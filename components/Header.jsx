
function Header() {
  return (
    <div className="flex justify-between items-center bg-blue-500 p-4">
      <div className="text-white font-bold text-xl">
        <span className="text-3xl">G</span> Grownet
      </div>
      <div className="flex gap-4">
        <button className="bg-white text-blue-500 rounded px-4 py-2">Productos</button>
        <button className="bg-white text-blue-500 rounded px-4 py-2">Categorías</button>
        <button className="bg-white text-blue-500 rounded px-4 py-2">Presentaciones</button>
        <button className="bg-white text-blue-500 rounded px-4 py-2">Proveedor</button>
        <button className="bg-white text-blue-500 rounded px-4 py-2">Orders</button>
      </div>
    </div>
  )
}
export default Header