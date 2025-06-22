import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import type { AbstractDto } from './dto/abstract.dto';

export abstract class AbstractEntity<DTO extends AbstractDto> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp without time zone',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    name: 'updated_at',
  })
  updatedAt: Date;

  abstract dtoClass /*: new (entity: AbstractEntity /!*<T>*!/, options?: any) => T*/;

  toDto() {
    return new this.dtoClass(this);
  }
}
