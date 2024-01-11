/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  exportPathMap: async function (defaultPathMap) {
    return {
      "/": { page: "/" },
      "/pages/order/[orderId]": { page: "/pages/order/[orderId]" },
      // Agrega aquí todas las demás rutas que necesites
    };
  },
};

module.exports = nextConfig;
