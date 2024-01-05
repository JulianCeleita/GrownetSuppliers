"use client"
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { orderDetail } from '@/app/config/urls.config';
import useTokenStore from '@/app/store/useTokenStore';
import axios from 'axios';
import { useState } from 'react';
import RootLayout from '@/app/layout';
import Layout from '@/app/layoutS';
import Link from 'next/link';

export const fetchOrderDetail = async (
  token,
  setOrderDetail,
  setIsLoading,
  orderId
) => {
  try {
    const response = await axios.get(`${orderDetail}${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response);

    const newOrderDetail = Array.isArray(response.data.order) ? response.data.order : [];
    setOrderDetail(response.data.order);
    setIsLoading(false);
    console.log("response.data.order", response.data.order);
    console.log("product", orderDetail.products);
  } catch (error) {
    console.error("Error al obtener el detalle:", error);
  }
};


const OrderDetailPage = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const { token, setToken } = useTokenStore();
  const router = useRouter();
  const orderId = useParams();
  const [orderDetail, setOrderDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log(orderDetail)

  var products = orderDetail.products
  console.log(products)
  // holaArray = Object.values(hola);
  // var hola2 = orderDetail.products.map((product) => (
  //   console.log(product.id)
  // ))

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/");
    } else {
      if (storedToken != null) {
        setToken(storedToken);
        console.log("stored token", storedToken);
        if (token !== null && orderId !== null) {
          // console.log("token", token)
          // console.log("Este es el token", token)
          // console.log("Este es el id", orderId.orderId)
          fetchOrderDetail(token, setOrderDetail, setIsLoading, orderId.orderId);
        }
      }
    }
  }, [token, setOrderDetail, setIsLoading, setToken, orderId]);

  if (!hasMounted) {
    return null;
  }

  // const sortedProductOrders = [];

  // for (let i = 0; i < orderDetail.products.length; i++) {
  //   const sortedProduct = orderDetail.products[i].slice().sort((a, b) => {
  //     const orderNameA = orderDetail.find((o) => o.id === a.orders_id)?.accountName || '';
  //     const orderNameB = orderDetail.find((o) => o.id === b.orders_id)?.accountName || '';
  //     return orderNameA.localeCompare(orderNameB);
  //   });

  //   sortedProductOrders.push(sortedProduct);
  // }



  return (
    <>
      {token ? (
        <Layout>
          <div>
            <div className="flex justify-between p-8 pb-20 bg-primary-blue">
              <h1 className="text-2xl text-white font-semibold">
                Orders Detail: {orderDetail.accountName}
              </h1>
            </div>
            <div className="flex items-center justify-center mb-20 -mt-14">
              <table className="w-[90%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <thead className="sticky top-0 bg-white shadow-[0px_11px_15px_-3px_#edf2f7] ">
                  <tr className="border-b-2 border-stone-100 text-dark-blue">
                    <th className="py-4 rounded-tl-lg">ID Product</th>
                    <th className="py-4">Product name</th>
                    <th className="py-4">Unit of measure</th>
                    <th className="py-4">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.uom}</td>
                      <td>{product.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {isLoading && (
              <div className="flex justify-center items-center mb-20">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-blue"></div>
              </div>
            )}
          </div>
        </Layout>
      ) : (
        <RootLayout></RootLayout>
      )}
    </>
  );
};

export default OrderDetailPage;