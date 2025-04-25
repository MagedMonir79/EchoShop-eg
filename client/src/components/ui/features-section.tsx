import { useContext } from "react";
import { Package, Shield, HeadphonesIcon } from "lucide-react";
import { LanguageContext } from "@/context/language-context";

export default function FeaturesSection() {
  const { t } = useContext(LanguageContext);

  const features = [
    {
      icon: <Package className="h-6 w-6 text-primary" />,
      title: t("freeShipping"),
      description: t("onOrdersOver"),
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: t("securePayments"),
      description: t("100SecurePayment"),
    },
    {
      icon: <HeadphonesIcon className="h-6 w-6 text-primary" />,
      title: t("24Support"),
      description: t("dedicatedSupport"),
    },
  ];

  return (
    <section className="bg-mediumBlue py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-4 p-4">
            <div className="bg-blue-900 p-3 rounded-full">
              {feature.icon}
            </div>
            <div>
              <h3 className="font-bold">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
