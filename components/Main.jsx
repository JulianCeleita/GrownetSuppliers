function Main() {
  return (
    <div className="flex flex-col p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-white uppercase bg-blue-700">
            <tr>
              <th scope="col" className="px-6 py-3">ProductCode</th>
              <th scope="col" className="px-6 py-3">Description</th>
              <th scope="col" className="px-6 py-3">Quantity</th>
              <th scope="col" className="px-6 py-3">Net</th>
              <th scope="col" className="px-6 py-3">Tax</th>
              <th scope="col" className="px-6 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            PRUEBA
          </tbody>
        </table>
      </div>
      <div className="flex justify-end gap-4 p-4">
        <div>
          <label>Total</label>
          <input className="rounded p-2 border" />
        </div>
        <div>
          <label>Total Im</label>
          <input className="rounded p-2 border" />
        </div>
        <button className="bg-blue-500 text-white rounded px-6 py-2">save</button>
      </div>
    </div>
  )
}
export default Main