import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsUUID,
  IsString as IsStringEach,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FieldEnum } from '../constants/field.enum';

export class CreateQuestionDto {
  @ApiProperty({ description: 'Unique ID for the question', format: 'uuid' })
  @IsUUID('4')
  id: string;

  @ApiProperty({ enum: FieldEnum, description: 'Type of this question field' })
  @IsEnum(FieldEnum)
  fieldType: FieldEnum;

  @ApiPropertyOptional({ description: 'Label text for the question' })
  @IsString()
  @IsOptional()
  fieldLabel?: string;

  @ApiPropertyOptional({
    description: 'Whether this question is required',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @ApiPropertyOptional({
    type: [String],
    description: 'Options for select/radio questions',
  })
  @IsArray()
  @IsStringEach({ each: true })
  @IsOptional()
  options?: string[];
}

export class CreateFormDto {
  @ApiProperty({ description: 'Title of the form' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Optional description of the form' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: [CreateQuestionDto],
    description: 'Array of questions for the form',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questionFields: CreateQuestionDto[];

  @ApiProperty({ type: [String], description: 'Order of question IDs' })
  @IsArray()
  @IsUUID('4', { each: true })
  order: string[];
}
