import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import ErrorPage from './Error';

/**
 * Error Boundary Component for React Router
 * Automatically handles routing errors and displays appropriate error pages
 * This component should be used with React Router's errorElement prop
 */
const RouteErrorBoundary = () => {
  const error = useRouteError();

  // Determine error type and status
  let status = '500';
  let title = 'Something went wrong';
  let message = 'An unexpected error occurred. Please try again later.';

  if (isRouteErrorResponse(error)) {
    // Handle HTTP response errors (404, 403, 500, etc.)
    status = error.status.toString();
    
    switch (error.status) {
      case 404:
        title = 'Page Not Found';
        message = 'The page you are looking for does not exist or has been moved.';
        break;
      case 403:
        title = 'Access Denied';
        message = 'You do not have permission to access this page.';
        break;
      case 401:
        title = 'Unauthorized';
        message = 'Please log in to access this page.';
        break;
      case 500:
        title = 'Server Error';
        message = 'The server encountered an error. Please try again later.';
        break;
      case 503:
        title = 'Service Unavailable';
        message = 'The service is temporarily unavailable. Please try again later.';
        break;
      default:
        title = `Error ${error.status}`;
        message = error.statusText || 'An error occurred while processing your request.';
    }
  } else if (error instanceof Error) {
    // Handle JavaScript errors
    console.error('Route Error:', error);
    
    if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
      status = 'offline';
      title = 'Connection Error';
      message = 'Unable to connect to the server. Please check your internet connection.';
    } else {
      status = '500';
      title = 'Application Error';
      message = 'An unexpected error occurred in the application.';
    }
  } else {
    // Handle unknown error types
    console.error('Unknown Error:', error);
    status = '500';
    title = 'Unknown Error';
    message = 'An unexpected error occurred. Please try again.';
  }

  return <ErrorPage status={status} title={title} message={message} />;
};

export default RouteErrorBoundary;