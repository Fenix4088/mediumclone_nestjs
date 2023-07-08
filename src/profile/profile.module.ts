import { Module } from '@nestjs/common';
import { ProfileController } from '@app/profile/profile.controller';
import { ProfileService } from '@app/profile/profile.service';
import { UtilsProvider } from '@app/utils/utils.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [ProfileController],
  providers: [ProfileService, UtilsProvider],
})
export class ProfileModule {}
