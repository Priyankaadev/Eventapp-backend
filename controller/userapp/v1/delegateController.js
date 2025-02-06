/**
 * ProductController.js
 * @description : exports action methods for Product.
 */

const Delegate = require('../../../model/delegate');
const delegateSchemaKey = require('../../../utils/validation/delegateValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbServices');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../../utils/comon');
   
/**
 * @description : create document of Delegate in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Delegate. {status, message, data}
 */ 
const addDelegate = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      delegateSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Delegate(dataToCreate);
    let createdDelegate = await dbService.create(Delegate,dataToCreate);
    return res.success({ data : createdDelegate });
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
const bulkInsertDelegate = async (req,res)=>{
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
      let createdDelegates = await dbService.create(Delegate,dataToCreate);
      createdDelegates = { count: createdDelegates ? createdDelegates.length : 0 };
      return res.success({ data:{ count:createdDelegates.count || 0 } });
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
const findAllDelegate = async (req, res) => {
  try {
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      delegateSchemaKey.findFilterKeys,
      Delegate.schema.obj
    );

    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }

    // Build the query object from the request body
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }

    // Check if only count is requested
    if (req.body.isCountOnly) {
      let totalRecords = await dbService.count(Delegate, query);
      return res.success({ data: { totalRecords } });
    }

    // Fetch all data without pagination
    let foundDelegates = await dbService.findMany(Delegate, query);

    if (!foundDelegates || !foundDelegates.length) {
      return res.recordNotFound();
    }

    return res.success({data: { data: foundDelegates }});
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : find document of Product from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains document retrieved from table.
 * @return {Object} : found Product. {status, message, data}
 */
const getDelegate = async (req,res) => {
    try {
      let query = {};
      if (!ObjectId.isValid(req.params.id)) {
        return res.validationError({ message : 'invalid objectId.' });
      }
      query._id = req.params.id;
      let options = {};
      let foundDelegate = await dbService.findOne(Delegate,query, options);
      if (!foundDelegate){
        return res.recordNotFound();
      }
      return res.success({ data :foundDelegate });
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
const getDelegateCount = async (req,res) => {
    try {
      let where = {};
      let validateRequest = validation.validateFilterWithJoi(
        req.body,
        delegateSchemaKey.findFilterKeys,
      );
      if (!validateRequest.isValid) {
        return res.validationError({ message: `${validateRequest.message}` });
      }
      if (typeof req.body.where === 'object' && req.body.where !== null) {
        where = { ...req.body.where };
      }
      let countedDelegate = await dbService.count(Delegate,where);
      return res.success({ data : { count: countedDelegate } });
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
const updateDelegate = async (req,res) => {
    try {
      let dataToUpdate = {
        ...req.body,
        updatedBy:req.user.id,
      };

    // let {name, city, date, status} = req.body;

      let validateRequest = validation.validateParamsWithJoi(
        dataToUpdate,
        delegateSchemaKey.updateSchemaKeys
      );
      if (!validateRequest.isValid) {
        return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
      }
      const query = { _id:req.params.id };
      let updatedDelegate = await dbService.updateOne(Delegate,query,dataToUpdate);
      if (!updatedDelegate){
        return res.recordNotFound();
      }
      return res.success({ data :updatedDelegate });
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
const bulkUpdateDelegate = async (req,res)=>{
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
      let updatedDelegate = await dbService.updateMany(Delegate,filter,dataToUpdate);
      if (!updatedDelegate){
        return res.recordNotFound();
      }
      return res.success({ data :{ count : updatedDelegate } });
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
const softDeleteDelegate = async (req,res) => {
    try {
      if (!req.params.id){
        return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
      }
      let query = { _id:req.params.id };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      let updatedDelegate = await dbService.updateOne(Delegate, query, updateBody);
      if (!updatedDelegate){
        return res.recordNotFound();
      }
      return res.success({ data:updatedDelegate });
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
const deleteDelegate = async (req,res) => {
    try { 
      if (!req.params.id){
        return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
      }
      const query = { _id:req.params.id };
      const deletedDelegate = await dbService.deleteOne(Delegate, query);
      if (!deletedDelegate){
        return res.recordNotFound();
      }
      return res.success({ data :deletedDelegate});
          
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
const deleteManyDelegate = async (req, res) => {
    try {
      let ids = req.body.ids;
      if (!ids || !Array.isArray(ids) || ids.length < 1) {
        return res.badRequest();
      }
      const query = { _id:{ $in:ids } };
      const deletedDelegate = await dbService.deleteMany(Delegate,query);
      if (!deletedDelegate){
        return res.recordNotFound();
      }
      return res.success({ data :{ count :deletedDelegate } });
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
const softDeleteManyDelegate = async (req,res) => {
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
    let updatedDelegate = await dbService.updateMany(Delegate,query, updateBody);
    if (!updatedDelegate) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedDelegate } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};


  module.exports = {
    addDelegate,
    bulkInsertDelegate,
    findAllDelegate,
    getDelegate,
    getDelegateCount,
    updateDelegate,
    bulkUpdateDelegate,
    softDeleteDelegate,
    deleteDelegate,
    deleteManyDelegate,
    softDeleteManyDelegate    
  };