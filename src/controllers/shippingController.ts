import type { Request, Response } from "express";
import { ShippingService } from '../services/ShippingServices';

export class ShippingController {
    
    static calculateShippingCost = async (req: Request, res: Response) => {
        //logica
    };

    static listTransportMethods = async (req: Request, res: Response) => {
        //logica
    };

    static createShipping = async (req: Request, res: Response) => {
        //logica
    };

    static listShippings = async (req: Request, res: Response) => {
        //logica
    };

    //------------------------------------------------------------------------------------------------- //

    static getShippingById = async (req: Request, res: Response) => { 
        
        //transforma el numero del id a entero
        const shippingId = parseInt(req.params.shipping_id);       


        // 1. Manejo de Error 400 (Bad Request / Validación de ID) 
        if (isNaN(shippingId) || shippingId <= 0) {                                            
            return res.status(400).json({ 
                code: "malformed_request", 
                message: "El ID del envío debe ser un número entero positivo." 
            });
        }

        try {
            // 2. Llama al servicio
            const shippingData: any = await ShippingService.getShippingDetails(shippingId);

            // 3. Manejo de Error 404 (Not Found)
            if (!shippingData) {
                return res.status(404).json({ 
                    code: "not_found", 
                    message: `El envío con ID ${shippingId} no fue encontrado.` 
                });
            }

            // 4. Formatear y devolver la respuesta (200 OK)
            const responseData = {
                // Campos principales (del objeto 'shippings')
                shipping_id: shippingData.id,
                order_id: shippingData.order_id,
                user_id: shippingData.user_id,
                status: shippingData.status,
                transport_type: shippingData.transport_type,
                tracking_number: shippingData.tracking_number,
                carrier_name: shippingData.carrier_name,
                total_cost: shippingData.total_cost,
                currency: shippingData.currency,
                estimated_delivery_at: shippingData.estimated_delivery_at,
                created_at: shippingData.created_at,
                updated_at: shippingData.updated_at,
                
                // Direcciones: Mapeo con fallback 
                delivery_address: { 
                    street: shippingData.delivery_street || "Dirección de Entrega", 
                    city: shippingData.delivery_city || "Ciudad",
                    postal_code: shippingData.delivery_postal_code || "H3500ABC", 
                    state: shippingData.delivery_state || "Chaco", 
                    country: shippingData.delivery_country || "AR" 
                },

                //valores fijos
                departure_address: { 
                    street: "Warehouse Central", 
                    city: "Resistencia",
                    postal_code: "H3500XYZ", 
                    state: "Chaco", 
                    country: "AR" 
                },
                
                // Productos anidados
                products: shippingData.product_items.map((p: any) => ({
                    product_id: p.product_id,
                    quantity: p.quantity,
                })),
                
                // Logs anidados (ordenados cronológicamente)
                logs: shippingData.shipping_logs.sort((a: any, b: any) => 
                    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                ), 
            };

            res.status(200).json(responseData);

        } catch (error) {
            // 5. Manejo de Error 500
            res.status(500).json({ 
                code: "server_error", 
                message: "Ocurrió un error inesperado al consultar los detalles del envío." 
            });
        }
    }; 

    //------------------------------------------------------------------------------------------------- //

    static cancelShipping = async (req: Request, res: Response) => {
        //logica
    };
}

