import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function App() {
  const handleLoginSuccess = (response) => {
    console.log('Login Success:', response);
    // You can send the response to your backend for token verification and user info retrieval.
  };

  const handleLoginFailure = (error) => {
    console.error('Login Failed:', error);
  };

  return (
    <GoogleOAuthProvider >
      <div className="App">
        <h1>Login with Google</h1>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
          useOneTap
        />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
