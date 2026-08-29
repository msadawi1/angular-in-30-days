import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Person } from './person.entity';

@Entity('important_dates')
export class ImportantDate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 80 })
  label: string;

  /** ISO calendar date (YYYY-MM-DD). */
  @Column({ type: 'varchar', length: 10 })
  date: string;

  @Index()
  @Column({ type: 'uuid' })
  personId: string;

  @ManyToOne(() => Person, (person) => person.importantDates, { onDelete: 'CASCADE' })
  person: Person;
}
