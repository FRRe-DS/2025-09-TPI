import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://api-logisticautn-1.onrender.com/api";
const USE_MOCKUP = true; // Cambiar a false para usar la API real

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
            if (USE_MOCKUP) {
                // Mockup para probar
                await new Promise(resolve => setTimeout(resolve, 1500));
                setCostData({
                    success: true,
                    cost: 1250.50,
                    currency: "ARS",
                    estimated_days: 5
                });
                return;
            }

            const payload = {
                transportMethod: data.transportMethod || "standard",
                sender: {
                    address: data.senderAddress,
                    locality: data.senderLocality,
                    postalCode: data.senderPostalCode,
                    province: data.senderProvince,
                },
                recipient: {
                    address: data.recipientAddress,
                    locality: data.recipientLocality,
                    postalCode: data.recipientPostalCode,
                    province: data.recipientProvince,
                },
                products: [
                    {
                        id: "1",
                        quantity: parseInt(data.quantity) || 1,
                        weight_kg: parseFloat(data.weight),
                        dimensions_cm: {
                            width: parseFloat(data.width),
                            height: parseFloat(data.height),
                            length: parseFloat(data.length),
                        },
                        declared_value: parseFloat(data.declaredValue) || 0,
                    },
                ],
            };
            
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

    const provincias = [
        "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes",
        "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza",
        "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis",
        "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego",
        "Tucumán", "Ciudad Autónoma de Buenos Aires"
    ];

    // Iconos SVG
    const SmartphoneIcon = () => (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
    );

    const DocumentIcon = () => (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );

    const LocationIcon = () => (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );

    const BoxIcon = ({ direction = "horizontal" }) => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            {direction === "horizontal" && (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
            )}
            {direction === "vertical" && (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8" />
            )}
        </svg>
    );

    const ScaleIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
    );

    const DollarIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Título */}
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Cotizá tu encomienda
                </h1>

                {/* Proceso de 3 pasos */}
                <div className="flex items-center justify-center mb-8 gap-4">
                    <div className="flex flex-col items-center flex-1">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white mb-2">
                            <SmartphoneIcon />
                        </div>
                        <p className="text-sm text-center text-gray-700 font-medium">
                            Cargá los datos<br />de tu envío
                        </p>
                    </div>
                    <div className="text-blue-500 text-2xl">→</div>
                    <div className="flex flex-col items-center flex-1">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white mb-2">
                            <DocumentIcon />
                        </div>
                        <p className="text-sm text-center text-gray-700 font-medium">
                            Imprimí tu<br />etiqueta
                        </p>
                    </div>
                    <div className="text-blue-500 text-2xl">→</div>
                    <div className="flex flex-col items-center flex-1">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white mb-2">
                            <LocationIcon />
                        </div>
                        <p className="text-sm text-center text-gray-700 font-medium">
                            Despachá en tu<br />sucursal más cercana
                        </p>
                    </div>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                    {/* Sección Remitente */}
                    <div className="border-b pb-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Remitente</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <input
                                    type="text"
                                    placeholder="Dirección y nombre"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("senderAddress", { required: "Dirección del remitente es obligatoria" })}
                                />
                                {errors.senderAddress && (
                                    <p className="text-red-500 text-xs mt-1">{errors.senderAddress.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Localidad"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("senderLocality", { required: "Localidad es obligatoria" })}
                                />
                                {errors.senderLocality && (
                                    <p className="text-red-500 text-xs mt-1">{errors.senderLocality.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Código Postal"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("senderPostalCode", { required: "Código postal es obligatorio" })}
                                />
                                {errors.senderPostalCode && (
                                    <p className="text-red-500 text-xs mt-1">{errors.senderPostalCode.message}</p>
                                )}
                            </div>
                            <div>
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    {...register("senderProvince", { required: "Provincia es obligatoria" })}
                                >
                                    <option value="">Provincia</option>
                                    {provincias.map((prov) => (
                                        <option key={prov} value={prov}>{prov}</option>
                                    ))}
                                </select>
                                {errors.senderProvince && (
                                    <p className="text-red-500 text-xs mt-1">{errors.senderProvince.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sección Destinatario */}
                    <div className="border-b pb-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Destinatario</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <input
                                    type="text"
                                    placeholder="Dirección y nombre"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("recipientAddress", { required: "Dirección del destinatario es obligatoria" })}
                                />
                                {errors.recipientAddress && (
                                    <p className="text-red-500 text-xs mt-1">{errors.recipientAddress.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Localidad"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("recipientLocality", { required: "Localidad es obligatoria" })}
                                />
                                {errors.recipientLocality && (
                                    <p className="text-red-500 text-xs mt-1">{errors.recipientLocality.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Código Postal"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("recipientPostalCode", { required: "Código postal es obligatorio" })}
                                />
                                {errors.recipientPostalCode && (
                                    <p className="text-red-500 text-xs mt-1">{errors.recipientPostalCode.message}</p>
                                )}
                            </div>
                            <div>
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    {...register("recipientProvince", { required: "Provincia es obligatoria" })}
                                >
                                    <option value="">Provincia</option>
                                    {provincias.map((prov) => (
                                        <option key={prov} value={prov}>{prov}</option>
                                    ))}
                                </select>
                                {errors.recipientProvince && (
                                    <p className="text-red-500 text-xs mt-1">{errors.recipientProvince.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sección Producto */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Producto N°1</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                                <div className="text-blue-500">
                                    <BoxIcon direction="horizontal" />
                                </div>
                                <input
                                    type="number"
                                    step="0.1"
                                    placeholder="Ancho (cm)"
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("width", { required: "Ancho es obligatorio", min: { value: 0.1, message: "Mínimo 0.1 cm" } })}
                                />
                            </div>
                            {errors.width && (
                                <p className="text-red-500 text-xs col-span-2 md:col-span-3">{errors.width.message}</p>
                            )}
                            <div className="flex items-center gap-2">
                                <div className="text-blue-500">
                                    <BoxIcon direction="vertical" />
                                </div>
                                <input
                                    type="number"
                                    step="0.1"
                                    placeholder="Alto (cm)"
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("height", { required: "Alto es obligatorio", min: { value: 0.1, message: "Mínimo 0.1 cm" } })}
                                />
                            </div>
                            {errors.height && (
                                <p className="text-red-500 text-xs col-span-2 md:col-span-3">{errors.height.message}</p>
                            )}
                            <div className="flex items-center gap-2">
                                <div className="text-blue-500">
                                    <DollarIcon />
                                </div>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Valor declarado ($)"
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("declaredValue", { min: { value: 0, message: "El valor debe ser positivo" } })}
                                />
                            </div>
                            {errors.declaredValue && (
                                <p className="text-red-500 text-xs col-span-2 md:col-span-3">{errors.declaredValue.message}</p>
                            )}
                            <div className="flex items-center gap-2">
                                <div className="text-blue-500">
                                    <BoxIcon direction="horizontal" />
                                </div>
                                <input
                                    type="number"
                                    step="0.1"
                                    placeholder="Largo (cm)"
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("length", { required: "Largo es obligatorio", min: { value: 0.1, message: "Mínimo 0.1 cm" } })}
                                />
                            </div>
                            {errors.length && (
                                <p className="text-red-500 text-xs col-span-2 md:col-span-3">{errors.length.message}</p>
                            )}
                            <div className="flex items-center gap-2">
                                <div className="text-blue-500">
                                    <ScaleIcon />
                                </div>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Peso por unidad (kg)"
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("weight", { required: "Peso es obligatorio", min: { value: 0.1, message: "Mínimo 0.1 kg" } })}
                                />
                            </div>
                            {errors.weight && (
                                <p className="text-red-500 text-xs col-span-2 md:col-span-3">{errors.weight.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Mensajes de error */}
                    {error && (
                        <div className="text-red-600 p-3 bg-red-50 rounded border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Resultado de cotización */}
                    {costData?.success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-lg font-semibold text-gray-800">
                                Costo Estimado:{" "}
                                <span className="text-blue-600">
                                    ${costData.cost.toFixed(2)} {costData.currency}
                                </span>
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                Entrega estimada en {costData.estimated_days} días.
                            </p>
                        </div>
                    )}

                    {/* Botón COTIZÁ */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg text-lg uppercase disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Calculando..." : "COTIZÁ"}
                    </button>
                </form>

                {/* Botón volver */}
                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Volver al Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShippingCostView;

