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

  if (!isOpen) return null;

  // ---------------------------------------------------
  // UI DEL MODAL
  // ---------------------------------------------------
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">

        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-600 hover:text-black text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Detalles del Envío</h2>

        {/* Loading */}
        {loading && <p className="text-gray-600">Cargando...</p>}

        {/* Error */}
        {error === "SIN_TOKEN" && (
          <p className="text-red-600">No hay sesión activa.</p>
        )}

        {error === "TOKEN_INVALIDO" && (
          <p className="text-red-600">Token inválido — debes iniciar sesión.</p>
        )}

        {error && error !== "TOKEN_INVALIDO" && error !== "SIN_TOKEN" && (
          <p className="text-red-600">Error cargando los datos.</p>
        )}

        {/* Detalle */}
        {detail && (
          <div className="space-y-3">

            <p><strong>ID:</strong> {detail.order_id}</p>
            <p><strong>Estado:</strong> {detail.status}</p>
            <p><strong>Costo:</strong> ${detail.shipping_cost}</p>

            <p>
              <strong>Entrega estimada:</strong>{" "}
              {new Date(detail.estimated_delivery_at).toLocaleDateString()}
            </p>

            <div className="mt-4">
              <h3 className="font-semibold text-lg">Dirección</h3>
              <p>{detail.delivery_address_json.street}</p>
              <p>
                {detail.delivery_address_json.city},{" "}
                {detail.delivery_address_json.state}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-lg mb-2">Historial</h3>
              <ul className="space-y-1">
                {detail.logs.map((log) => (
                  <li key={log.id} className="border-b pb-1">
                    <strong>{log.status.replace("_", " ")}</strong> —{" "}
                    {new Date(log.createdAt).toLocaleString()}
                    <br />
                    <span className="text-gray-700 text-sm">{log.message}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

