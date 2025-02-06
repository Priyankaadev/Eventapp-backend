/**
 * ProductController.js
 * @description : exports action methods for Product.
 */

const Feedbackresponse = require('../../../model/feedbackresponse');
const feedbackresponseSchemaKey = require('../../../utils/validation/feedbackresponseValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbServices');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../../utils/comon');
   
/**
 * @description : create document of Feedbackresponse in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Feedbackresponse. {status, message, data}
 */ 
const addFeedbackresponse = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      feedbackresponseSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Feedbackresponse(dataToCreate);
    let createdFeedbackresponse = await dbService.create(Feedbackresponse,dataToCreate);
    return res.success({ data : createdFeedbackresponse });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};

/**
 * @description : create multiple documents of Product in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Products. {status, message, data}
 */
const bulkInsertFeedbackresponse = async (req,res)=>{
    try {
      if (req.body && (!Array.isArray(req.body.data) || req.body.data.length < 1)) {
        return res.badRequest();
      }
      let dataToCreate = [ ...req.body.data ];
      for (let i = 0;i < dataToCreate.length;i++){
        dataToCreate[i] = {
          ...dataToCreate[i],
          addedBy: req.user.id
        };
      }
      let createdFeedbackresponses = await dbService.create(Feedbackresponse,dataToCreate);
      createdFeedbackresponses = { count: createdFeedbackresponses ? createdFeedbackresponses.length : 0 };
      return res.success({ data:{ count:createdFeedbackresponses.count || 0 } });
    } catch (error){
      return res.internalServerError({ message:error.message });
    }
  };


/**
 * @description : find all documents of Product from collection based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {Object} res : response contains data found from collection.
 * @return {Object} : found Product(s). {status, message, data}
 */
const findAllFeedbackresponse = async (req,res) => {
    try {
      let options = {};
      let query = {};
      let validateRequest = validation.validateFilterWithJoi(
        req.body,
        feedbackresponseSchemaKey.findFilterKeys,
        Feedbackresponse.schema.obj
      );
      if (!validateRequest.isValid) {
        return res.validationError({ message: `${validateRequest.message}` });
      }
      if (typeof req.body.query === 'object' && req.body.query !== null) {
        query = { ...req.body.query };
      }
      if (req.body.isCountOnly){
        let totalRecords = await dbService.count(Product, query);
        return res.success({ data: { totalRecords } });
      }
      if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
        options = { ...req.body.options };
      }
      let foundFeedbackresponses = await dbService.paginate( Feedbackresponse,query,options);
      if (!foundFeedbackresponses || !foundFeedbackresponses.data || !foundFeedbackresponses.data.length){
        return res.recordNotFound(); 
      }
      return res.success({ data :foundFeedbackresponses });
    } catch (error){
      return res.internalServerError({ message:error.message });
    }
  };


/**
 * @description : find document of Product from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Product. {status, message, data}
 */
const getFeedbackresponse = async (req,res) => {
    try {
      let query = {};
      if (!ObjectId.isValid(req.params.id)) {
        return res.validationError({ message : 'invalid objectId.' });
      }
      query._id = req.params.id;
      let options = {};
      let foundFeedbackresponse = await dbService.findOne(Feedbackresponse,query, options);
      if (!foundFeedbackresponse){
        return res.recordNotFound();
      }
      return res.success({ data :foundFeedbackresponse });
    }
    catch (error){
      return res.internalServerError({ message:error.message });
    }
  };


  /**
 * @description : returns total number of documents of Product.
 * @param {Object} req : request including where object to apply filters in req body 
 * @param {Object} res : response that returns total number of documents.
 * @return {Object} : number of documents. {status, message, data}
 */
const getFeedbackresponseCount = async (req,res) => {
    try {
      let where = {};
      let validateRequest = validation.validateFilterWithJoi(
        req.body,
        feedbackresponseSchemaKey.findFilterKeys,
      );
      if (!validateRequest.isValid) {
        return res.validationError({ message: `${validateRequest.message}` });
      }
      if (typeof req.body.where === 'object' && req.body.where !== null) {
        where = { ...req.body.where };
      }
      let countedFeedbackresponse = await dbService.count(Feedbackresponse,where);
      return res.success({ data : { count: countedFeedbackresponse } });
    } catch (error){
      return res.internalServerError({ message:error.message });
    }
  };

  /**
 * @description : update document of Product with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Product.
 * @return {Object} : updated Product. {status, message, data}
 */
