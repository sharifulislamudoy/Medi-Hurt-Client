import { FaShieldAlt, FaClock, FaMedal, FaUserMd, FaPills, FaShippingFast } from 'react-icons/fa';
import { motion } from 'framer-motion';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaShieldAlt className="text-4xl mb-4" />,
      title: "100% Genuine Medicines",
      description: "All our medicines are sourced directly from licensed manufacturers and verified pharmacies.",
      color: "from-blue-100 to-blue-50",
      delay: 0.1,
    },
    {
      icon: <FaClock className="text-4xl mb-4" />,
      title: "24/7 Availability",
      description: "Our services are available round the clock because health emergencies don't keep office hours.",
      color: "from-purple-100 to-purple-50",
      delay: 0.2,
    },
    {
      icon: <FaMedal className="text-4xl mb-4" />,
      title: "Quality Guaranteed",
      description: "We maintain strict quality control measures at every step of our supply chain.",
      color: "from-amber-100 to-amber-50",
      delay: 0.3,
    },
    {
      icon: <FaUserMd className="text-4xl mb-4" />,
      title: "Expert Pharmacists",
      description: "Consult with our licensed pharmacists for any medication-related questions.",
      color: "from-teal-100 to-teal-50",
      delay: 0.4,
    },
    {
      icon: <FaPills className="text-4xl mb-4" />,
      title: "Wide Product Range",
      description: "From common OTC drugs to specialized medications, we've got you covered.",
      color: "from-green-100 to-green-50",
      delay: 0.5,
    },
    {
      icon: <FaShippingFast className="text-4xl mb-4" />,
      title: "Fast Delivery",
      description: "Get your medicines delivered within 2-4 hours in metro areas.",
      color: "from-red-100 to-red-50",
      delay: 0.6,
    },
  ];

  return (
    <section className=" w-11/12 mx-auto  my-20 py-10 bg-gradient-to-br from-white to-teal-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 data-aos="fade-up" className="text-3xl lg:text-5xl md:text-4xl font-bold text-teal-900 mb-4">
            Why Choose <span className="text-teal-600">MediHurt?</span>
          </h2>
          <div data-aos="fade-right" className="w-24 h-1 bg-teal-600 mx-auto rounded-full mb-8"></div>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg">
            We're revolutionizing healthcare delivery with our patient-first approach and cutting-edge solutions.
          </p>
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: feature.delay }}
              whileHover={{ y: -10 }}
              className={`bg-gradient-to-br ${feature.color} p-8 rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100`}
            >
              <div className="text-teal-600 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-center text-teal-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-700 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-8 text-white shadow-lg"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500K+</div>
              <div className="text-teal-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">64</div>
              <div className="text-teal-100">Districts Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-teal-100">Service Availability</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-teal-100">Satisfaction Rate</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
