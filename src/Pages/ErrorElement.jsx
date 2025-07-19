import { useEffect, useState } from 'react';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import errorAnimation from '../../public/404 Error Page Animation With Sky.json'; 

const ErrorElement = ({ 
  errorMessage = "Something went wrong",
  showRetry = true,
  showHome = true,
  onRetry,
  compact = false
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Customize your Lottie animation path
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: errorAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center justify-center ${compact ? 'py-8' : 'min-h-[60vh] py-12'} mx-auto w-11/12`}
    >
      <div className={`bg-white ${compact ? 'p-6' : 'p-8 md:p-12'} rounded-xl shadow-lg border border-red-100 max-w-2xl w-full text-center`}>
        {/* Lottie Animation */}
        <div className={`mx-auto ${compact ? 'w-32 h-32' : 'w-48 h-48 md:w-64 md:h-64'} mb-6`}>
          <Lottie 
            animationData={errorAnimation}
            loop={true}
            autoplay={true}
            className="w-full h-full"
          />
        </div>

        {/* Error Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-center text-red-500">
            <FaExclamationTriangle className={`${compact ? 'text-2xl' : 'text-3xl'} mr-3`} />
            <h2 className={`font-bold ${compact ? 'text-xl' : 'text-2xl md:text-3xl'}`}>
              {errorMessage}
            </h2>
          </div>

          {!compact && (
            <p className="text-gray-600 max-w-md mx-auto">
              We encountered an unexpected error. Please try again or contact support if the problem persists.
            </p>
          )}

          {/* Action Buttons */}
          <div className={`flex ${compact ? 'flex-col space-y-3' : 'flex-row space-x-4'} justify-center pt-4`}>
            {showRetry && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRetry}
                className={`flex items-center justify-center ${compact ? 'w-full py-2' : 'px-6 py-3'} bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors`}
              >
                <FaRedo className="mr-2" />
                Try Again
              </motion.button>
            )}

            {showHome && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/'}
                className={`flex items-center justify-center ${compact ? 'w-full py-2' : 'px-6 py-3'} bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors`}
              >
                <FaHome className="mr-2" />
                Return Home
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Support Contact (only shown in full version) */}
      {!compact && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center text-gray-600"
        >
          <p>Need immediate help? <a href="mailto:support@medihurt.com" className="text-teal-600 hover:underline">Contact our support team</a></p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ErrorElement;