import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LeadForm from '../components/leads/LeadForm';
import api from '../services/api';
import toast from 'react-hot-toast';
const EditLeadPage = () => {
  const {id}=useParams(); const navigate=useNavigate();
  const [lead,setLead]=useState(null); const [loading,setLoading]=useState(false); const [fetching,setFetching]=useState(true);
  useEffect(()=>{api.get(`/leads/${id}`).then(({data})=>setLead({...data.lead,tags:(data.lead.tags||[]).join(', ')})).catch(()=>{toast.error('Lead not found.');navigate('/leads');}).finally(()=>setFetching(false));},[id]);
  const handleSubmit=async formData=>{setLoading(true);try{await api.put(`/leads/${id}`,formData);toast.success('Lead updated!');navigate(`/leads/${id}`);}catch(err){toast.error(err.response?.data?.message||'Failed to update.');}finally{setLoading(false);}};
  if(fetching)return <div style={{display:'flex',justifyContent:'center',padding:'60px'}}><div style={{width:36,height:36,border:'3px solid var(--color-primary)',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/></div>;
  return <LeadForm initialData={lead} onSubmit={handleSubmit} submitLabel="Save Changes" loading={loading}/>;
};
export default EditLeadPage;
