import type { Request, Response } from "express";


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
   //logica
  };
}
