import Footer from "./components/Footer";
import Header from "./components/Header";

export default function Layout({ children }) {
  return (
    <div className="relative  min-h-screen font-poppins text-dark-blue">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
