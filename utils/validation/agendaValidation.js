/**
 * paymentValidation.js
 * @description :: validate each post and put request as per payment model
 */

const joi = require('joi');
const {
  options, isCountOnly, populate, select 
} = require('./comonFilterValidation');

/** validation keys and properties of payment */
exports.schemaKeys = joi.object({
  isDeleted: joi.boolean(),
  isActive: joi.boolean(),
  title: joi.string().allow(null).allow(''),
  date: joi.string().allow(null).allow(''),
  time: joi.string().allow(null).allow(''),
  description: joi.string().allow(null).allow(''),
  hall : joi.string().allow(null).allow(''),
  eventId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  speakerId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),

  }).unknown(true);

/** validation keys and properties of payment for updation */
exports.updateSchemaKeys = joi.object({
    isDeleted: joi.boolean(),
    isActive: joi.boolean(),
    title: joi.string().allow(null).allow(''),
    date: joi.string().allow(null).allow(''),
    time: joi.string().allow(null).allow(''),
    description: joi.string().allow(null).allow(''),
    hall : joi.string().allow(null).allow(''),
    eventId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
    speakerId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),

  _id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of payment for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
  isDeleted:joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
  isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
  title: joi.string().allow(null).allow(''),
  date: joi.string().allow(null).allow(''),
  time: joi.string().allow(null).allow(''),
  description: joi.string().allow(null).allow(''),
  hall : joi.string().allow(null).allow(''),
  eventId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  speakerId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
      id: joi.any(),
      _id: joi.alternatives().try(joi.array().items(),joi.string().regex(/^[0-9a-fA-F]{24}$/),joi.object())
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  populate: joi.array().items(populate),
  select: select
    
}).unknown(true);
