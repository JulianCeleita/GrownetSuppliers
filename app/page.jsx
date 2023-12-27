"use client";
import React, { useEffect, useState } from "react";
import Layout from "./layoutS";
import LoginForm from "./components/LoginForm";
import OrderView from "./orders/page";

function Home() {
  const [hasMounted, setHasMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  const handleLogin = () => {
    // Lógica de inicio de sesión aquí
    console.log("Usuario:", username, "Contraseña:", password);
    setIsLoggedIn(true);
  };

  return (
    <>
      {isLoggedIn ? (
        <Layout>
          <OrderView />
        </Layout>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-blue-500">
          <div className="bg-white p-8 rounded shadow-md">
            <h1 className="text-2xl mb-4">Log In</h1>
            <LoginForm
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              handleLogin={handleLogin}
            />
          </div>
        </div>
      )}
    </>
  );
}
export default Home;
