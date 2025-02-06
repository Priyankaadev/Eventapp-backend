/**
 * ProductController.js
 * @description : exports action methods for Product.
 */

const Leadscan = require('../../../model/leadscan');
const leadscanSchemaKey = require('../../../utils/validation/leadscanValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbServices');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../../utils/comon');
   
/**
 * @description : create document of Leadscan in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Leadscan. {status, message, data}
 */ 
const addLeadscan = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };

    // Validate request body
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      leadscanSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({
        message: `Invalid values in parameters, ${validateRequest.message}`,
      });
    }

    // Extract userId and exhibitorId
    const userId = req.user.id; // Assuming `req.user.id` holds the logged-in user's ID
    const { exhibitorId } = dataToCreate;

    // Ensure exhibitorId and userId combination is unique
    const existingLeadscan = await dbService.findOne(Leadscan, { userId, exhibitorId });
    if (existingLeadscan) {
      return res.validationError({
        message: `A Leadscan already exists for this user and exhibitor combination.`,
      });
    }

    // Add additional fields and create Leadscan
    dataToCreate.addedBy = userId;
    dataToCreate.userId = userId;
    dataToCreate = new Leadscan(dataToCreate);

    let createdLeadscan = await dbService.create(Leadscan, dataToCreate);
    return res.success({ data: createdLeadscan });

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
const bulkInsertLeadscan = async (req,res)=>{
    try {
      if (req.body && (!Array.isArray(req.body.data) || req.body.data.length < 1)) {
        return res.badRequest();
      }
      let dataToCreate = [ ...req.body.data ];
      for (let i = 0;i < dataToCreate.length;i++){
        dataToCreate[i] = {
          ...dataToCreate[i],
          addedBy: req.user.id,
          userId:req.user.id
        };
      }
      let createdLeadscans = await dbService.create(Leadscan,dataToCreate);
      createdLeadscans = { count: createdLeadscans ? createdLeadscans.length : 0 };
      return res.success({ data:{ count:createdLeadscans.count || 0 } });
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
const findAllLeadscan = async (req, res) => {
  try {
    let options = {};
    let query = {};
    let validateRequest = validation.validateFilterWithJoi(
      req.body,
      leadscanSchemaKey.findFilterKeys,
      Leadscan.schema.obj
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }

    // Parse query
    if (typeof req.body.query === 'object' && req.body.query !== null) {
      query = { ...req.body.query };
    }

    // If isCountOnly is true
    if (req.body.isCountOnly) {
      let totalRecords = await dbService.count(Leadscan, query);
      return res.success({ data: { totalRecords } });
    }

    // Parse options
    if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
      options = { ...req.body.options };
    }

    // Fetch userId from token (assuming it's part of `req.user`)
    const userId = req.user.id; // Modify based on how token data is stored.

    // Fetch paginated results
    let foundLeadscans = await dbService.paginate(Leadscan, query, options);
    if (!foundLeadscans || !foundLeadscans.data || !foundLeadscans.data.length) {
      return res.recordNotFound();
    }
console.log("")
    // Add isVisited key
    const leadscanIds = foundLeadscans.data.map((leadscan) => leadscan.id); // Assuming `id` exists in Leadscan records.
    const visitedRecords = await dbService.findMany(Leadscan, {
      userId,
      exhibitorId: { $in: leadscanIds },
    });

    const visitedMap = new Set(visitedRecords.map((record) => record.exhibitorId));

    foundLeadscans.data = foundLeadscans.data.map((leadscan) => ({
      ...leadscan,
      isVisited: visitedMap.has(leadscan.id), // Check if leadscan is in visited records.
    }));

    return res.success({ data: foundLeadscans });
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
const getLeadscan = async (req,res) => {
    try {
      let query = {};
      if (!ObjectId.isValid(req.params.id)) {
        return res.validationError({ message : 'invalid objectId.' });
      }
      query._id = req.params.id;
      let options = {};
      let foundLeadscan = await dbService.findOne(Leadscan,query, options);
      if (!foundLeadscan){
        return res.recordNotFound();
      }
      return res.success({ data :foundLeadscan });
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
const getLeadscanCount = async (req,res) => {
    try {
      let where = {};
      let validateRequest = validation.validateFilterWithJoi(
        req.body,
        leadscanSchemaKey.findFilterKeys,
      );
      if (!validateRequest.isValid) {
        return res.validationError({ message: `${validateRequest.message}` });
      }
      if (typeof req.body.where === 'object' && req.body.where !== null) {
        where = { ...req.body.where };
      }
      let countedLeadscan = await dbService.count(Leadscan,where);
      return res.success({ data : { count: countedLeadscan } });
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
const updateLeadscan = async (req,res) => {
    try {
      let dataToUpdate = {
        ...req.body,
        updatedBy:req.user.id,
      };

    // let {name, city, date, status} = req.body;

      let validateRequest = validation.validateParamsWithJoi(
        dataToUpdate,
        leadscanSchemaKey.updateSchemaKeys
      );
      if (!validateRequest.isValid) {
        return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
      }
      const query = { _id:req.params.id };
      let updatedLeadscan = await dbService.updateOne(Leadscan,query,dataToUpdate);
      if (!updatedLeadscan){
        return res.recordNotFound();
      }
      return res.success({ data :updatedLeadscan });
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
const bulkUpdateLeadscan = async (req,res)=>{
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
      let updatedLeadscan = await dbService.updateMany(Leadscan,filter,dataToUpdate);
      if (!updatedLeadscan){
        return res.recordNotFound();
      }
      return res.success({ data :{ count : updatedLeadscan } });
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
const softDeleteLeadscan = async (req,res) => {
    try {
      if (!req.params.id){
        return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
      }
      let query = { _id:req.params.id };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      let updatedLeadscan = await dbService.updateOne(Leadscan, query, updateBody);
      if (!updatedLeadscan){
        return res.recordNotFound();
      }
      return res.success({ data:updatedLeadscan });
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
const deleteLeadscan = async (req,res) => {
    try { 
      if (!req.params.id){
        return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
      }
      const query = { _id:req.params.id };
      const deletedLeadscan = await dbService.deleteOne(Leadscan, query);
      if (!deletedLeadscan){
        return res.recordNotFound();
      }
      return res.success({ data :deletedLeadscan});
          
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
const deleteManyLeadscan = async (req, res) => {
    try {
      let ids = req.body.ids;
      if (!ids || !Array.isArray(ids) || ids.length < 1) {
        return res.badRequest();
      }
      const query = { _id:{ $in:ids } };
      const deletedLeadscan = await dbService.deleteMany(Leadscan,query);
      if (!deletedLeadscan){
        return res.recordNotFound();
      }
      return res.success({ data :{ count :deletedLeadscan } });
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
const softDeleteManyLeadscan = async (req,res) => {
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
    let updatedLeadscan = await dbService.updateMany(Leadscan,query, updateBody);
    if (!updatedLeadscan) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedLeadscan } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};


  module.exports = {
    addLeadscan,
    bulkInsertLeadscan,
    findAllLeadscan,
    getLeadscan,
    getLeadscanCount,
    updateLeadscan,
    bulkUpdateLeadscan,
    softDeleteLeadscan,
    deleteLeadscan,
    deleteManyLeadscan,
    softDeleteManyLeadscan    
  };