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
        <Link href="#" className="text-white text-lg rounded m-2 py-2">
          Productos
        </Link>
        <Link href="#" className="text-white text-lg rounded m-2 py-2">
          Categorías
        </Link>
        <Link href="#" className="text-white text-lg rounded m-2 py-2">
          Presentaciones
        </Link>
        <Link href="#" className="text-white text-lg rounded m-2 py-2">
          Proveedor
        </Link>
        <Link href="#" className="text-white text-lg rounded m-2 py-2">
          Orders
        </Link>
      </div>
    </div>
  );
}
export default Header;
