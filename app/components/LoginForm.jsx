import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import logo_blancov2 from '../img/logo_blancov2.svg'

function LoginForm() {
    // const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Lógica de inicio de sesión aquí
        console.log('Usuario:', username, 'Contraseña:', password);
        // router.push("/hola");
    };

    return (
        <body>
            <div className="min-h-screen flex flex-col items-center justify-center bg-blue-500">
                <div className="p-8 flex flex-col items-center">
                    <Image
                        src={logo_blancov2}
                        alt="logo"
                        width={250}
                        height={250}
                    />
                    {/* <form className="mt-5"> */}
                        <div className="mb-3 flex flex-col items-center">
                            <label className="text-white">
                                Email:
                            </label>
                            <input
                                className="border border-inherit rounded-3xl p-3 w-[100%]"
                                type="text"
                                placeholder="email@user.com"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="mb-3 flex flex-col items-center">
                            <label className="text-white">
                                Password:
                            </label>
                            <input
                                className="border border-inherit rounded-3xl p-3 w-[100%]"
                                type="password"
                                placeholder="**************"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mt-5 flex justify-center items-center">
                            <button className="bg-green hover:bg-light-green text-black transition-all font-bold py-2 px-4 rounded w-80" onClick={handleLogin}>
                                Log in
                            </button>
                        </div>
                    {/* </form> */}
                </div>
            </div>
        </body>
    );
}


export default LoginForm;
