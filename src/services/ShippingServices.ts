
import Shipping from '../models/shippings';       
import ShippingLog from '../models/ShippingLog';   
import ProductItem from '../models/ProductItem'; 

export const ShippingService = { 
    

    async getShippingDetails(shippingId: number) { 
        
        try {
            // Utilizamos findByPk (Find by Primary Key) para buscar el envío.
      
            const shippingData = await Shipping.findByPk(shippingId, {
    
                include: [
                    { model: ShippingLog, as: 'logs' }, 
                    { model: ProductItem, as: 'products' } 
                ]
            });

            // Si Sequelize no encuentra el registro, devuelve null. (Manejo del 404)
            if (!shippingData) {
                return null; 
            }

            // Convertimos la instancia de Sequelize a un objeto JSON simple para la respuesta.
            return shippingData.toJSON();

        } catch (error: any) {
            // Capturamos cualquier error de la DB/Asociación para el 500 Server Error
            console.error('Error de Sequelize al buscar envío:', error.message);
            throw new Error(`Error en la capa de datos: ${error.message}`);
        }
    },
    
   
};