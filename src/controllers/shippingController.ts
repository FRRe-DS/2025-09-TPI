import type { Request, Response } from "express";
import Shipping from "../models/shippings";
import ShippingLog from "../models/ShippingLog";


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

  static getShippingById = (req: Request, res: Response) => {
   //logica
  };

  static cancelShipping= async (req: Request, res: Response) => {
    try {
      const { shipping_id } = req.params;

      const shipping = await Shipping.findByPk(shipping_id);
      if (!shipping) {
        return res.status(404).json({ error: "Envio no encontrado" });
      }

      if (shipping.status === "cancelled") {
        return res.status(400).json({ error: "El envio ya se encuentra cancelado" });
      }

      shipping.status = "cancelled";
      await shipping.save();

      await ShippingLog.create({
        shipping_id: shipping.id,
        status: "cancelled",
        message: "El envio fue cancelado",
        timestamp: new Date(),
      });

      res.json({ 
        shipping_id: shipping.id,
        message: "El envio fue cancelado correctamente", 
        status: "cancelled",
        cancelled_at: new Date().toLocaleString("es-AR")
      });
    } catch (error) {
      console.error("Error al cancelar el envio:", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  };
}
