"use client";

import Image from "next/image";
import { useState } from "react";
import logo_blancov2 from "../img/logo_blancov2.svg";
import { loginUrl } from "../config/urls.config";
import Swal from "sweetalert2";
import axios from "axios";
import useTokenStore from "../store/useTokenStore";
import useUserStore from "../store/useUserStore";
import { encryptData, decryptData, generateKey, arrayBufferToBase64 } from "../utils/cryptoUtils";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setToken } = useTokenStore();
  const { setUser } = useUserStore();

  

  // Función para enviar datos de inicio de sesión
  async function enviarData(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const postData = {
      email: username,
      password: password,
    };

    try {
      const response = await axios.post(loginUrl, postData);

      if (response.data.status === 200) {
        console.log("🚀 ~ enviarData ~ response:", response)
        const key = await generateKey();
        const { encrypted: encryptedToken, iv: ivToken } = await encryptData(response.data.token, key);
        const { encrypted: encryptedUser, iv: ivUser } = await encryptData(JSON.stringify(response.data.user), key);
        const base64Token = arrayBufferToBase64(encryptedToken);
        const base64User = arrayBufferToBase64(encryptedUser);
        localStorage.setItem('encryptedToken', base64Token);
        localStorage.setItem('encryptedUser', base64User);

        localStorage.setItem('ivToken', ivToken);
        localStorage.setItem('ivUser', ivUser);

        setToken(response.data.token);
        setUser(response.data.user);
        setLoading(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `${response.data.message}`,
        });
      }
    } catch (error) {
      console.error('Error al iniciar sesión: ', error);
    } finally {
      setUsername('');
      setPassword('');
      setLoading(false);
    }
  }
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
                {loading ? "Logging in..." : "Log in"}
              </button>
            </div>
          </form>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
    </body>
  );
}

export default LoginForm;
