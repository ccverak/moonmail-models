import { Model } from './model';

class Automation extends Model {
  static get tableName() {
    return process.env.AUTOMATIONS_TABLE;
  }

  static get footprintStatusIndex() {
    return process.env.FOOTPRINT_STATUS_INDEX_NAME;
  }

  static get serieIndex() {
    return process.env.SERIE_INDEX_NAME;
  }

  static get hashKey() {
    return 'userId';
  }

  static get rangeKey() {
    return 'id';
  }

  static allByStatusAndFootprint(status, footprint) {
    const options = {
      indexName: this.footprintStatusIndex,
      range: {eq: {footprint}}
    };
    return this.allBy('status', status, options);
  }
}

module.exports.Automation = Automation;
