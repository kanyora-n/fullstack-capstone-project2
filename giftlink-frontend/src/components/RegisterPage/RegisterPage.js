import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Task 3
import useAppContext from '../context/AuthContext'; // Task 2
import { urlConfig } from '../../config'; // Task 1
import './RegisterPage.css';

function RegisterPage() {

    //insert code here to create useState hook variables for firstName, lastName, email, password
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showerr, setShowerr] = useState(''); // Task 4
    const navigate = useNavigate(); // Task 5
    const { setIsLoggedIn } = useAppContext(); // Task 5

    // insert code here to create handleRegister function and include console.log
    const handleRegister = async () => {
        console.log("Register invoked");
        console.log("First Name:", firstName);
        console.log("Last Name:", lastName);
        console.log("Email:", email);
        console.log("Password:", password);
        // Implement API call for registration later
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST', // Task 6
                headers: { // Task 7
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ // Task 8
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                }),
            });
    
            if (!response.ok) {
                // Handle non-successful responses (e.g., 400, 500)
                const errorData = await response.json();
                setShowerr(errorData.message || 'Registration failed');
                return;
            }
    
            // Task 1: Access data coming from fetch API
            const json = await response.json();

            if (json.authtoken) {
                // Task 2: Set user details
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', firstName);
                sessionStorage.setItem('email', json.email);

                // Task 3: Set the state of user to logged in using useAppContext
                setIsLoggedIn(true);

                // Task 4: Navigate to the MainPage after logging in
                navigate('/app');
            } else {
                // Task 5: Set an error message if the registration fails
                if (json.error) {
                    setShowerr(json.error);
                } else {
                    setShowerr("Registration failed"); // Default error message
                }
            }
    
        } catch (e) {
            console.log("Error fetching details: " + e.message);
            setShowerr('Network error or server unavailable');
        }
    };

         return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="register-card p-4 border rounded">
                            <h2 className="text-center mb-4 font-weight-bold">Register</h2>

                    {/* insert code here to create input elements for all the variables - firstName, lastName, email, password */}
                    <div className="mb-4">
                            <label htmlFor="firstName" className="form-label">First Name</label><br />
                            <input
                                id="firstName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your first name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="lastName" className="form-label">Last Name</label><br />
                            <input
                                id="lastName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="form-label">Email</label><br />
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {showerr && <p className="text-danger">{showerr}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label">Password</label><br />
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                    {/* insert code here to create a button that performs the `handleRegister` function on click */}
                    <button className="btn btn-primary w-100 mb-3" onClick={handleRegister}>Register</button>
                        <p className="mt-4 text-center">
                            Already a member? <a href="/app/login" className="text-primary">Login</a>
                        </p>

                         </div>
                    </div>
                </div>
            </div>

         )//end of return
}

export default RegisterPage;
