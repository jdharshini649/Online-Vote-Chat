import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../UI/Input';
import Button from '../UI/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white font-bold text-3xl">D</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 mt-2">Join the debate arena</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={(e)=>handleChange(e)}
            placeholder="johndoe"
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={(e)=>handleChange(e)}
            placeholder="your@email.com"
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={(e)=>handleChange(e)}
            placeholder="••••••••"
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <Button type="submit" disabled={loading} className="w-full mb-4" fullWidth>
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </form>

        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 hover:text-primary-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>  
  );
};

export default Register;
