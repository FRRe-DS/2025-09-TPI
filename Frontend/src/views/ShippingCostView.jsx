import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; // 🚨 Importar useNavigate

const API_BASE_URL = "https://api-logisticautn-1.onrender.com/api";

const ShippingCostView = () => {
    const navigate = useNavigate(); // Inicializar useNavigate
    const [costData, setCostData] = useState(null);
    const [error, setError] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm();

    const onSubmit = async (data) => {
        setError(null);
        setCostData(null);

        try {
            // ... (Lógica de Payload)
            const payload = {
                transportMethod: data.transportMethod,
                products: [
                    {
                        id: "1",
                        quantity: parseInt(data.quantity1),
                        weight_kg: parseFloat(data.weight1),
                        dimensions_cm: { width: 10, height: 10, length: 10 },
                    },
                ],
            };
            
            // ... (Lógica de Fetch)
            const res = await fetch(`${API_BASE_URL}/logistics/cost`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
                throw new Error(
                    json.error || json.message || "Error desconocido en la cotización."
                );
            }

            setCostData(json);
        } catch (err) {
            console.error("Error al cotizar:", err);
            setError(err.message || "Error de red al intentar la cotización.");
        }
    };
    
    // Función para manejar la creación del envío (puede ser llamada después de cotizar)
    const handleCreateShipping = () => {

        navigate('/'); 
    };


    return (
        // 🚨 Contenedor principal centrado
        <div className="w-full bg-[url(/src/assets/costo.jpg)] h-screen flex justify-center items-center">
            {/* Contenedor del formulario */}
            <div className="max-w-xl p-8 bg-white rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Cotizar Costo de Envío</h1>
                <p className="mb-6 text-gray-600">Ingrese los datos para obtener el precio estimado del flete.</p>

               
                

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* ... (Campos de Servicio Requerido y Artículos/Peso) ... */}
                    <fieldset className="border p-4 rounded-lg">
                        <legend className="text-lg font-semibold text-gray-700">Servicio Requerido</legend>
                        <select
                            {...register("transportMethod", { required: "Debe seleccionar un tipo de envío" })}
                            className="w-full p-2 border rounded bg-white"
                        >
                            <option value="">Seleccione el Tipo de Servicio</option>
                            <option value="standard">Envío Estándar</option>
                            <option value="express">Envío Express</option>
                        </select>
                        {errors.transportMethod && (<p className="text-red-500 text-xs mt-1">{errors.transportMethod.message}</p>)}
                    </fieldset>

                    <fieldset className="border p-4 rounded-lg space-y-3">
                        <legend className="text-lg font-semibold text-gray-700">Artículos y Peso</legend>
                        <input type="number" step="1" placeholder="Cantidad de Artículos (Total)" className="w-full p-2 border rounded"
                            {...register("quantity1", { required: "Cantidad es obligatoria", min: { value: 1, message: "Mínimo 1 artículo" } })}
                        />
                        <input type="number" step="0.01" placeholder="Peso total (kg)" className="w-full p-2 border rounded"
                            {...register("weight1", { required: "Peso es obligatorio", min: { value: 0.1, message: "Mínimo 0.1 kg" } })}
                        />
                    </fieldset>

                    {error && (
                        <div className="text-red-600 p-3 bg-red-50 rounded border border-red-200">{error}</div>
                    )}

                    <div className="flex justify-between items-center pt-4">
                        {/* BOTÓN DE SUBMIT (Cotización) */}
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Calculando..." : "Obtener Cotización"}
                        </button>

                        {/* RESULTADO DE COTIZACIÓN */}
                        {costData?.success && (
                            <div className="text-right text-lg font-semibold text-gray-800">
                                Costo Estimado:{" "}
                                <span className="text-blue-600">
                                    ${costData.cost.toFixed(2)} {costData.currency}
                                </span>
                                <div className="text-sm text-gray-500">
                                    Entrega en {costData.estimated_days} días.
                                </div>
                            </div>
                        )}
                    </div>
                </form>
                <div className="flex justify-end mb-4">
                    <button
                        type="button"
                        onClick={handleCreateShipping} // Llama a la función de navegación
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        + Volver al Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShippingCostView;

