import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const LoginView = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Simulación de Login exitoso con:", data);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    localStorage.setItem("token", "simulated_jwt_token_12345");
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 1, email: data.email, name: "Usuario Demo" })
    );

    navigate("/app/shippings", { replace: true });
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-[url(/src/assets/bglogin.webp)] ">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden max-w-5xl w-full">
        <div className="hidden md:flex flex-1 items-center justify-center p-8 bg-gray-100 relative">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-white from-blue-50 to-white  rounded-lg"></div>
            <div className="relative z-10 text-center">
              <img
                src="https://imgs.search.brave.com/-yKfGjDo6L3HZX7oeVCpkJJ-Y_TjtYWKHwdQ70I11JY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvdGVjaG5vbG9n/eS1kcml2ZW4td2Fy/ZWhvdXNlLW9wZXJh/dGlvbnMtaW52ZW50/b3J5LWNvbnRyb2wt/aWxsdXN0cmF0aW9u/LWlsbHVzdHJhdGlv/bl8zMjcxNzYtMTgz/OS5qcGc_c2VtdD1h/aXNfaHlicmlkJnc9/NzQwJnE9ODA"
                alt="Logistics"
                className="mx-auto"
              />
              <p className="text-gray-600 mt-4 text-lg">
                Plataforma de gestión de cadena de suministro
              </p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold mb-3 text-gray-900">
            Iniciar sesion
          </h2>
          <p className="text-gray-500 mb-8 text-base">
            Bienvenido a la plataforma de logística. Inicie sesión para
            continuar.
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-5">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                {...register("email", {
                  required: "El email es obligatorio",
                  pattern: /^\S+@\S+$/i,
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="password"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Iniciando Sesión..." : "Iniciar Sesión"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
