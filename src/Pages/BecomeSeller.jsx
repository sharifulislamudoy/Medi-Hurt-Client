import { useState } from 'react';
import { FaStore, FaChartLine, FaShieldAlt, FaTruck, FaHandshake, FaFileAlt, FaBars, FaTimes, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import useScrollToTop from '../Components/Hooks/useScrollToTop';

const BecomeSeller = () => {
  useScrollToTop();
  const [activeTab, setActiveTab] = useState('benefits');
  const [hoveredTab, setHoveredTab] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'benefits', label: 'Seller Benefits', icon: <FaStore /> },
    { id: 'requirements', label: 'Requirements', icon: <FaFileAlt /> },
    { id: 'process', label: 'Onboarding Process', icon: <FaHandshake /> },
    { id: 'support', label: 'Seller Support', icon: <FaShieldAlt /> }
  ];

  const benefits = [
    { icon: <FaChartLine className="text-teal-600 text-2xl" />, 
      title: "Increased Reach", 
      desc: "Access to thousands of customers on our platform" },
    { icon: <FaTruck className="text-teal-600 text-2xl" />, 
      title: "Logistics Support", 
      desc: "We handle delivery and fulfillment for you" },
    { icon: <FaShieldAlt className="text-teal-600 text-2xl" />, 
      title: "Trust & Security", 
      desc: "Secure payments and fraud protection" }
  ];

  const requirements = [
    { title: "Business License", desc: "Valid business registration documents" },
    { title: "Product Quality", desc: "All products must meet our quality standards" },
    { title: "Inventory", desc: "Minimum stock requirements must be maintained" },
    { title: "Pricing", desc: "Competitive pricing compared to market rates" }
  ];

  const processSteps = [
    { step: 1, title: "Application", desc: "Submit your seller application form" },
    { step: 2, title: "Verification", desc: "Our team will review your documents" },
    { step: 3, title: "Onboarding", desc: "Set up your seller account and inventory" },
    { step: 4, title: "Go Live!", desc: "Start selling on our platform" }
  ];

  return (
    <section className="py-12 mx-auto w-11/12 bg-gradient-to-br from-teal-50 to-white">
      <div className="container max-w-7xl">
        {/* Mobile Menu Button */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-teal-900">
            Become a <span className="text-teal-600">Seller</span>
          </h2>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-teal-100 text-teal-700"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block md:w-1/4`}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="md:sticky md:top-24"
            >
              <h2 className="hidden md:block text-3xl font-bold text-teal-900 mb-6">
                Become a <span className="text-teal-600">Seller</span>
              </h2>
              
              <div className="bg-white rounded-xl shadow-md p-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    onMouseEnter={() => setHoveredTab(tab.id)}
                    onMouseLeave={() => setHoveredTab(null)}
                    className={`relative w-full text-left px-4 py-3 rounded-lg transition-all duration-300 mb-2 last:mb-0 flex items-center ${
                      activeTab === tab.id 
                        ? 'bg-gradient-to-r from-teal-100 to-teal-50 text-teal-700 font-semibold' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    {tab.label}
                    {hoveredTab === tab.id && activeTab !== tab.id && (
                      <motion.span 
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        initial={{ x: -5, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -5, opacity: 0 }}
                      >
                        <FaArrowRight className="text-teal-400" />
                      </motion.span>
                    )}
                  </button>
                ))}
              </div>

              {/* CTA Button */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="mt-6 hidden md:block"
              >
                <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300">
                  Apply Now
                </button>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Main Content Area */}
          <div className="w-full md:w-3/4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-6 md:p-8 h-full hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                {activeTab === 'benefits' && (
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-teal-900 mb-6 relative pb-2">
                      Why Sell With Us?
                      <span className="absolute bottom-0 left-0 w-16 h-1 bg-teal-500 rounded-full"></span>
                    </h3>
                    <p className="text-gray-700 mb-8 text-base md:text-lg leading-relaxed">
                      Join our growing marketplace of trusted sellers and take your business to the next level. 
                      We provide all the tools and support you need to succeed in the e-commerce space.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {benefits.map((benefit, index) => (
                        <motion.div 
                          key={index}
                          whileHover={{ y: -5 }}
                          className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl border border-gray-200 hover:border-teal-300 transition-all"
                        >
                          <div className="flex items-center mb-4">
                            {benefit.icon}
                            <h4 className="font-bold text-xl text-teal-900 ml-3">{benefit.title}</h4>
                          </div>
                          <p className="text-gray-700">{benefit.desc}</p>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                      <h4 className="font-bold text-xl text-teal-900 mb-3">Seller Success Stories</h4>
                      <p className="text-gray-800 mb-4 italic">
                        "Since joining MediHurt, our sales have increased by 300% in just 6 months. 
                        The platform's reach and support have been incredible for our small pharmacy."
                      </p>
                      <p className="text-gray-700">- Rajesh Kumar, CityMed Pharmacy</p>
                    </div>
                  </div>
                )}
                
                {activeTab === 'requirements' && (
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-teal-900 mb-6 relative pb-2">
                      Seller Requirements
                      <span className="absolute bottom-0 left-0 w-16 h-1 bg-teal-500 rounded-full"></span>
                    </h3>
                    <p className="text-gray-700 mb-8 text-base md:text-lg leading-relaxed">
                      To maintain quality standards and ensure the best experience for our customers, 
                      we require all sellers to meet these basic requirements:
                    </p>
                    
                    <div className="space-y-4 mb-8">
                      {requirements.map((req, index) => (
                        <motion.div 
                          key={index}
                          whileHover={{ x: 5 }}
                          className="flex items-start bg-white p-4 rounded-lg border border-gray-200"
                        >
                          <div className="bg-teal-100 text-teal-800 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-teal-900">{req.title}</h4>
                            <p className="text-gray-700">{req.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-r from-teal-50 to-white rounded-xl p-6 border border-teal-200">
                      <h4 className="font-bold text-xl text-teal-900 mb-3">Document Checklist</h4>
                      <ul className="list-disc pl-5 text-gray-700 space-y-2">
                        <li>Business registration certificate</li>
                        <li>Tax identification documents</li>
                        <li>Product catalog with pricing</li>
                        <li>Bank account details for payments</li>
                      </ul>
                    </div>
                  </div>
                )}
                
                {activeTab === 'process' && (
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-teal-900 mb-6 relative pb-2">
                      Onboarding Process
                      <span className="absolute bottom-0 left-0 w-16 h-1 bg-teal-500 rounded-full"></span>
                    </h3>
                    <p className="text-gray-700 mb-8 text-base md:text-lg leading-relaxed">
                      Getting started as a seller is quick and easy. Our streamlined process 
                      helps you go from application to first sale in as little as 3 business days.
                    </p>
                    
                    <div className="space-y-6 relative mb-8">
                      <div className="absolute left-5 top-0 h-full w-0.5 bg-teal-200"></div>
                      {processSteps.map((step, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start relative"
                        >
                          <div className="bg-teal-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-5 mt-1 flex-shrink-0 z-10">
                            {step.step}
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-gray-200 w-full">
                            <div className="text-teal-900 font-semibold text-lg">{step.title}</div>
                            <div className="text-gray-700">{step.desc}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                      <h4 className="font-bold text-xl text-teal-900 mb-3">Ready to Get Started?</h4>
                      <p className="text-gray-800 mb-4">
                        Our seller support team is available to guide you through every step of the process.
                      </p>
                      <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-300">
                        Begin Application
                      </button>
                    </div>
                  </div>
                )}
                
                {activeTab === 'support' && (
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-teal-900 mb-6 relative pb-2">
                      Seller Support
                      <span className="absolute bottom-0 left-0 w-16 h-1 bg-teal-500 rounded-full"></span>
                    </h3>
                    <p className="text-gray-700 mb-8 text-base md:text-lg leading-relaxed">
                      We're committed to your success as a seller. Our comprehensive support 
                      system ensures you have all the resources you need to grow your business.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl border border-gray-200">
                        <h4 className="font-bold text-xl text-teal-900 mb-3">Dedicated Account Manager</h4>
                        <p className="text-gray-700 mb-4">
                          Every seller gets a personal account manager to help with onboarding, 
                          optimization, and growth strategies.
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl border border-gray-200">
                        <h4 className="font-bold text-xl text-teal-900 mb-3">24/7 Seller Support</h4>
                        <p className="text-gray-700 mb-4">
                          Our support team is available round the clock to resolve any issues 
                          or answer your questions.
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl border border-gray-200">
                        <h4 className="font-bold text-xl text-teal-900 mb-3">Seller Training</h4>
                        <p className="text-gray-700 mb-4">
                          Regular webinars and training sessions to help you maximize your 
                          sales potential on our platform.
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl border border-gray-200">
                        <h4 className="font-bold text-xl text-teal-900 mb-3">Marketing Support</h4>
                        <p className="text-gray-700 mb-4">
                          Get featured in our newsletters, promotions, and social media to 
                          increase your visibility.
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-teal-50 to-white rounded-xl p-6 border border-teal-200">
                      <h4 className="font-bold text-xl text-teal-900 mb-3">Contact Seller Support</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold text-gray-800">Email:</p>
                          <p className="text-gray-700">sellers@medihurt.com</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Phone:</p>
                          <p className="text-gray-700">1-800-SELLER (735-537)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Mobile CTA Button */}
            <div className="mt-6 md:hidden">
              <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeSeller;