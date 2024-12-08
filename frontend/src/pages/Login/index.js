import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { backendUrl } from '../../config';
import { useGoogleLogin } from '@react-oauth/google';
import { useEffect } from 'react';
import "./login.css";
function Login() {
    const navigate = useNavigate();

    function handleCredentialResponse(response) {
        fetch(`${backendUrl}/api/google-login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ response }),
        })
            .then((res) => res.json())
            .then((data) => {
                localStorage.setItem("folderId", data.folderId);
                localStorage.setItem("accessToken", data.access_token);
                console.log("Folder ID:", data.folderId);
                navigate(`/collections/${data.folderId}/Your Trip Len`);
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
        redirect_uri: `${backendUrl}/api/google-login`,
        scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.metadata",
        onSuccess: handleCredentialResponse,
        onError: errorMessage,
    });

    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            navigate("/");
        }
    }, [navigate]);

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <img src="/logo.png" alt="TripLens Logo" />
                    <h1>TripLens</h1>
                </div>
                <h2>Organize Your Photo Memories</h2>
                <p>
                    Link your Google Drive and effortlessly manage your trip photo
                    collections in one place.
                </p>
                <button className="login-button" onClick={loginbtn}>
                    <i className="google-icon"></i> Login with Google
                </button>
            </div>
        </div>
    );
}

export default Login;