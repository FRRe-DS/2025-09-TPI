import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AllowNull,
} from 'sequelize-typescript';
import Shipping from './shippings';

@Table({ tableName: 'shipping_logs' })
class ShippingLog extends Model {
  @ForeignKey(() => Shipping)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare shipping_id: number;

  @BelongsTo(() => Shipping)
  declare shipping: Shipping;

  @AllowNull(false)
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
  @Column(DataType.STRING)
  declare message: string;
}

export default ShippingLog;