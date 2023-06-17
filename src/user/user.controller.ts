import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { ExpressRequestInterface } from '@app/types/expressRequest.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.loginUser(loginUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Get()
  async currentUser(
    @Req() request: ExpressRequestInterface,
  ): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(request.user);
  }
}
