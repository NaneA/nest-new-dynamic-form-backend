import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FieldEnum } from '../constants/field.enum';
import { QuestionEntity } from '../question-field.entity';
import { AbstractDto } from './abstract.dto';

export class QuestionFieldDto extends AbstractDto {
  @ApiProperty({ enum: FieldEnum })
  fieldType: FieldEnum;

  @ApiPropertyOptional()
  fieldLabel?: string;

  @ApiPropertyOptional({ type: [String] })
  options?: string[];

  @ApiPropertyOptional()
  isRequired: boolean;

  @ApiProperty()
  orderPosition: number;

  constructor(question: QuestionEntity) {
    super(question);
    this.fieldType = question.fieldType;
    this.fieldLabel = question.fieldLabel;
    try {
      this.options = question.options ? JSON.parse(question.options) : [];
    } catch {
      this.options = [];
    }
    this.isRequired = question.isRequired;
    this.orderPosition = question.position;
  }
}
