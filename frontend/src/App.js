import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
var backendUrl = 'http://localhost:5000';


function App() {
  function handleCredentialResponse(response) {
    const idToken = response.credential; // Get the ID token from Google login
    fetch("http://localhost:5000/api/google-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Folder ID:", data.folderId);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  const errorMessage = (error) => {
    console.log(error);
  };
  const loginbtn = useGoogleLogin({
    flow: 'auth-code',
    scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file",
    onSuccess: { handleCredentialResponse }, onError: { errorMessage }
  })

  return (
    <div>
      <h2>React Google Login</h2>
      <br />
      <br />
      <button onClick={loginbtn}>Login with Google</button>
    </div>
  )
}
export default App;