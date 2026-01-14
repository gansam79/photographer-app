import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError(null);

        // Simple hardcoded check for demonstration (as requested: "simple username & password based login")
        // In a real app, this would check against an API but without JWT as requested.
        // For now, we simulate a successful login if fields are not empty, 
        // or we can use specific credentials like admin/admin.
        if (username === "admin" && password === "admin") {
            localStorage.setItem("isLoggedIn", "true");
            // Optional: Store username
            localStorage.setItem("user", username);
            navigate("/");
        } else {
            setError("Invalid username or password (try admin/admin)");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-center text-2xl font-bold text-charcoal-900">Admin Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter username"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    {error && <div className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</div>}
                    <button
                        type="submit"
                        className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
