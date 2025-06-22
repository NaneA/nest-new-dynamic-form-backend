import { Entity, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { FormsDto } from './dto/forms.dto';
import { QuestionEntity } from './question-field.entity';

@Entity({ name: 'forms' })
export class FormsEntity extends AbstractEntity<FormsDto> {
  toDto() {
    throw new Error('Method not implemented.');
  }
  dtoClass: any;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => QuestionEntity, (q) => q.form, { cascade: true })
  questions?: QuestionEntity[];

  @Column({ type: 'text', array: true, default: [] })
  order: string[];
}
