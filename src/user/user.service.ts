import { LoginUserDto } from './dto/loginUser.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserEntity } from '@app/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { compare } from 'bcrypt';
import { UtilsProvider } from '@app/utils/utils.provider';
import { UpdateUserDto } from '@app/user/dto/updateUser.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly utilsProvider: UtilsProvider,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    //check is user with suck email OR username exists
    const userByEmailOrName = await this.userRepository.findOne({
      where: [
        {
          email: createUserDto.email,
        },
        {
          username: createUserDto.username,
        },
      ],
    });

    if (userByEmailOrName) {
      throw new HttpException(
        'Email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      select: ['email', 'username', 'image', 'id', 'bio', 'password'],
    });

    if (!user) {
      throw new HttpException('User does not excist', HttpStatus.NOT_FOUND);
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new HttpException('Wrong password', HttpStatus.FORBIDDEN);
    }

    return this.utilsProvider.excludeObjectOptions<UserEntity>(user, [
      'password',
    ]);
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userRepository.save({ id, ...updateUserDto });
  }

  findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  generateJwt({ id, username, email }: UserEntity): string {
    return sign({ id, username, email }, JWT_SECRET);
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
