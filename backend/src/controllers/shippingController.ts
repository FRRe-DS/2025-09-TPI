import type { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { calculateShippingCost } from "../utils/calculateShippingCost";
import {
  calculateDeliveryDate,
  fetchDetailedProducts,
  mapTransportTypeToEnum,
} from "../utils/shippingHelpers";
import Shipping from "../models/shippings";
import ShippingLog from "../models/ShippingLog";

interface ProductDetail {
  id: string;
  quantity: number;
  weight_kg: number;
  dimensions_cm: { width: number; height: number; length: number };
}

export class ShippingController {
  static createShipping = async (req: AuthenticatedRequest, res: Response) => {
    const DEFAULT_DEPARTURE_CP = "C1000AAA";
    const authenticatedUserId = req.user?.id;

    const { order_id, user_id, delivery_address, transport_type, products } =
      req.body;

    const t = await Shipping.sequelize.transaction();

    try {
      // Validación de Seguridad
      if (!authenticatedUserId || authenticatedUserId !== user_id) {
        await t.rollback();
        return res.status(403).json({
          success: false,
          message: "Acceso denegado. ID de usuario no coincide.",
        });
      }

      //  Integración
      const detailedProducts = await fetchDetailedProducts(products);
      const transport_type_base = mapTransportTypeToEnum(transport_type);
      const estimatedDeliveryAt = calculateDeliveryDate(transport_type);
      const finalShippingCost = calculateShippingCost(
        detailedProducts,
        transport_type_base
      );

      //  Crear el registro de envío
      const shipping = await Shipping.create(
        {
          user_id: authenticatedUserId,
          order_id: order_id,
          status: "created",
          shipping_cost: finalShippingCost,
          products: detailedProducts,

          delivery_address_json: delivery_address,

          transport_type: transport_type_base,
          departure_postal_code: DEFAULT_DEPARTURE_CP,
          estimated_delivery_at: estimatedDeliveryAt,
        },
        { transaction: t }
      );

      //  Crear el primer log de seguimiento
      await ShippingLog.create(
        {
          shipping_id: shipping.id,
          status: "created",
          message: "Envío creado y pendiente de recolección.",
          timestamp: new Date(),
        },
        { transaction: t }
      );

      await t.commit();

      return res.status(201).json({
        success: true,
        message: "Envío registrado exitosamente.",
        data: { shipping_id: shipping.id },
      });
    } catch (error: any) {
      await t.rollback();
      console.error("Error en createShipping:", error);

      const errorMessage = error.errors
        ? error.errors.map((e: any) => e.message).join(", ")
        : error.message.includes("Stock")
        ? error.message
        : "Error interno al procesar el envío.";

      return res.status(500).json({
        success: false,
        message: "Falló la creación del envío o la reserva de stock.",
        error: errorMessage,
      });
    }
  };

  static getShippingById = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const authenticatedUserId = req.user?.id;

      const shipping = await Shipping.findByPk(id, {
        include: [
          {
            model: ShippingLog,
            as: "logs",
            order: [["createdAt", "ASC"]],
          },
        ],
      });

      if (!shipping) {
        return res
          .status(404)
          .json({ success: false, message: "Envío no encontrado." });
      }

      return res.status(200).json({ success: true, data: shipping });
    } catch (error) {
      console.error("Error al obtener el envío:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor al obtener el detalle.",
      });
    }
  };

  static updateShippingStatus = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const { id: shipping_id } = req.params;
    const { status, message } = req.body;
    const authenticatedUserId = req.user?.id;

    const t = await Shipping.sequelize.transaction();

    try {
      if (!status || !message) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "Faltan los campos status y message.",
        });
      }

      //  Buscar Envío
      const shipping = await Shipping.findByPk(shipping_id, { transaction: t });

      if (!shipping) {
        await t.rollback();
        return res
          .status(404)
          .json({ success: false, message: "Envío no encontrado." });
      }

      // Actualizar el Estado del Envío
      await shipping.update({ status: status }, { transaction: t });

      // Crear el Log de Seguimiento
      await ShippingLog.create(
        {
          shipping_id: shipping.id,
          status: status,
          message: message,
          timestamp: new Date(),
        },
        { transaction: t }
      );

      await t.commit();

      return res.status(200).json({
        success: true,
        message: `Estado de envío ${shipping_id} actualizado a ${status}.`,
        new_status: status,
      });
    } catch (error) {
      await t.rollback();
      console.error("Error al actualizar estado:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno al actualizar el estado.",
      });
    }
  };

  static getShippingsByUser = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const { id: requestedUserId } = req.params;
      const authenticatedUserId = req.user?.id;

      if (authenticatedUserId !== parseInt(requestedUserId as string)) {
        return res
          .status(403)
          .json({
            success: false,
            message: "No autorizado para ver el historial de otro usuario.",
          });
      }

      // Consulta con filtro e inclusión
      const shippings = await Shipping.findAll({
        where: { user_id: requestedUserId },
        order: [["createdAt", "DESC"]],

        include: [{ model: ShippingLog, as: "logs" }],
      });

      if (!shippings || shippings.length === 0) {
        return res
          .status(200)
          .json({
            success: true,
            message: "No se encontraron envíos para este usuario.",
            data: [],
          });
      }

      return res.status(200).json({ success: true, data: shippings });
    } catch (error) {
      console.error("Error al obtener los envíos del usuario:", error);
      return res
        .status(500)
        .json({
          success: false,
          message: "Error interno del servidor al obtener el historial.",
        });
    }
  };

  static calculateCost = async (req: Request, res: Response) => {
    try {
      const { transportMethod, sender, receiver, product } = req.body;

      if (!transportMethod || !sender || !receiver || !product) {
        return res
          .status(400)
          .json({ ok: false, message: "Faltan datos requeridos" });
      }

      const { province: originProvince } = sender;
      const { province: destinationProvince } = receiver;
      const { width, height, length, weight, declaredValue } = product;

      // Tabla de distancias
      const provinceDistances: Record<string, number> = {
        "Buenos Aires": 10,
        CABA: 5,
        Catamarca: 40,
        Chaco: 30,
        Chubut: 70,
        Córdoba: 20,
        Corrientes: 28,
        "Entre Ríos": 18,
        Formosa: 32,
        Jujuy: 55,
        "La Pampa": 22,
        "La Rioja": 42,
        Mendoza: 35,
        Misiones: 33,
        Neuquén: 60,
        "Río Negro": 65,
        Salta: 50,
        "San Juan": 36,
        "San Luis": 25,
        "Santa Cruz": 90,
        "Santa Fe": 15,
        "Santiago del Estero": 38,
        "Tierra del Fuego": 110,
        Tucumán: 45,
      };

      // Validación de provincias
      if (
        !provinceDistances[originProvince] ||
        !provinceDistances[destinationProvince]
      ) {
        return res.status(400).json({
          ok: false,
          message: "Provincia origen o destino no válida",
        });
      }

      // Distancia simulada
      const distance = Math.abs(
        provinceDistances[originProvince] -
          provinceDistances[destinationProvince]
      );

      // Precios según transporte
      let pricePerKg = 0;
      let pricePerDistance = 0;
      let estimatedDays = 0;

      if (transportMethod === "terrestrial") {
        pricePerKg = 20;
        pricePerDistance = 2;
        estimatedDays = 10 + Math.ceil(distance / 10);
      } else if (transportMethod === "air") {
        pricePerKg = 50;
        pricePerDistance = 5;
        estimatedDays = 7 + Math.ceil(distance / 20);
      } else {
        return res
          .status(400)
          .json({ ok: false, message: "Tipo de transporte inválido" });
      }

      // Costo por peso
      const weightCost = weight * pricePerKg;

      // Costo adicional por distancia
      const distanceCost = distance * pricePerDistance;

      // Seguro
      const insurance = declaredValue ? declaredValue * 0.01 : 0;

      // Total
      const totalCost = weightCost + distanceCost + insurance;

      return res.json({
        ok: true,
        cost: totalCost,
        estimatedDays,
        breakdown: {
          weightCost,
          distanceCost,
          insurance,
          distance,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        ok: false,
        message: "Error al calcular el costo",
      });
    }
  };

  static getShippingStatuses = (req: Request, res: Response): Response => {
    try {
      const statuses = [
        "created",
        "reserved",
        "in_transit",
        "in_distribution",
        "arrived",
        "delivered",
        "cancelled",
      ];

      return res.status(200).json({
        success: true,
        data: statuses,
      });
    } catch (error) {
      console.error("Error en getShippingStatuses:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor al obtener estados.",
      });
    }
  };
  static getShippingMethods = (req: Request, res: Response): Response => {
    try {
      const methods = [
        {
          id: "air",
          nombre: "Aire",
          descripcion: "Envio por aire",
          dias_entrega: 3,
          costo_base: 70,
        },
        {
          id: "road",
          nombre: "Terrestre",
          descripcion: "Envio por ruta",
          dias_entrega: 4,
          costo_base: 60,
        },
        {
          id: "rail",
          nombre: "Ferroviario",
          descripcion: "Envio por tren",
          dias_entrega: 10,
          costo_base: 40,
        },
        {
          id: "express",
          nombre: "Express",
          descripcion: "Envio con prioridad de entrega",
          dias_entrega: 2,
          costo_base: 80,
        },
        {
          id: "sea",
          nombre: "Maritimo",
          descripcion: "Envio por mar/rio",
          dias_entrega: 15,
          costo_base: 50,
        },
      ];
      return res.status(200).json({ success: true, data: methods });
    } catch (error) {
      console.error("Error en getShippingMethods:", error);
      return res
        .status(500)
        .json({
          success: false,
          message:
            "Error interno del servidor al obtener métodos de transporte.",
        });
    }
  };
}
