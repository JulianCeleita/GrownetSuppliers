"use client";

import Image from "next/image";
import { useState } from "react";
import logo_blancov2 from "../img/logo_blancov2.svg";

function LoginForm({
  username,
  setUsername,
  password,
  setPassword,
  enviarData,
  loading,
}) {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  return (
    <body className="overflow-hidden">
      <div className="min-h-screen flex flex-col items-center justify-center font-poppins bg-blue-500">
        <div className="p-8 flex flex-col items-center">
          <Image src={logo_blancov2} alt="logo" width={250} height={250} />
          <form className="mt-5" onSubmit={enviarData}>
            <div className="mb-3 flex flex-col items-center">
              <label className="text-white mb-2">Email:</label>
              <input
                className="border border-inherit rounded-xl p-3 w-[100%] font-poppins"
                type="text"
                placeholder="email@user.com"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-3 flex flex-col items-center">
              <label className="text-white mb-2">Password:</label>
              <input
                className="border border-inherit rounded-xl p-3 w-[100%]"
                type="password"
                placeholder="**************"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-5 flex justify-center items-center">
              <button
                type="submit"
                className={`bg-dark-blue hover:scale-110 text-white transition-all font-bold py-3 px-2 rounded-3xl w-80`}
                disabled={loading}
              >
                {loading ? "Iniciando sesión..." : "Log in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </body>
  );
}

export default LoginForm;
