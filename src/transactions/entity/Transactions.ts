import { Booths } from 'src/auth/entity/Booths'
import { Users } from 'src/auth/entity/Users'
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('transactions')
export class Transactions {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'transactions_id'
  })
  public readonly id: number

  @Column({
    type: 'int',
    unsigned: true,
    name: 'transactions_point',
    nullable: true
  })
  public readonly point: number

  @Column({
    name: 'users_id_sent',
    type: 'int',
    unsigned: true
  })
  public readonly sentUserId: number

  @Column({
    name: 'users_id_received',
    type: 'int',
    unsigned: true,
    nullable: false
  })
  public readonly receivedUserId: number

  @OneToOne(() => Users, { eager: true })
  @JoinColumn({ referencedColumnName: 'id', name: 'users_id_sent' })
  public readonly sentUser: Users

  @OneToOne(() => Users, { eager: true })
  @JoinColumn({ referencedColumnName: 'id', name: 'users_id_received' })
  public readonly receivedUser: Users

  @Column({
    name: 'booths_id',
    type: 'int',
    unsigned: true,
    nullable: true
  })
  public readonly boothId?: number

  @OneToOne(() => Booths, { eager: true })
  @JoinColumn({ referencedColumnName: 'id', name: 'booths_id' })
  public readonly booth?: Booths

  @Column({
    name: 'transactions_createdat',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false
  })
  public readonly createdAt: Date
}
