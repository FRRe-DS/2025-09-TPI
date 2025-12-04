const TRANSPORT_METHODS = [
    {
        "id": "air",
        "nombre": "Aéreo",
        "descripcion": "Envío por aire",
        "dias_entrega": 2,
        "costo_base": 50 // Costo base para el cálculo
    },
    {
        "id": "road",
        "nombre": "Terrestre",
        "descripcion": "Envío por tierra",
        "dias_entrega": 7,
        "costo_base": 20
    }
];

// Helper para buscar los datos del método
export const getMethodDetails = (transportId: string) => {
    if(transportId === 'road'){
        return 7
    }
     if(transportId === 'air'){
        return 2
    }
    
};
export const calculateDeliveryDate = (transportMethod: string): Date => {
    const deliveryDate = new Date();
    
    // Mapeamos el nombre de entrada (ej., 'standard') al ID del ENUM ('road')
    const transportId = mapTransportTypeToEnum(transportMethod);
    console.log(transportId)
    const method = getMethodDetails(transportId);

    // Usamos los días reales de entrega del método, si existe
    const daysToAdd = method 

    deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);
    console.log(deliveryDate)
    return deliveryDate;
};

// Mapea la entrada del usuario al valor exacto del ENUM de la DB
export const mapTransportTypeToEnum = (method: string): string => {
    const lowerCaseMethod = method.toLowerCase();
 
    
    if (lowerCaseMethod.includes('express') || lowerCaseMethod.includes('aéreo') || lowerCaseMethod === 'air') {
        return 'air'; 
    }
    
    // Si contiene 'standard' o 'terrestre', usa 'road'.
    if (lowerCaseMethod.includes('standard') || lowerCaseMethod.includes('terrestre') || lowerCaseMethod === 'road') {
        return 'road'; 
    }
    
    // Fallback por defecto si no se reconoce
    return 'road'; 
};

interface StockProductDetails {
    id: number;
    nombre: string;
    precio: number;
    pesoKg: number;
    dimensiones: {
        altoCm: number;
        anchoCm: number;
        largoCm: number;
    };
    // Quitamos los campos que no son necesarios (stockDisponible, ubicacion, etc.)
}

// Interfaz para la entrada de la orden (la que recibimos de Compras)
interface ProductOrderInput {
    id: number;
    quantity: number;
}
import axios from 'axios';

// 🚨 Usar la variable de entorno para la URL de la red Docker
const STOCK_API_BASE_URL = process.env.STOCK_API_URL || 'http://localhost:4000/api'; 


export const fetchDetailedProducts = async (productsFromOrder: ProductOrderInput[]): Promise<any[]> => {
    
    const token = 'MOCK_KEYCLOAK_TOKEN'; // 🚨 Si Keycloak es obligatorio, debes obtener el token aquí.

    // Usamos Promise.all para hacer las llamadas en paralelo y mejorar performance
    const detailedProducts = await Promise.all(
        productsFromOrder.map(async (p) => {
            
            // La URL es: http://stock-backend:4000/api/v1/productos/ID
            const url = `${STOCK_API_BASE_URL}/v1/productos/${p.id}`; 
            
            try {
                // 1. Llamada a la API de Stock
                const response = await axios.get<StockProductDetails>(url, {
                    headers: {
                        // Incluir el token de servicio a servicio si es necesario
                        // 'Authorization': `Bearer ${token}` 
                    }
                });
                const stockData = response.data;
                
                // 2. Mapeo a la estructura interna de Logística (para guardar en JSONB)
                return {
                    id: p.id,
                    name: stockData.nombre, // Usar 'nombre' de la API Stock
                    quantity: p.quantity,
                    price: stockData.precio, // Precio unitario (necesario para el cálculo de costo total)
                    weight_kg: stockData.pesoKg, // Peso real
                    // Mapeo de dimensiones a la estructura que usaste en tu modelo
                    dimensions_cm: { 
                        width: stockData.dimensiones.anchoCm, 
                        height: stockData.dimensiones.altoCm,
                        length: stockData.dimensiones.largoCm,
                    }
                };
            } catch (error) {
                // Si el producto no existe o la API falla, lanzamos error
                throw new Error(`Error: Producto ID ${p.id} no encontrado en Stock o API falló.`);
            }
        })
    );

    return detailedProducts;
};