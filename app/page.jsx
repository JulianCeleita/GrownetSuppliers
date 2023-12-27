"use client";
import React, { useEffect, useState } from "react";
import RootLayout from './layout';

function Home() {
  const [hasMounted, setHasMounted] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }
  // return (
  //   <div className="font-poppins text-dark-blue">
  //     <OrderView />
  //   </div>
  // );


  const handleLogin = () => {
    // Lógica de inicio de sesión aquí
    console.log('Usuario:', username, 'Contraseña:', password);
  };

  return (
    <RootLayout hideHeaderFooter>
      <body>

        <div className="min-h-screen flex items-center justify-center bg-blue-500">
          <div className="bg-white p-8 rounded shadow-md">
            <h1 className="text-2xl mb-4">Log In</h1>
            <form>
              <div className="mb-3 flex justify-between">
                <label>
                  Email:
                </label>
                <input
                  className="border border-inherit rounded-sm px-2"
                  type="text"
                  placeholder="email@user.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-3 flex justify-between gap-2">
                <label>
                  Password:
                </label>
                <input
                  className="border border-inherit rounded-sm px-2"
                  type="password"
                  placeholder="**************"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mt-5 flex justify-center items-center">
                <button
                  className="bg-green hover:bg-light-green text-black transition-all font-bold py-2 px-4 rounded w-80"
                  type="button"
                  onClick={handleLogin}
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
        </div>
      </body>
    </RootLayout>
  );
}
export default Home;
