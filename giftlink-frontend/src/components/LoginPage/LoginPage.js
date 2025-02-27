import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext, setIsLoggedIn, setUserName, setUserEmail } from '../../context/AuthContext';
import { urlConfig } from '../../config';
import './LoginPage.css';


function LoginPage() {

    //insert code here to create useState hook variables for email, password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [incorrect, setIncorrect] = useState(''); // Task 4: Include a state for the error message.
    const navigate = useNavigate(); // Task 5: Create a local variable for navigate.
    const bearerToken = sessionStorage.getItem('auth-token'); // Task 5: Create a local variable for bearerToken.
    const { setIsLoggedIn } = useAppContext(); // Task 5: Create a local variable for setIsLoggedIn.

    useEffect(() => {
        if (bearerToken) {
            navigate('/app'); // If token exists, redirect to MainPage
        }
    }, [navigate, bearerToken]);

    // insert code here to create handleLogin function and include console.log
    const handleLogin = async () => {
        console.log("Inside handleLogin");
        console.log("Email:", email);
        console.log("Password:", password);try {
            // Task 7: Set method (POST)
            // Task 8: Set headers
            // Task 9: Set body to send user details
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST', // Task 7: Set the POST method
                headers: {
                    'Content-Type': 'application/json', // Task 8: Set headers
                    'Authorization': bearerToken ? `Bearer ${bearerToken}` : '', // Task 8: Set headers (Bearer token)
                },
                body: JSON.stringify({ // Task 9: Set body to send user details
                    email: email,
                    password: password,
                }),
            });

            // Implement API call for login later
            // Task 1: Access data in JSON format as a response from the backend
            const json = await response.json();

            if (json.authtoken) {// Task 2: Set user details in session storage
            sessionStorage.setItem('auth-token', json.authtoken);
            sessionStorage.setItem('name', json.userName);
            sessionStorage.setItem('email', json.userEmail);

            // Task 3: Set the user's state to logged in using the useAppContext
            setIsLoggedIn(true);
            setUserName(json.userName);
            setUserEmail(json.userEmail);

            // Task 4: Navigate to the MainPage after logging in
            navigate('/app');
        } else {
            // Task 5: Set an error message if the password is incorrect
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            setIncorrect("Wrong password. Try again.");
            // Below is optional, but recommended - clear out error message after 2 seconds
            setTimeout(() => {
                setIncorrect("");
            }, 2000);
        }

        } catch (e) {
            console.log("Error fetching details:", e.message);
            setIncorrect('Network error or server unavailable');
        }
    };

        return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="login-card p-4 border rounded">
              <h2 className="text-center mb-4 font-weight-bold">Login</h2>

          {/* insert code here to create input elements for the variables email and  password */}
          <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

          {/* insert code here to create a button that performs the `handleLogin` function on click */}
                <button className="btn btn-primary w-100" onClick={handleLogin}>Login</button>
          
                <p className="mt-4 text-center">
                    New here? <a href="/app/register" className="text-primary">Register Here</a>
                </p>

            </div>
          </div>
        </div>
      </div>
    )
}

export default LoginPage;
