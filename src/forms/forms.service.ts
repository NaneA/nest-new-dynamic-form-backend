// src/forms/forms.service.ts
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFormDto } from './dto/create-form.dto';
import { FormsDto } from './dto/forms.dto';
import { FormsEntity } from './forms.entity';
import { QuestionEntity } from './question-field.entity';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(FormsEntity)
    private readonly formsRepository: Repository<FormsEntity>,
  ) {}

  async createOrUpdate(createFormDto: CreateFormDto): Promise<FormsDto> {
    try {
      const { id, title, description, questionFields, order } = createFormDto;
      let form = id
        ? await this.formsRepository.findOne({
            where: { id },
            relations: ['questions'],
          })
        : null;

      if (form) {
        form.title = title;
        form.description = description;

        const existingQs = form.questions || [];
        const incomingIds = questionFields.map((q) => q.id);

        const toRemove = existingQs.filter((q) => !incomingIds.includes(q.id));
        if (toRemove.length) {
          await this.formsRepository.manager.remove(toRemove);
        }

        form.questions = questionFields.map((qDto) => {
          const q =
            existingQs.find((e) => e.id === qDto.id) || new QuestionEntity();
          q.id = qDto.id;
          q.fieldType = qDto.fieldType;
          q.fieldLabel = qDto.fieldLabel;
          q.isRequired = qDto.isRequired ?? false;
          q.options = qDto.options
            ? JSON.stringify(qDto.options)
            : JSON.stringify([]);
          q.position = order.indexOf(qDto.id);
          q.form = form!;
          return q;
        });
      } else {
        const questions = questionFields.map((qDto) => {
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
        });

        form = this.formsRepository.create({
          id,
          title,
          description,
          questions,
        });
      }

      const saved = await this.formsRepository.save(form);
      return new FormsDto(saved);
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to create or update form schema',
      );
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

  async findAll(): Promise<FormsDto[]> {
    const forms = await this.formsRepository.find({
      relations: ['questions'],
    });
    return forms.map((form) => new FormsDto(form));
  }
}
