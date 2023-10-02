const chai = require('chai');
const sinon = require('sinon');
const Toolbox = require('../../services/toolbox');
const MockAdapter = require('axios-mock-adapter');
const HttpClient = require('../../utils/httpClient');

const { expect } = chai;

describe('Toolbox service', function () {
  let mock;
  let httpClient;
  let requestConfig;


  beforeEach(() => {
    httpClient = new HttpClient('http://test-toolbox-url.com', 'Toolbox');
    mock = new MockAdapter(httpClient.instance);
    sinon.stub(Toolbox, 'instance').get(() => httpClient.instance);
  });

  afterEach(() => {
    mock.reset();
    sinon.restore();
  });

  it('Should fetch secret files with correct headers', async function () {
    const mockResponse = {
      files: [
        'test1.csv',
        'test2.csv',
        'test3.csv',
        'test18.csv',
        'test4.csv',
        'test5.csv',
        'test6.csv',
        'test9.csv'
      ]
    };
    mock.onGet('/v1/secret/files').reply((config) => {
      requestConfig = config;
      return [200, mockResponse];
    }); const response = await Toolbox.getSecretfiles();

    expect(requestConfig.headers['Content-Type']).to.equal('application/json');
    expect(requestConfig.headers['Authorization']).to.equal('Bearer aSuperSecretKey'); // 
    expect(response).to.deep.equal(mockResponse);
  });

  it('Should fetch specific secret file with correct headers', async function () {
    const mockResponse = `file,text,number,hex\nfile1.csv,pus,0\nfile1.csv,lodbAOLgBPXrxlPQfcYGsLYP,82874921,04b6c17188b90c012993c8c85fe4bf6c`;
    mock.onGet('/v1/secret/file/file1.csv').reply((config) => {
      requestConfig = config;
      return [200, mockResponse];
    }); const response = await Toolbox.getFile('file1.csv');
    expect(requestConfig.headers['Content-Type']).to.equal('application/json');
    expect(requestConfig.headers['Authorization']).to.equal('Bearer aSuperSecretKey'); // 
    expect(response).to.deep.equal(mockResponse);
  });
});
