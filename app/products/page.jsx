"use client";
import EditProduct from "@/app/components/EditProduct";
import { deleteProductUrl, productsUrl } from "@/app/config/urls.config";
import useProductStore from "@/app/store/useProductStore";
import useTokenStore from "@/app/store/useTokenStore";
import {
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchCategories } from "../categories/page";
import ModalDelete from "../components/ModalDelete";
import NewProduct from "../components/NewProduct";
import Layout from "../layoutS";
import useCategoryStore from "../store/useCategoryStore";

function Products() {
  const { token } = useTokenStore();
  const { setCategories } = useCategoryStore();
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [country, setCountry] = useState(44);

  //Api
  const { products, setProducts } = useProductStore();

  const fetchProducts = async (token) => {
    try {
      const response = await axios.get(productsUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newProducts = Array.isArray(response.data.products)
        ? response.data.products
        : [];

      const sortedProducts = newProducts.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setProducts(sortedProducts);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  // Efecto useEffect
  useEffect(() => {
    fetchProducts(token, setProducts);
    fetchCategories(token, setCategories, setIsLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Api delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteProduct = async (product) => {
    try {
      const { id } = product;
      const response = await axios.post(`${deleteProductUrl}${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
    setShowDeleteModal(false);
    fetchProducts(token, setProducts, setIsLoading);
  };

  return (
    <Layout>
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
        <div className="flex items-center justify-center mb-20 -mt-14">
          <table className="w-[90%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-8">
            <thead className="sticky top-0 bg-white shadow-[0px_11px_15px_-3px_#edf2f7] ">
              <tr className="border-b-2 border-stone-100 text-dark-blue ">
                <th className="py-4 rounded-tl-lg">Product</th>
                <th className="py-4">Image</th>
                <th className="py-4 rounded-tr-lg">Operate</th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter((product) => product.stateProduct_id !== 2)
                .map((product) => (
                  <tr
                    key={product.id}
                    className="text-dark-blue border-b-2 border-stone-100"
                  >
                    {product.stateProduct_id === 2 ? (
                      <td className="py-3 text-danger">
                        {product.name + " - Product disabled"}
                      </td>
                    ) : (
                      <td className="py-3">{product.name}</td>
                    )}
                    <td className="py-3">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="mx-auto"
                      />
                    </td>
                    <td className="py-4 flex justify-center">
                      <button
                        className="flex text-primary-blue mr-6 font-medium hover:scale-110 hover:text-green hover:border-green"
                        onClick={() => {
                          setShowEditProduct(true);
                          setSelectedProduct(product);
                        }}
                      >
                        <PencilSquareIcon className="h-6 w-6 mr-1" />
                        Edit
                      </button>
                      <button
                        className="flex text-primary-blue font-medium hover:scale-110 hover:text-danger hover:border-danger"
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowDeleteModal(true);
                        }}
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
        <ModalDelete
          isvisible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDeleteProduct(selectedProduct)}
        />
        <NewProduct
          isvisible={showNewProduct}
          onClose={() => setShowNewProduct(false)}
          fetchProducts={fetchProducts}
          setIsLoading={setIsLoading}
        />
        <EditProduct
          isvisible={showEditProduct}
          onClose={() => setShowEditProduct(false)}
          fetchProducts={fetchProducts}
          product={selectedProduct}
          setIsLoading={setIsLoading}
        />
        {isLoading && (
          <div className="flex justify-center items-center mb-20">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-blue"></div>
          </div>
        )}
      </div>
    </Layout>
  );
}
export default Products;
