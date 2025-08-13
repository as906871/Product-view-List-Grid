import React, { useState, useEffect, useMemo } from "react";
import { Search, Plus, Grid3X3, List, Loader2 } from "lucide-react";
import { apiService } from "../../Services/Api";
import ProductModal from "../../constant/ProductModal";
import Pagination from "../../constant/Pagination";
import ProductViewList from "./ProductViewList";
import ProductCard from "./ProductCard";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [viewType, setViewType] = useState("card");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productsData, categoriesData] = await Promise.all([
          apiService.getProducts(),
          apiService.getCategories(),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);


  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [products, debouncedSearchTerm]);


  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);


  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);


  const handleProductSave = async (productData, editingProduct) => {
    try {
      setSaving(true);
      setError(null);

      if (editingProduct) {
        const updatedProduct = await apiService.updateProduct(
          editingProduct.id,
          {
            ...productData,
            id: editingProduct.id,
          }
        );

        setProducts(
          products.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
        );
      } else {
        const newProduct = await apiService.addProduct({
          ...productData,
          createdAt: new Date().toISOString(),
        });

        setProducts([newProduct, ...products]);
      }

      handleCloseModal();
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Failed to save product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setSaving(false);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Product Management
          </h1>
          <p className="text-gray-600">
            Manage your products efficiently with our comprehensive system
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-red-800">{error}</p>
              <button
                onClick={handleRetry}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewType("card")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    viewType === "card"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Cards</span>
                </button>
                <button
                  onClick={() => setViewType("list")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    viewType === "list"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>

              <button
                onClick={handleAddNew}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Product</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
            products
            {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
          </p>
        </div>

        {paginatedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              {searchTerm
                ? "No products found matching your search."
                : "No products available."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {viewType === "card" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            ) : (
              <ProductViewList
                products={paginatedProducts}
                onEdit={handleEdit}
              />
            )}
          </>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        <ProductModal
          showModal={showModal}
          editingProduct={editingProduct}
          onClose={handleCloseModal}
          onSave={handleProductSave}
          categories={categories}
          saving={saving}
        />
      </div>
    </div>
  );
};

export default ProductListing;
