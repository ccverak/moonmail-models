import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import 'sinon-as-promised';
import moment from 'moment';
import sinonChai from 'sinon-chai';
import { Automation } from '../src/models/automation';

const expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('Automation', () => {
  const tableName = 'automations-table';
  const footprintStatusIndexName = 'footprint-status-index';
  const serieIndexName = 'serie-index';
  const automationId = 'automationId';
  const userId = 'thatUserId';
  let tNameStub;
  const automationHashKey = 'userId';
  const automationRangeKey = 'id';

  before(() => {
    sinon.stub(Automation, '_client').resolves({Items: []});
    tNameStub = sinon.stub(Automation, 'tableName', { get: () => tableName});
    tNameStub = sinon.stub(Automation, 'footprintStatusIndex', { get: () => footprintStatusIndexName});
    tNameStub = sinon.stub(Automation, 'serieIndex', { get: () => serieIndexName});
  });

  describe('#get', () => {
    it('calls the DynamoDB get method with correct params', done => {
      Automation.get(userId, automationId).then(() => {
        const args = Automation._client.lastCall.args;
        expect(args[0]).to.equal('get');
        expect(args[1]).to.have.deep.property(`Key.${automationHashKey}`, userId);
        expect(args[1]).to.have.deep.property(`Key.${automationRangeKey}`, automationId);
        expect(args[1]).to.have.property('TableName', tableName);
        done();
      });
    });
  });

  describe('#allByStatusAndFootprint', () => {
    const stubResult = 'some-result';

    before(() => {
      sinon.stub(Automation, 'allBy').resolves(stubResult);
    });
    after(() => {
      Automation.allBy.restore();
    });

    it('calls the DynamoDB get method with correct params', (done) => {
      const footprint = 'whatever';
      const status = 'active';
      Automation.allByStatusAndFootprint(status, footprint).then(result => {
        const expectedOptions = {range: {eq: {footprint}}, indexName: Automation.footprintStatusIndex};
        expect(Automation.allBy).to.have.been.calledWithExactly('status', status, expectedOptions);
        expect(result).to.equal(stubResult);
        done();
      }).catch(done);
    });
  });

  describe('#hashKey', () => {
    it('returns the hash key name', () => {
      expect(Automation.hashKey).to.equal(automationHashKey);
    });
  });

  describe('#rangeKey', () => {
    it('returns the range key name', () => {
      expect(Automation.rangeKey).to.equal(automationRangeKey);
    });
  });

  after(() => {
    Automation._client.restore();
    tNameStub.restore();
  });
});
