const Header = () => {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center z-20">
      <div className="flex items-center space-x-3">
        <div className="text-xl font-extrabold text-red-600">UTN</div>
        <h1 className="text-xl font-bold text-gray-800">
          Grupo N9 (Logística)
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
          JA
        </div>
      </div>
    </header>
  );
};
export default Header;
