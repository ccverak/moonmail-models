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

  static get conditionTypes() {
    return conditionTypes;
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
      conditionType: Joi.string().default('filter'),
      condition: Joi.object().keys({
        queryType: Joi.string().required(),
        fieldToQuery: Joi.string().required(),
        searchTerm: Joi.any().required()
      })
    })).min(1);
  }

  static save(item) {
    if (this.isValid(item, { allowUnknown: true })) return super.save(item);
    return Promise.reject(new Error('ListSegment is not valid, you miss required attributes'));
  }

  static update(params, hash, range) {
    if (params.conditions) {
      return this.validateConditions(params.conditions)
        .then(() => super.update(params, hash, range));
    }
  }

  static validConditions(conditions) {
    return this._validateSchema(this.conditionsSchema, conditions);
  }

  static validateConditions(conditions) {
    return this.validConditions(conditions) ? Promise.resolve(conditions) : Promise.reject("List segment's conditions are invalid");
  }
}

module.exports.ListSegment = ListSegment;
