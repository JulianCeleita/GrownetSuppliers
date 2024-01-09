"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import LoginForm from "./components/LoginForm";
import OrderView from "./orders/page";
import { loginUrl } from "./config/urls.config";
import useTokenStore from "./store/useTokenStore";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import useUserStore from "./store/useUserStore";

function Home() {
  const [hasMounted, setHasMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, setToken } = useTokenStore();
  const { user, setUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setHasMounted(true);
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsLoggedIn(true);
      setToken(storedToken);
    }
  }, [setToken]);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/orders");
    }
  }, [isLoggedIn, router]);
  
  if (!hasMounted) {
    return null;
  }

  // Función para enviar datos de inicio de sesión
  const enviarData = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const postData = {
      email: username,
      password: password,
    };
    axios.post(loginUrl, postData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if(response.data.status === 200) {
        setUsername("");
        setPassword("");
        setIsLoggedIn(true);
        setToken(response.data.token);
        setUser(response.data.user);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `${response.data.message}`,
        });
      }
    })
    .catch((error) => {
      console.error("Error al iniciar sesión: ", error);
    });
  };

  // const handleLogin = () => {
  //   console.log("Usuario:", username, "Contraseña:", password);
  // };

  return (
    <>
      {isLoggedIn ? (
        <OrderView />
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center bg-blue-500">
            <LoginForm
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              enviarData={enviarData}
              loading={loading}
            />
            {error && <p className="text-red-500">{error}</p>}
        </div>
      )}
    </>
  );
}

export default Home;