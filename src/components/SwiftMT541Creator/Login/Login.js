import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { login, getProfile } from '../../../services/api';
import './Auth.css';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ usernameOrEmail: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Login and get token
      const response = await login(credentials);
      localStorage.setItem('token', response.data.token);
      
      // Fetch user profile after successful login to get user data
      try {
        const profileResponse = await getProfile();
        if (profileResponse.data) {
          onLogin(profileResponse.data);
        } else {
          // If profile doesn't have data, pass credentials as user info
          onLogin({ name: credentials.usernameOrEmail });
        }
      } catch (profileError) {
        console.error("Failed to fetch profile:", profileError);
        // Still log the user in but with minimal info
        onLogin({ name: credentials.usernameOrEmail });
      }

      Swal.fire({
        title: 'Success!',
        text: 'Login successful. Redirecting...',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/dashboard', { replace: true });
      });
    } catch (err) {
      setError('Invalid email or password.');
      Swal.fire({
        title: 'Error!',
        text: 'Invalid email or password. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="text"
          name="usernameOrEmail"
          placeholder="Username or Email"
          value={credentials.usernameOrEmail}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Login;