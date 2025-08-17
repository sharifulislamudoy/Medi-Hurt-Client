import { motion } from 'framer-motion';
import { FaArrowRight, FaPhoneAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const Banner = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-r from-teal-600 to-teal-800 text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-teal-400"></div>
        <div className="absolute bottom-10 right-20 w-48 h-48 rounded-full bg-teal-300"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-teal-200"></div>
      </div>
      
      <div className="container w-11/12 mx-auto px-4 py-10 md:py-10 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          {/* Text content */}
          <div className="md:w-1/2 mb-10 md:mb-0">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              Your Trusted <span className="text-teal-200">Pharmacy</span> Partner
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl mb-8 text-teal-100 max-w-lg"
            >
              Quality healthcare delivered to your doorstep with care and professionalism.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button className="bg-white text-teal-700 hover:bg-teal-50 px-6 py-3 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl">
                Explore Services <FaArrowRight className="ml-2" />
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-teal-700 px-6 py-3 rounded-lg font-semibold flex items-center justify-center transition-all duration-300">
                Contact Us
              </button>
            </motion.div>
          </div>
          
          {/* Stats/info cards */}
          <div className="md:w-1/2 md:pl-10">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {/* Card 1 */}
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:border-teal-300 transition-all">
                <div className="flex items-center mb-4">
                  <div className="bg-teal-500 p-3 rounded-full mr-4">
                    <FaPhoneAlt className="text-white" />
                  </div>
                  <h3 className="font-bold text-xl">24/7 Support</h3>
                </div>
                <p className="text-teal-100">Pharmacists available round the clock for your needs</p>
              </div>
              
              {/* Card 2 */}
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:border-teal-300 transition-all">
                <div className="flex items-center mb-4">
                  <div className="bg-teal-500 p-3 rounded-full mr-4">
                    <FaMapMarkerAlt className="text-white" />
                  </div>
                  <h3 className="font-bold text-xl">Nationwide</h3>
                </div>
                <p className="text-teal-100">Serving customers across the country</p>
              </div>
              
              {/* Card 3 */}
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:border-teal-300 transition-all">
                <div className="flex items-center mb-4">
                  <div className="bg-teal-500 p-3 rounded-full mr-4">
                    <FaClock className="text-white" />
                  </div>
                  <h3 className="font-bold text-xl">Fast Delivery</h3>
                </div>
                <p className="text-teal-100">Same-day delivery for urgent prescriptions</p>
              </div>
              
              {/* Card 4 */}
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:border-teal-300 transition-all">
                <div className="text-teal-200 mb-2 font-semibold">Trusted by</div>
                <h3 className="font-bold text-3xl text-white">1M+ Customers</h3>
                <p className="text-teal-100 mt-2">and counting</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Animated wave effect at bottom */}
      {/* <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-16 md:h-24"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            className="fill-current text-teal-700"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
            className="fill-current text-teal-600"
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            className="fill-current text-teal-500"
          ></path>
        </svg>
      </div> */}
    </section>
  );
};

export default Banner;