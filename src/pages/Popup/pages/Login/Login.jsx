import React, { useState } from 'react';
import './Login.css';
import logo from '../../../../assets/img/superstar-icon.png';
import ApiClient from '../../../../lib/api/apiclient';
import { useAuth } from '../../../../lib/auth/AuthContextProvider';
import { useGlobalState } from '../../../../lib/state/GlobalStateProvider';
import { fetchCreators } from '../../../../lib/api/fetchcreators';
import Button from '../../../../components/common/basics/button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const loginResponse = await ApiClient.post('/v1/users/login', {
        email,
        password,
      });

      const profileResponse = await ApiClient.get('/v1/users/profile');

      login(loginResponse.data.token, profileResponse.data);

     

      console.log('Login successful!');
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="Login-container">
      <div className="Login-header">
        <img src={logo} className="Login-logo" alt="Superstar Icon" />
        <h2 className="Login-title">Login to Superstar</h2>
      </div>
      <form className="Login-form" onSubmit={handleSubmit}>
        <div className="Login-input-container">
          <label htmlFor="email" className="Login-label">Email</label>
          <input
            id="email"
            className="Login-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="Login-input-container">
          <label htmlFor="password" className="Login-label">Password</label>
          <input
            id="password"
            className="Login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        {error && <div className="Login-error">{error}</div>}
        <Button type="submit" className="Login-button">
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;