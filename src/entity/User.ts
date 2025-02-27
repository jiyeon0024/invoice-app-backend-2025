import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

declare global {
  namespace Express {
    interface Request {
      user?: User; // req.user 속성을 User 타입으로 확장합니다.
    }
  }
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true }) // email은 고유해야 함
  email: string;
}
