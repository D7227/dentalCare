import { useLoginQaMutation } from "@/store/slices/qaslice/qaApi";
import { setUser } from "@/store/slices/userDataSlice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const QALogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading, error, data }] = useLoginQaMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        try {
            const result = await login({ email, password }).unwrap();
            localStorage.setItem("token", result?.token);
              dispatch(setUser(result?.user));
            navigate("/qa");
        } catch (err: any) {
            setFormError(err?.data?.error || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-800">QA Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input type="checkbox" className="form-checkbox text-blue-600" />
                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                        <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
                    </div>

                    {formError && (
                        <div className="text-red-600 text-sm text-center">{formError}</div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default QALogin;
