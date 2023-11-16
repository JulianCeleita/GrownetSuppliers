import OrderView from "@/pages/OrdersView";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

function Home() {
  return (
    <div className="font-poppins text-dark-blue">
      <Header />
      <OrderView />
      <Footer />
    </div>
  );
}
export default Home;