const updateFeedbackresponse = async (req,res) => {
    try {
      let dataToUpdate = {
        ...req.body,
        updatedBy:req.user.id,
      };

    // let {name, city, date, status} = req.body;

      let validateRequest = validation.validateParamsWithJoi(
        dataToUpdate,
        feedbackresponseSchemaKey.updateSchemaKeys
      );
      if (!validateRequest.isValid) {
        return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
      }
      const query = { _id:req.params.id };
      let updatedFeedbackresponse = await dbService.updateOne(Feedbackresponse,query,dataToUpdate);
      if (!updatedFeedbackresponse){
        return res.recordNotFound();
      }
      return res.success({ data :updatedFeedbackresponse });
    } catch (error){
      return res.internalServerError({ message:error.message });
    }
  };

  /**
 * @description : update multiple records of Product with data by filter.
 * @param {Object} req : request including filter and data in request body.
 * @param {Object} res : response of updated Products.
 * @return {Object} : updated Products. {status, message, data}
 */
const bulkUpdateFeedbackresponse = async (req,res)=>{
    try {
      let filter = req.body && req.body.filter ? { ...req.body.filter } : {};
      let dataToUpdate = {};
      delete dataToUpdate['addedBy'];
      if (req.body && typeof req.body.data === 'object' && req.body.data !== null) {
        dataToUpdate = { 
          ...req.body.data,
          updatedBy : req.user.id
        };
      }
      let updatedFeedbackresponse = await dbService.updateMany(Feedbackresponse,filter,dataToUpdate);
      if (!updatedFeedbackresponse){
        return res.recordNotFound();
      }
      return res.success({ data :{ count : updatedFeedbackresponse } });
    } catch (error){
      return res.internalServerError({ message:error.message }); 
    }
  };

  /**
 * @description : deactivate document of Product from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated document of Product.
 * @return {Object} : deactivated Product. {status, message, data}
 */
const softDeleteFeedbackresponse = async (req,res) => {
    try {
      if (!req.params.id){
        return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
      }
      let query = { _id:req.params.id };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      let updatedFeedbackresponse = await dbService.updateOne(Feedbackresponse, query, updateBody);
      if (!updatedFeedbackresponse){
        return res.recordNotFound();
      }
      return res.success({ data:updatedFeedbackresponse });
    } catch (error){
      return res.internalServerError({ message:error.message }); 
    }
  };

 

  /**
 * @description : delete document of Product from table.
 * @param {Object} req : request including id as req param.
 * @param {Object} res : response contains deleted document.
 * @return {Object} : deleted Product. {status, message, data}
 */
const deleteFeedbackresponse = async (req,res) => {
    try { 
      if (!req.params.id){
        return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
      }
      const query = { _id:req.params.id };
      const deletedFeedbackresponse = await dbService.deleteOne(Feedbackresponse, query);
      if (!deletedFeedbackresponse){
        return res.recordNotFound();
      }
      return res.success({ data :deletedFeedbackresponse});
          
    }
    catch (error){
      return res.internalServerError({ message:error.message });
    }
  };

  /**
 * @description : delete documents of Product in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of documents deleted.
 * @return {Object} : no of documents deleted. {status, message, data}
 */
const deleteManyFeedbackresponse = async (req, res) => {
    try {
      let ids = req.body.ids;
      if (!ids || !Array.isArray(ids) || ids.length < 1) {
        return res.badRequest();
      }
      const query = { _id:{ $in:ids } };
      const deletedFeedbackresponse = await dbService.deleteMany(Feedbackresponse,query);
      if (!deletedFeedbackresponse){
        return res.recordNotFound();
      }
      return res.success({ data :{ count :deletedFeedbackresponse } });
    } catch (error){
      return res.internalServerError({ message:error.message }); 
    }
  };

   /**
 * @description : deactivate multiple documents of Product from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated documents of Product.
 * @return {Object} : number of deactivated documents of Product. {status, message, data}
 */
const softDeleteManyFeedbackresponse = async (req,res) => {
  try {
    let ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length < 1) {
      return res.badRequest();
    }
    const query = { _id:{ $in:ids } };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id,
    };
    let updatedFeedbackresponse = await dbService.updateMany(Feedbackresponse,query, updateBody);
    if (!updatedFeedbackresponse) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedFeedbackresponse } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};


  module.exports = {
    addFeedbackresponse,
    bulkInsertFeedbackresponse,
    findAllFeedbackresponse,
    getFeedbackresponse,
    getFeedbackresponseCount,
    updateFeedbackresponse,
    bulkUpdateFeedbackresponse,
    softDeleteFeedbackresponse,
    deleteFeedbackresponse,
    deleteManyFeedbackresponse,
    softDeleteManyFeedbackresponse    
  };