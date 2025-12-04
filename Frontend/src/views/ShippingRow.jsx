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

  // Función para obtener el icono y color según el estado
  const getStatusIcon = (status) => {
    const statusLower = status.toLowerCase();
    
    switch (statusLower) {
      case "created":
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          ),
          color: "bg-blue-100 text-blue-600",
          label: "Creado"
        };
      case "reserved":
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
          color: "bg-yellow-100 text-yellow-600",
          label: "Reservado"
        };
      case "in_transit":
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
          color: "bg-purple-100 text-purple-600",
          label: "En tránsito"
        };
      case "in_distribution":
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          ),
          color: "bg-indigo-100 text-indigo-600",
          label: "En distribución"
        };
      case "arrived":
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
          color: "bg-cyan-100 text-cyan-600",
          label: "Llegó"
        };
      case "delivered":
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: "bg-green-100 text-green-600",
          label: "Entregado"
        };
      case "cancelled":
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: "bg-red-100 text-red-600",
          label: "Cancelado"
        };
      default:
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          ),
          color: "bg-gray-100 text-gray-600",
          label: status
        };
    }
  };

  // Función para obtener el icono del tipo de transporte
  const getTransportIcon = (transportType) => {
    const type = transportType?.toLowerCase();
    
    switch (type) {
      case "air":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        );
      case "sea":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case "rail":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case "road":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      default:
        return null;
    }
  };

  const statusInfo = getStatusIcon(shipping.status);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-4 border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Detalles del pedido */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl font-bold text-gray-800">SHIP-{shipping.id}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`${statusInfo.color} rounded-full p-2 flex items-center justify-center`}>
              {statusInfo.icon}
            </div>
            <span className="font-semibold text-gray-700">{statusInfo.label}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date(shipping.createdAt).toLocaleDateString('es-AR')}</span>
            <span className="text-xs">{new Date(shipping.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <div className="text-blue-500">
              {getTransportIcon(shipping.transport_type)}
            </div>
            <span className="capitalize">{shipping.transport_type || 'N/A'}</span>
          </div>
        </div>

        {/* Detalles de envío */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Dirección de entrega</h3>
          <div className="flex items-start gap-2 text-gray-700">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="flex flex-col">
              <span className="font-medium">{address.city}, {address.state}</span>
              <span className="text-sm text-gray-600">{address.street}</span>
              <span className="text-xs text-gray-500">CP: {address.postal_code}</span>
            </div>
          </div>
        </div>

        {/* Detalles del pago */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Información de pago</h3>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xl font-bold text-gray-800">${shipping.shipping_cost?.toLocaleString('es-AR') || '0'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>EDD: {new Date(shipping.estimated_delivery_at).toLocaleDateString('es-AR')}</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end md:justify-start">
          <button
            onClick={() => openTracking(shipping.id)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Ver más
          </button>
        </div>
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
