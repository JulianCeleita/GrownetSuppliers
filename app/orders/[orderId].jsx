"use client"
import { useRouter } from 'next/router';

const OrderDetailPage = () => {
  const router = useRouter();
  const { orderId } = router.query;

  useEffect(() => {
    console.log("entré")
  }, [])
  


  return (
      <div>
        <h1>Order Detail</h1>
        <p>Order ID: {orderId}</p>
      </div>
  );
};

export default OrderDetailPage;