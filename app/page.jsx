import OrderView from "@/components/OrdersView";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Main from "@/components/Main";

function Home() {
  return (
    <div className="font-poppins text-dark-blue">
      <Header />
      <OrderView />
      {/*<Main />*/}
      <Footer />
    </div>
  );
}
export default Home;
