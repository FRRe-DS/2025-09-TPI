import { useEffect, useState } from "react";

export default function TrackingDetailModal({ isOpen, onClose, id }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ---------------------------------------------
  // Cargar datos cuando el modal se abre
  // ---------------------------------------------
  useEffect(() => {
    if (!isOpen || !id) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("SIN_TOKEN");
          return;
        }

        const res = await fetch(
          `https://api-logisticautn-1.onrender.com/api/logistics/tracking/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.status === 401) {
          setError("TOKEN_INVALIDO");
          return;
        }

        const json = await res.json();
        setDetail(json.data);
      } catch (err) {
        console.error(err);
        setError("ERROR_DESCONOCIDO");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [isOpen, id]);

  // Función para obtener el icono y color según el estado
  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    
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

  if (!isOpen) return null;

  // ---------------------------------------------------
  // UI DEL MODAL
  // ---------------------------------------------------
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Detalles del Envío</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="text-gray-600">Cargando...</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error === "SIN_TOKEN" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 font-semibold">No hay sesión activa.</p>
            </div>
          )}

          {error === "TOKEN_INVALIDO" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 font-semibold">Token inválido — debes iniciar sesión.</p>
            </div>
          )}

          {error && error !== "TOKEN_INVALIDO" && error !== "SIN_TOKEN" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 font-semibold">Error cargando los datos.</p>
            </div>
          )}

          {/* Detalle */}
          {detail && !loading && (
            <div className="space-y-6">
              {/* Información Principal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ID */}
                <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">ID</p>
                    <p className="text-lg font-bold text-gray-800">SHIP-{detail.order_id}</p>
                  </div>
                </div>

                {/* Estado */}
                <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
                  {(() => {
                    const statusInfo = getStatusIcon(detail.status);
                    return (
                      <>
                        <div className={`${statusInfo.color} rounded-full p-2`}>
                          {statusInfo.icon}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase">Estado</p>
                          <p className="text-lg font-bold text-gray-800">{statusInfo.label}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Costo */}
                <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Costo</p>
                    <p className="text-lg font-bold text-gray-800">${detail.shipping_cost?.toLocaleString('es-AR') || '0'}</p>
                  </div>
                </div>

                {/* Entrega Estimada */}
                <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
                  <div className="bg-purple-100 rounded-full p-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Entrega Estimada</p>
                    <p className="text-lg font-bold text-gray-800">
                      {new Date(detail.estimated_delivery_at).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dirección */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 rounded-full p-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Dirección de Entrega</h3>
                </div>
                <div className="space-y-2 pl-1">
                  <div className="flex items-start gap-2 text-gray-700">
                    <svg className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-sm font-medium">{detail.delivery_address_json.street}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <svg className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                    <span className="text-sm font-medium">
                      {detail.delivery_address_json.city}, {detail.delivery_address_json.state}
                    </span>
                  </div>
                  {detail.delivery_address_json.postal_code && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-xs">CP: {detail.delivery_address_json.postal_code}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Historial */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-100 rounded-full p-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Historial de Seguimiento</h3>
                </div>
                <div className="relative">
                  {/* Línea de tiempo vertical */}
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  <ul className="space-y-6 relative">
                    {detail.logs.map((log, index) => {
                      const statusInfo = getStatusIcon(log.status);
                      const isLast = index === detail.logs.length - 1;
                      return (
                        <li key={log.id} className="relative pl-12">
                          {/* Punto en la línea de tiempo */}
                          <div className={`absolute left-3 ${statusInfo.color} rounded-full p-2 border-2 border-white shadow-sm`}>
                            {statusInfo.icon}
                          </div>
                          
                          {/* Contenido del log */}
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                                {statusInfo.label}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(log.createdAt).toLocaleDateString('es-AR')} {new Date(log.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{log.message}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

