import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
