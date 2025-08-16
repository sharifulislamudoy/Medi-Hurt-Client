import { useState } from 'react';
import { FaHeartbeat, FaShieldAlt, FaTruck, FaHeadset, FaPills, FaArrowRight, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import useScrollToTop from '../Components/Hooks/useScrollToTop';

const About = () => {
  useScrollToTop();
  const [activeTab, setActiveTab] = useState('mission');
  const [hoveredTab, setHoveredTab] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'mission', label: 'Our Mission' },
    { id: 'values', label: 'Core Values' },
    { id: 'team', label: 'Our Team' },
    { id: 'story', label: 'Our Story' }
  ];

  const teamMembers = [
    { name: 'Dr. Sarah Johnson', role: 'Chief Pharmacist', color: 'from-blue-100 to-blue-50' },
    { name: 'Michael Chen', role: 'Operations Head', color: 'from-purple-100 to-purple-50' },
    { name: 'Priya Patel', role: 'Customer Care', color: 'from-teal-100 to-teal-50' }
  ];

  const milestones = [
    { year: '2020', event: 'Launched with 10 local pharmacies' },
    { year: '2021', event: 'Expanded to 5 major cities' },
    { year: '2022', event: 'Reached 1 million happy customers' },
    { year: '2023', event: 'Nationwide coverage with 24/7 support' }
  ];

  return (
    <section className="py-12 mx-auto w-11/12 bg-gradient-to-br from-teal-50 to-white">
      <div className="container max-w-7xl">
        {/* Mobile Menu Button - Only visible on small screens */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-teal-900">
            About <span className="text-teal-600">MediHurt</span>
          </h2>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-teal-100 text-teal-700"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation - Hidden on mobile unless menu is open */}
          <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block md:w-1/4`}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="md:sticky md:top-24"
            >
              <h2 className="hidden md:block text-3xl font-bold text-teal-900 mb-6">
                About <span className="text-teal-600">MediHurt.</span>
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
                    className={`relative w-full text-left px-4 py-3 rounded-lg transition-all duration-300 mb-2 last:mb-0 ${
                      activeTab === tab.id 
                        ? 'bg-gradient-to-r from-teal-100 to-teal-50 text-teal-700 font-semibold' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
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
                {activeTab === 'mission' && (
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-teal-900 mb-6 relative pb-2">
                      Our Mission
                      <span className="absolute bottom-0 left-0 w-16 h-1 bg-teal-500 rounded-full"></span>
                    </h3>
                    <p className="text-gray-700 mb-6 text-base md:text-lg leading-relaxed">
                      At MediCare+, we're dedicated to making healthcare accessible, affordable, and convenient for everyone. 
                      Our mission is to deliver quality medicines and healthcare products to your doorstep with care and professionalism.
                    </p>
                    <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                      <FaHeartbeat className="text-teal-600 text-4xl mb-4 md:mb-0 md:mr-6 flex-shrink-0" />
                      <p className="text-gray-800 text-base md:text-lg italic">
                        "Health is a right, not a privilege. We're here to ensure you get what you need, when you need it."
                      </p>
                    </div>
                  </div>
                )}
                
                {activeTab === 'values' && (
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-teal-900 mb-6 relative pb-2">
                      Our Core Values
                      <span className="absolute bottom-0 left-0 w-16 h-1 bg-teal-500 rounded-full"></span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {[
                        { icon: <FaShieldAlt className="text-teal-600 text-3xl mb-4" />, 
                          title: "Trust & Safety", 
                          desc: "100% genuine medicines from licensed pharmacies" },
                        { icon: <FaTruck className="text-teal-600 text-3xl mb-4" />, 
                          title: "Fast Delivery", 
                          desc: "Same-day delivery for urgent needs" },
                        { icon: <FaHeadset className="text-teal-600 text-3xl mb-4" />, 
                          title: "24/7 Support", 
                          desc: "Pharmacists available round the clock" },
                        { icon: <FaPills className="text-teal-600 text-3xl mb-4" />, 
                          title: "Affordable Care", 
                          desc: "Competitive prices and discounts" },
                      ].map((item, index) => (
                        <motion.div 
                          key={index}
                          whileHover={{ y: -5 }}
                          className="bg-gradient-to-br from-white to-blue-50 p-4 md:p-6 rounded-xl border border-gray-200 hover:border-teal-300 transition-all"
                        >
                          {item.icon}
                          <h4 className="font-bold text-lg md:text-xl text-teal-900 mb-2 md:mb-3">{item.title}</h4>
                          <p className="text-gray-700 text-sm md:text-base">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'team' && (
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-teal-900 mb-6 relative pb-2">
                      Meet Our Team
                      <span className="absolute bottom-0 left-0 w-16 h-1 bg-teal-500 rounded-full"></span>
                    </h3>
                    <p className="text-gray-700 mb-6 text-base md:text-lg leading-relaxed">
                      Our team consists of licensed pharmacists, healthcare professionals, and technology experts working together 
                      to revolutionize how you access medicines.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                      {teamMembers.map((member, index) => (
                        <motion.div 
                          key={index}
                          whileHover={{ scale: 1.03 }}
                          className="text-center"
                        >
                          <div className={`h-32 w-32 md:h-48 md:w-48 mx-auto rounded-full mb-4 md:mb-6 bg-gradient-to-br ${member.color} shadow-md flex items-center justify-center text-4xl md:text-6xl font-bold text-gray-400`}>
                            {member.name.charAt(0)}
                          </div>
                          <h4 className="font-bold text-lg md:text-xl text-teal-900">{member.name}</h4>
                          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">{member.role}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'story' && (
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-teal-900 mb-6 relative pb-2">
                      Our Story
                      <span className="absolute bottom-0 left-0 w-16 h-1 bg-teal-500 rounded-full"></span>
                    </h3>
                    <p className="text-gray-700 mb-6 text-base md:text-lg leading-relaxed">
                      Founded in 2020 during the pandemic, MediCare+ started with a simple goal: to help people get their medicines 
                      without leaving home. What began as a small local service has now grown into a trusted nationwide platform 
                      serving thousands of customers daily.
                    </p>
                    <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl p-6 md:p-8 border border-teal-200">
                      <h4 className="font-bold text-lg md:text-xl text-teal-900 mb-4 md:mb-6">Our Milestones</h4>
                      <div className="space-y-4 md:space-y-6 relative">
                        <div className="absolute left-4 md:left-5 top-0 h-full w-0.5 bg-teal-200"></div>
                        {milestones.map((milestone, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start relative"
                          >
                            <div className="bg-teal-600 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center mr-4 md:mr-5 mt-1 flex-shrink-0 z-10">
                              {index + 1}
                            </div>
                            <div>
                              <div className="text-teal-900 font-semibold text-sm md:text-base">{milestone.year}</div>
                              <div className="text-gray-700 text-sm md:text-base">{milestone.event}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;