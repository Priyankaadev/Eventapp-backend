/**
 * ProductController.js
 * @description : exports action methods for Product.
 */

const Qanda = require('../../../model/qanda');
const Reply = require('../../../model/reply');

const qandaSchemaKey = require('../../../utils/validation/qandaValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbServices');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../../../utils/comon');
   
/**
 * @description : create document of Qanda in mongodb collection.
 * @param {Object} req : request including body for creating document.
 * @param {Object} res : response of created document
 * @return {Object} : created Qanda. {status, message, data}
 */ 
const addQanda = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      qandaSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Qanda(dataToCreate);
    let createdQanda = await dbService.create(Qanda,dataToCreate);
    return res.success({ data : createdQanda });
  } catch (error) {
    return res.internalServerError({ message:error.message }); 
  }
};

const toggleLike = async (req, res) => {
  try {
    const { id } = req.params; // Q&A ID
    const userId = req.user.id; // Logged-in user ID
    console.log("id", id)
    console.log("userId", userId)
    // Find the Q&A document
    const qanda = await Qanda.findById(id);
    if (!qanda) {
      return res.status(404).json({ message: "Q&A not found" });
    }

    // Check if the user already liked this Q&A
    const alreadyLiked = qanda.likedBy.includes(userId);

    if (alreadyLiked) {
      // User has liked, so remove the like
      qanda.likedBy.pull(userId);
      qanda.like -= 1;
    } else {
      // User has not liked, so add the like
      qanda.likedBy.push(userId);
      qanda.like += 1;
    }

    // Save the updated Q&A
    await qanda.save();

    res.status(200).json({
      message: alreadyLiked ? "Like removed" : "Like added",
      likeCount: qanda.like,
    });
  } catch (error) {
    console.error("Error in toggling like:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



/**
 * @description : create multiple documents of Product in mongodb collection.
 * @param {Object} req : request including body for creating documents.
 * @param {Object} res : response of created documents.
 * @return {Object} : created Products. {status, message, data}
 */
const bulkInsertQanda = async (req,res)=>{
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
      let createdQandas = await dbService.create(Qanda,dataToCreate);
      createdQandas = { count: createdQandas ? createdQandas.length : 0 };
      return res.success({ data:{ count:createdQandas.count || 0 } });
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
const findAllQanda = async (req,res) => {
    try {
      let options = {};
      let query = {};
      let validateRequest = validation.validateFilterWithJoi(
        req.body,
        qandaSchemaKey.findFilterKeys,
        Qanda.schema.obj
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
      let foundQandas = await dbService.paginate( Qanda,query,options);
      if (!foundQandas || !foundQandas.data || !foundQandas.data.length){
        return res.recordNotFound(); 
      }
      return res.success({ data :foundQandas });
    } catch (error){
      return res.internalServerError({ message:error.message });
    }
  };


const findAllQandaWithReplies = async (req, res) => {
    try {
      let options = {};
      let query = {};
  
      // Validate incoming request
      let validateRequest = validation.validateFilterWithJoi(
        req.body,
        qandaSchemaKey.findFilterKeys,
        Qanda.schema.obj
      );
      if (!validateRequest.isValid) {
        return res.validationError({ message: `${validateRequest.message}` });
      }
  
      // Construct query and options from request body
      if (typeof req.body.query === 'object' && req.body.query !== null) {
        query = { ...req.body.query };
      }
      if (req.body && typeof req.body.options === 'object' && req.body.options !== null) {
        options = { ...req.body.options };
      }
  
      if (req.body.isCountOnly) {
        let totalRecords = await dbService.count(Qanda, query);
        return res.success({ data: { totalRecords } });
      }
  
      // Fetch Q&A data with pagination
      let foundQandas = await dbService.paginate(Qanda, query, options);
      if (!foundQandas || !foundQandas.data || !foundQandas.data.length) {
        return res.recordNotFound();
      }
  
      // Fetch replies for each Q&A
      const qandaIds = foundQandas.data.map((qanda) => qanda.id);
      const replies = await Reply.find({ qandaId: { $in: qandaIds } }).populate('userId', 'name email');
  
      // Map replies to their respective Q&A
      const qandaWithReplies = foundQandas.data.map((qanda) => {
        const qandaReplies = replies.filter((reply) => reply.qandaId.toString() === qanda.id.toString());
        return {
          ...qanda.toJSON(),
          replies: qandaReplies,
        };
      });
  
      // Return response
      return res.success({
        data: {
          ...foundQandas,
          data: qandaWithReplies,
        },
      });
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
const getQanda = async (req,res) => {
    try {
      let query = {};
      if (!ObjectId.isValid(req.params.id)) {
        return res.validationError({ message : 'invalid objectId.' });
      }
      query._id = req.params.id;
      let options = {};
      let foundQanda = await dbService.findOne(Qanda,query, options);
      if (!foundQanda){
        return res.recordNotFound();
      }
      return res.success({ data :foundQanda });
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
const getQandaCount = async (req,res) => {
    try {
      let where = {};
      let validateRequest = validation.validateFilterWithJoi(
        req.body,
        qandaSchemaKey.findFilterKeys,
      );
      if (!validateRequest.isValid) {
        return res.validationError({ message: `${validateRequest.message}` });
      }
      if (typeof req.body.where === 'object' && req.body.where !== null) {
        where = { ...req.body.where };
      }
      let countedQanda = await dbService.count(Qanda,where);
      return res.success({ data : { count: countedQanda } });
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
const updateQanda = async (req,res) => {
    try {
      let dataToUpdate = {
        ...req.body,
        updatedBy:req.user.id,
      };

    // let {name, city, date, status} = req.body;

      let validateRequest = validation.validateParamsWithJoi(
        dataToUpdate,
        qandaSchemaKey.updateSchemaKeys
      );
      if (!validateRequest.isValid) {
        return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
      }
      const query = { _id:req.params.id };
      let updatedQanda = await dbService.updateOne(Qanda,query,dataToUpdate);
      if (!updatedQanda){
        return res.recordNotFound();
      }
      return res.success({ data :updatedQanda });
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
const bulkUpdateQanda = async (req,res)=>{
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
      let updatedQanda = await dbService.updateMany(Qanda,filter,dataToUpdate);
      if (!updatedQanda){
        return res.recordNotFound();
      }
      return res.success({ data :{ count : updatedQanda } });
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
const softDeleteQanda = async (req,res) => {
    try {
      if (!req.params.id){
        return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
      }
      let query = { _id:req.params.id };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      let updatedQanda = await dbService.updateOne(Qanda, query, updateBody);
      if (!updatedQanda){
        return res.recordNotFound();
      }
      return res.success({ data:updatedQanda });
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
const deleteQanda = async (req,res) => {
    try { 
      if (!req.params.id){
        return res.badRequest({ message : 'Insufficient request parameters! id is required.' });
      }
      const query = { _id:req.params.id };
      const deletedQanda = await dbService.deleteOne(Qanda, query);
      if (!deletedQanda){
        return res.recordNotFound();
      }
      return res.success({ data :deletedQanda});
          
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
const deleteManyQanda = async (req, res) => {
    try {
      let ids = req.body.ids;
      if (!ids || !Array.isArray(ids) || ids.length < 1) {
        return res.badRequest();
      }
      const query = { _id:{ $in:ids } };
      const deletedQanda = await dbService.deleteMany(Qanda,query);
      if (!deletedQanda){
        return res.recordNotFound();
      }
      return res.success({ data :{ count :deletedQanda } });
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
const softDeleteManyQanda = async (req,res) => {
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
    let updatedQanda = await dbService.updateMany(Qanda,query, updateBody);
    if (!updatedQanda) {
      return res.recordNotFound();
    }
    return res.success({ data:{ count :updatedQanda } });
        
  } catch (error){
    return res.internalServerError({ message:error.message }); 
  }
};


  module.exports = {
    addQanda,
    toggleLike,
    bulkInsertQanda,
    findAllQanda,
    findAllQandaWithReplies,
    getQanda,
    getQandaCount,
    updateQanda,
    bulkUpdateQanda,
    softDeleteQanda,
    deleteQanda,
    deleteManyQanda,
    softDeleteManyQanda    
  };