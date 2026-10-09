"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmail } from "@/lib/api";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    verifyEmail(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100 text-center">
          {status === "loading" && (
            <div>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B5CFF] mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900">Verifying your email...</h2>
            </div>
          )}
          
          {status === "success" && (
            <div>
              <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Email Verified!</h2>
              <p className="text-gray-500 mb-6">Your email address has been successfully verified.</p>
              <Link href="/auth?mode=login" className="w-full inline-flex justify-center rounded-xl border border-transparent bg-[#0B5CFF] hover:bg-[#0043C9] py-2.5 px-4 text-sm font-semibold text-white shadow-sm transition-colors">
                Continue to Login
              </Link>
            </div>
          )}

          {status === "error" && (
            <div>
              <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">!</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-500 mb-6">The verification link is invalid or has expired.</p>
              <Link href="/auth?mode=login" className="w-full inline-flex justify-center rounded-xl border border-gray-300 bg-white py-2.5 px-4 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50"></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
