import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('booths')
export class Booths {
  @PrimaryGeneratedColumn({
    name: 'booths_id',
    type: 'int',
    unsigned: true
  })
  public readonly id: number

  @Column({
    name: 'booths_name',
    type: 'varchar',
    length: 30,
    nullable: false
  })
  public readonly name: string

  @Column({
    name: 'booths_point',
    type: 'int',
    unsigned: true,
    nullable: false,
    default: 0
  })
  public readonly point: number
}
