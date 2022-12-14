import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Booths } from '../../booths/entity/Booths'

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
    nullable: false,
    unique: true
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

  @ManyToMany(() => Booths, { eager: true })
  @JoinTable({
    name: 'users_booths',
    joinColumn: {
      name: 'users_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'booths_id',
      referencedColumnName: 'id'
    }
  })
  public readonly booths: Booths[]
}
