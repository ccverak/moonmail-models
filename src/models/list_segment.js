import Joi from 'joi';
import { Model } from './model';

const conditionTypes = {
  subscriptionOrigin: 'subscriptionOrigin',
  subscriptionDate: 'subscriptionDate'
};

class ListSegment extends Model {

  static get tableName() {
    return process.env.LIST_SEGMENTS_TABLE;
  }

  static get hashKey() {
    return 'listId';
  }

  static get rangeKey() {
    return 'id';
  }

  static get schema() {
    return Joi.object({
      listId: Joi.string().required(),
      id: Joi.string().required(),
      userId: Joi.string().required(),
      name: Joi.string().required(),
      conditionMatch: Joi.string().required(),
      conditions: Joi.array().items(Joi.object().keys({
        conditionType: Joi.string().required(),
        condition: Joi.object().keys({
          op: Joi.string().required(),
          field: Joi.string().required(),
          value: Joi.any().required()
        })
      })).min(1)
    });
  }

  static save(item) {
    if (this.isValid(item)) return super.save(item);
    return Promise.reject(new Error('ListSegment is not valid'));
  }
}

module.exports.ListSegment = ListSegment;
