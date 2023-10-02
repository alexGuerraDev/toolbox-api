const axios = require("axios");

class HttpClient {
  instance;
  serviceName;
  constructor(baseURL, serviceName) {
    this.instance = axios.create({
      baseURL,
    });
    this.serviceName = serviceName;
    this._initializeResponseInterceptor();
  }

  _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError
    );
  };

  resetUrlInstance = (url) => {
    this.instance.defaults.baseURL = url;
  };

  _handleResponse = ({ data }) => data;

  _handleError = (error) => {
    // aqui podemos agregar herramientas como datadog o sentry para monitorear errores
    console.error(this.serviceName, error.response?.data);
    return Promise.reject(error)
  };
}

module.exports = HttpClient;
