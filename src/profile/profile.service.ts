import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';
import { Repository } from 'typeorm';
import { ProfileType } from '@app/profile/types/profile.type';
import { ProfileResponseInterface } from '@app/profile/types/profileResponse.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    return {
      profile,
    };
  }
}
