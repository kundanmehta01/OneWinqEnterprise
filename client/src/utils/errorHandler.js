export const getErrorMessage = (error, defaultMsg = 'An unexpected error occurred') => {
  if (!error) return defaultMsg;
  if (typeof error === 'string') return error;
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data?.error?.message) return error.response.data.error.message;
  if (error.message) return error.message;
  return defaultMsg;
};
