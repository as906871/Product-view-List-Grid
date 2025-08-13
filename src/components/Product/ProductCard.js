import React from "react";
import { Edit, Package, Tag } from "lucide-react";
import { Utils } from "../../utils/customFunction";

const ProductCard = ({ product, onEdit }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {product.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Edit product"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-green-600">
              {Utils.formatCurrency(product.price)}
            </span>
            <div className="flex items-center gap-1">
              <Package className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {product.stock} in stock
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {product.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
          {product.tags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{product.tags.length - 3} more
            </span>
          )}
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-100">
          <span>Added {Utils.formatDate(product.createdAt)}</span>
          <div className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${
                product.isActive ? "bg-green-400" : "bg-red-400"
              }`}
            ></div>
            <span>{product.isActive ? "Active" : "Inactive"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
