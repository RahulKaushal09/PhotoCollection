import React, { useState } from 'react';
// import { useGoogleLogin } from '@react-oauth/google';
// import CollectionsViewer from './Components/collection/index';
import Collections from './pages/collection/index';
import { backendUrl } from './config';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';


function App() {
  const [data, setData] = useState({ folders: [], files: [] });
  const [error, setError] = useState(null);
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);



  // function handleCredentialResponse(response) {
  //   console.log(response);

  //   // const idToken = response.credential; // Get the ID token from Google login
  //   fetch("http://localhost:5000/api/google-login", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ response }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       localStorage.setItem("folderId", data.folderId);
  //       localStorage.setItem("accessToken", data.access_token);
  //       console.log("Folder ID:", data.folderId);

  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // }
  // const errorMessage = (error) => {
  //   console.log(error);
  // };
  // const loginbtn = useGoogleLogin({
  //   flow: 'auth-code',
  //   redirect_uri: "http://localhost:5000/api/google-login",  // Make sure this matches the Cloud Console
  //   scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.metadata",
  //   onSuccess: handleCredentialResponse, onError: errorMessage
  // })

  return (
    // <div>
    //   <h2>React Google Login</h2>
    //   <br />
    //   <br />
    //   <button onClick={loginbtn}>Login with Google</button>
    //   {/* <button onClick={getAllCollection}>All Collections</button> */}

    //   {/* <CollectionsViewer /> */}
    //   <Collections folders={folders} images={images} />

    // </div>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/collections" element={<Collections />} />
      </Routes>
    </Router>

  )
}
export default App;