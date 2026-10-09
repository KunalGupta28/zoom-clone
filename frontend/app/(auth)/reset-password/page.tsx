"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/lib/api";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }
    if (!token) {
      setErrorMsg("Invalid reset token");
      return;
    }

    setStatus("loading");
    try {
      await resetPassword(token, password);
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer">
           <span className="text-[#0B5CFF] font-bold text-5xl tracking-tighter">zoom</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Reset your password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          
          {status === "success" ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Password Reset Successful!</h2>
              <p className="text-gray-500 mb-6">You can now log in with your new password.</p>
              <Link href="/auth?mode=login" className="w-full inline-flex justify-center rounded-xl border border-transparent bg-[#0B5CFF] hover:bg-[#0043C9] py-2.5 px-4 text-sm font-semibold text-white shadow-sm transition-colors">
                Continue to Login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full appearance-none rounded-xl border border-gray-300 px-3 py-2.5 pr-10 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full appearance-none rounded-xl border border-gray-300 px-3 py-2.5 pr-10 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {(status === "error" || errorMsg) && (
                <div className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={status === "loading" || !token}
                  className="flex w-full justify-center rounded-xl border border-transparent bg-[#0B5CFF] hover:bg-[#0043C9] py-2.5 px-4 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {status === "loading" ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50"></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
