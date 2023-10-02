const httpClient = require('../utils/httpClient');
const { TOOLBOX_API_TOKEN, TOOLBOX_API_URL } = require('../utils/constants');


class Toolbox extends httpClient {
  constructor(url, token) {
    super(url, "Toolbox");
    this.token = token;
  }

  getSecretfiles = async () => {
    return this.instance.get('/v1/secret/files', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
    });
  }

  getFile = async (filename) => {
    return this.instance.get(`/v1/secret/file/${filename}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
    });
  }
}

module.exports = new Toolbox(
  TOOLBOX_API_URL,
  TOOLBOX_API_TOKEN
);
