import Table from "@/app/components/Table";

function OrderView() {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 p-6 shadow-lg bg-primary-blue pb-20">
        <div className="grid grid-cols-2 bg-white p-4 rounded-lg shadow-lg text-dark-blue">
          <div className="grid grid-cols-2 m-4 gap-2">
            <h3>Account Number:</h3>
            <h3 className="underline decoration-2 decoration-green">
              123-654-789{" "}
            </h3>
            <h3>Post Code:</h3>
            <h3 className="underline decoration-2 decoration-green">
              7755225588
            </h3>
            <h3>Telephone:</h3>
            <h3 className="underline decoration-2 decoration-green">
              123-654-789
            </h3>
            <h3>Round:</h3>
            <h3 className="underline decoration-2 decoration-green">R1</h3>
          </div>
          <div className="grid grid-cols-2 m-4 gap-2">
            <h3>Account Name:</h3>
            <h3 className="underline decoration-2 decoration-green">
              LETOBAKERY LTDA{" "}
            </h3>
            <h3>Address:</h3>
            <h3 className="underline decoration-2 decoration-green">
              155 WARDOUR STREET
            </h3>
            <h3>Contact:</h3>
            <h3 className="underline decoration-2 decoration-green">
              Kevin Pinzón
            </h3>
            <h3>Drop:</h3>
            <h3 className="underline decoration-2 decoration-green">12</h3>
          </div>
        </div>
        <div className="bg-white p-5 pr-9 pl-9 rounded-lg">
          <div className="flex">
            <div className="flex flex-col w-[50%]">
              <label>Date: </label>
              <input type="date" className="border p-3 rounded-md mr-2" />
              <label className="mt-2">A/C: </label>
              <input type="text" className="border p-3 rounded-md mr-2" />
            </div>
            <div className="flex flex-col w-[50%]">
              <label>Inv. No.: </label>
              <input type="text" className="border p-3 rounded-md mr-2" />
              <label className="mt-2">Order No.: </label>
              <input type="text" className="border p-3 rounded-md mr-2" />
            </div>
          </div>
          <label>Customer: </label>
          <input type="text" className="border p-3 rounded-md mt-3 w-full" />
        </div>
      </div>
      <div className="-mt-20">
        <Table />
      </div>
    </>
  );
}
export default OrderView;
