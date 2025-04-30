import { useContext } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import MainLayout from "@/components/layout/main-layout";
import { LanguageContext } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Box, 
  DollarSign, 
  Globe, 
  ShoppingBag, 
  Truck, 
  TrendingUp, 
  CheckCircle, 
  Zap, 
  Shield, 
  HelpCircle, 
  PieChart,
  Award,
  Users 
} from "lucide-react";

export default function SellerLearnMorePage() {
  const { language, t } = useContext(LanguageContext);
  const isRTL = language === "ar";
  const [, navigate] = useLocation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <MainLayout>
      <div className={`container mx-auto px-4 py-10 ${isRTL ? "rtl" : ""}`}>
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary mb-4">
            {t("sellerProgram") || "Seller Program"}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {t("becomeSellerTitle") || "Become an EchoShop Seller"}
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto">
            {t("becomeSellerDescription") || "Join thousands of businesses selling on EchoShop to reach millions of customers and grow your business with our powerful e-commerce platform."}
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button className="bg-primary text-black hover:bg-lime-500 h-12 px-8 text-base" asChild>
              <Link href="/seller/register">
                {t("registerNow") || "Register Now"}
              </Link>
            </Button>
            <Button variant="outline" className="border-gray-600 h-12 px-8 text-base" asChild>
              <Link href="#faq">
                {t("faqs") || "FAQs"}
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          <Card className="bg-mediumBlue border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-10 w-10 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold mb-1">10K+</div>
                <div className="text-sm text-gray-400">{t("activeSellers") || "Active Sellers"}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-mediumBlue border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <Globe className="h-10 w-10 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold mb-1">1M+</div>
                <div className="text-sm text-gray-400">{t("monthlyVisitors") || "Monthly Visitors"}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-mediumBlue border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <ShoppingBag className="h-10 w-10 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold mb-1">500K+</div>
                <div className="text-sm text-gray-400">{t("monthlyOrders") || "Monthly Orders"}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-mediumBlue border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="h-10 w-10 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold mb-1">25%</div>
                <div className="text-sm text-gray-400">{t("avgSalesGrowth") || "Avg. Sales Growth"}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Benefits */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              {t("whySellOnEchoShop") || "Why Sell on EchoShop?"}
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              {t("whySellDescription") || "EchoShop offers a comprehensive selling experience with tools and features designed to help your business succeed."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <motion.div variants={itemVariants} className="bg-mediumBlue p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("reachMoreCustomers") || "Reach More Customers"}
              </h3>
              <p className="text-gray-400">
                {t("reachMoreDescription") || "Gain access to millions of potential customers across Egypt and expand your market reach."}
              </p>
            </motion.div>

            {/* Benefit 2 */}
            <motion.div variants={itemVariants} className="bg-mediumBlue p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("competitiveFees") || "Competitive Fees"}
              </h3>
              <p className="text-gray-400">
                {t("competitiveFeesDescription") || "Benefit from competitive selling fees and transparent pricing structure with no hidden costs."}
              </p>
            </motion.div>

            {/* Benefit 3 */}
            <motion.div variants={itemVariants} className="bg-mediumBlue p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("simpleLogistics") || "Simple Logistics"}
              </h3>
              <p className="text-gray-400">
                {t("simpleLogisticsDescription") || "Use our network of delivery partners or handle deliveries yourself - you choose what works best."}
              </p>
            </motion.div>

            {/* Benefit 4 */}
            <motion.div variants={itemVariants} className="bg-mediumBlue p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <PieChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("sellerDashboard") || "Seller Dashboard"}
              </h3>
              <p className="text-gray-400">
                {t("sellerDashboardDescription") || "Manage your inventory, track sales, and analyze performance with our easy-to-use seller dashboard."}
              </p>
            </motion.div>

            {/* Benefit 5 */}
            <motion.div variants={itemVariants} className="bg-mediumBlue p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("securePayments") || "Secure Payments"}
              </h3>
              <p className="text-gray-400">
                {t("securePaymentsDescription") || "Receive payments securely and on time with multiple withdrawal options tailored to your needs."}
              </p>
            </motion.div>

            {/* Benefit 6 */}
            <motion.div variants={itemVariants} className="bg-mediumBlue p-6 rounded-xl border border-gray-700">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("growthOpportunities") || "Growth Opportunities"}
              </h3>
              <p className="text-gray-400">
                {t("growthOpportunitiesDescription") || "Access marketing tools, promotions, and special events to boost your sales and brand visibility."}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              {t("howItWorks") || "How It Works"}
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              {t("howItWorksDescription") || "Get started in just a few easy steps and start selling on EchoShop."}
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent transform -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-mediumBlue border-2 border-primary flex items-center justify-center mb-4 relative z-10">
                  <div className="absolute -top-2 -right-2 bg-primary text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">
                  {t("register") || "Register"}
                </h3>
                <p className="text-gray-400 text-sm">
                  {t("registerDescription") || "Sign up and complete your seller profile with business details."}
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-mediumBlue border-2 border-primary flex items-center justify-center mb-4 relative z-10">
                  <div className="absolute -top-2 -right-2 bg-primary text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">
                  {t("getVerified") || "Get Verified"}
                </h3>
                <p className="text-gray-400 text-sm">
                  {t("getVerifiedDescription") || "Our team verifies your information usually within 24-48 hours."}
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-mediumBlue border-2 border-primary flex items-center justify-center mb-4 relative z-10">
                  <div className="absolute -top-2 -right-2 bg-primary text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <Box className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">
                  {t("listProducts") || "List Products"}
                </h3>
                <p className="text-gray-400 text-sm">
                  {t("listProductsDescription") || "Add your products with detailed descriptions, images, and pricing."}
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-mediumBlue border-2 border-primary flex items-center justify-center mb-4 relative z-10">
                  <div className="absolute -top-2 -right-2 bg-primary text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">
                  {t("startSelling") || "Start Selling"}
                </h3>
                <p className="text-gray-400 text-sm">
                  {t("startSellingDescription") || "Receive orders, manage inventory, and grow your business with EchoShop."}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button className="bg-primary text-black hover:bg-lime-500 h-12 px-8 text-base" asChild>
              <Link href="/seller/register">
                {t("getStartedNow") || "Get Started Now"}
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Pricing */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              {t("pricing") || "Pricing & Fees"}
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              {t("pricingDescription") || "Transparent fee structure with no hidden costs. Pay only when you sell."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fee Type 1 */}
            <Card className="bg-mediumBlue border-gray-700 overflow-hidden">
              <div className="h-2 bg-primary"></div>
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="text-xl font-semibold mb-2">
                    {t("commissionFees") || "Commission Fees"}
                  </div>
                  <div className="text-4xl font-bold mb-1">5-10%</div>
                  <div className="text-sm text-gray-400">
                    {t("perSale") || "Per Sale"}
                  </div>
                </div>
                <div className="space-y-3 mt-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
                    <span className="text-sm">
                      {t("categoriesVary") || "Varies by product category"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
                    <span className="text-sm">
                      {t("deductedFromSales") || "Automatically deducted from sales"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
                    <span className="text-sm">
                      {t("volumeDiscounts") || "Volume discounts available"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fee Type 2 */}
            <Card className="bg-mediumBlue border-gray-700 overflow-hidden">
              <div className="h-2 bg-primary"></div>
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="text-xl font-semibold mb-2">
                    {t("subscriptionFees") || "Subscription Fees"}
                  </div>
                  <div className="text-4xl font-bold mb-1">
                    <span className="text-primary">EGP 0</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {t("perMonth") || "Per Month"}
                  </div>
                </div>
                <div className="space-y-3 mt-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
                    <span className="text-sm">
                      {t("noMonthlySub") || "No monthly subscription fee"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
                    <span className="text-sm">
                      {t("fullAccess") || "Full access to seller dashboard"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
                    <span className="text-sm">
                      {t("unlimitedProducts") || "Unlimited product listings"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fee Type 3 */}
            <Card className="bg-mediumBlue border-gray-700 overflow-hidden">
              <div className="h-2 bg-primary"></div>
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="text-xl font-semibold mb-2">
                    {t("otherFees") || "Other Fees"}
                  </div>
                  <div className="text-4xl font-bold mb-1">
                    <span className="text-primary">Varies</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {t("asApplicable") || "As Applicable"}
                  </div>
                </div>
                <div className="space-y-3 mt-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
                    <span className="text-sm">
                      {t("promotionalFees") || "Optional promotional fees"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
                    <span className="text-sm">
                      {t("paymentProcessing") || "Payment processing fees"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
                    <span className="text-sm">
                      {t("shippingRates") || "Competitive shipping rates"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              {t("sellerStories") || "Seller Success Stories"}
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              {t("sellerStoriesDescription") || "Hear from businesses that have grown with EchoShop."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="bg-mediumBlue border-gray-700">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-primary/20 w-10 h-10 flex items-center justify-center">
                      <span className="text-primary font-bold">A</span>
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">{t("sellerName1") || "Ahmed Electronics"}</div>
                      <div className="text-xs text-gray-400">{t("sellerLocation1") || "Cairo, Egypt"}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 italic">
                    "{t("sellerTestimonial1") || "Since joining EchoShop, our sales have increased by 70% in just 6 months. The platform's reach and tools have transformed our business."}"
                  </p>
                  <div className="flex items-center mt-3">
                    <Award className="text-primary h-5 w-5" />
                    <span className="text-xs text-gray-400 ml-2">{t("sellerAchievement1") || "Top Seller 2023"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="bg-mediumBlue border-gray-700">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-primary/20 w-10 h-10 flex items-center justify-center">
                      <span className="text-primary font-bold">F</span>
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">{t("sellerName2") || "Fashion Boutique"}</div>
                      <div className="text-xs text-gray-400">{t("sellerLocation2") || "Alexandria, Egypt"}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 italic">
                    "{t("sellerTestimonial2") || "The seller dashboard makes it incredibly easy to manage our inventory and track sales. We've expanded our business beyond our expectations."}"
                  </p>
                  <div className="flex items-center mt-3">
                    <Award className="text-primary h-5 w-5" />
                    <span className="text-xs text-gray-400 ml-2">{t("sellerAchievement2") || "Fastest Growing Seller"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="bg-mediumBlue border-gray-700">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-primary/20 w-10 h-10 flex items-center justify-center">
                      <span className="text-primary font-bold">T</span>
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">{t("sellerName3") || "Tech Gadgets"}</div>
                      <div className="text-xs text-gray-400">{t("sellerLocation3") || "Giza, Egypt"}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 italic">
                    "{t("sellerTestimonial3") || "EchoShop's customer base has helped us reach a wider audience. The support team is always helpful and responsive to our needs."}"
                  </p>
                  <div className="flex items-center mt-3">
                    <Award className="text-primary h-5 w-5" />
                    <span className="text-xs text-gray-400 ml-2">{t("sellerAchievement3") || "Highest Customer Satisfaction"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          id="faq"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mb-20 scroll-mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              {t("frequentlyAskedQuestions") || "Frequently Asked Questions"}
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              {t("faqDescription") || "Find answers to common questions about selling on EchoShop."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* FAQ Item 1 */}
            <div className="bg-mediumBlue border border-gray-700 rounded-lg p-6">
              <div className="flex items-start">
                <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold mb-2">
                    {t("faqQuestion1") || "How do I register as a seller?"}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {t("faqAnswer1") || "Click on the 'Register as Seller' button, fill out the application form with your business details, and submit. Our team will review your application and get back to you within 24-48 hours."}
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-mediumBlue border border-gray-700 rounded-lg p-6">
              <div className="flex items-start">
                <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold mb-2">
                    {t("faqQuestion2") || "What documents do I need to register?"}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {t("faqAnswer2") || "You'll need your ID card, tax card (for businesses), commercial registry (for companies), and bank account details. The exact requirements may vary based on your seller type."}
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-mediumBlue border border-gray-700 rounded-lg p-6">
              <div className="flex items-start">
                <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold mb-2">
                    {t("faqQuestion3") || "When and how do I get paid?"}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {t("faqAnswer3") || "Payments are processed every 14 days for all confirmed deliveries. The money is transferred directly to your registered bank account after deducting the applicable fees."}
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-mediumBlue border border-gray-700 rounded-lg p-6">
              <div className="flex items-start">
                <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold mb-2">
                    {t("faqQuestion4") || "How do I handle returns and refunds?"}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {t("faqAnswer4") || "EchoShop has a standard return policy that applies to all sellers. You'll be notified of return requests through your seller dashboard and can accept or contest them according to our guidelines."}
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-mediumBlue border border-gray-700 rounded-lg p-6">
              <div className="flex items-start">
                <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold mb-2">
                    {t("faqQuestion5") || "Can I offer promotions and discounts?"}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {t("faqAnswer5") || "Yes, you can create promotions, discounts, and special offers through your seller dashboard. You can also participate in platform-wide events and campaigns for additional visibility."}
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 6 */}
            <div className="bg-mediumBlue border border-gray-700 rounded-lg p-6">
              <div className="flex items-start">
                <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold mb-2">
                    {t("faqQuestion6") || "How does the dropshipping feature work?"}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {t("faqAnswer6") || "Our dropshipping feature allows you to connect with multiple suppliers, automatically synchronize inventory, and fulfill orders without holding stock. You can set your own profit margins while we handle the supplier coordination."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <p className="text-gray-400 mb-4">
              {t("moreQuestions") || "Still have questions?"}
            </p>
            <Button variant="outline" className="border-gray-600">
              <Link href="/contact">
                {t("contactSupport") || "Contact Seller Support"}
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-darkBlue to-secondary border-gray-700 overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t("readyToStart") || "Ready to Start Selling on EchoShop?"}
                </h2>
                <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
                  {t("readyToStartDescription") || "Join our growing community of successful sellers and take your business to the next level."}
                </p>
                <Button className="bg-primary text-black hover:bg-lime-500 h-14 px-10 text-base" asChild>
                  <Link href="/seller/register">
                    {t("becomeSellerNow") || "Become a Seller Now"}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}