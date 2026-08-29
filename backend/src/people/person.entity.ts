import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContactLog } from '../contact-logs/contact-log.entity';
import { RelationshipType } from '../common/domain';
import { ImportantDate } from './important-date.entity';

@Entity('people')
export class Person {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 80 })
  name: string;

  @Index()
  @Column({ type: 'varchar', length: 32 })
  relationshipType: RelationshipType;

  @Column({ type: 'varchar', length: 40, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 254, nullable: true })
  email: string | null;

  /** null = follows the effective default for `relationshipType`. */
  @Column({ type: 'integer', nullable: true })
  customCadenceDays: number | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  /** Set by the add-flow chip (FR-1.4) and by contact logs. Only ever moves
   * forward on a log; null = never contacted. */
  @Column({ type: 'varchar', length: 10, nullable: true })
  lastContactDate: string | null;

  @OneToMany(() => ImportantDate, (date) => date.person, { eager: true })
  importantDates: ImportantDate[];

  @OneToMany(() => ContactLog, (log) => log.person)
  logs: ContactLog[];

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
