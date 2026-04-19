import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Toast from '../components/SuccessToast';
import useFetch from '../hooks/useFetch'; // Import useFetch

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    
    // State for form fields
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [toastError, setToastError] = useState(null);

    // 1. Setup useFetch (initially idle with null path)
    const [triggerPath, setTriggerPath] = useState(null);
    
    const { data, loading, error } = useFetch(
        triggerPath,
        'POST',
        formData
    );

    // 2. Listen for response from useFetch
    useEffect(() => {
        if (data) {
            navigate('/login');
        }
        if (error) {
            const errorMsg = error.response?.data?.message || "Registration failed. Please try again.";
            console.error("Registration failed:", errorMsg);
            setToastError({ title: "Registration Failed", msg: errorMsg });
            setTriggerPath(null); // Reset so the user can try again
        }
    }, [data, error, navigate]);

    const validate = () => {
        const { username, email, password } = formData;
        if (!username || !email || !password) return "All fields are required";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Invalid email format";

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character";
        }
        return null;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (toastError) setToastError(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationError = validate();

        if (validationError) {
            setToastError({ title: "Validation Error", msg: validationError });
            return;
        }

        // 3. Trigger the registration request
        setTriggerPath('/api/auth/register');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-dark-bg)] px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-[var(--color-dark-surface)] p-8 rounded-xl border border-[var(--color-dark-border)] shadow-2xl">

                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-[var(--color-dark-text)]">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-[var(--color-dark-muted)]">
                        Join the community and start sharing videos
                    </p>
                </div>

                {toastError && (
                    <div className='flex flex-col gap-3 items-center justify-center'>
                        <Toast
                            type="error"
                            title={toastError?.title}
                            message={toastError?.msg}
                            onClose={() => setToastError(null)}
                        />
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-[var(--color-dark-border)] placeholder-[var(--color-dark-muted)] text-[var(--color-dark-text)] bg-[var(--color-dark-bg)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-dark-primary)] focus:border-transparent sm:text-sm"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-[var(--color-dark-border)] placeholder-[var(--color-dark-muted)] text-[var(--color-dark-text)] bg-[var(--color-dark-bg)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-dark-primary)] focus:border-transparent sm:text-sm"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative group">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-[var(--color-dark-border)] placeholder-[var(--color-dark-muted)] text-[var(--color-dark-text)] bg-[var(--color-dark-bg)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-dark-primary)] focus:border-transparent sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-dark-muted)] hover:text-[var(--color-dark-text)] transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-[var(--color-dark-primary)] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50"
                        >
                            {loading ? "Creating Account..." : "Sign Up"}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-[var(--color-dark-muted)]">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-[var(--color-dark-accent)] hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;