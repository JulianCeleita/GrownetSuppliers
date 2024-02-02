"use client";
import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import OrderView from "./orders/page";
import useTokenStore from "./store/useTokenStore";

function Home() {
  const [hasMounted, setHasMounted] = useState(false);
  const { token } = useTokenStore();

  useEffect(() => {
    setHasMounted(true);
  }, [token]);

  if (!hasMounted) {
    return null;
  }

  return (
    <>
      {token ? (
        <OrderView />
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center bg-blue-500">
          <LoginForm />
        </div>
      )}
    </>
  );
}

export default Home;
