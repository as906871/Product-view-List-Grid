import React, { useEffect, useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { Utils } from "../utils/customFunction";

const ProductModal = ({
  showModal,
  editingProduct,
  onClose,
  onSave,
  categories,
  saving = false,
}) => {
  const [formData, setFormData] = useState(Utils.getEmptyFormData());
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (showModal) {
      if (editingProduct) {
        setFormData({
          name: editingProduct.name,
          price: editingProduct.price.toString(),
          category: editingProduct.category,
          stock: editingProduct.stock.toString(),
          description: editingProduct.description || "",
          tags: editingProduct.tags ? editingProduct.tags.join(", ") : "",
          isActive: editingProduct.isActive,
        });
      } else {
        setFormData(Utils.getEmptyFormData());
      }
      setFormErrors({});
    }
  }, [showModal, editingProduct]);

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Product name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Product name must be at least 2 characters";
    }

    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      errors.price = "Valid price is required";
    }

    if (!formData.category) {
      errors.category = "Category is required";
    }

    const stock = parseInt(formData.stock);
    if (formData.stock === "" || isNaN(stock) || stock < 0) {
      errors.stock = "Valid stock quantity is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const productData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock),
      description: formData.description.trim(),
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      isActive: formData.isActive,
    };

    if (!editingProduct) {
      productData.createdAt = new Date().toISOString();
    }

    await onSave(productData, editingProduct);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: "" });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              onClick={onClose}
              disabled={saving}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6" onKeyPress={handleKeyPress}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={saving}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed ${
                  formErrors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter product name"
                maxLength={100}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                disabled={saving}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed ${
                  formErrors.price ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0"
                min="0"
                step="0.01"
              />
              {formErrors.price && (
                <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                disabled={saving}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed ${
                  formErrors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {formErrors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.category}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
                disabled={saving}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed ${
                  formErrors.stock ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0"
                min="0"
              />
              {formErrors.stock && (
                <p className="text-red-500 text-sm mt-1">{formErrors.stock}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              disabled={saving}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="e.g. wireless, gaming, premium"
              maxLength={200}
            />
            <p className="text-gray-500 text-sm mt-1">
              Separate tags with commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={saving}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="Enter product description..."
              maxLength={500}
            />
            <p className="text-gray-500 text-sm mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleInputChange("isActive", e.target.checked)}
              disabled={saving}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
            />
            <label
              htmlFor="isActive"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Product is active
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {editingProduct ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {editingProduct ? "Update Product" : "Add Product"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
