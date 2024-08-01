import React, { useState, Suspense, lazy } from 'react';

const Login = lazy(() => import('./components/Login'));
const Quiz = lazy(() => import('./components/Quiz'));
const History = lazy(() => import('./components/History'));

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('username'));
  const [data, setData] = useState('');

  const handleDataChange = (newData) => {
    setData(newData);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className='bg-gray-900 h-screen'>
      <Suspense fallback={<div>Loading...</div>}>
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} user={handleDataChange}/>
        ) : (
          <>
            <Quiz username={data}/>
          </>
        )}
      </Suspense>
    </div>
  );
};

export default App;
