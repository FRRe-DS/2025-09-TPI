import ShippingRow from "./ShippingRow";

export default function ShippingTable({ data }) {
  return (
    <div className="bg-white rounded w-full p-4 overflow-x-auto">
      <table className="min-w-[600px] w-full">
        <thead>
          <tr className="grid grid-cols-4 gap-4 font-semibold text-gray-700 border-b border-b-gray-200 pb-2">
            <th>Detalles del pedido</th>
            <th>Detalles de envío</th>
            <th>Detalles del pago</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((s) => (
            <ShippingRow key={s.id} shipping={s} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
