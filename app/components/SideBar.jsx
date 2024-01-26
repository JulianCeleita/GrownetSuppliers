import { ArrowLeftOnRectangleIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import useUserStore from "../store/useUserStore";

const SideBar = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [activeLink, setActiveLink] = useState("");
    const { user, setUser } = useUserStore();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/");
    };

    const addBodyClass = (className) => {
        const body = document.body;
        body.classList.add(className);
        body.classList.add("transition")
        body.classList.add("duration-300")
        body.classList.add("ease-in-out")
    }

    const removeBodyClass = (className) => {
        const body = document.body;
        body.classList.remove(className);
    }

    useLayoutEffect(() => {
        if (open) {
            addBodyClass('ml-80')
        } else {
            removeBodyClass('ml-80')
        }
    }, [open])

    return (
        <div className="py-3 absolute top-0 left-0 z-50">
            <button className={`${open && "hidden"} ml-4`} onClick={() => setOpen(true)}>
                <Bars3Icon className="h-10 w-10 mr-6 text-white font-bold" />
            </button>

            <div className={`${!open && "hidden"} min-h-screen w-full fixed top-0 left-0 right-0`}>
                <div className={`${open ? "w-80" : "w-0"} bg-primary-blue border-white min-h-screen w-80 fixed top-0 left-0`}>
                    <div className={`${!open && "hidden"} pt-3`}>
                        <button className="ml-4 text-white" onClick={() => setOpen(false)}>
                            <XMarkIcon className="h-8 w-8" />
                        </button>
                        <div className="pl-4">
                            <Link
                                href="/users"
                                className="relative group text-white rounded m-2 py-2 hover:text-light-green hover:scale-110"
                            >
                                <h3
                                    className={activeLink === "users" ? "active" : ""}
                                    onClick={() => setActiveLink("users")}
                                >
                                    Users
                                </h3>

                                {activeLink === "users" && (
                                    <span className="absolute bottom-0 left-0 h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
                                )}

                                {activeLink !== "users" && (
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                                )}
                            </Link>
                            <Link
                                href="/orders"
                                className="relative group text-white rounded m-2 py-2 hover:text-light-green hover:scale-110"
                            >
                                <h3
                                    className={activeLink === "orders" ? "active" : ""}
                                    onClick={() => setActiveLink("orders")}
                                >
                                    Orders
                                </h3>

                                {activeLink === "orders" && (
                                    <span className="absolute bottom-0 left-0 h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
                                )}

                                {activeLink !== "orders" && (
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                                )}
                            </Link>
                            <Link
                                href="/presentations"
                                className="relative group text-white rounded m-2 py-2 hover:text-light-green hover:scale-110"
                            >
                                <div
                                    className={activeLink === "presentations" ? "active" : ""}
                                    onClick={() => setActiveLink("presentations")}
                                >
                                    Presentations
                                </div>
                                {activeLink === "presentations" ? (
                                    <span className="absolute bottom-0 left-0  h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
                                ) : (
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                                )}
                            </Link>
                            <Link
                                href="/calendar"
                                className="relative group text-white rounded m-2 py-2 hover:text-light-green hover:scale-110"
                            >
                                <div
                                    className={activeLink === "calendar" ? "active" : ""}
                                    onClick={() => setActiveLink("calendar")}
                                >
                                    Calendar
                                </div>
                                {activeLink === "calendar" ? (
                                    <span className="absolute bottom-0 left-0  h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
                                ) : (
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                                )}
                            </Link>

                            {user && user.rol_name === "AdminGrownet" && (
                                <Link
                                    href="/products"
                                    className="relative group text-white rounded m-2 py-2 hover:text-light-green hover:scale-110"
                                >
                                    <h3
                                        className={activeLink === "products" ? "active" : ""}
                                        onClick={() => setActiveLink("products")}
                                    >
                                        Products
                                    </h3>

                                    {activeLink === "products" && (
                                        <span className="absolute bottom-0 left-0 h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
                                    )}

                                    {activeLink !== "products" && (
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                                    )}
                                </Link>
                            )}


                            {user && user.rol_name === "AdminGrownet" && (
                                <Link
                                    href="/categories"
                                    className="relative group text-white rounded m-2 py-2 hover:text-light-green hover:scale-110"
                                >
                                    <h3
                                        className={activeLink === "categories" ? "active" : ""}
                                        onClick={() => setActiveLink("categories")}
                                    >
                                        Categories
                                    </h3>

                                    {activeLink === "categories" && (
                                        <span className="absolute bottom-0 left-0 h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
                                    )}

                                    {activeLink !== "categories" && (
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                                    )}
                                </Link>
                            )}


                            {user && user.rol_name === "AdminGrownet" && (
                                <Link
                                    href="/suppliers"
                                    className="relative group text-white rounded m-2 py-2 hover:text-light-green hover:scale-110"
                                >
                                    <h3
                                        className={activeLink === "suppliers" ? "active" : ""}
                                        onClick={() => setActiveLink("suppliers")}
                                    >
                                        Suppliers
                                    </h3>

                                    {activeLink === "suppliers" && (
                                        <span className="absolute bottom-0 left-0 h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
                                    )}

                                    {activeLink !== "suppliers" && (
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                                    )}
                                </Link>
                            )}

                            {user && user.rol_name === "Administrador" && (
                                <Link
                                    href="/customers"
                                    className="relative group text-white rounded m-2 py-2 hover:text-light-green hover:scale-110"
                                >
                                    <h3
                                        className={activeLink === "customers" ? "active" : ""}
                                        onClick={() => setActiveLink("customers")}
                                    >
                                        Customers
                                    </h3>

                                    {activeLink === "customers" && (
                                        <span className="absolute bottom-0 left-0 h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
                                    )}

                                    {activeLink !== "customers" && (
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                                    )}
                                </Link>
                            )}
                            {user && user.rol_name === "Administrador" && (
                                <Link
                                    href="/prices"
                                    className="relative group text-white rounded m-2 py-2 hover:text-light-green hover:scale-110"
                                >
                                    <h3
                                        className={activeLink === "prices" ? "active" : ""}
                                        onClick={() => setActiveLink("prices")}
                                    >
                                        Prices
                                    </h3>

                                    {activeLink === "prices" && (
                                        <span className="absolute bottom-0 left-0 h-0.5 bg-light-green w-full transition-all duration-300 ease-in-out"></span>
                                    )}

                                    {activeLink !== "prices" && (
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                                    )}
                                </Link>
                            )}
                            <button
                                className="text-white flex bg-dark-blue rounded-lg m-2 p-2 transition-all hover:bg-black hover:scale-110"
                                onClick={handleLogout}
                            >
                                <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                                Log out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideBar;