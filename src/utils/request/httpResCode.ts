const HTTP_RES_CODE = {
  SUCCESS_CODE: 0, // xiao-potato api response success code
  ERROR_40000: 40000, // Request parameter error
  ERROR_40001: 40001, // Request data null
  ERROR_40101: 40101, // "Token has been invalidated." "not authenticated"
  ERROR_50000: 50000, // System error
  SUCCESS: 200,
  FAIL: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};
export default HTTP_RES_CODE;
