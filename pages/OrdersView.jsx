function OrderView() {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 p-6 shadow-lg">
        <div className="grid grid-cols-2 bg-white p-4 rounded-lg shadow-lg">
          <div className="flex flex-col gap-2">
            <label>Account Number</label>
            <input className="rounded p-2 border" placeholder="123-654-789" />
            <label>Account Name</label>
            <input className="rounded p-2 border" placeholder="Kevin Pinzón" />
            <label>Telephone</label>
            <input className="rounded p-2 border" placeholder="123-654-789" />
          </div>
          <div className="flex flex-col gap-2">
            <label>Account Number</label>
            <input className="rounded p-2 border" placeholder="123-654-789" />
            <label>Account Name</label>
            <input className="rounded p-2 border" placeholder="Kevin Pinzón" />
            <label>Telephone</label>
            <input className="rounded p-2 border" placeholder="123-654-789" />
          </div>
        </div>
        <div className="grid grid-cols-2 bg-white p-4 rounded-lg shadow-lg">
          <div className="flex flex-col gap-2">
            <label>Due on</label>
            <input className="rounded p-2 border" placeholder="123-654-789" />
            <label>Date</label>
            <input className="rounded p-2 border" placeholder="Kevin Pinzón" />
            <label>A/C*</label>
            <input className="rounded p-2 border" placeholder="123-654-789" />
          </div>
          <div className="flex flex-col gap-2">
            <label>Due on</label>
            <input className="rounded p-2 border" placeholder="123-654-789" />
            <label>Date</label>
            <input className="rounded p-2 border" placeholder="Kevin Pinzón" />
            <label>A/C*</label>
            <input className="rounded p-2 border" placeholder="123-654-789" />
          </div>
        </div>
      </div>
      <div className="flex flex-col p-4">
        <div className="overflow-x-auto">
          {/* <table className="w-full text-sm text-left">
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
      </table> */}
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
          <button className="bg-blue-500 text-white rounded px-6 py-2">
            save
          </button>
        </div>
      </div>
    </>
  );
}
export default OrderView;
