import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { AdminLayout } from '@/components/layout/admin-layout';
import { formatCurrency, formatDate } from '@/lib/utils';

// Order status type
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Order interface
interface Order {
  id: number;
  orderNumber: string;
  customer: {
    id: number;
    name: string;
    email: string;
  };
  date: string;
  status: OrderStatus;
  items: number;
  total: number;
  paymentMethod: string;
  shippingMethod: string;
}

// Orders page component
export default function AdminOrdersPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string>('all');
  
  // Mock orders data
  const orders: Order[] = [
    {
      id: 1,
      orderNumber: 'ECO-10001',
      customer: {
        id: 1,
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
      },
      date: '2024-04-26T10:30:00',
      status: 'pending',
      items: 3,
      total: 240.99,
      paymentMethod: 'فوري',
      shippingMethod: 'القاهرة للشحن',
    },
    {
      id: 2,
      orderNumber: 'ECO-10002',
      customer: {
        id: 2,
        name: 'سارة علي',
        email: 'sara@example.com',
      },
      date: '2024-04-25T14:20:00',
      status: 'processing',
      items: 2,
      total: 129.50,
      paymentMethod: 'فودافون كاش',
      shippingMethod: 'الاسكندرية السريع',
    },
    {
      id: 3,
      orderNumber: 'ECO-10003',
      customer: {
        id: 3,
        name: 'محمود عبدالله',
        email: 'mahmoud@example.com',
      },
      date: '2024-04-25T09:15:00',
      status: 'shipped',
      items: 5,
      total: 420.75,
      paymentMethod: 'فوري',
      shippingMethod: 'القاهرة للشحن',
    },
    {
      id: 4,
      orderNumber: 'ECO-10004',
      customer: {
        id: 4,
        name: 'فاطمة خالد',
        email: 'fatma@example.com',
      },
      date: '2024-04-24T16:45:00',
      status: 'delivered',
      items: 1,
      total: 89.99,
      paymentMethod: 'الدفع عند الاستلام',
      shippingMethod: 'القاهرة للشحن',
    },
    {
      id: 5,
      orderNumber: 'ECO-10005',
      customer: {
        id: 5,
        name: 'عمر حسن',
        email: 'omar@example.com',
      },
      date: '2024-04-23T11:10:00',
      status: 'cancelled',
      items: 4,
      total: 350.25,
      paymentMethod: 'انستابي',
      shippingMethod: 'الشحن السريع',
    },
    {
      id: 6,
      orderNumber: 'ECO-10006',
      customer: {
        id: 6,
        name: 'نورا محمد',
        email: 'noura@example.com',
      },
      date: '2024-04-23T08:30:00',
      status: 'delivered',
      items: 2,
      total: 175.50,
      paymentMethod: 'فودافون كاش',
      shippingMethod: 'الاسكندرية السريع',
    },
    {
      id: 7,
      orderNumber: 'ECO-10007',
      customer: {
        id: 7,
        name: 'كريم أحمد',
        email: 'kareem@example.com',
      },
      date: '2024-04-22T13:25:00',
      status: 'processing',
      items: 6,
      total: 560.99,
      paymentMethod: 'فوري',
      shippingMethod: 'القاهرة للشحن',
    },
    {
      id: 8,
      orderNumber: 'ECO-10008',
      customer: {
        id: 8,
        name: 'ليلى علي',
        email: 'laila@example.com',
      },
      date: '2024-04-21T15:40:00',
      status: 'shipped',
      items: 3,
      total: 299.75,
      paymentMethod: 'انستابي',
      shippingMethod: 'الشحن السريع',
    },
  ];
  
  // Filter orders
  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);
  
  // Status badge component
  const StatusBadge = ({ status }: { status: OrderStatus }) => {
    const getStatusColor = (status: OrderStatus) => {
      switch (status) {
        case 'pending':
          return 'bg-yellow-500/20 text-yellow-500';
        case 'processing':
          return 'bg-blue-500/20 text-blue-500';
        case 'shipped':
          return 'bg-purple-500/20 text-purple-500';
        case 'delivered':
          return 'bg-green-500/20 text-green-500';
        case 'cancelled':
          return 'bg-red-500/20 text-red-500';
        default:
          return 'bg-gray-500/20 text-gray-500';
      }
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
        {t(status)}
      </span>
    );
  };
  
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t('orders')}</h1>
            <p className="text-gray-400 mt-1">{t('manageAllOrders')}</p>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-black px-4 py-2 rounded-md font-medium">
            {t('exportOrders')}
          </button>
        </div>
        
        {/* Filters */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setFilter('all')} 
              className={`px-4 py-2 rounded-md text-sm ${filter === 'all' ? 'bg-primary text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              {t('all')}
            </button>
            <button 
              onClick={() => setFilter('pending')} 
              className={`px-4 py-2 rounded-md text-sm ${filter === 'pending' ? 'bg-primary text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              {t('pending')}
            </button>
            <button 
              onClick={() => setFilter('processing')} 
              className={`px-4 py-2 rounded-md text-sm ${filter === 'processing' ? 'bg-primary text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              {t('processing')}
            </button>
            <button 
              onClick={() => setFilter('shipped')} 
              className={`px-4 py-2 rounded-md text-sm ${filter === 'shipped' ? 'bg-primary text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              {t('shipped')}
            </button>
            <button 
              onClick={() => setFilter('delivered')} 
              className={`px-4 py-2 rounded-md text-sm ${filter === 'delivered' ? 'bg-primary text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              {t('delivered')}
            </button>
            <button 
              onClick={() => setFilter('cancelled')} 
              className={`px-4 py-2 rounded-md text-sm ${filter === 'cancelled' ? 'bg-primary text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              {t('cancelled')}
            </button>
          </div>
        </div>
        
        {/* Orders Table */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800">
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t('orderNumber')}
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t('customer')}
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t('date')}
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t('status')}
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t('items')}
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t('total')}
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-800/50">
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-medium">{order.orderNumber}</span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium">{order.customer.name}</span>
                        <span className="text-sm text-gray-400">{order.customer.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-gray-300">{formatDate(order.date)}</span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-gray-300">{order.items}</span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-medium">{formatCurrency(order.total)}</span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm">
                          {t('view')}
                        </button>
                        <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1 rounded text-sm">
                          {t('updateStatus')}
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
                  {t('showing')} <span className="font-medium">1</span> {t('to')} <span className="font-medium">8</span> {t('of')} <span className="font-medium">20</span> {t('results')}
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
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700">
                    3
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