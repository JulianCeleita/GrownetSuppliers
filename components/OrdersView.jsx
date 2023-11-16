import Categories from "./Categories";

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
      <Categories />
    </>
  );
}
export default OrderView;
