// src/forms/entities/question.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { FieldEnum } from './constants/field.enum';
import { FormsEntity } from './forms.entity';
import { QuestionFieldDto } from './dto/question-field.dto';

/**
 * Question entity representing the `questions` table
 */
@Entity({ name: 'questions' })
export class QuestionEntity extends AbstractEntity<QuestionFieldDto> {
  /** DTO class to which this entity will convert */
  dtoClass = QuestionFieldDto;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => FormsEntity, (form) => form.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'form_id' })
  form: FormsEntity;

  @Column({ type: 'enum', enum: FieldEnum })
  fieldType: FieldEnum;

  @Column({ type: 'text', nullable: true })
  fieldLabel?: string;

  @Column({ type: 'boolean', default: false })
  isRequired: boolean;

  /** Order of this question within its parent form */
  @Column({ type: 'int' })
  position: number;

  /**
   * Serialized JSON of option labels (for select/radio fields)
   * Stored as TEXT in Postgres
   */
  @Column({ type: 'text', nullable: true })
  options?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  /**
   * toDto() is inherited from AbstractEntity,
   * which will call new QuestionFieldDto(this)
   */
}
