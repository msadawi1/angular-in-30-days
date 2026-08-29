import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContactType } from '../common/domain';
import { Person } from '../people/person.entity';

@Entity('contact_logs')
export class ContactLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  personId: string;

  @Column({ type: 'varchar', length: 16 })
  type: ContactType;

  /** ISO calendar date (YYYY-MM-DD). Never in the future. */
  @Column({ type: 'varchar', length: 10 })
  date: string;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @ManyToOne(() => Person, (person) => person.logs, { onDelete: 'CASCADE' })
  person: Person;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}
