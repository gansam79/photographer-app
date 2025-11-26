import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const auth = useAuth();
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Login failed");
            auth.login(data.token, data.user);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-24 p-6 border rounded">
            <h2 className="text-2xl mb-4">Login</h2>
            <form onSubmit={submit}>
                <label className="block mb-2">Email</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                    type="email"
                />
                <label className="block mb-2">Password</label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                    type="password"
                />
                {error && <div className="text-red-600 mb-2">{error}</div>}
                <button className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
            </form>
        </div>
    );
};

export default Login;
