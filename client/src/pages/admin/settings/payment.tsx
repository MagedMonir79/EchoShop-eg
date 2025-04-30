import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { AdminLayout } from '@/components/layout/admin-layout';
import { 
  Plus, 
  Edit, 
  Trash, 
  Check,
  ArrowUpDown,
  CreditCard,
  Banknote,
  Smartphone,
  QrCode
} from 'lucide-react';

// Payment method interface
interface PaymentMethod {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  fees: string;
  active: boolean;
}

// Payment gateway interface
interface PaymentGateway {
  id: number;
  name: string;
  logo: string;
  isConfigured: boolean;
  active: boolean;
}

// Settings payment page component
export default function AdminSettingsPaymentPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'methods' | 'gateways'>('methods');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  
  // Mock payment methods data
  const paymentMethods: PaymentMethod[] = [
    {
      id: 1,
      name: 'فوري',
      description: 'الدفع عبر منافذ فوري المختلفة',
      icon: <CreditCard className="h-5 w-5 text-blue-500" />,
      fees: '5 جنيه + 2%',
      active: true,
    },
    {
      id: 2,
      name: 'فودافون كاش',
      description: 'الدفع عبر محفظة فودافون كاش الإلكترونية',
      icon: <Smartphone className="h-5 w-5 text-red-500" />,
      fees: '2%',
      active: true,
    },
    {
      id: 3,
      name: 'انستابي',
      description: 'الدفع عبر محفظة انستابي الإلكترونية',
      icon: <CreditCard className="h-5 w-5 text-purple-500" />,
      fees: '1.5%',
      active: true,
    },
    {
      id: 4,
      name: 'الدفع عند الاستلام',
      description: 'الدفع نقداً عند استلام الطلب',
      icon: <Banknote className="h-5 w-5 text-green-500" />,
      fees: '10 جنيه',
      active: true,
    },
  ];
  
  // Mock payment gateways data
  const paymentGateways: PaymentGateway[] = [
    {
      id: 1,
      name: 'بوابة الدفع الموحدة',
      logo: '🏦',
      isConfigured: true,
      active: true,
    },
    {
      id: 2,
      name: 'ميزا',
      logo: '💳',
      isConfigured: true,
      active: true,
    },
    {
      id: 3,
      name: 'باي موب',
      logo: '📱',
      isConfigured: false,
      active: false,
    },
    {
      id: 4,
      name: 'Stripe',
      logo: '💸',
      isConfigured: false,
      active: false,
    },
  ];
  
  // Toggle payment method status
  const toggleMethodStatus = (id: number) => {
    // In a real app, this would update the backend
    console.log(`Toggle method status: ${id}`);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };
  
  // Toggle payment gateway status
  const toggleGatewayStatus = (id: number) => {
    // In a real app, this would update the backend
    console.log(`Toggle gateway status: ${id}`);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t('paymentSettings')}</h1>
            <p className="text-gray-400 mt-1">{t('managePaymentMethodsAndGateways')}</p>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-black px-4 py-2 rounded-md font-medium flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {activeTab === 'methods' ? t('addPaymentMethod') : t('addPaymentGateway')}
          </button>
        </div>
        
        {/* Success message */}
        {showSuccess && (
          <div className="bg-green-900/20 border border-green-800 text-green-500 px-4 py-3 rounded-md flex items-center gap-2">
            <Check className="h-5 w-5" />
            <span>{t('settingsSaved')}</span>
          </div>
        )}
        
        {/* Tabs */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="border-b border-gray-800">
            <div className="flex">
              <button
                onClick={() => setActiveTab('methods')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'methods'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {t('paymentMethods')}
              </button>
              <button
                onClick={() => setActiveTab('gateways')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'gateways'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {t('paymentGateways')}
              </button>
            </div>
          </div>
          
          {/* Payment Methods Tab */}
          {activeTab === 'methods' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800/50">
                    <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                        {t('method')}
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t('description')}
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                        {t('fees')}
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
                <tbody className="divide-y divide-gray-800">
                  {paymentMethods.map((method) => (
                    <tr key={method.id} className="hover:bg-gray-800/50">
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-800 flex items-center justify-center">
                            {method.icon}
                          </div>
                          <div className="text-sm font-medium text-gray-200">{method.name}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">
                        {method.description}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">
                        {method.fees}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={method.active} 
                            onChange={() => toggleMethodStatus(method.id)} 
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
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
          
          {/* Payment Gateways Tab */}
          {activeTab === 'gateways' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800/50">
                    <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-200">
                        {t('gateway')}
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {t('configured')}
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
                  {paymentGateways.map((gateway) => (
                    <tr key={gateway.id} className="hover:bg-gray-800/50">
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-800 flex items-center justify-center text-xl">
                            {gateway.logo}
                          </div>
                          <div className="text-sm font-medium text-gray-200">{gateway.name}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          gateway.isConfigured 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {gateway.isConfigured ? t('configured') : t('notConfigured')}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={gateway.active} 
                            onChange={() => toggleGatewayStatus(gateway.id)} 
                            className="sr-only peer" 
                            disabled={!gateway.isConfigured}
                          />
                          <div className={`w-11 h-6 ${!gateway.isConfigured ? 'opacity-50 cursor-not-allowed' : ''} bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary`}></div>
                        </label>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-3">
                          <button 
                            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-1.5 rounded-md"
                            title={t('configure')}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-1.5 rounded-md"
                            title={t('remove')}
                          >
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
        </div>
        
        {/* Additional Configuration */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-semibold mb-6">{t('additionalPaymentConfiguration')}</h2>
          
          <div className="space-y-6">
            {/* QR Code Payments */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-gray-800 rounded-md p-2 mt-1">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-200">{t('qrCodePayments')}</h3>
                  <p className="text-xs text-gray-400 mt-1">{t('qrCodePaymentsDescription')}</p>
                </div>
              </div>
              <div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
            
            {/* Payment Receipt */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-gray-800 rounded-md p-2 mt-1">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-200">{t('automaticReceipts')}</h3>
                  <p className="text-xs text-gray-400 mt-1">{t('automaticReceiptsDescription')}</p>
                </div>
              </div>
              <div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
            
            {/* Payment Currency */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-gray-800 rounded-md p-2 mt-1">
                  <span className="text-primary font-bold">£</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-200">{t('defaultCurrency')}</h3>
                  <p className="text-xs text-gray-400 mt-1">{t('defaultCurrencyDescription')}</p>
                </div>
              </div>
              <div>
                <select className="w-full sm:w-auto rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 appearance-none">
                  <option value="EGP">EGP (الجنيه المصري)</option>
                  <option value="USD">USD (الدولار الأمريكي)</option>
                  <option value="EUR">EUR (اليورو)</option>
                  <option value="SAR">SAR (الريال السعودي)</option>
                </select>
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