import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
} from 'sequelize-typescript';

@Table({ tableName: 'addresses' })
class Address extends Model {
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare user_id: number; 

  @AllowNull(false)
  @Column(DataType.STRING)
  declare street: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare city: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare state: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: {
      is: /^[A-Z]\d{4}[A-Z]{3}$/i, // Ejemplo: H3500ABC
    },
  })
  declare postal_code: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare country: string;
}

export default Address;