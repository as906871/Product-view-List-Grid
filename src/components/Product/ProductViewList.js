import React from "react";
import { Edit2, Package } from "lucide-react";
import { Utils } from "../../utils/customFunction";

const ProductViewList = ({ products, onEdit }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">
                Product
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">
                Category
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">
                Price
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">
                Stock
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">
                Status
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-6">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-600 truncate max-w-xs">
                      {product.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.category}
                  </span>
                </td>
                <td className="py-4 px-6 font-semibold text-green-600">
                  {Utils.formatCurrency(product.price)}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span>{product.stock}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        product.isActive ? "bg-green-400" : "bg-red-400"
                      }`}
                    ></div>
                    <span className="text-sm">
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => onEdit(product)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductViewList;
