export default function OrderCard({ title,  items }) {
  return (
    <div className="border-l-4 border-red-500  p-4 rounded mb-4">
      {/* Título y total */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>

      {/* Lista */}
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="text-gray-700">{item.label}</span>
            </div>
            <span className="text-gray-700">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
