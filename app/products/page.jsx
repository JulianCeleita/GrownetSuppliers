"use client";
import EditProduct from "@/app/components/EditProduct";
import { deleteProductUrl, productsUrl } from "@/app/config/urls.config";
import {
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import NewProduct from "../../components/NewProduct";
import useProductStore from "@/store/useProductStore";
import useTokenStore from "@/store/useTokenStore";

function Products() {
  const { token } = useTokenStore();
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  //Api
  const { products, setProducts } = useProductStore();
  const urlImagen = "https://api.grownetapp.com/grownet/";
  useEffect(() => {
    axios
      .get(productsUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const newProducts = Array.isArray(response.data.products)
          ? response.data.products
          : [];
        setProducts(newProducts);
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
      });
  }, [products]);
  //Api delete
  const [deleteResponse, setDeleteResponse] = useState(null);
  const handleDeleteProduct = (product) => {
    const { id } = product;
    axios
      .post(`${deleteProductUrl}${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDeleteResponse(response.data);
        console.log("Se borró con éxito el producto" + product.id);
      })
      .catch((error) => {
        console.error("Error al eliminar el producto:", error);
      });
  };
  return (
    <div>
      <div className="flex justify-between p-8 pb-20 bg-primary-blue">
        <h1 className="text-2xl text-white font-semibold">Products list</h1>
        <button
          className="flex bg-green py-3 px-4 rounded-lg text-white font-medium hover:bg-dark-blue hover:scale-110 "
          type="button"
          onClick={() => setShowNewProduct(true)}
        >
          <PlusCircleIcon className="h-6 w-6 mr-3 font-bold" />
          New product
        </button>
      </div>
      <div className="flex items-center justify-center mb-6 -mt-14">
        <table className="w-[90%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-80">
          <thead>
            <tr className="border-b-2 border-stone-100 text-dark-blue">
              <th className="py-4 pl-4">ID</th>
              <th className="py-4">Product</th>
              <th className="py-4">Image</th>
              <th className="py-4">Operate</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="text-dark-blue border-b-2 border-stone-100"
              >
                <td style={{ textAlign: "center", padding: "1.5rem" }}>
                  {product.id}
                </td>
                {product.stateProduct_id === 2 ? (
                  <td className="py-3 text-danger">
                    {product.name + " - Product disabled"}
                  </td>
                ) : (
                  <td className="py-3">{product.name}</td>
                )}
                <td className="py-3">
                  <img
                    className="w-[40px] mx-auto"
                    src={urlImagen + product.image}
                    alt={product.name}
                  />
                </td>
                <td className="py-4 flex justify-center">
                  <button
                    className="flex text-primary-blue mr-6 font-medium hover:scale-110 hover:text-green hover:border-green"
                    onClick={() => setShowEditProduct(true)}
                  >
                    <PencilSquareIcon className="h-6 w-6 mr-1" />
                    Edit
                  </button>
                  <button
                    className="flex text-primary-blue font-medium hover:scale-110 hover:text-danger hover:border-danger"
                    onClick={() => handleDeleteProduct(product)}
                  >
                    <TrashIcon className="h-6 w-6 mr-1" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <NewProduct
        isvisible={showNewProduct}
        onClose={() => setShowNewProduct(false)}
        setProducts={setProducts}
      ></NewProduct>
      <EditProduct
        isvisible={showEditProduct}
        onClose={() => setShowEditProduct(false)}
      />
    </div>
  );
}
export default Products;
