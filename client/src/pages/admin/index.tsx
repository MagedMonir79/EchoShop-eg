import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { AdminLayout } from '@/components/layout/admin-layout';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

// Dashboard page component
export default function AdminDashboardPage() {
  const { t } = useTranslation();
  
  // Mock data for dashboard stats
  interface Stat {
    title: string;
    value: string | number;
    change: number;
    icon: React.ReactNode;
  }
  
  const stats: Stat[] = [
    {
      title: t('revenue'),
      value: formatCurrency(124500),
      change: 12.5,
      icon: <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
        <span className="text-green-500 text-xl">$</span>
      </div>
    },
    {
      title: t('orders'),
      value: 324,
      change: 4.2,
      icon: <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
        <span className="text-blue-500 text-xl">📦</span>
      </div>
    },
    {
      title: t('customers'),
      value: 1254,
      change: 8.1,
      icon: <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
        <span className="text-purple-500 text-xl">👤</span>
      </div>
    },
    {
      title: t('products'),
      value: 432,
      change: -2.3,
      icon: <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
        <span className="text-yellow-500 text-xl">🛍️</span>
      </div>
    }
  ];
  
  // Sales data
  const salesData = [
    { name: t('jan'), sales: 4000 },
    { name: t('feb'), sales: 3000 },
    { name: t('mar'), sales: 5000 },
    { name: t('apr'), sales: 8000 },
    { name: t('may'), sales: 7000 },
    { name: t('jun'), sales: 9000 },
    { name: t('jul'), sales: 11000 },
    { name: t('aug'), sales: 12000 },
    { name: t('sep'), sales: 10000 },
    { name: t('oct'), sales: 14000 },
    { name: t('nov'), sales: 15000 },
    { name: t('dec'), sales: 19000 }
  ];
  
  // Order status data
  const orderStatusData = [
    { name: t('pending'), value: 25 },
    { name: t('processing'), value: 35 },
    { name: t('shipped'), value: 20 },
    { name: t('delivered'), value: 15 },
    { name: t('cancelled'), value: 5 }
  ];
  
  // Colors for pie chart
  const COLORS = ['#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#EF4444'];
  
  // Category performance data
  const categoryData = [
    { name: t('electronics'), sales: 12000 },
    { name: t('clothing'), sales: 9000 },
    { name: t('home'), sales: 5000 },
    { name: t('beauty'), sales: 4000 },
    { name: t('books'), sales: 3000 }
  ];
  
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
          <p className="text-gray-400 mt-1">{t('welcomeToAdminDashboard')}</p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <div className={`flex items-center mt-2 ${stat.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <span>{stat.change >= 0 ? '↑' : '↓'}</span>
                    <span className="ms-1">{Math.abs(stat.change)}%</span>
                    <span className="text-gray-400 text-xs ms-1">{t('thisMonth')}</span>
                  </div>
                </div>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">{t('salesTrend')}</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis 
                    stroke="#9CA3AF"
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                    formatter={(value: any) => [`${formatCurrency(value)}`, t('sales')]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#10B981" 
                    fillOpacity={1} 
                    fill="url(#salesColor)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Order Status Distribution */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">{t('orderStatus')}</h2>
            <p className="text-gray-400 text-sm mb-4">{t('currentOrderStatusDistribution')}</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                    formatter={(value: any) => [`${value}%`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Category Performance */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">{t('categoryPerformance')}</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis 
                    stroke="#9CA3AF"
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                    formatter={(value: any) => [`${formatCurrency(value)}`, t('sales')]}
                  />
                  <Bar dataKey="sales" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Recent Activities */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">{t('recentActivity')}</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="border-b border-gray-800 pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-400">{item}</span>
                      </div>
                      <div>
                        <p className="font-medium">{t('newOrder')} #{1000 + item}</p>
                        <p className="text-gray-400 text-sm">{t('customerName')}: John Doe</p>
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                        {t('processing')}
                      </span>
                      <p className="text-gray-400 text-xs mt-1">1 {t('hoursAgo')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}