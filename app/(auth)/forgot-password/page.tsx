"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/validations/auth";
import Link from "next/link";
import { Leaf, Mail, Loader2, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setError(null);
    setIsSubmitting(true);
    try {
      // Mock API call to trigger password recovery email
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err: any) {
      setError("Unable to process request. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-8 bg-slate-900/60 border border-slate-800/80 p-8 rounded-2xl backdrop-blur-xl relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 mb-4">
            <Leaf className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">EcoSphere</h2>
          <p className="mt-2 text-sm text-slate-400">Recover your ESG Platform Account</p>
        </div>

        {success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 p-6 rounded-lg text-center space-y-4">
            <CheckCircle className="h-12 w-12 mx-auto text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Reset Email Sent</h3>
            <p className="text-sm text-slate-350 leading-relaxed">
              If an account exists for that email, we have sent instructions to reset your password.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors mt-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-450 p-4 rounded-lg flex items-start space-x-2 text-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    {...register("email")}
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-950/85 border border-slate-850 rounded-lg text-slate-200 placeholder-slate-655 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-sm"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-400 font-medium">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-500/10"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Sending link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <div className="text-center mt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
