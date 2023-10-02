const sinon = require('sinon');
const { expect } = require('chai');
const HttpClient = require('../../utils/httpClient');
const MockAdapter = require('axios-mock-adapter');

describe('HttpClient', () => {
  let httpClient;
  let mock;

  beforeEach(() => {
    httpClient = new HttpClient('http://test-base-url.com', 'TestService');
    mock = new MockAdapter(httpClient.instance);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should initialize with given baseURL and serviceName', () => {
    expect(httpClient.instance.defaults.baseURL).to.equal('http://test-base-url.com');
    expect(httpClient.serviceName).to.equal('TestService');
  });

  it('should handle successful response', async () => {
    mock.onGet('/test-endpoint').reply(200, { data: 'test' });

    const response = await httpClient.instance.get('/test-endpoint');
    expect(response).to.deep.equal({ data: 'test' });
  });

  it('should handle error response', async () => {
    mock.onGet('/test-endpoint').reply(500, { error: 'test-error' });

    const consoleErrorStub = sinon.stub(console, 'error');

    try {
      await httpClient.instance.get('/test-endpoint');
    } catch (error) {
      expect(consoleErrorStub.calledOnce).to.be.true;
      expect(error.response.data).to.deep.equal({ error: 'test-error' });
    }

    consoleErrorStub.restore();
  });

  it('should reset baseURL', () => {
    httpClient.resetUrlInstance('http://new-test-url.com');
    expect(httpClient.instance.defaults.baseURL).to.equal('http://new-test-url.com');
  });
});
