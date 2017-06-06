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
      archived: Joi.boolean().default(false),
      conditionMatch: Joi.string().default('all'),
      conditions: this.conditionsSchema
    });
  }

  static get conditionsSchema() {
    return Joi.array().items(Joi.object().keys({
      conditionType: Joi.string().required(),
      condition: Joi.object().keys({
        type: Joi.string().required(),
        field: Joi.string().required(),
        data: Joi.any().required()
      })
    })).min(1);
  }

  static save(item) {
    if (this.isValid(item, { allowUnknown: true })) return super.save(item);
    return Promise.reject(new Error('ListSegment is not valid, you miss required attributes'));
  }

  static update(params, hash, range) {
    if (params.conditions) {
      if (!this._validateSchema(this.conditionsSchema, params.conditions)) return Promise.reject("List segment's conditions are invalid");
    }
    return super.update(params, hash, range);
  }
}

module.exports.ListSegment = ListSegment;
