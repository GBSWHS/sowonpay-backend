import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn({
    name: 'users_id',
    type: 'int',
    unsigned: true
  })
  public readonly id: number

  @Column({
    name: 'users_name',
    type: 'varchar',
    length: 15,
    nullable: false
  })
  public readonly name: string

  @Column({
    name: 'users_phone',
    type: 'char',
    length: 11,
    nullable: false
  })
  public readonly phone: string

  @Column({
    name: 'users_point',
    type: 'int',
    unsigned: false,
    default: 0
  })
  public readonly point: number

  @Column({
    name: 'users_admin',
    type: 'boolean',
    default: false
  })
  public readonly isAdmin: boolean
}
