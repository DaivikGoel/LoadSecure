import React, { useState } from 'react';
import logo from '../../../../assets/img/logo.svg';
import './Login.css';
import ApiClient from '../../../../lib/api/apiclient';
import { importCreatorList } from '../../../Content/ExportAccount/exporter';
import { useAuth } from '../../../../lib/auth/AuthContextProvider';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await ApiClient.post('/v1/users/login', {
        email,
        password,
      });
      console.log('Login response:', response.data);
      login(response.data.token); // Assuming the API returns a token
      console.log('Login successful!');
      importCreatorList('bus_rRFgg9Kom3uRfDjX4EVKGW');
    } catch (error) {
      if (error.response) {
        console.log(error.response)
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
