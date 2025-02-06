/**
 * ProductController.js
 * @description : exports action methods for Product.
 */

const Pollresponse = require('../../../model/pollresponse');
const pollresponseSchemaKey = require('../../../utils/validation/pollresponseValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbServices');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../../utils/comon');
   
/**
 * @description : create document of Pollresponse in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Pollresponse. {status, message, data}
 */ 
const addPollresponse = async (req, res) => {
  try {
    let dataToCreate = { ...(req.body || {}) };

    // Validate request parameters
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      pollresponseSchemaKey.schemaKeys
    );

    if (!validateRequest.isValid) {
      return res.validationError({
        message: `Invalid values in parameters, ${validateRequest.message}`,
      });
    }

    // Check if a response already exists for the given userId and sessionId
    const existingResponse = await dbService.findOne(Pollresponse, {
      userId: req.user.id,
      sessionId: dataToCreate.sessionId, // Assuming sessionId is part of the request body
    });

    if (existingResponse) {
      return res.validationError({
        message: "You have already submitted a quiz response for this session.",
      });
    }

    // Set additional data fields
    dataToCreate.addedBy = req.user.id;
    dataToCreate.userId = req.user.id;

    // Create a new poll response
    dataToCreate = new Pollresponse(dataToCreate);
    let createdPollresponse = await dbService.create(Pollresponse, dataToCreate);

    return res.success({ data: createdPollresponse });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : create multiple documents of Product in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Products. {status, message, data}
 */
const bulkInsertPollresponse = async (req,res)=>{
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
      let createdPollresponses = await dbService.create(Pollresponse,dataToCreate);
      createdPollresponses = { count: createdPollresponses ? createdPollresponses.length : 0 };
      return res.success({ data:{ count:createdPollresponses.count || 0 } });
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
const findAllPollresponse = async (req,res) => {
    try {
      let options = {};
      let query = {};
      let validateRequest = validation.validateFilterWithJoi(
        req.body,
        pollresponseSchemaKey.findFilterKeys,
        Pollresponse.schema.obj
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
      let foundPollresponses = await dbService.paginate( Pollresponse,query,options);
      if (!foundPollresponses || !foundPollresponses.data || !foundPollresponses.data.length){
        return res.recordNotFound(); 
      }
      return res.success({ data :foundPollresponses });
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
const getPollresponse = async (req,res) => {
    try {
      let query = {};
      if (!ObjectId.isValid(req.params.id)) {
        return res.validationError({ message : 'invalid objectId.' });
      }
      query._id = req.params.id;
      let options = {};
      let foundPollresponse = await dbService.findOne(Pollresponse,query, options);
      if (!foundPollresponse){
        return res.recordNotFound();
      }
      return res.success({ data :foundPollresponse });
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
const getPollresponseCount = async (req,res) => {
    try {
      let where = {};
      let validateRequest = validation.validateFilterWithJoi(
        req.body,
        pollresponseSchemaKey.findFilterKeys,
      );
      if (!validateRequest.isValid) {
        return res.validationError({ message: `${validateRequest.message}` });
      }
      if (typeof req.body.where === 'object' && req.body.where !== null) {
        where = { ...req.body.where };
      }
      let countedPollresponse = await dbService.count(Pollresponse,where);
      return res.success({ data : { count: countedPollresponse } });
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
const updatePollresponse = async (req,res) => {
    try {
      let dataToUpdate = {
        ...req.body,
        updatedBy:req.user.id,
      };

    // let {name, city, date, status} = req.body;

      let validateRequest = validation.validateParamsWithJoi(
        dataToUpdate,
        pollresponseSchemaKey.updateSchemaKeys
      );
      if (!validateRequest.isValid) {
        return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
      }
      const query = { _id:req.params.id };
      let updatedPollresponse = await dbService.updateOne(Pollresponse,query,dataToUpdate);
      if (!updatedPollresponse){
        return res.recordNotFound();
      }
      return res.success({ data :updatedPollresponse });
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
const bulkUpdatePollresponse = async (req,res)=>{
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
      let updatedPollresponse = await dbService.updateMany(Pollresponse,filter,dataToUpdate);
      if (!updatedPollresponse){
        return res.recordNotFound();
      }
      return res.success({ data :{ count : updatedPollresponse } });
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
const softDeletePollresponse = async (req,res) => {
    try {
      if (!req.params.id){
        return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
      }
      let query = { _id:req.params.id };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      let updatedPollresponse = await dbService.updateOne(Pollresponse, query, updateBody);
      if (!updatedPollresponse){
        return res.recordNotFound();
      }
      return res.success({ data:updatedPollresponse });
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
const deletePollresponse = async (req,res) => {
    try { 
      if (!req.params.id){
        return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
      }
      const query = { _id:req.params.id };
      const deletedPollresponse = await dbService.deleteOne(Pollresponse, query);
      if (!deletedPollresponse){
        return res.recordNotFound();
      }
      return res.success({ data :deletedPollresponse});
          
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
const deleteManyPollresponse = async (req, res) => {
    try {
      let ids = req.body.ids;
      if (!ids || !Array.isArray(ids) || ids.length < 1) {
        return res.badRequest();
      }
      const query = { _id:{ $in:ids } };
      const deletedPollresponse = await dbService.deleteMany(Pollresponse,query);
      if (!deletedPollresponse){
        return res.recordNotFound();
      }
      return res.success({ data :{ count :deletedPollresponse } });
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
const softDeleteManyPollresponse = async (req,res) => {
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
    let updatedPollresponse = await dbService.updateMany(Pollresponse,query, updateBody);
    if (!updatedPollresponse) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedPollresponse } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};


  module.exports = {
    addPollresponse,
    bulkInsertPollresponse,
    findAllPollresponse,
    getPollresponse,
    getPollresponseCount,
    updatePollresponse,
    bulkUpdatePollresponse,
    softDeletePollresponse,
    deletePollresponse,
    deleteManyPollresponse,
    softDeleteManyPollresponse    
  };