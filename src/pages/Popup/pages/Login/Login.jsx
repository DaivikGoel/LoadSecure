import React, { useState } from 'react';
import logo from '../../../../assets/img/logo.svg';
import './Login.css';
import ApiClient from '../../../../lib/api/apiclient';
import { useAuth } from '../../../../lib/auth/AuthContextProvider';
import { useGlobalState } from '../../../../lib/state/GlobalStateProvider';
import { fetchCreators } from '../../helpers/fetchcreators';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const { selectedBusiness, setSelectedBusiness, setBusinessCreators } = useGlobalState();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const loginResponse = await ApiClient.post('/v1/users/login', {
        email,
        password,
      });
      console.log('Login response:', loginResponse.data);
      
      const profileResponse = await ApiClient.get('/v1/users/profile');
      console.log('Profile response:', profileResponse.data);
      
      // Call login function with token and user data
      login(loginResponse.data.token, profileResponse.data);
      
      // Set the selected business to the primary business of the user
      setSelectedBusiness(profileResponse.data.primaryBusiness);
      
      // Fetch creators for the selected business
      const creators = await fetchCreators(profileResponse.data.primaryBusiness.id);
      setBusinessCreators(creators);
      
      console.log('Login successful!');
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Login to Your Superstar Account</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </header>
    </div>
  );
};

export default Login;