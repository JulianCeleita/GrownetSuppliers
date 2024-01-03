"use client";
import EditPresentation from "@/app/components/EditPresentation";
import NewPresentation from "@/app/components/NewPresentation";
import {
  deletePresentationUrl,
  presentationsUrl,
  productsUrl,
  uomUrl,
  usersUrl,
} from "@/app/config/urls.config";
import useTokenStore from "@/app/store/useTokenStore";
import {
  CheckIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import EditAccessUser from "../components/EditAccesUser";
import ModalDelete from "../components/ModalDelete";
import Layout from "../layoutS";
import "react-calendar/dist/Calendar.css";

export const fetchUsers = async (
  token,
  setUsers,
  setIsLoading
) => {
  try {
    const response = await axios.get(usersUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newUser = Array.isArray(response.data.users)
      ? response.data.users
      : [];
    setUsers(newUser);
    setIsLoading(false);
    console.log("response.data.users", response.data.users);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    console.error(response.data.users);
  }
};

// export const fetchUsers = async (
//   token,
//   setIsLoading
// ) => {
//   try {
//     const response = await axios.get(usersUrl, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

function Users() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { token } = useTokenStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showEditAccessUsers, setShowEditAccessUsers] = useState(false);

  //Api
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers(token, setUsers, setIsLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const sortedUsers = users.slice().sort((a, b) => {
    const userNameA =
      users.find((user) => user.id === a.users_id)?.name || "";
    const userNameB =
      users.find((user) => user.id === b.users_id)?.name || "";
    return userNameA.localeCompare(userNameB);
  });
  // const sortedUsers = ["Jaime"];

  return (
    <Layout>
      <div>
        <div className="flex justify-between p-8 pb-20 bg-primary-blue">
          <h1 className="text-2xl text-white font-semibold">Users list</h1>
        </div>
        <div className="flex gap-16 items-center justify-center mb-0 -mt-14">
          {/* TODO: Implementar calendario 
          <div className="flex-col items-center">
            <Calendar
              className="border rounded p-4 shadow-md text-black mt-40"
              locale="en-GB"
            />
            <button className="bg-green p-5 text-white hover:scale-105 transition-all font-semibold rounded-lg mt-4">
              Close Day
            </button>
          </div> */}
          <table className="w-[90%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-10">
            <thead className="sticky top-0 bg-white shadow-[0px_11px_15px_-3px_#edf2f7]">
              <tr className="border-b-2 border-stone-100 text-dark-blue">
                <th className="py-4">User</th>
                <th className="py-4">Email</th>
                <th className="py-4">Rol</th>
                <th className="py-4">Users</th>
                <th className="py-4">Orders</th>
                {/* <th className="py-4">Products</th> */}
                <th className="py-4">Presentations</th>
                {/* <th className="py-4">Categories</th> */}
                {/* <th className="py-4">Suppliers</th> */}
                <th className="py-4">Access</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="text-dark-blue border-b-2 border-stone-100 "
                >
                  <td className="py-8">{user.name}</td>
                  <td className="py-8">{user.email}</td>
                  <td className="py-8">{user.rol_name}</td>
                  <td className="py-8">
                    {" "}
                    <CheckIcon className="h-6 w-[100%]" />{" "}
                  </td>
                  <td className="py-8">
                    {user.rol_name === "Administrador" ? (
                      <CheckIcon className="h-6 w-[100%]" />
                    ) : (
                      <XMarkIcon className="h-6 w-[100%]" />
                    )}
                  </td>
                  <td className="py-8">
                    {user.rol_name === "Administrador" ? (
                      <CheckIcon className="h-6 w-[100%]" />
                    ) : (
                      <XMarkIcon className="h-6 w-[100%]" />
                    )}
                  </td>
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
