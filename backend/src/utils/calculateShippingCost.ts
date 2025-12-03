interface ProductDetailForCost {
    id: string;
    quantity: number;
    price: number; // Precio unitario del producto
    weight_kg: number;
    // ... (dimensions_cm) ...
}



export const calculateShippingCost = (
  products: ProductDetailForCost[],
  transport_type: string
): number => {

  // 1. Calcular el valor total de los productos
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  // 2. Costos por tipo de transporte
  let CONSTrans = 0;

  if (transport_type === "road") {
    CONSTrans = 20;
  } else if (transport_type === "air") {
    CONSTrans = 50;
  }

  // 3. Total
  const totalCost = totalValue + CONSTrans;

  return parseFloat(totalCost.toFixed(2));
};
