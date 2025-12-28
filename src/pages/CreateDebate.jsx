import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebate } from '../hooks/useDebate';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';

const CreateDebate = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 10
  });
  const teamARef = useRef()
  const teamBRef = useRef()
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { createDebate } = useDebate();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    let tName = [teamARef.current.value, teamBRef.current.value]
  
    try {
      const debate = await createDebate({...formData, tName});
      navigate(`/debate/${debate._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create debate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-2xl shadow p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Debate</h1>
        <p className="text-gray-600 mb-6">Set up a debate with Team A and Team B</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Debate Title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter debate topic"
            required
          />

          <div className="flex  gap-4 items-center">
              <div className="grid gap-2 flex-1  ">
                <label htmlFor="tA" className='pl-1'>Team A</label>
                <input type="text"   className='bg-gray-200 px-4 py-1 rounded-md ' placeholder='Team A Name' required ref={teamARef}/>
              </div>
              <div className="grid gap-2  flex-1 ">
                <label htmlFor="tB" className='pl-1'>Team B</label>
                <input type="text" className='bg-gray-200 px-4 py-1 rounded-md ' placeholder='Team B Name' required ref={teamBRef} />
              </div>
          </div>    

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the debate topic..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <Input
            label="Duration (minutes)"
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="10"
            required
          />
          

          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-primary-800 mb-2">📋 Debate Structure</h3>
            <ul className="text-sm text-primary-700 space-y-1">
              <li>• Two teams will be automatically created: Team A and Team B</li>
              <li>• Users can join either team before the debate starts</li>
              <li>• Debate will run for the specified duration</li>
              <li>• Winner is determined by total votes</li>
            </ul>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4 gap-2">
            <Button type="submit" disabled={loading} className="flex-1" fullWidth>
              {loading ? 'Creating...' : 'Create Debate'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/')} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDebate;
