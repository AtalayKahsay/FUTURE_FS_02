const mongoose=require('mongoose');
const noteSchema=new mongoose.Schema({text:{type:String,required:true},createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'},createdAt:{type:Date,default:Date.now}});
const leadSchema=new mongoose.Schema({
  name:{type:String,required:true,trim:true},
  email:{type:String,required:true,trim:true,lowercase:true},
  phone:{type:String,default:''},company:{type:String,default:''},
  source:{type:String,enum:['website','referral','social_media','email_campaign','cold_call','other'],default:'website'},
  status:{type:String,enum:['new','contacted','converted','lost'],default:'new'},
  priority:{type:String,enum:['low','medium','high'],default:'medium'},
  notes:[noteSchema],
  assignedTo:{type:mongoose.Schema.Types.ObjectId,ref:'User',default:null},
  createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  followUpDate:{type:Date,default:null},value:{type:Number,default:0},tags:[{type:String}]
},{timestamps:true});
leadSchema.index({status:1});leadSchema.index({source:1});leadSchema.index({createdAt:-1});
module.exports=mongoose.model('Lead',leadSchema);
