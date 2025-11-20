import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import OrderCard from "./auth/OrderCard";
import ShippingTable from "./ShippingTable";

const statusTranslations = {
  created: "Creado",
  reserved: "Reservado",
  in_transit: "En tránsito",
  in_distribution: "En distribución",
  arrived: "Arribado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const AppLayout = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [tableData, setTableData] = useState([]);



  useEffect(() => {
    const loadAll = async () => {
      try {
        // 1) LOGIN AUTOMÁTICO
        const loginRes = await fetch(
          "https://api-logisticautn-1.onrender.com/api/auth/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: "test@utn.com",
              password: "PasswordSeguro123",
            }),
          }
        );

        const loginJson = await loginRes.json();
        const token = loginJson.token;

        // *** GUARDAR TOKEN EN LOCALSTORAGE ***
        localStorage.setItem("authToken", token);

        // 2) Traer envíos
        const shippingsRes = await fetch(
          "https://api-logisticautn-1.onrender.com/api/logistics/users/1/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const shippingsJson = await shippingsRes.json();
        const shippings = shippingsJson.data || [];

        setTableData(shippings);

        // 3) Contar estados
        const counts = {};
        shippings.forEach((s) => {
          counts[s.status] = (counts[s.status] || 0) + 1;
        });

        // 4) Lista formateada
        const formatted = Object.keys(statusTranslations).map((key) => ({
          label: statusTranslations[key],
          value: counts[key] || 0,
          color: "#6b7280",
        }));

        setOrderItems(formatted);
      } catch (error) {
        console.error("ERROR cargando datos:", error);
      }
    };

    loadAll();
  }, []);

 


  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="bg-[#4a4e69] h-12"></div>

      <div className="flex justify-between items-center mb-1 p-4">
        <h1 className="text-2xl font-bold text-gray-800">Mis Envios</h1>

        <Link
          to="/cost"
          className="bg-[#da627d] hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow transition duration-150"
        >
          + Cotizar envío
        </Link>
      </div>

      <span className="block w-full h-px bg-gray-200"></span>

      <div className="flex justify-between items-center mb-1 p-4">
        <div className="mb-1 p-3 rounded-lg flex items-center ">
          <input
            type="text"
            placeholder="Buscar..."
            className="p-2 border border-gray-300 rounded-l-md w-full
            focus:ring-blue-500 focus:border-blue-500 shadow-inner"
          />
          <button className="p-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-100">
            🔍
          </button>
        </div>
      </div>

      <main className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen">

          {/* Sidebar */}
          <aside className="w-full lg:w-1/4 bg-white border-r-gray-200 p-6 shadow-md sticky top-0">
            <h3 className="text-xl font-bold text-gray-800">Órdenes por estado</h3>

            <div className="mt-4 space-y-2">
              <OrderCard title="Mis Pedidos" items={orderItems} />
            </div>
          </aside>

          {/* Contenido */}
          <div className="w-full lg:w-2/3 p-6">
            <h1 className="text-3xl font-bold">Listado de Registros</h1>

            <div className="mt-4 bg-white p-4 rounded shadow">
              <ShippingTable data={tableData} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AppLayout;


