import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';
import { FormsEntity } from './forms.entity';
import { QuestionEntity } from './question-field.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FormsEntity, QuestionEntity])],
  controllers: [FormsController],
  providers: [FormsService],
})
export class FormsModule {}
