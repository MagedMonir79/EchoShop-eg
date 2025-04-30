import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Plus, Edit, Trash, ArrowUpDown } from 'lucide-react';

// Shipping company interface
interface ShippingCompany {
  id: number;
  name: string;
  logo: string;
  contactInfo: string;
  deliveryTime: string;
  active: boolean;
}

// Shipping option interface
interface ShippingOption {
  id: number;
  companyId: number;
  name: string;
  description: string;
  price: number;
  estimatedDelivery: string;
  active: boolean;
}

// Settings shipping page component
export default function AdminSettingsShippingPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'companies' | 'options'>('companies');
  
  // Mock shipping companies data
  const shippingCompanies: ShippingCompany[] = [
    {
      id: 1,
      name: 'القاهرة للشحن',
      logo: '🚚',
      contactInfo: 'contact@cairoexpress.com',
      deliveryTime: '2-3 أيام',
      active: true,
    },
    {
      id: 2,
      name: 'الشحن السريع',
      logo: '🚀',
      contactInfo: 'support@fasttrack.com',
      deliveryTime: '1-2 أيام',
      active: true,
    },
    {
      id: 3,
      name: 'الاسكندرية السريع',
      logo: '🚛',
      contactInfo: 'info@alexexpress.com',
      deliveryTime: '3-5 أيام',
      active: true,
    },
    {
      id: 4,
      name: 'توصيل إكسبرس',
      logo: '📦',
      contactInfo: 'service@expressdelivery.com',
      deliveryTime: '1-3 أيام',
      active: false,
    },
  ];
  
  // Mock shipping options data
  const shippingOptions: ShippingOption[] = [
    {
      id: 1,
      companyId: 1,
      name: 'توصيل قياسي',
      description: 'توصيل عادي لمدة 2-3 أيام',
      price: 50,
      estimatedDelivery: '2-3 أيام',
      active: true,
    },
    {
      id: 2,
      companyId: 1,
      name: 'توصيل سريع',
      description: 'توصيل سريع في نفس اليوم',
      price: 100,
      estimatedDelivery: 'نفس اليوم',
      active: true,
    },
    {
      id: 3,
      companyId: 2,
      name: 'فاست تراك قياسي',
      description: 'توصيل سريع خلال 1-2 أيام',
      price: 75,
      estimatedDelivery: '1-2 أيام',
      active: true,
    },
    {
      id: 4,
      companyId: 2,
      name: 'توصيل بريميم',
      description: 'توصيل فاخر مع تغليف خاص',
      price: 150,
      estimatedDelivery: '1 يوم',
      active: true,
    },
    {
      id: 5,
      companyId: 3,
      name: 'توصيل عادي',
      description: 'توصيل موفر لمدة 3-5 أيام',
      price: 40,
      estimatedDelivery: '3-5 أيام',
      active: true,
    },
    {
      id: 6,
      companyId: 3,
      name: 'توصيل عاجل',
      description: 'توصيل عاجل خلال 1-2 أيام',
      price: 90,
      estimatedDelivery: '1-2 أيام',
      active: true,
    },
  ];
  
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t('shippingSettings')}</h1>
            <p className="text-gray-400 mt-1">{t('manageShippingCompaniesAndOptions')}</p>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-black px-4 py-2 rounded-md font-medium flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {activeTab === 'companies' ? t('addShippingCompany') : t('addShippingOption')}
          </button>
        </div>
        
        {/* Tabs */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="border-b border-gray-800">
            <div className="flex">
              <button
                onClick={() => setActiveTab('companies')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'companies'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {t('shippingCompanies')}
              </button>
              <button
                onClick={() => setActiveTab('options')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'options'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {t('shippingOptions')}
              </button>
            </div>
          </div>
          
          {/* Shipping Companies Tab */}
          {activeTab === 'companies' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800/50">
                    <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                        {t('company')}
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t('contactInfo')}
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t('deliveryTime')}
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
                  {shippingCompanies.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-800/50">
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-800 rounded-md flex items-center justify-center text-xl">
                            {company.logo}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-200">{company.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">
                        {company.contactInfo}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">
                        {company.deliveryTime}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          company.active 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-red-500/20 text-red-500'
                        }`}>
                          {company.active ? t('active') : t('inactive')}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-3">
                          <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-1.5 rounded-md">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-1.5 rounded-md">
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Shipping Options Tab */}
          {activeTab === 'options' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800/50">
                    <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                        {t('optionName')}
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t('company')}
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t('description')}
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                        {t('price')}
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t('estimatedDelivery')}
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
                  {shippingOptions.map((option) => {
                    const company = shippingCompanies.find(c => c.id === option.companyId);
                    return (
                      <tr key={option.id} className="hover:bg-gray-800/50">
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-200">{option.name}</div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-gray-800 rounded-md flex items-center justify-center text-lg me-2">
                              {company?.logo}
                            </div>
                            <div className="text-sm text-gray-300">{company?.name}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">
                          {option.description}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-200">
                          {option.price.toLocaleString('ar-EG')} {t('egp')}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">
                          {option.estimatedDelivery}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            option.active 
                              ? 'bg-green-500/20 text-green-500' 
                              : 'bg-red-500/20 text-red-500'
                          }`}>
                            {option.active ? t('active') : t('inactive')}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-3">
                            <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-1.5 rounded-md">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-1.5 rounded-md">
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Additional Configuration */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-semibold mb-6">{t('additionalShippingConfiguration')}</h2>
          
          <div className="space-y-6">
            {/* Free Shipping Threshold */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-200">{t('freeShippingThreshold')}</h3>
                <p className="text-xs text-gray-400 mt-1">{t('freeShippingThresholdDescription')}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue="500"
                  className="w-28 px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-gray-400">{t('egp')}</span>
              </div>
            </div>
            
            {/* Local Pickup */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-200">{t('localPickupOption')}</h3>
                <p className="text-xs text-gray-400 mt-1">{t('localPickupOptionDescription')}</p>
              </div>
              <div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
            
            {/* International Shipping */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-200">{t('internationalShipping')}</h3>
                <p className="text-xs text-gray-400 mt-1">{t('internationalShippingDescription')}</p>
              </div>
              <div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <button className="bg-primary hover:bg-primary/90 text-black px-4 py-2 rounded-md font-medium">
              {t('saveChanges')}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}