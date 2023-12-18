"use client";
import React, { useEffect, useState } from "react";
import OrderView from "./orders/page";

function Home() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }
  return (
    <div className="font-poppins text-dark-blue">
      <OrderView />
    </div>
  );
}
export default Home;
