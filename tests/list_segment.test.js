import * as chai from 'chai';
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
import * as sinon from 'sinon';
import * as sinonAsPromised from 'sinon-as-promised';
import { ListSegment } from '../src/models/list_segment';

chai.use(chaiAsPromised);

describe('ListSegment', () => {
  const tableName = 'list_segments-table';
  const hashKey = 'listId';
  const rangeKey = 'id';
  let tNameStub;

  before(() => {
    sinon.stub(ListSegment, '_client').resolves(true);
    tNameStub = sinon.stub(ListSegment, 'tableName', { get: () => tableName });
  });

  describe('#hashKey', () => {
    it('returns the hash key name', () => {
      expect(ListSegment.hashKey).to.equal(hashKey);
    });
  });

  describe('#rangeKey', () => {
    it('returns the range key name', () => {
      expect(ListSegment.rangeKey).to.equal(rangeKey);
    });
  });

  describe('#save', () => {
    context('when the item is not valid', () => {
      it('rejects and returns', (done) => {
        ListSegment.save({ listId: '1', id: '2' }).catch(() => {
          expect(ListSegment._client).not.to.have.been.called;
          done();
        });
      });
    });
    context('when the item is valid', () => {
      it('saves it', (done) => {
        ListSegment.save({
          listId: '1',
          id: '2',
          name: 'some-name',
          userId: 'user-id',
          conditionMatch: 'any',
          conditions: [
            {
              conditionType: 'subscription-origin', condition: {
                type: 'range',
                field: 'age',
                data: { gte: 29, lt: 50 }
              }
            }
          ]
        }).then(() => {
          expect(ListSegment._client).to.have.been.called;
          done();
        });
      });
    });
  });

  after(() => {
    ListSegment._client.restore();
    tNameStub.restore();
  });
});
