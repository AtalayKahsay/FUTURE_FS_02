const Lead=require('../models/Lead.model');
exports.getStats=async(req,res)=>{try{
  const [total,newLeads,contacted,converted,lost]=await Promise.all([Lead.countDocuments(),Lead.countDocuments({status:'new'}),Lead.countDocuments({status:'contacted'}),Lead.countDocuments({status:'converted'}),Lead.countDocuments({status:'lost'})]);
  const sourceStats=await Lead.aggregate([{$group:{_id:'$source',count:{$sum:1}}},{$sort:{count:-1}}]);
  const recentLeads=await Lead.find({createdAt:{$gte:new Date(Date.now()-7*24*60*60*1000)}}).select('name email status source createdAt').sort('-createdAt').limit(5);
  const sixMonthsAgo=new Date();sixMonthsAgo.setMonth(sixMonthsAgo.getMonth()-6);
  const monthlyLeads=await Lead.aggregate([{$match:{createdAt:{$gte:sixMonthsAgo}}},{$group:{_id:{year:{$year:'$createdAt'},month:{$month:'$createdAt'}},count:{$sum:1}}},{$sort:{'_id.year':1,'_id.month':1}}]);
  const conversionRate=total>0?((converted/total)*100).toFixed(1):0;
  res.status(200).json({success:true,stats:{total,new:newLeads,contacted,converted,lost,conversionRate,sourceStats,recentLeads,monthlyLeads}});
}catch(e){res.status(500).json({success:false,message:e.message});}};
