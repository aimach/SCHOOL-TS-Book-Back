import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import Skill from "./Skill";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export default class Wilder {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column({ nullable: true })
  avatar: string;

  @Field(() => [Skill])
  @ManyToMany(() => Skill, { eager: true })
  @JoinTable()
  skills: Skill[];
}
