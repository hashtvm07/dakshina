import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Muallim } from './entities/muallim.entity';
import { MuallimsController } from './muallims.controller';
import { MuallimsService } from './muallims.service';

@Module({
  imports: [TypeOrmModule.forFeature([Muallim]), UsersModule],
  controllers: [MuallimsController],
  providers: [MuallimsService],
})
export class MuallimsModule {}
