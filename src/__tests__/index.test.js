const chai = require('chai');
const sinon = require('sinon');
const request = require('supertest');
const app = require('../index');
const ToolboxService = require('../services/toolbox');
const expect = chai.expect;

describe('API Tests', () => {
  let getSecretFilesStub;
  let getFileStub;

  beforeEach(() => {
    getSecretFilesStub = sinon.stub(ToolboxService, 'getSecretfiles');
    getFileStub = sinon.stub(ToolboxService, 'getFile');
  });

  afterEach(() => {
    getSecretFilesStub.restore();
    getFileStub.restore();
  });

  describe('GET /files/data', () => {
    it('should respond with a JSON array', async () => {
      getSecretFilesStub.resolves({
        files: ['file1.csv', 'file2.csv']
      });
      getFileStub
        .onCall(0).resolves(`file,text,number,hex\nfile1.csv,pus,0\nfile1.csv,lodbAOLgBPXrxlPQfcYGsLYP,82874921,04b6c17188b90c012993c8c85fe4bf6c`)
        .onCall(1).resolves(`file,text,number,hex\nfile2.csv,pus,1\nfile2.csv,LOASDES,823234,ABCVDSE`)
      const req = await request(app)
        .get('/files/data')
      expect(req.status).to.equal(200);
      expect(req.body).to.be.an('array');
      expect(req.body.length).to.equal(2);
      expect(req.body).to.eql([
        { file: "file1.csv", lines: [{ text: "lodbAOLgBPXrxlPQfcYGsLYP", number: 82874921, hex: "04b6c17188b90c012993c8c85fe4bf6c" }] },
        { file: "file2.csv", lines: [{ text: "LOASDES", number: 823234, hex: "ABCVDSE" }] }
      ]);
    });

    it('should respond with a JSON array when filter by fileName', async () => {
      getSecretFilesStub.resolves({
        files: ['file1.csv', 'file2.csv']
      });
      getFileStub
        .onCall(0).resolves(`file,text,number,hex\nfile1.csv,pus,0\nfile1.csv,lodbAOLgBPXrxlPQfcYGsLYP,82874921,04b6c17188b90c012993c8c85fe4bf6c`)
        .onCall(1).resolves(`file,text,number,hex\nfile2.csv,pus,1\nfile2.csv,LOASDES,823234,ABCVDSE`)
      const req = await request(app)
        .get('/files/data?fileName=file1.csv')
      expect(req.status).to.equal(200);
      expect(req.body).to.be.an('array');
      expect(req.body.length).to.equal(1);
      expect(req.body).to.eql([
        { file: "file1.csv", lines: [{ text: "lodbAOLgBPXrxlPQfcYGsLYP", number: 82874921, hex: "04b6c17188b90c012993c8c85fe4bf6c" }] },
      ]);
    });

    it('should respond with a JSON array when a file fails to get Data', async () => {
      getSecretFilesStub.resolves({
        files: ['file1.csv', 'file2.csv']
      });
      getFileStub
        .onCall(0).resolves(`file,text,number,hex\nfile1.csv,pus,0\nfile1.csv,lodbAOLgBPXrxlPQfcYGsLYP,82874921,04b6c17188b90c012993c8c85fe4bf6c`)
        .onCall(1).throws({ data: 'Error get file' })
      const req = await request(app)
        .get('/files/data')
      expect(req.status).to.equal(200);
      expect(req.body).to.be.an('array');
      expect(req.body.length).to.equal(1);
      expect(req.body).to.eql([
        { file: "file1.csv", lines: [{ text: "lodbAOLgBPXrxlPQfcYGsLYP", number: 82874921, hex: "04b6c17188b90c012993c8c85fe4bf6c" }] },
      ]);
    });
  });
});
