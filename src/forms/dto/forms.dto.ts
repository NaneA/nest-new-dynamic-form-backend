import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from './abstract.dto';
import { QuestionFieldDto } from './question-field.dto';
import { FormsEntity } from '../forms.entity';

export class FormsDto extends AbstractDto {
  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ type: QuestionFieldDto, isArray: true })
  questionFields: QuestionFieldDto[];

  @ApiProperty({ type: [String] })
  order: string[];

  constructor(form: FormsEntity) {
    super(form);
    this.title = form.title;
    this.description = form.description;
    const sortedQs = form.questions
      .slice()
      .sort((a, b) => a.position - b.position);
    this.questionFields = sortedQs.map((q) => new QuestionFieldDto(q));
    this.order = sortedQs.map((q) => q.id);
  }
}
