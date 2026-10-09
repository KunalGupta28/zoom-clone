"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, getMe, forgotPassword } from "@/lib/api";
import { useUserStore } from "@/stores/user-store";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const router = useRouter();
  const { login: setLoginUser } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login({ email, password });
      localStorage.setItem("auth_token", data.access_token);
      
      const user = await getMe();
      setLoginUser(user);
      router.push("/");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address first");
      return;
    }
    
    setLoading(true);
    try {
      await forgotPassword(email);
      setResetSent(true);
      setError("");
      setTimeout(() => setResetSent(false), 5000);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer">
           <span className="text-[#0B5CFF] font-bold text-5xl tracking-tighter">zoom</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-gray-300 px-3 py-2.5 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-medium text-[#0B5CFF] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-xl border border-gray-300 px-3 py-2.5 pr-10 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded-lg">{error}</div>
            )}
            
            {resetSent && (
              <div className="text-green-600 text-sm font-medium text-center bg-green-50 py-2 rounded-lg border border-green-200">
                A password reset link has been sent to your email.
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-xl border border-transparent bg-[#0B5CFF] hover:bg-[#0043C9] py-2.5 px-4 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/signup"
                className="flex w-full justify-center rounded-xl border border-gray-300 bg-white py-2.5 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
              >
                Create a new account
              </Link>
            </div>
            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-[#0B5CFF] font-medium hover:underline">
                Continue as Guest
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
