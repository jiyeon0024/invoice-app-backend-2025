import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Invoice } from "./Invoice";

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column("decimal")
  price: number;

  @Column("decimal")
  total: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.items)
  @JoinColumn({ name: "invoiceId", referencedColumnName: "id" })
  invoice: Invoice;

  @Column({ nullable: true })
  tempColumn: string;
}
