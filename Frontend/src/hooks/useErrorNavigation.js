import { useNavigate } from 'react-router-dom';

/**
 * Custom hook for error page navigation
 * Provides convenient methods to navigate to different error pages
 */
export const useErrorNavigation = () => {
  const navigate = useNavigate();

  /**
   * Navigate to 404 error page
   * @param {string} message - Custom error message (optional)
   */
  const goTo404 = (message) => {
    navigate('/error', { 
      state: { 
        status: '404', 
        title: 'Page Not Found', 
        message: message || 'The page you are looking for does not exist or has been moved.' 
      } 
    });
  };

  /**
   * Navigate to 403 error page (Access Denied)
   * @param {string} message - Custom error message (optional)
   */
  const goTo403 = (message) => {
    navigate('/error', { 
      state: { 
        status: '403', 
        title: 'Access Denied', 
        message: message || 'You do not have permission to access this page.' 
      } 
    });
  };

  /**
   * Navigate to 500 error page (Server Error)
   * @param {string} message - Custom error message (optional)
   */
  const goTo500 = (message) => {
    navigate('/error', { 
      state: { 
        status: '500', 
        title: 'Server Error', 
        message: message || 'The server encountered an error. Please try again later.' 
      } 
    });
  };

  /**
   * Navigate to offline error page
   * @param {string} message - Custom error message (optional)
   */
  const goToOffline = (message) => {
    navigate('/error', { 
      state: { 
        status: 'offline', 
        title: 'Connection Error', 
        message: message || 'Unable to connect to the server. Please check your internet connection.' 
      } 
    });
  };

  /**
   * Navigate to custom error page
   * @param {string} status - Error status code
   * @param {string} title - Error title
   * @param {string} message - Error message
   */
  const goToError = (status, title, message) => {
    navigate('/error', { 
      state: { status, title, message } 
    });
  };

  return {
    goTo404,
    goTo403,
    goTo500,
    goToOffline,
    goToError,
  };
};

export default useErrorNavigation;