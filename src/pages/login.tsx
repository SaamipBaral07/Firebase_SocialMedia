import {auth,provider} from '../config/firebase'
import {signInWithPopup} from 'firebase/auth'
import {useNavigate} from "react-router-dom";
import { useState } from 'react';
import './login.css'; // Import the CSS file

export const Login=()=>{
    const navigate=useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const signInWithGoogle = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const result = await signInWithPopup(auth, provider);
            console.log("Login success:", result.user);
            navigate("/");
        } catch (error: any) { 
            console.error("Login error:", error);
            setError("Failed to sign in. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }
    
    return(
        <div className="login-container">
            <div className="login-card">
                <div className="login-brand">
                    <h1>SocialFeed</h1>
                    <p>Connect with friends and share your thoughts</p>
                </div>
                
                <div className="login-message">
                    <h2>Welcome!</h2>
                    <p>Sign in with Google to continue and start sharing your stories with the world.</p>
                </div>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                
                <button 
                    className={`google-signin-btn ${isLoading ? 'loading' : ''}`}
                    onClick={signInWithGoogle}
                    disabled={isLoading}
                >
                    {!isLoading && <div className="google-logo"></div>}
                    {isLoading ? 'Signing in...' : 'Sign in with Google'}
                </button>
                
                <div className="login-footer">
                    <p>
                        By signing in, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
}