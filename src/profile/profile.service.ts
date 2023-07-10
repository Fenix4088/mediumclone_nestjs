import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';
import { Repository } from 'typeorm';
import { ProfileType } from '@app/profile/types/profile.type';
import { ProfileResponseInterface } from '@app/profile/types/profileResponse.interface';
import { FollowEntity } from '@app/profile/follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async getProfile(username: string): Promise<ProfileType> {
    const profile = await this.userRepository.findOne({
      where: {
        username,
      },
      select: {
        username: true,
        bio: true,
        image: true,
      },
    });

    if (!profile) {
      throw new HttpException('Profile does not fount', HttpStatus.NOT_FOUND);
    }

    return {
      ...profile,
      following: false,
    };
  }

  async followProfile(
    currentUserId: number,
    username: string,
  ): Promise<ProfileType> {
    const profile = await this.userRepository.findOne({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        bio: true,
        image: true,
      },
    });

    if (!profile) {
      throw new HttpException('Profile does not fount', HttpStatus.NOT_FOUND);
    }

    if (currentUserId === profile.id) {
      throw new HttpException(
        'Follower and following cant be equal',
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followRepository.findOne({
      where: {
        followerId: currentUserId,
        followingId: profile.id,
      },
    });

    if (!follow) {
      const followToCreate = new FollowEntity();
      followToCreate.followerId = currentUserId;
      followToCreate.followingId = profile.id;
      await this.followRepository.save(followToCreate);
    }

    return { ...profile, following: true };
  }

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    return {
      profile,
    };
  }
}