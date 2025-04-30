import React, { useState } from 'react';
import { Link } from 'wouter';
import { useTranslation } from '@/hooks/use-translation';
import { AdminLayout } from '@/components/layout/admin-layout';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Edit, 
  Trash, 
  Eye, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Product interface
interface Product {
  id: number;
  image: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'draft' | 'out_of_stock';
}

// Admin products page component
export default function AdminProductsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Mock products data
  const products: Product[] = [
    {
      id: 1,
      image: "https://via.placeholder.com/50",
      name: "هاتف ذكي - سامسونج جالاكسي S22",
      sku: "SAMS-S22-128B",
      price: 12999,
      stock: 25,
      category: "الإلكترونيات",
      status: "active",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/50",
      name: "لابتوب - آبل ماك بوك برو",
      sku: "APP-MBP-256-M1",
      price: 36999,
      stock: 10,
      category: "الإلكترونيات",
      status: "active",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/50",
      name: "ساعة ذكية - آبل واتش سيريس 7",
      sku: "APP-AWS7-GPS",
      price: 5999,
      stock: 0,
      category: "الإلكترونيات",
      status: "out_of_stock",
    },
    {
      id: 4,
      image: "https://via.placeholder.com/50",
      name: "سماعات لاسلكية - آير بودز برو",
      sku: "APP-AIRP-PRO",
      price: 3999,
      stock: 15,
      category: "الإلكترونيات",
      status: "active",
    },
    {
      id: 5,
      image: "https://via.placeholder.com/50",
      name: "حقيبة ظهر - نايكي",
      sku: "NIKE-BP-01",
      price: 499,
      stock: 30,
      category: "الملابس",
      status: "active",
    },
    {
      id: 6,
      image: "https://via.placeholder.com/50",
      name: "حذاء رياضي - نايكي اير ماكس",
      sku: "NIKE-AM-270-42",
      price: 1899,
      stock: 8,
      category: "الملابس",
      status: "active",
    },
    {
      id: 7,
      image: "https://via.placeholder.com/50",
      name: "تلفزيون ذكي - إل جي 55 بوصة",
      sku: "LG-TV-55-4K",
      price: 8999,
      stock: 5,
      category: "الإلكترونيات",
      status: "active",
    },
    {
      id: 8,
      image: "https://via.placeholder.com/50",
      name: "مكنسة كهربائية - دايسون",
      sku: "DYS-V11-ABSL",
      price: 5499,
      stock: 0,
      category: "الأجهزة المنزلية",
      status: "out_of_stock",
    },
    {
      id: 9,
      image: "https://via.placeholder.com/50",
      name: "غسالة ملابس - سامسونج",
      sku: "SAMS-WM-8KG",
      price: 4299,
      stock: 12,
      category: "الأجهزة المنزلية",
      status: "active",
    },
    {
      id: 10,
      image: "https://via.placeholder.com/50",
      name: "بلوزة قطنية - زارا",
      sku: "ZARA-BL-M-WHT",
      price: 299,
      stock: 0,
      category: "الملابس",
      status: "draft",
    },
  ];
  
  // Filter products based on search, category, and status
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  // Categories for filter
  const categoriesSet = new Set(products.map((product) => product.category));
  const categories = Array.from(categoriesSet);
  
  // Pagination
  const productsPerPage = 5;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ج.م`;
  };
  
  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-500';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'out_of_stock':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };
  
  // Status badge text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return t('active');
      case 'draft':
        return t('draft');
      case 'out_of_stock':
        return t('outOfStock');
      default:
        return status;
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t('products')}</h1>
            <p className="text-gray-400 mt-1">{t('manageYourProducts')}</p>
          </div>
          <div>
            <Link href="/admin/products/add">
              <a className="bg-primary hover:bg-primary/90 text-black px-4 py-2 rounded-md font-medium flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {t('addProduct')}
              </a>
            </Link>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder={t('searchProducts')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-gray-700 bg-gray-800 pl-10 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">{t('allCategories')}</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">{t('allStatuses')}</option>
                <option value="active">{t('active')}</option>
                <option value="draft">{t('draft')}</option>
                <option value="out_of_stock">{t('outOfStock')}</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Products Table */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800/50">
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t('product')}
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                      {t('sku')}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                      {t('price')}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                      {t('stock')}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t('category')}
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t('status')}
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-800/50">
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="text-sm font-medium text-gray-200 truncate max-w-[150px]">
                            {product.name}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">
                        {product.sku}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm">
                        <span className={`font-medium ${product.stock === 0 ? 'text-red-500' : 'text-gray-300'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">
                        {product.category}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                          {getStatusText(product.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Link href={`/admin/products/${product.id}`}>
                            <a className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-1.5 rounded-md" title={t('view')}>
                              <Eye className="h-4 w-4" />
                            </a>
                          </Link>
                          <Link href={`/admin/products/edit/${product.id}`}>
                            <a className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 p-1.5 rounded-md" title={t('edit')}>
                              <Edit className="h-4 w-4" />
                            </a>
                          </Link>
                          <button 
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-1.5 rounded-md"
                            title={t('delete')}
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-400">
                      {t('noProductsFound')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="p-4 border-t border-gray-800 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                {t('showing')} {(currentPage - 1) * productsPerPage + 1} {t('to')}{' '}
                {Math.min(currentPage * productsPerPage, filteredProducts.length)} {t('of')}{' '}
                {filteredProducts.length} {t('products')}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}