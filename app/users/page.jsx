"use client";
import EditPresentation from "@/app/components/EditPresentation";
import NewPresentation from "@/app/components/NewPresentation";
import {
  deletePresentationUrl,
  presentationsUrl,
  productsUrl,
  uomUrl,
} from "@/app/config/urls.config";
import useTokenStore from "@/app/store/useTokenStore";
import {
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import EditAccessUser from "../components/EditAccesUser";
import ModalDelete from "../components/ModalDelete";
import Layout from "../layoutS";

// export const fetchPresentations = async (
//   token,
//   setPresentations,
//   setIsLoading
// ) => {
//   try {
//     const response = await axios.get(presentationsUrl, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const newPresentation = Array.isArray(response.data.presentations)
//       ? response.data.presentations
//       : [];
//     setPresentations(newPresentation);
//     setIsLoading(false);
//     console.log("response.data.presentations", response.data.presentations);
//   } catch (error) {
//     console.error("Error al obtener las presentaciones:", error);
//   }
// };

function Users() {
  const { token } = useTokenStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showEditAccessUsers, setShowEditAccessUsers] = useState(false);

  // const sortedUsers = presentations.slice().sort((a, b) => {
  //   const productNameA =
  //     products.find((product) => product.id === a.products_id)?.name || "";
  //   const productNameB =
  //     products.find((product) => product.id === b.products_id)?.name || "";
  //   return productNameA.localeCompare(productNameB);
  // });
  const sortedUsers = ["Jaime"];

  return (
    <Layout>
      <div>
        <div className="flex justify-between p-8 pb-20 bg-primary-blue">
          <h1 className="text-2xl text-white font-semibold">Users list</h1>
        </div>
        <div className="flex items-center justify-center mb-40 -mt-14">
          <table className="w-[90%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-10">
            <thead className="sticky top-0 bg-white shadow-[0px_11px_15px_-3px_#edf2f7]">
              <tr className="border-b-2 border-stone-100 text-dark-blue">
                <th className="py-4 w-1/2">User</th>
                <th className="py-4 w-1/2">Access</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr
                  key="users"
                  className="text-dark-blue border-b-2 border-stone-100 "
                >
                  <td className="py-8 w-1/2">Javier</td>
                  <td className="py-8 w-[100%] flex items-center justify-center">
                    <button
                      onClick={() => {
                        // setSelectedUser(user);
                        setShowEditAccessUsers(true);
                      }}
                      className="flex text-primary-blue font-medium transition-all hover:scale-110 hover:text-green hover:border-green"
                    >
                      <PencilSquareIcon className="h-6 w-6 mr-1" />
                      Edit Access
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <EditAccessUser
          isvisible={showEditAccessUsers}
          onClose={() => setShowEditAccessUsers(false)}
          // user={selectedUser}
          // setUser={setUser}
          setIsLoading={setIsLoading}
        />
        {isLoading && (
          <div className="flex justify-center items-center mb-20">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-blue"></div>
          </div>
        )}
      </div>
    </Layout>
  );
}
export default Users;
