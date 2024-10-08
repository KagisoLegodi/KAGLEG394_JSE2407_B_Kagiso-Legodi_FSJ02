"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * ProductCard component displays individual product details with image gallery.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.product - Product data to display.
 * @returns {JSX.Element} - Rendered ProductCard component.
 */
export default function ProductCard({ product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  /**
   * Switch to the next image in the gallery.
   */
  const nextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % product.images.length
    );
  };

  /**
   * Switch to the previous image in the gallery.
   */
  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + product.images.length) % product.images.length
    );
  };

  // Map Firestore structure to expected product structure
  const productData = {
    id: product.id.integerValue, // Firestore ID
    title: product.title.stringValue,
    description: product.description.stringValue,
    price: product.price.doubleValue,
    category: product.category.stringValue,
    stock: product.stock.integerValue,
    rating: product.rating.doubleValue,
    images: product.images.arrayValue.values.map((img) => img.stringValue), // Convert arrayValue to a simple array
    thumbnail: product.thumbnail.stringValue,
    reviews: product.reviews.arrayValue.values.map((review) => ({
      reviewerName: review.mapValue.fields.reviewerName.stringValue,
      rating: review.mapValue.fields.rating.integerValue,
      comment: review.mapValue.fields.comment.stringValue,
      date: review.mapValue.fields.date.stringValue,
    })),
  };

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700">
      {/* Product Image Gallery */}
      <div className="relative">
        <Image
          src={productData.images[currentImageIndex]}
          alt={`Image of ${productData.title}`}
          width={320}
          height={320}
          className="rounded-t-lg object-contain w-full h-64"
          onError={(e) => {
            e.currentTarget.src = "/path/to/placeholder-image.jpg"; // Fallback image
          }}
        />
        {productData.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r"
            >
              &lt;
            </button>
            <button
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l"
            >
              &gt;
            </button>
          </>
        )}
      </div>
      <div className="px-5 pb-5">
        <Link href={`/api/products/${product.id}`}>
          <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white truncate">
            {product.title}
          </h5>
        </Link>

        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
          {productData.description}
        </p>

        <div className="flex items-center mt-2 mb-3">
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <svg
                key={index}
                className={`w-5 h-5 ${
                  productData.rating >= index + 1
                    ? "text-yellow-400"
                    : "text-gray-200 dark:text-gray-600"
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
            ))}
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
            {productData.rating}
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Category: {productData.category}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Stock: {productData.stock} available
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ${productData.price.toFixed(2)}
          </span>
          <Link
            href={`/cart/add/${productData.id}`}
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add to cart
          </Link>
        </div>
      </div>
    </div>
  );
}
