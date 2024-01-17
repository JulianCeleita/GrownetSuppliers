import Footer from "./components/Footer";
import Header from "./components/Header";

export default function Layout({ children }) {
  return (
    <body className="relative pb-40 min-h-screen font-poppins text-dark-blue">
      <Header />
      {children}
      <Footer />
    </body>
  );
}
