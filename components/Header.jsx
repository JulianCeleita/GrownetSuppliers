import Image from "next/image";
import Link from "next/link";

function Header() {
  return (
    <div className="flex justify-between items-center bg-primary-blue p-4">
      <div className="mx-5">
        <Link href="#">
          <Image
            src="/logoGrownetBlanco.svg"
            width={150}
            height={150}
            alt="Logo Grownet"
          />
        </Link>
      </div>
      <div className="flex gap-8 mx-10">
        <Link href="/" className="text-white rounded m-2 py-2">
          Orders
        </Link>
        <Link href="/products" className="text-white rounded m-2 py-2">
          Products
        </Link>
        <Link href="#" className="text-white rounded m-2 py-2">
          Presentations
        </Link>
        <Link href="/categories" className="text-white rounded m-2 py-2">
          Categories
        </Link>
        <Link href="/suppliers" className="text-white rounded m-2 py-2">
          Suppliers
        </Link>
      </div>
    </div>
  );
}
export default Header;
