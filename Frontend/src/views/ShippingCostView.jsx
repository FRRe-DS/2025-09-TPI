import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { TbCubeSend } from "react-icons/tb";

const API_BASE_URL = "http://localhost:4001/api";

const ShippingCostView = () => {
    const navigate = useNavigate();
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
            const payload = {
                transportMethod: data.transportMethod,
                sender: {
                    province: data.senderProvince,
                },
                receiver: {
                    province: data.recipientProvince,
                },
                product: {
                    width: parseFloat(data.width),
                    height: parseFloat(data.height),
                    length: parseFloat(data.length),
                    weight: parseFloat(data.weight),
                    declaredValue: parseFloat(data.declaredValue || 0),
                },
            };

            const res = await fetch(`${API_BASE_URL}/logistics/cost`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const json = await res.json();

            if (!res.ok || !json.ok) {
                throw new Error(json.message || "Error en la cotización.");
            }

            setCostData(json);
            console.log(json)

        } catch (err) {
            console.error("Error al cotizar:", err);
            setError(err.message || "Error de red.");
        }
    };

    const provincias = [
        "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes",
        "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza",
        "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis",
        "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego",
        "Tucumán", "CABA"
    ];

    const medios = ["terrestrial", "air"];

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Cotizá tu encomienda
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-lg p-6 space-y-6">

                    {/* Tipo transporte */}
                    <div className="border-b pb-4">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <TbCubeSend /> Tipo de transporte
                        </h2>

                        <select
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            {...register("transportMethod", { required: "Seleccione un método" })}
                        >
                            <option value="">Seleccionar método</option>
                            {medios.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>

                        {errors.transportMethod && (
                            <p className="text-red-500 text-xs mt-1">{errors.transportMethod.message}</p>
                        )}
                    </div>

                    {/* REMITENTE */}
                    <div className="border-b pb-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Remitente</h2>

                        <select
                            className="p-3 border rounded-lg w-full"
                            {...register("senderProvince", { required: true })}
                        >
                            <option value="">Provincia</option>
                            {provincias.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    {/* DESTINATARIO */}
                    <div className="border-b pb-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Destinatario</h2>

                        <select
                            className="p-3 border rounded-lg w-full"
                            {...register("recipientProvince", { required: true })}
                        >
                            <option value="">Provincia</option>
                            {provincias.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    {/* PRODUCTO */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Producto</h2>

                        <div className="grid grid-cols-3 gap-4">
                            <input type="number" step="0.1" placeholder="Ancho (cm)" {...register("width", { required: true })} className="p-3 border rounded-lg" />
                            <input type="number" step="0.1" placeholder="Alto (cm)" {...register("height", { required: true })} className="p-3 border rounded-lg" />
                            <input type="number" step="0.1" placeholder="Largo (cm)" {...register("length", { required: true })} className="p-3 border rounded-lg" />
                            <input type="number" step="0.01" placeholder="Peso (kg)" {...register("weight", { required: true })} className="p-3 border rounded-lg col-span-3" />
                            <input type="number" step="0.01" placeholder="Valor declarado ($)" {...register("declaredValue")} className="p-3 border rounded-lg col-span-3" />
                        </div>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div className="text-red-600 p-3 bg-red-50 rounded border border-red-200 mt-3">
                            {error}
                        </div>
                    )}

                    {/* RESULTADO */}
                    {costData?.ok && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
                            <p className="text-lg font-semibold text-gray-800">
                                Costo Estimado:{" "}
                                <span className="text-blue-600">
                                    ${costData.cost.toFixed(2)}
                                </span>
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                Entrega estimada en {costData.estimatedDays} días.
                            </p>

                            <p className="mt-3 text-gray-700 text-sm">
                                Distancia estimada: {costData.breakdown.distance} KM  
                                <br />
                                Costo por peso: ${costData.breakdown.weightCost}
                                <br />
                                Costo por distancia: ${costData.breakdown.distanceCost}
                                <br />
                                Seguro: ${costData.breakdown.insurance}
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg mt-6"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Calculando..." : "COTIZAR"}
                    </button>
                </form>

                <div className="mt-4 flex justify-end">
                    <button onClick={() => navigate('/')} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">
                        Volver al Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShippingCostView;


