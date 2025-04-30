import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { AdminLayout } from '@/components/layout/admin-layout';
import { formatDate } from '@/lib/utils';
import { 
  Search,
  FilterIcon,
  ArrowUpDown,
  MoreHorizontal 
} from 'lucide-react';

// Customer interface
interface Customer {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  registrationDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
}

// Customers page component
export default function AdminCustomersPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  // Mock customers data
  const customers: Customer[] = [
    {
      id: 1,
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      phoneNumber: '0123456789',
      registrationDate: '2024-01-15T10:30:00',
      totalOrders: 8,
      totalSpent: 1540.50,
      status: 'active',
    },
    {
      id: 2,
      name: 'سارة علي',
      email: 'sara@example.com',
      phoneNumber: '0123456790',
      registrationDate: '2024-02-20T14:20:00',
      totalOrders: 5,
      totalSpent: 920.75,
      status: 'active',
    },
    {
      id: 3,
      name: 'محمود عبدالله',
      email: 'mahmoud@example.com',
      phoneNumber: '0123456791',
      registrationDate: '2024-01-05T09:15:00',
      totalOrders: 12,
      totalSpent: 2345.25,
      status: 'active',
    },
    {
      id: 4,
      name: 'فاطمة خالد',
      email: 'fatma@example.com',
      phoneNumber: '0123456792',
      registrationDate: '2024-03-10T16:45:00',
      totalOrders: 3,
      totalSpent: 450.99,
      status: 'active',
    },
    {
      id: 5,
      name: 'عمر حسن',
      email: 'omar@example.com',
      phoneNumber: '0123456793',
      registrationDate: '2023-11-25T11:10:00',
      totalOrders: 0,
      totalSpent: 0,
      status: 'inactive',
    },
    {
      id: 6,
      name: 'نورا محمد',
      email: 'noura@example.com',
      phoneNumber: '0123456794',
      registrationDate: '2024-02-05T08:30:00',
      totalOrders: 6,
      totalSpent: 1120.50,
      status: 'active',
    },
    {
      id: 7,
      name: 'كريم أحمد',
      email: 'kareem@example.com',
      phoneNumber: '0123456795',
      registrationDate: '2023-12-15T13:25:00',
      totalOrders: 1,
      totalSpent: 150.25,
      status: 'inactive',
    },
    {
      id: 8,
      name: 'ليلى علي',
      email: 'laila@example.com',
      phoneNumber: '0123456796',
      registrationDate: '2024-03-20T15:40:00',
      totalOrders: 4,
      totalSpent: 870.99,
      status: 'active',
    },
  ];
  
  // Filter and search customers
  const filteredCustomers = customers
    .filter(customer => {
      if (filter === 'all') return true;
      return customer.status === filter;
    })
    .filter(customer => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.phoneNumber.includes(searchTerm)
      );
    });
  
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t('customers')}</h1>
            <p className="text-gray-400 mt-1">{t('manageAllCustomers')}</p>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-black px-4 py-2 rounded-md font-medium">
            {t('addNewCustomer')}
          </button>
        </div>
        
        {/* Search and filters */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('searchCustomers')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-2">
              <button 
                onClick={() => setFilter('all')} 
                className={`px-4 py-2 rounded-md text-sm ${filter === 'all' ? 'bg-primary text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                {t('all')}
              </button>
              <button 
                onClick={() => setFilter('active')} 
                className={`px-4 py-2 rounded-md text-sm ${filter === 'active' ? 'bg-primary text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                {t('active')}
              </button>
              <button 
                onClick={() => setFilter('inactive')} 
                className={`px-4 py-2 rounded-md text-sm ${filter === 'inactive' ? 'bg-primary text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                {t('inactive')}
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-md text-sm flex items-center gap-2">
                <FilterIcon className="h-4 w-4" />
                {t('moreFilters')}
              </button>
            </div>
          </div>
        </div>
        
        {/* Customers Table */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800">
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                      {t('customer')}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                      {t('contact')}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                      {t('registrationDate')}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                      {t('orders')}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                      {t('totalSpent')}
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t('status')}
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-800/50">
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-medium">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-200">{customer.name}</div>
                          <div className="text-sm text-gray-400">ID: {customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-sm text-gray-200">{customer.email}</div>
                      <div className="text-sm text-gray-400">{customer.phoneNumber}</div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(customer.registrationDate)}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">
                      {customer.totalOrders}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">
                      {customer.totalSpent.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        customer.status === 'active' 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {t(customer.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex items-center space-x-3">
                        <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm">
                          {t('view')}
                        </button>
                        <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-1 rounded">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-md text-sm font-medium">
                {t('previous')}
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-md text-sm font-medium">
                {t('next')}
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  {t('showing')} <span className="font-medium">1</span> {t('to')} <span className="font-medium">8</span> {t('of')} <span className="font-medium">8</span> {t('results')}
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700">
                    <span className="sr-only">{t('previous')}</span>
                    ←
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-gray-900 text-sm font-medium text-gray-200">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700">
                    <span className="sr-only">{t('next')}</span>
                    →
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}