"use client";
import { usersUrl } from "@/app/config/urls.config";
import useTokenStore from "@/app/store/useTokenStore";
import {
  CheckIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import EditAccessUser from "../components/EditAccesUser";
import Layout from "../layoutS";

export const fetchUsers = async (token, setUsers, setIsLoading) => {
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
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    console.error(response.data.users);
  }
};

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
    const userNameA = users.find((user) => user.id === a.users_id)?.name || "";
    const userNameB = users.find((user) => user.id === b.users_id)?.name || "";
    return userNameA.localeCompare(userNameB);
  });
  // const sortedUsers = ["Jaime"];

  return (
    <Layout>
      <div>
        <h1 className="text-2xl text-white font-semibold -mt-[57px] ml-28">
          Users <span className="text-light-green">list</span>
        </h1>
        {/* <div className="flex justify-between p-8 bg-primary-blue">
          <h1 className="text-2xl text-white font-semibold">Users list</h1>
        </div> */}
        <div className="flex gap-16 items-center justify-center mb-0  mt-12">
          <table className="w-[90%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-10">
            <thead className="sticky top-0 bg-white shadow-[0px_11px_15px_-3px_#edf2f7]">
              <tr className="border-b-2 border-stone-100 text-dark-blue">
                <th className="py-4">User</th>
                <th className="py-4">Email</th>
                <th className="py-4">Rol</th>
                <th className="py-4">Users</th>
                <th className="py-4">Orders</th>
                <th className="py-4">Presentations</th>
                <th className="py-4">Access</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map(
                (user) =>
                  user.email.toLowerCase() !== "admin@grownetapp.com" && (
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
                        {user.rol_name === "Administrador" ||
                        user.rol_name === "AdminGrownet" ? (
                          <CheckIcon className="h-6 w-[100%]" />
                        ) : (
                          <XMarkIcon className="h-6 w-[100%]" />
                        )}
                      </td>
                      <td className="py-8">
                        {user.rol_name === "Administrador" ||
                        user.rol_name === "AdminGrownet" ? (
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
                  )
              )}
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
            <div className="loader"></div>
          </div>
        )}
      </div>
    </Layout>
  );
}
export default Users;
