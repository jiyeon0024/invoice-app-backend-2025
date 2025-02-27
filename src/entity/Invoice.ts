import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "../entity/User";
import { Item } from "../entity/Items"; // Item 엔티티를 따로 정의하여 참조

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn() // createdAt 자동 처리
  createdAt: Date;

  @Column({ nullable: false })
  paymentDue: string;

  @Column()
  description: string;

  @Column({ nullable: false })
  paymentTerms: number;

  @Column({ nullable: false })
  clientName: string;

  @Column()
  status: string;

  // 송신자 주소
  @Column("json")
  senderAddress: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  };

  // 클라이언트 주소
  @Column("json")
  clientAddress: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  };

  // 상품 항목
  @OneToMany(() => Item, (item) => item.invoice, { eager: true })
  items: Item[];

  @Column("decimal")
  total: number;

  // 여전히 clientEmail을 컬럼으로 저장할 수 있습니다.
  @Column()
  clientEmail: string;
}
