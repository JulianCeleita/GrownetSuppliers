import Table from "@/components/Table";

function OrderView() {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 p-6 shadow-lg">
        <div className="grid grid-cols-2 bg-white p-4 rounded-lg shadow-lg text-dark-blue">
          <div className="grid grid-cols-2 m-4 gap-2">
            <h3>Account Number</h3>
            <h3 className="underline decoration-4 decoration-green">
              123-654-789{" "}
            </h3>
            <h3>Post Code</h3>
            <h3 className="underline decoration-4 decoration-green">
              7755225588
            </h3>
            <h3>Telephone</h3>
            <h3 className="underline decoration-4 decoration-green">
              123-654-789
            </h3>
          </div>
          <div className="grid grid-cols-2 m-4 gap-2">
            <h3>Account Name</h3>
            <h3 className="underline decoration-4 decoration-green">
              LETOBAKERY LTDA{" "}
            </h3>
            <h3>Address</h3>
            <h3 className="underline decoration-4 decoration-green">
              155 WARDOUR STREET
            </h3>
            <h3>Contact</h3>
            <h3 className="underline decoration-4 decoration-green">
              Kevin Pinzón
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-2 bg-white p-4 rounded-lg shadow-lg text-dark-blue">
          <div className="grid grid-cols-2 m-4 gap-2">
            <h3>Date</h3>
            <input className="rounded p-2 border-2 border-dark-blue border-solid shadow-sm shadow-dark-blue" />
            <h3>A/C</h3>
            <input className="rounded p-2 border-2 border-dark-blue border-solid shadow-sm shadow-dark-blue" />
          </div>
          <div className="grid grid-cols-2 m-4 gap-2">
            <h3>Inv. No.</h3>
            <input className="rounded p-2 border-2 border-dark-blue border-solid shadow-sm shadow-dark-blue" />
            <h3>Order No.</h3>
            <input className="rounded p-2 border-2 border-dark-blue border-solid shadow-sm shadow-dark-blue" />
          </div>
          <h3>Customer Order No.</h3>
          <input className="rounded p-2 border-2 border-dark-blue border-solid shadow-sm shadow-dark-blue" />
        </div>
      </div>
      <Table />
    </>
  );
}
export default OrderView;
