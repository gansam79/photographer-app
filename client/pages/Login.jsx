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

        if (username === "admin" && password === "admin") {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("user", username);
            navigate("/dashboard");
        } else {
            setError("Invalid username or password (try admin/admin)");
        }
    };

    return (
        <div className="relative w-full px-4">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-r from-rose-100/40 via-amber-100/30 to-emerald-100/40 blur-3xl" />
            <div className="pointer-events-none absolute left-10 top-10 hidden h-32 w-32 rounded-full bg-gradient-to-br from-amber-200/50 to-white/60 blur-2xl lg:block" />
            <div className="pointer-events-none absolute right-10 bottom-10 hidden h-24 w-24 rounded-full bg-gradient-to-br from-emerald-200/50 to-white/60 blur-2xl lg:block" />

            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[40px] border border-[#e6eaf2] bg-gradient-to-br from-white via-[#fdfefe] to-[#f5f7fb] p-6 text-charcoal-900 shadow-[0_35px_120px_rgba(15,23,42,0.12)] sm:p-8 lg:p-10">
                <div className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 text-white font-playfair text-xl">P</div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Studio Console</p>
                                <p className="font-playfair text-lg font-semibold text-charcoal-900">The Patil Photography & Film's</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-4xl font-semibold leading-tight">Enter the unified ops suite</h1>
                            <p className="text-sm text-slate-600">
                                Orchestrate shoots, quotes, payouts, and galleries from a single cockpit. Same tonal language as dashboard and admin registry for a seamless narrative.
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <StatCard label="Active shoots" value="12" helper="Across India" accent="from-[#fff5dc]" />
                            <StatCard label="Invoices cleared" value="82%" helper="This quarter" accent="from-[#e9f9f0]" />
                        </div>
                        <div className="rounded-3xl border border-slate-100 bg-white/90 p-5 text-sm text-slate-600 shadow-inner">
                            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Support</p>
                            <p className="mt-1">Need access? Ping studio owner or mail ops@patil.studio</p>
                            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                                <Badge>24/7 Secure</Badge>
                                <Badge>GST compliant</Badge>
                                <Badge>Managed by Lumina Ops</Badge>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 translate-x-6 translate-y-6 rounded-3xl bg-gradient-to-br from-white to-transparent opacity-40 blur-2xl" />
                        <div className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
                            <div className="mb-6 text-center">
                                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Sign in</p>
                                <h2 className="mt-2 text-2xl font-semibold text-charcoal-900">Admin Access</h2>
                                <p className="text-xs text-slate-500">Use studio-issued credentials only.</p>
                            </div>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <Field label="Username">
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="input"
                                        placeholder="admin"
                                        required
                                    />
                                </Field>
                                <Field label="Password">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input"
                                        placeholder="••••••"
                                        required
                                    />
                                </Field>
                                {error && <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-600">{error}</div>}
                                <button
                                    type="submit"
                                    className="w-full rounded-xl bg-[#d39a6f] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c7885b]"
                                >
                                    Login
                                </button>
                                {/* <p className="text-center text-xs text-slate-500">Demo: admin / admin</p> */}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function Field({ label, children }) {
    return (
        <label className="block text-sm font-semibold text-slate-600">
            {label}
            <div className="mt-1">{children}</div>
        </label>
    );
}

function StatCard({ label, value, helper, accent = "from-[#fff5dc]" }) {
    return (
        <div className={`rounded-3xl border border-slate-100 bg-gradient-to-br ${accent} to-white p-4 shadow-sm`}>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-charcoal-900">{value}</p>
            <p className="text-xs text-slate-500">{helper}</p>
        </div>
    );
}

function Badge({ children }) {
    return <span className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-500">{children}</span>;
}

export default Login;
