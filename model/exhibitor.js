const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
let idValidator = require('mongoose-id-validator');
const uniqueValidator = require('mongoose-unique-validator');

const myCustomLabels = {
    totalDocs: 'itemCount',
    docs: 'data',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'next',
    prevPage: 'prev',
    totalPages: 'pageCount',
    pagingCounter: 'slNo',
    meta: 'paginator',
  };
 
  mongoosePaginate.paginate.options = {customLabels:myCustomLabels}
  const Schema = mongoose.Schema;

  const schema = new Schema({
    name:{ type:String },
    stall:{ type:String },
    hall:{ type:String },
     image:{type:String},
     description:{type:String},
     website:{type:String},
     exhibitor_type: {
      type: String,
      enum: ['Platinum', 'Gold', 'Silver', 'Exhibitor', 'Bronze', 'Diamond', 'Super Platinum'], // Define the enum values
      required: true, // Make it a required field
      default: 'Exhibitor', // Optional: Set a default value
    },
    status:{
      type:String,
      enum: ['Pending', 'Visited'], // Define the enum values
      // required: true, // Make it a required field
      default: 'Pending',
        },
     eventId:{
      type:Schema.Types.ObjectId,
      ref:'event'
     },
   userId:{
    type:Schema.Types.ObjectId,
    ref:'user'
   },
    addedBy:{
      type:Schema.Types.ObjectId,
      ref:'user'
    },

    updatedBy:{
      type:Schema.Types.ObjectId,
      ref:'user'
    },
      isAppUser: { type: Boolean, default: true },
      isActive: { type: Boolean },
      isDeleted: { type: Boolean },
      createdAt: { type: Date },
      updatedAt: { type: Date },
     
    },
      {
        timestamps: {
          createdAt: 'createdAt',
          updatedAt: 'updatedAt'
        }
      }
  );
  schema.pre('save', async function (next) {
    this.isDeleted = false;
    this.isActive = true;
    next();
  });
  
  schema.pre('insertMany', async function (next, docs) {
    if (docs && docs.length){
      for (let index = 0; index < docs.length; index++) {
        const element = docs[index];
        element.isDeleted = false;
        element.isActive = true;
      }
    }
    next();
  });
  
  schema.method('toJSON', function () {
    const {
      _id, __v, ...object 
    } = this.toObject({ virtuals:true });
    object.id = _id;
       
    return object;
  });
  schema.plugin(mongoosePaginate);
  schema.plugin(idValidator);
  const exhibitor = mongoose.model('exhibitor',schema);
  module.exports = exhibitor;