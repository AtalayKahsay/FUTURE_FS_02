const router=require('express').Router();
const {getLeads,createLead,getLeadById,updateLead,deleteLead,addNote,deleteNote}=require('../controllers/lead.controller');
const {protect}=require('../middleware/auth.middleware');
router.use(protect);
router.route('/').get(getLeads).post(createLead);
router.route('/:id').get(getLeadById).put(updateLead).delete(deleteLead);
router.route('/:id/notes').post(addNote);
router.route('/:id/notes/:noteId').delete(deleteNote);
module.exports=router;
