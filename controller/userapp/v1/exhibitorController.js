/**
 * ProductController.js
 * @description : exports action methods for Product.
 */

const Exhibitor = require('../../../model/exhibitor');
const exhibitorSchemaKey = require('../../../utils/validation/exhibitorValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbServices');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../../utils/comon');
const leadscan = require('../../../model/leadscan');
   
/**
 * @description : create document of Exhibitor in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Exhibitor. {status, message, data}
 */ 
const addExhibitor = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      exhibitorSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Exhibitor(dataToCreate);
    let createdExhibitor = await dbService.create(Exhibitor,dataToCreate);
    return res.success({ data : createdExhibitor });
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
const bulkInsertExhibitor = async (req,res)=>{
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
      let createdExhibitors = await dbService.create(Exhibitor,dataToCreate);
      createdExhibitors = { count: createdExhibitors ? createdExhibitors.length : 0 };
      return res.success({ data:{ count:createdExhibitors.count || 0 } });
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
const findAllExhibitor = async (req, res) => {
  try {
    let options = {};
    let query = {};
    let userId = req.user.id; // Extract user ID from the request
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      exhibitorSchemaKey.findFilterKeys,
      Exhibitor.schema.obj
    );

    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }

    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }

    if (req.body.isCountOnly) {
      let totalRecords = await dbService.count(Exhibitor, query);
      return res.success({ data: { totalRecords } });
    }

    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }

    // Fetch exhibitors with pagination
    let foundExhibitors = await dbService.paginate(Exhibitor, query, options);

    if (!foundExhibitors || !foundExhibitors.data || !foundExhibitors.data.length) {
      return res.recordNotFound();
    }

    // Fetch leadscan data
    const leadScans = await dbService.findMany(leadscan, { userId });

    // Map exhibitors to update their `status` field based on leadscan data
    foundExhibitors.data = await Promise.all(
      foundExhibitors.data.map(async (exhibitor) => {
        const isVisited = leadScans.some(
          (lead) =>
            lead.exhibitorId.toString() === exhibitor._id.toString() &&
            lead.userId.toString() === userId.toString()
        );

        // Update status in the database if necessary
        if (isVisited && exhibitor.status !== 'Visited') {
          await dbService.updateOne(
            Exhibitor,
            { _id: exhibitor._id },
            { status: 'Visited' }
          );
          exhibitor.status = 'Visited';
        }

        return exhibitor.toObject();
      })
    );

    return res.success({ data: foundExhibitors });
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
const getExhibitor = async (req,res) => {
    try {
      let query = {};
      if (!ObjectId.isValid(req.params.id)) {
        return res.validationError({ message : 'invalid objectId.' });
      }
      query._id = req.params.id;
      let options = {};
      let foundExhibitor = await dbService.findOne(Exhibitor,query, options);
      if (!foundExhibitor){
        return res.recordNotFound();
      }
      return res.success({ data :foundExhibitor });
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
const getExhibitorCount = async (req,res) => {
    try {
      let where = {};
      let validateRequest = validation.validateFilterWithJoi(
        req.body,
        exhibitorSchemaKey.findFilterKeys,
      );
      if (!validateRequest.isValid) {
        return res.validationError({ message: `${validateRequest.message}` });
      }
      if (typeof req.body.where === 'object' && req.body.where !== null) {
        where = { ...req.body.where };
      }
      let countedExhibitor = await dbService.count(Exhibitor,where);
      return res.success({ data : { count: countedExhibitor } });
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
const updateExhibitor = async (req,res) => {
    try {
      let dataToUpdate = {
        ...req.body,
        updatedBy:req.user.id,
      };

    // let {name, city, date, status} = req.body;

      let validateRequest = validation.validateParamsWithJoi(
        dataToUpdate,
        exhibitorSchemaKey.updateSchemaKeys
      );
      if (!validateRequest.isValid) {
        return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
      }
      const query = { _id:req.params.id };
      let updatedExhibitor = await dbService.updateOne(Exhibitor,query,dataToUpdate);
      if (!updatedExhibitor){
        return res.recordNotFound();
      }
      return res.success({ data :updatedExhibitor });
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
const bulkUpdateExhibitor = async (req,res)=>{
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
      let updatedExhibitor = await dbService.updateMany(Exhibitor,filter,dataToUpdate);
      if (!updatedExhibitor){
        return res.recordNotFound();
      }
      return res.success({ data :{ count : updatedExhibitor } });
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
const softDeleteExhibitor = async (req,res) => {
    try {
      if (!req.params.id){
        return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
      }
      let query = { _id:req.params.id };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      let updatedExhibitor = await dbService.updateOne(Exhibitor, query, updateBody);
      if (!updatedExhibitor){
        return res.recordNotFound();
      }
      return res.success({ data:updatedExhibitor });
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
const deleteExhibitor = async (req,res) => {
    try { 
      if (!req.params.id){
        return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
      }
      const query = { _id:req.params.id };
      const deletedExhibitor = await dbService.deleteOne(Exhibitor, query);
      if (!deletedExhibitor){
        return res.recordNotFound();
      }
      return res.success({ data :deletedExhibitor});
          
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
const deleteManyExhibitor = async (req, res) => {
    try {
      let ids = req.body.ids;
      if (!ids || !Array.isArray(ids) || ids.length < 1) {
        return res.badRequest();
      }
      const query = { _id:{ $in:ids } };
      const deletedExhibitor = await dbService.deleteMany(Exhibitor,query);
      if (!deletedExhibitor){
        return res.recordNotFound();
      }
      return res.success({ data :{ count :deletedExhibitor } });
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
const softDeleteManyExhibitor = async (req,res) => {
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
    let updatedExhibitor = await dbService.updateMany(Exhibitor,query, updateBody);
    if (!updatedExhibitor) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedExhibitor } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};


  module.exports = {
    addExhibitor,
    bulkInsertExhibitor,
    findAllExhibitor,
    getExhibitor,
    getExhibitorCount,
    updateExhibitor,
    bulkUpdateExhibitor,
    softDeleteExhibitor,
    deleteExhibitor,
    deleteManyExhibitor,
    softDeleteManyExhibitor    
  };