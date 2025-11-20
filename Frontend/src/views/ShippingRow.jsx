import { useState } from "react";
import TrackingDetailModal from "./modal/TrackingDetailModal";

function ShippingRow({ shipping }) {
  const address = shipping.delivery_address_json;

  const [openModal, setOpenModal] = useState(false);
const [selectedId, setSelectedId] = useState(null);

const openTracking = (id) => {
  setSelectedId(id);
  setOpenModal(true);
};


  return (

    <div className="grid grid-cols-4 gap-4 py-4 border-b border-b-gray-200 text-sm">

      {/* Order Details */}
      <div className="flex flex-col">
        <span className="font-semibold">SHIP-{shipping.id}</span>
        <span className="text-gray-600 capitalize">{shipping.status}</span>
        <span className="text-gray-500 text-xs">
          {new Date(shipping.createdAt).toLocaleString()}
        </span>
        <span className="text-gray-500 text-xs">
          Transport: {shipping.transport_type}
        </span>
      </div>

      {/* Shipping Details */}
      <div className="flex flex-col">
        <span>{address.city}, {address.state}</span>
        <span>{address.street}</span>
        <span>{address.postal_code}</span>
      </div>

      {/* Payment Details */}
      <div className="flex flex-col">
        <span className="font-semibold">$ {shipping.shipping_cost}</span>
        <span className="text-gray-600">
          EDD: {new Date(shipping.estimated_delivery_at).toLocaleDateString()}
        </span>
        <span className="text-xs text-gray-500">Method: N/A</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => openTracking(shipping.id)}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded"
          
        >
          Ver más
        </button>
      </div>
<TrackingDetailModal
  isOpen={openModal}
  onClose={() => setOpenModal(false)}
  id={selectedId}
/>

    </div>
  );
}

export default ShippingRow;
