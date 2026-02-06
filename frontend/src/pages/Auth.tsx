import React, { useState } from "react";
import { signUp, signIn } from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Auth = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isSignup) {
                // For Signup
                await signUp(formData);
                setIsSignup(false); // Move to login after successful signup
                alert("Signup successful! Now please login.");
            } else {
                // For Login
                const { data } = await signIn({ 
                    username: formData.email, // Adjust based on your backend field name
                    password: formData.password 
                });

                // Save to localStorage
                localStorage.setItem("token", data.token);
                localStorage.setItem("profile", data.username);

                // Redirect home and force a reload to pick up the new token
                window.location.href = "/";
            }
        } catch (err) {
            console.error(err);
            alert("Authentication failed. Check your credentials.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Aryan Planet</h1>
                <p>{isSignup ? "Create your account" : "Welcome back, explorer"}</p>
                
                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <input 
                            name="username" 
                            placeholder="Username" 
                            onChange={handleChange} 
                            required 
                        />
                    )}
                    <input 
                        name="email" 
                        placeholder="Email or Username" 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        name="password" 
                        type="password" 
                        placeholder="Password" 
                        onChange={handleChange} 
                        required 
                    />
                    
                    <button type="submit" className="auth-btn">
                        {isSignup ? "Join the Planet" : "Sign In"}
                    </button>
                </form>

                <p className="switch-text" onClick={() => setIsSignup(!isSignup)}>
                    {isSignup ? "Already have an account? Sign In" : "New here? Create an account"}
                </p>
            </div>
        </div>
    );
};

export default Auth;