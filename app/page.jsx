"use client";
import React, { useEffect, useState } from "react";
import RootLayout from './layout';
import Image from "next/image";

import { useRouter } from "next/router";
import LoginPage from "./login/page";

function Home() {
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <RootLayout hideHeaderFooter>
      <LoginPage />
    </RootLayout>
  );
}
export default Home;
