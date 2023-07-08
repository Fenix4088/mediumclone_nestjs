import { Controller, Get, Param } from '@nestjs/common';
import { ProfileService } from '@app/profile/profile.service';
import { ProfileResponseInterface } from '@app/profile/types/profileResponse.interface';
import { User } from '@app/user/decorators/user.decorator';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get(':username')
  async getProfile(
    @User('id') currentUserId: string,
    @Param('username') username: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getProfile(username);

    return this.profileService.buildProfileResponse(profile);
  }
}
