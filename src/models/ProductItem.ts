import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import Shipping from './shippings'; 

@Table({
    tableName: 'product_items',
    timestamps: true,
})
export default class ProductItem extends Model {
    
    // 1. CORRECCIÓN CLAVE: Usamos 'declare' para indicar que la propiedad ya está definida en 'Model'.
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    declare id: number; // <-- Usa 'declare' aquí

    @ForeignKey(() => Shipping)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    shipping_id!: number;
    
    // ... el resto de las propiedades usan '!' ya que no son propiedades base de Model
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    product_id!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    quantity!: number;

    @Column({ type: DataType.FLOAT, allowNull: false })
    weight!: number;

    @Column({ type: DataType.FLOAT, allowNull: false })
    length!: number;

    @Column({ type: DataType.FLOAT, allowNull: false })
    width!: number;

    @Column({ type: DataType.FLOAT, allowNull: false })
    height!: number;
}