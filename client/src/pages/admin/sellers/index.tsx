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
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Seller interface
interface Seller {
  id: number;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  productsCount: number;
  joinDate: string;
  status: 'pending' | 'approved' | 'rejected';
  rating: number;
}

// Admin sellers page component
export default function AdminSellersPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Mock sellers data
  const sellers: Seller[] = [
    {
      id: 1,
      name: "محمد أحمد",
      companyName: "إلكترونيات المستقبل",
      email: "mohamed@electronics-future.com",
      phone: "+201012345678",
      productsCount: 45,
      joinDate: "2023-05-15",
      status: "approved",
      rating: 4.8,
    },
    {
      id: 2,
      name: "أحمد محمود",
      companyName: "تكنو ستار",
      email: "ahmed@technostar.com",
      phone: "+201123456789",
      productsCount: 28,
      joinDate: "2023-06-20",
      status: "approved",
      rating: 4.5,
    },
    {
      id: 3,
      name: "عمر خالد",
      companyName: "سمارت هوم",
      email: "omar@smarthome.com",
      phone: "+201234567890",
      productsCount: 0,
      joinDate: "2023-10-05",
      status: "pending",
      rating: 0,
    },
    {
      id: 4,
      name: "ياسمين علي",
      companyName: "فاشون لايف",
      email: "yasmine@fashionlife.com",
      phone: "+201198765432",
      productsCount: 72,
      joinDate: "2023-03-10",
      status: "approved",
      rating: 4.9,
    },
    {
      id: 5,
      name: "كريم سامي",
      companyName: "الرياضية للملابس",
      email: "karim@sportswear.com",
      phone: "+201287654321",
      productsCount: 34,
      joinDate: "2023-07-18",
      status: "approved",
      rating: 4.2,
    },
    {
      id: 6,
      name: "نورا حسين",
      companyName: "بيوتي كوين",
      email: "noura@beautyqueen.com",
      phone: "+201345678901",
      productsCount: 56,
      joinDate: "2023-04-25",
      status: "approved",
      rating: 4.7,
    },
    {
      id: 7,
      name: "سامي محمد",
      companyName: "جادجيت ورلد",
      email: "sami@gadgetworld.com",
      phone: "+201456789012",
      productsCount: 0,
      joinDate: "2023-11-01",
      status: "pending",
      rating: 0,
    },
    {
      id: 8,
      name: "حسام علي",
      companyName: "سوبر ماركت أونلاين",
      email: "hussam@onlinesupermarket.com",
      phone: "+201567890123",
      productsCount: 120,
      joinDate: "2023-02-15",
      status: "approved",
      rating: 4.6,
    },
    {
      id: 9,
      name: "ليلى أحمد",
      companyName: "كيدز بلاي",
      email: "laila@kidsplay.com",
      phone: "+201678901234",
      productsCount: 0,
      joinDate: "2023-09-10",
      status: "rejected",
      rating: 0,
    },
    {
      id: 10,
      name: "طارق محمود",
      companyName: "هوم فيرنتشر",
      email: "tarek@homefurniture.com",
      phone: "+201789012345",
      productsCount: 48,
      joinDate: "2023-08-05",
      status: "approved",
      rating: 4.4,
    },
  ];
  
  // Filter sellers based on search and status
  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch = 
      seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || seller.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Pagination
  const sellersPerPage = 5;
  const totalPages = Math.ceil(filteredSellers.length / sellersPerPage);
  const paginatedSellers = filteredSellers.slice(
    (currentPage - 1) * sellersPerPage,
    currentPage * sellersPerPage
  );
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG');
  };
  
  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-500';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'rejected':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };
  
  // Status badge text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return t('approved');
      case 'pending':
        return t('pending');
      case 'rejected':
        return t('rejected');
      default:
        return status;
    }
  };
  
  // Rating stars
  const renderRating = (rating: number) => {
    if (rating === 0) return <span className="text-gray-400">-</span>;
    
    return (
      <div className="flex items-center">
        <span className="text-yellow-400">{rating.toFixed(1)}</span>
        <span className="text-yellow-400 ml-1">★</span>
      </div>
    );
  };
  
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t('sellers')}</h1>
            <p className="text-gray-400 mt-1">{t('manageYourSellers')}</p>
          </div>
          <div>
            <Link href="/admin/sellers/add">
              <a className="bg-primary hover:bg-primary/90 text-black px-4 py-2 rounded-md font-medium flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {t('addSeller')}
              </a>
            </Link>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder={t('searchSellers')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-gray-700 bg-gray-800 pl-10 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">{t('allStatuses')}</option>
                <option value="pending">{t('pending')}</option>
                <option value="approved">{t('approved')}</option>
                <option value="rejected">{t('rejected')}</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Sellers Table */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800/50">
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t('seller')}
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t('contact')}
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                      {t('products')}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                      {t('joinDate')}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t('status')}
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t('rating')}
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {paginatedSellers.length > 0 ? (
                  paginatedSellers.map((seller) => (
                    <tr key={seller.id} className="hover:bg-gray-800/50">
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-200">
                            {seller.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {seller.companyName}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm text-gray-300 flex items-center gap-1">
                            <Mail className="h-3 w-3 text-gray-400" />
                            {seller.email}
                          </div>
                          <div className="text-sm text-gray-300 flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3 text-gray-400" />
                            {seller.phone}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">
                        {seller.productsCount}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(seller.joinDate)}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(seller.status)}`}>
                          {getStatusText(seller.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm">
                        {renderRating(seller.rating)}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Link href={`/admin/sellers/${seller.id}`}>
                            <a className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-1.5 rounded-md" title={t('view')}>
                              <Eye className="h-4 w-4" />
                            </a>
                          </Link>
                          
                          {seller.status === 'pending' && (
                            <>
                              <button 
                                className="bg-green-500/20 hover:bg-green-500/30 text-green-400 p-1.5 rounded-md"
                                title={t('approve')}
                              >
                                <ThumbsUp className="h-4 w-4" />
                              </button>
                              <button 
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-1.5 rounded-md"
                                title={t('reject')}
                              >
                                <ThumbsDown className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          
                          {seller.status === 'approved' && (
                            <Link href={`/admin/sellers/edit/${seller.id}`}>
                              <a className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 p-1.5 rounded-md" title={t('edit')}>
                                <Edit className="h-4 w-4" />
                              </a>
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-400">
                      {t('noSellersFound')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredSellers.length > 0 && (
            <div className="p-4 border-t border-gray-800 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                {t('showing')} {(currentPage - 1) * sellersPerPage + 1} {t('to')}{' '}
                {Math.min(currentPage * sellersPerPage, filteredSellers.length)} {t('of')}{' '}
                {filteredSellers.length} {t('sellers')}
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