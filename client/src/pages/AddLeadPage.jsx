import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeadForm from '../components/leads/LeadForm';
import api from '../services/api';
import toast from 'react-hot-toast';

const AddLeadPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async formData => {
    setLoading(true);
    try {
      const { data } = await api.post('/leads', formData);
      toast.success('Lead added!');
      navigate(`/leads/${data.lead._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create lead.');
    } finally {
      setLoading(false);
    }
  };

  return <LeadForm onSubmit={handleSubmit} submitLabel="Add Lead" loading={loading}/>;
};

export default AddLeadPage;