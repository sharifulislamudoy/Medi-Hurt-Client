import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaShippingFast, FaPills, FaUserShield, FaCreditCard, FaExchangeAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import useScrollToTop from '../Components/Hooks/useScrollToTop';
import { Link } from 'react-router';

const FAQ = () => {
  useScrollToTop();
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How quickly can I get my medications delivered?",
      answer: "We offer same-day delivery in metro areas (within 2-4 hours) and next-day delivery for other locations. Delivery times may vary based on your location and medication availability.",
      icon: <FaShippingFast className="text-teal-600 mr-4 text-xl" />
    },
    {
      question: "Are all your medicines genuine and safe?",
      answer: "Absolutely! We source medications only from licensed pharmacies and verified manufacturers. All products go through strict quality checks before dispatch.",
      icon: <FaPills className="text-teal-600 mr-4 text-xl" />
    },
    {
      question: "Do I need a prescription to order medicines?",
      answer: "For prescription medications, yes. You'll need to upload a valid prescription from a registered medical practitioner. For OTC (over-the-counter) products, no prescription is needed.",
      icon: <FaUserShield className="text-teal-600 mr-4 text-xl" />
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, mobile banking (bKash, Nagad), bank transfers, and cash on delivery (available in select areas).",
      icon: <FaCreditCard className="text-teal-600 mr-4 text-xl" />
    },
    {
      question: "What if I receive the wrong medication?",
      answer: "In the rare case of incorrect delivery, please contact us immediately. We'll arrange for a replacement and pick up the incorrect item at no extra cost.",
      icon: <FaExchangeAlt className="text-teal-600 mr-4 text-xl" />
    },
    {
      question: "Can I consult with a pharmacist before ordering?",
      answer: "Yes! Our licensed pharmacists are available 24/7 for free consultations. Use the chat feature on our app/website or call our helpline for expert advice.",
      icon: <FaUserShield className="text-teal-600 mr-4 text-xl" />
    }
  ];

  return (
    <section className="py-20 mx-auto w-11/12 bg-gradient-to-br from-teal-50 to-white" id="faq">
      <div className="container max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-teal-900 mb-4">
            Frequently Asked <span className="text-teal-600">Questions</span>
          </h2>
          <div className="w-24 h-1 bg-teal-600 mx-auto rounded-full mb-8"></div>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg">
            Find quick answers to common queries about our services, deliveries, and medications.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="mb-4"
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
                >
                  <div className="flex items-center">
                    {faq.icon}
                    <h3 className="font-semibold text-lg text-gray-800">{faq.question}</h3>
                  </div>
                  {activeIndex === index ? (
                    <FaChevronUp className="text-teal-600" />
                  ) : (
                    <FaChevronDown className="text-teal-600" />
                  )}
                </button>

                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-0 text-gray-700">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-700 mb-6">
            Still have questions? Our support team is ready to help.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all"
          >
            <Link to={'/contact'}>
              Contact Support
            </Link>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;