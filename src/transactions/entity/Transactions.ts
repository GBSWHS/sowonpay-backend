import { Booths } from '../../booths/entity/Booths'
import { Users } from '../../users/entity/Users'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('transactions')
export class Transactions {
  @PrimaryGeneratedColumn('increment', {
    name: 'transactions_id',
    unsigned: true,
    type: 'int'
  })
  public readonly id: string

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

  @ManyToOne(() => Users, { eager: true })
  @JoinColumn({ referencedColumnName: 'id', name: 'users_id_sent' })
  public readonly sentUser: Users

  @ManyToOne(() => Users, { eager: true })
  @JoinColumn({ referencedColumnName: 'id', name: 'users_id_received' })
  public readonly receivedUser: Users

  @Column({
    name: 'booths_id',
    type: 'int',
    unsigned: true,
    nullable: true
  })
  public readonly boothId?: number

  @ManyToOne(() => Booths, { eager: true })
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
