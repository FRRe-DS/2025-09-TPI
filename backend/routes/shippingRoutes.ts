import { Router } from 'express';
import { ShippingController } from '../controllers/shippingController';

const router = Router();



// 1. Cotizar envío (sin crearlo)
router.post('/cost', ShippingController.calculateShippingCost );

// 2. Listar métodos de transporte
router.get('/transport-methods', ShippingController.listTransportMethods);

// 3. Crear envío
router.post('/',  ShippingController.createShipping);

// 4. Listar envíos con filtros
router.get('/', ShippingController.listShippings);

// 5. Ver detalles de un envío
router.get('/:shipping_id', ShippingController.getShippingById);

// 6. Cancelar envío
router.post('/:shipping_id/cancel', ShippingController.cancelShipping);

export default router;
