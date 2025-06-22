// src/forms/forms.service.ts
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFormDto, CreateQuestionDto } from './dto/create-form.dto';
import { FormsDto } from './dto/forms.dto';
import { FormsEntity } from './forms.entity';
import { QuestionEntity } from './question-field.entity';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(FormsEntity)
    private readonly formsRepository: Repository<FormsEntity>,
  ) {}

  @Transactional()
  async create(createFormDto: CreateFormDto): Promise<FormsDto> {
    try {
      const { title, description, questionFields, order } = createFormDto;

      const questions: QuestionEntity[] = questionFields.map(
        (qDto: CreateQuestionDto) => {
          const q = new QuestionEntity();
          q.id = qDto.id;
          q.fieldType = qDto.fieldType;
          q.fieldLabel = qDto.fieldLabel;
          q.isRequired = qDto.isRequired ?? false;
          q.options = qDto.options
            ? JSON.stringify(qDto.options)
            : JSON.stringify([]);
          q.position = order.indexOf(qDto.id);
          return q;
        },
      );

      // Build and save form entity with cascade-inserted questions
      const formEntity = this.formsRepository.create({
        title,
        description,
        questions,
      });
      const saved = await this.formsRepository.save(formEntity);

      return new FormsDto(saved);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create form schema');
    }
  }

  async findOne(id: string): Promise<FormsDto> {
    const form = await this.formsRepository.findOne({
      where: { id },
      relations: ['questions'],
    });
    if (!form) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }
    return new FormsDto(form);
  }
}
