/**
 * ProductController.js
 * @description : exports action methods for Product.
 */

const Reply = require('../../../model/reply');
const replySchemaKey = require('../../../utils/validation/replyValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbServices');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../../utils/comon');
   
/**
 * @description : create document of Reply in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Reply. {status, message, data}
 */ 
const addReply = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      replySchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Reply(dataToCreate);
    let createdReply = await dbService.create(Reply,dataToCreate);
    return res.success({ data : createdReply });
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
const bulkInsertReply = async (req,res)=>{
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
      let createdReplys = await dbService.create(Reply,dataToCreate);
      createdReplys = { count: createdReplys ? createdReplys.length : 0 };
      return res.success({ data:{ count:createdReplys.count || 0 } });
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
const findAllReply = async (req,res) => {
    try {
      let options = {};
      let query = {};
      let validateRequest = validation.validateFilterWithJoi(
        req.body,
        replySchemaKey.findFilterKeys,
        Reply.schema.obj
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
      let foundReplys = await dbService.paginate( Reply,query,options);
      if (!foundReplys || !foundReplys.data || !foundReplys.data.length){
        return res.recordNotFound(); 
      }
      return res.success({ data :foundReplys });
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
const getReply = async (req,res) => {
    try {
      let query = {};
      if (!ObjectId.isValid(req.params.id)) {
        return res.validationError({ message : 'invalid objectId.' });
      }
      query._id = req.params.id;
      let options = {};
      let foundReply = await dbService.findOne(Reply,query, options);
      if (!foundReply){
        return res.recordNotFound();
      }
      return res.success({ data :foundReply });
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
const getReplyCount = async (req,res) => {
    try {
      let where = {};
      let validateRequest = validation.validateFilterWithJoi(
        req.body,
        replySchemaKey.findFilterKeys,
      );
      if (!validateRequest.isValid) {
        return res.validationError({ message: `${validateRequest.message}` });
      }
      if (typeof req.body.where === 'object' && req.body.where !== null) {
        where = { ...req.body.where };
      }
      let countedReply = await dbService.count(Reply,where);
      return res.success({ data : { count: countedReply } });
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
const updateReply = async (req,res) => {
    try {
      let dataToUpdate = {
        ...req.body,
        updatedBy:req.user.id,
      };

    // let {name, city, date, status} = req.body;

      let validateRequest = validation.validateParamsWithJoi(
        dataToUpdate,
        replySchemaKey.updateSchemaKeys
      );
      if (!validateRequest.isValid) {
        return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
      }
      const query = { _id:req.params.id };
      let updatedReply = await dbService.updateOne(Reply,query,dataToUpdate);
      if (!updatedReply){
        return res.recordNotFound();
      }
      return res.success({ data :updatedReply });
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
const bulkUpdateReply = async (req,res)=>{
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
      let updatedReply = await dbService.updateMany(Reply,filter,dataToUpdate);
      if (!updatedReply){
        return res.recordNotFound();
      }
      return res.success({ data :{ count : updatedReply } });
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
const softDeleteReply = async (req,res) => {
    try {
      if (!req.params.id){
        return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
      }
      let query = { _id:req.params.id };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      let updatedReply = await dbService.updateOne(Reply, query, updateBody);
      if (!updatedReply){
        return res.recordNotFound();
      }
      return res.success({ data:updatedReply });
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
const deleteReply = async (req,res) => {
    try { 
      if (!req.params.id){
        return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
      }
      const query = { _id:req.params.id };
      const deletedReply = await dbService.deleteOne(Reply, query);
      if (!deletedReply){
        return res.recordNotFound();
      }
      return res.success({ data :deletedReply});
          
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
const deleteManyReply = async (req, res) => {
    try {
      let ids = req.body.ids;
      if (!ids || !Array.isArray(ids) || ids.length < 1) {
        return res.badRequest();
      }
      const query = { _id:{ $in:ids } };
      const deletedReply = await dbService.deleteMany(Reply,query);
      if (!deletedReply){
        return res.recordNotFound();
      }
      return res.success({ data :{ count :deletedReply } });
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
const softDeleteManyReply = async (req,res) => {
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
    let updatedReply = await dbService.updateMany(Reply,query, updateBody);
    if (!updatedReply) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedReply } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};


  module.exports = {
    addReply,
    bulkInsertReply,
    findAllReply,
    getReply,
    getReplyCount,
    updateReply,
    bulkUpdateReply,
    softDeleteReply,
    deleteReply,
    deleteManyReply,
    softDeleteManyReply    
  };