import React, { useState } from 'react';
import AuthService from '../utils/auth';

interface LoginFormProps {
  handleModalClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ handleModalClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await AuthService.login(username, password);
      console.log('Login successful:', response);
      handleModalClose(); // Call the handleModalClose function after successful login
    } catch (error) {
      console.log('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;