import React from 'react';
import './UnAuthorized.css';
import { useNavigate } from 'react-router-dom';

const UnAuthorized = () => {
  const navigate = useNavigate()
  
  const handleGoBack = () => {
    navigate('/home')
  }

  return (
    <div className="unauthContainer">
      <h1 className="unauthErrorCode">Error: 403</h1>
      <h2 className='unauthTitle'>Access Denied</h2>
      <p className='unauthMessage'>
        You do not have the necessary permissions to view this page. Please contact your system administrator if you believe this is an error.
      </p>
      <button className='unauthMessage' onClick={handleGoBack}>
        Go To Home
      </button>
    </div>
  );
};

export default UnAuthorized;