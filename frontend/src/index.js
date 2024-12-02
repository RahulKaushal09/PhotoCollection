import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import './index.css'
import { GoogleOAuthProvider } from "@react-oauth/google"

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='153849327107-os3c8r2smfskndr62fr9hrine702qalk.apps.googleusercontent.com'>
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  </GoogleOAuthProvider>
)