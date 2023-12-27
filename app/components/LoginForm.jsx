import React from "react";

export default function LoginForm({
  username,
  setUsername,
  password,
  setPassword,
  handleLogin,
}) {
  return (
    <form>
      <div className="mb-3 flex justify-between">
        <label>Email:</label>
        <input
          className="border border-inherit rounded-sm px-2"
          type="text"
          placeholder="email@user.com"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="mb-3 flex justify-between gap-2">
        <label>Password:</label>
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
  );
}
