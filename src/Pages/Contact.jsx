import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import useScrollToTop from '../Components/Hooks/useScrollToTop';

const Contact = () => {
    useScrollToTop();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      // Hide success message after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 1500);
  };

  const contactMethods = [
    {
      icon: <FaPhone className="text-teal-600 text-2xl" />,
      title: "Call Us",
      info: "+1 (555) 123-4567",
      description: "24/7 customer support"
    },
    {
      icon: <FaEnvelope className="text-teal-600 text-2xl" />,
      title: "Email Us",
      info: "support@medihurt.com",
      description: "Response within 24 hours"
    },
    {
      icon: <FaMapMarkerAlt className="text-teal-600 text-2xl" />,
      title: "Visit Us",
      info: "123 Health St, Medical City",
      description: "Open Mon-Fri: 9AM-5PM"
    }
  ];

  return (
    <section className="py-20 mx-auto w-11/12 bg-gradient-to-br from-white to-teal-50" id="contact">
      <div className="container max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-teal-900 mb-4">
            Contact <span className="text-teal-600">MediHurt.</span>
          </h2>
          <div className="w-24 h-1 bg-teal-600 mx-auto rounded-full mb-8"></div>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg">
            Have questions or need assistance? Reach out to our friendly team - we're here to help with all your healthcare needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            {contactMethods.map((method, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="flex items-start bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="bg-teal-100 p-3 rounded-full mr-6">
                  {method.icon}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-teal-900 mb-2">{method.title}</h3>
                  <p className="text-gray-800 font-medium">{method.info}</p>
                  <p className="text-gray-600 mt-1">{method.description}</p>
                </div>
              </motion.div>
            ))}

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-200 overflow-hidden"
            >
              <Link to={'/coverage-area'} className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                <FaMapMarkerAlt className="text-teal-600 text-4xl" />
                <p className="ml-2 text-gray-700">Interactive Map Here</p>
              </Link>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-teal-900 mb-6 relative pb-2">
              Send Us a Message
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-teal-500 rounded-full"></span>
            </h3>
            
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-teal-100 border border-teal-200 text-teal-800 p-6 rounded-lg text-center"
              >
                <div className="flex justify-center mb-3">
                  <FaCheck className="text-teal-600 text-4xl" />
                </div>
                <h4 className="font-bold text-xl mb-2">Message Sent Successfully!</h4>
                <p>We'll get back to you within 24 hours. Thank you for contacting MediHurt.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${isLoading ? 'bg-teal-400' : 'bg-teal-600 hover:bg-teal-700'}`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <FaPaperPlane className="mr-2" />
                        Send Message
                      </span>
                    )}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;