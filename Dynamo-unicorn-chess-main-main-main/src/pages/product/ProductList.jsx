import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getApi } from "../../utils/api";
import { useQuery } from "react-query";
import Pagination from "../../components/Pagination";

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const allProductUrl = `${import.meta.env.VITE_URL}${import.meta.env.VITE_GET_ALL_PRODUCt}?page=${currentPage}`;
  const products = useQuery(["allProductUrl", currentPage], () => getApi(allProductUrl));

  const productList = products?.data?.data?.products;
  const totalPages = products?.data?.totalPages || 1;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productList?.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="font-semibold text-lg">{product.name}</h2>
              <p className="text-sm text-gray-600">{product.description}</p>
              <div className="flex items-center mt-2">
                <span className="font-bold text-xl">₹{product.sellPrice}</span>
                <span className="line-through text-gray-500 ml-2">
                  ₹{product.price}
                </span>
              </div>
              <p className="text-green-600 text-sm mt-1">
                {((product.price - product.sellPrice) / product.price * 100).toFixed(0)}% Off
              </p>

              <div className="mt-4">
                <Link to={`/Checkout/${product._id}`}>
                  <button
                    className="bg-green-500 w-full text-white text-xs px-3 py-3 rounded hover:bg-green-600 transition-colors duration-300"
                    aria-label={`Buy ${product.name}`}
                  >
                    Buy Now
                  </button>
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductList;
