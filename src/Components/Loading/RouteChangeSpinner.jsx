
import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../../../public/RouteLoading.json'; 
const RouteChangeSpinner = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      zIndex: 9999
    }}>
      <div style={{ width: 200, height: 200 }}>
        <Lottie animationData={animationData} loop={true} />
      </div>
    </div>
  );
};

export default RouteChangeSpinner;