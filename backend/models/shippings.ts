import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Default,
  ForeignKey,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import ShippingLog from './ShippingLog';
import Address from './Address';

@Table({ tableName: 'shippings' })
class Shipping extends Model {
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare user_id: number; 

  @ForeignKey(() => Address)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare address_id: number;

  @BelongsTo(() => Address)
  declare address: Address;

  @AllowNull(false)
  @Default('created')
  @Column(
    DataType.ENUM(
      'created',
      'reserved',
      'in_transit',
      'arrived',
      'in_distribution',
      'delivered',
      'cancelled'
    )
  )
  declare status: string;

  @AllowNull(false)
  @Column(DataType.ENUM('air', 'sea', 'rail', 'road'))
  declare transport_type: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: {
      is: /^[A-Z]\d{4}[A-Z]{3}$/i,
    },
  })
  declare departure_postal_code: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare estimated_delivery_at: Date;

  @Column(DataType.DATE)
  declare cancelled_at?: Date;

  @Column(DataType.INTEGER)
  declare order_id: number;

  @Column(DataType.STRING)
  declare tracking_number?: string;

  @Column(DataType.STRING)
  declare tracking_company?: string;

  @Column(DataType.JSONB)
  declare products: {
    id: number;
    quantity: number;
  }[]; // Simulación de productos sin modelo

  @HasMany(() => ShippingLog, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  declare logs: ShippingLog[];
}

export default Shipping;