/**
 * Cause of difficulty mocking facebook-token-strategy
 * I decided to test only Auth.socialLogin method
 */
const responseMock = {
  statusCode: 500,
  body: {},
  headers: {},

  status: function (code = this.statusCode) {
    this.statusCode = code;
    return this;
  },

  json: function (objToStringify) {
    this.body = objToStringify;
    this.headers['content-type'] = 'application/json';
    return this;
  }
};

module.exports = responseMock;