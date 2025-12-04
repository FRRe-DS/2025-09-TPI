import ShippingRow from "./ShippingRow";

export default function ShippingTable({ data }) {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Mis Envíos
        </h1>

        {/* Lista de envíos */}
        <div className="space-y-4">
          {data && data.length > 0 ? (
            data.map((s) => (
              <ShippingRow key={s.id} shipping={s} />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-600 text-lg">No hay envíos disponibles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
