class ErrorResponse extends Error {
  constructor(message, statusCode) {
    // Call the error class constructor
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
