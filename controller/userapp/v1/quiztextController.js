/**
 * ProductController.js
 * @description : exports action methods for Product.
 */

const Quiztext = require('../../../model/quiztext');
const quiztextSchemaKey = require('../../../utils/validation/quiztextValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbServices');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../../utils/comon');
   
/**
 * @description : create document of Quiztext in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Quiztext. {status, message, data}
 */ 
const addQuiztext = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      quiztextSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Quiztext(dataToCreate);
    let createdQuiztext = await dbService.create(Quiztext,dataToCreate);
    return res.success({ data : createdQuiztext });
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
const bulkInsertQuiztext = async (req,res)=>{
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
      let createdQuiztexts = await dbService.create(Quiztext,dataToCreate);
      createdQuiztexts = { count: createdQuiztexts ? createdQuiztexts.length : 0 };
      return res.success({ data:{ count:createdQuiztexts.count || 0 } });
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
const findAllQuiztext = async (req,res) => {
    try {
      let options = {};
      let query = {};
      let validateRequest = validation.validateFilterWithJoi(
        req.body,
        quiztextSchemaKey.findFilterKeys,
        Quiztext.schema.obj
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
      let foundQuiztexts = await dbService.paginate( Quiztext,query,options);
      if (!foundQuiztexts || !foundQuiztexts.data || !foundQuiztexts.data.length){
        return res.recordNotFound(); 
      }
      return res.success({ data :foundQuiztexts });
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
const getQuiztext = async (req,res) => {
    try {
      let query = {};
      if (!ObjectId.isValid(req.params.id)) {
        return res.validationError({ message : 'invalid objectId.' });
      }
      query._id = req.params.id;
      let options = {};
      let foundQuiztext = await dbService.findOne(Quiztext,query, options);
      if (!foundQuiztext){
        return res.recordNotFound();
      }
      return res.success({ data :foundQuiztext });
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
const getQuiztextCount = async (req,res) => {
    try {
      let where = {};
      let validateRequest = validation.validateFilterWithJoi(
        req.body,
        quiztextSchemaKey.findFilterKeys,
      );
      if (!validateRequest.isValid) {
        return res.validationError({ message: `${validateRequest.message}` });
      }
      if (typeof req.body.where === 'object' && req.body.where !== null) {
        where = { ...req.body.where };
      }
      let countedQuiztext = await dbService.count(Quiztext,where);
      return res.success({ data : { count: countedQuiztext } });
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
const updateQuiztext = async (req,res) => {
    try {
      let dataToUpdate = {
        ...req.body,
        updatedBy:req.user.id,
      };

    // let {name, city, date, status} = req.body;

      let validateRequest = validation.validateParamsWithJoi(
        dataToUpdate,
        quiztextSchemaKey.updateSchemaKeys
      );
      if (!validateRequest.isValid) {
        return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
      }
      const query = { _id:req.params.id };
      let updatedQuiztext = await dbService.updateOne(Quiztext,query,dataToUpdate);
      if (!updatedQuiztext){
        return res.recordNotFound();
      }
      return res.success({ data :updatedQuiztext });
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
const bulkUpdateQuiztext = async (req,res)=>{
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
      let updatedQuiztext = await dbService.updateMany(Quiztext,filter,dataToUpdate);
      if (!updatedQuiztext){
        return res.recordNotFound();
      }
      return res.success({ data :{ count : updatedQuiztext } });
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
const softDeleteQuiztext = async (req,res) => {
    try {
      if (!req.params.id){
        return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
      }
      let query = { _id:req.params.id };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      let updatedQuiztext = await dbService.updateOne(Quiztext, query, updateBody);
      if (!updatedQuiztext){
        return res.recordNotFound();
      }
      return res.success({ data:updatedQuiztext });
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
const deleteQuiztext = async (req,res) => {
    try { 
      if (!req.params.id){
        return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
      }
      const query = { _id:req.params.id };
      const deletedQuiztext = await dbService.deleteOne(Quiztext, query);
      if (!deletedQuiztext){
        return res.recordNotFound();
      }
      return res.success({ data :deletedQuiztext});
          
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
const deleteManyQuiztext = async (req, res) => {
    try {
      let ids = req.body.ids;
      if (!ids || !Array.isArray(ids) || ids.length < 1) {
        return res.badRequest();
      }
      const query = { _id:{ $in:ids } };
      const deletedQuiztext = await dbService.deleteMany(Quiztext,query);
      if (!deletedQuiztext){
        return res.recordNotFound();
      }
      return res.success({ data :{ count :deletedQuiztext } });
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
const softDeleteManyQuiztext = async (req,res) => {
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
    let updatedQuiztext = await dbService.updateMany(Quiztext,query, updateBody);
    if (!updatedQuiztext) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedQuiztext } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};


  module.exports = {
    addQuiztext,
    bulkInsertQuiztext,
    findAllQuiztext,
    getQuiztext,
    getQuiztextCount,
    updateQuiztext,
    bulkUpdateQuiztext,
    softDeleteQuiztext,
    deleteQuiztext,
    deleteManyQuiztext,
    softDeleteManyQuiztext    
  };