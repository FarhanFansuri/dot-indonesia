import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    if (username.trim()) {
      localStorage.setItem('username', username);
      onLogin();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };


  return (
    <div className="bg-gray-900 flex items-center justify-center h-screen">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-white text-2xl mb-4 text-center">Login</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your name"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        />
        <button
          onClick={handleLogin}

          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
