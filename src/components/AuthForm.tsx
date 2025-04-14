import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, Link2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface AuthFormProps {
  onSubmit: (email: string, password: string) => void;
  type: 'login' | 'register';
}

export function AuthForm({ onSubmit, type }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState<'email' | 'password' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative">
      <div className="text-center mb-8 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mb-6 group">
          <Link2 className="w-8 h-8 text-indigo-600 transform group-hover:rotate-12 transition-transform duration-300" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">URL Shortener</h1>
        <p className="text-lg text-gray-600">Simplify your links, amplify your reach</p>
      </div>

      <div className="bg-white/90 rounded-2xl shadow-xl p-8 backdrop-blur-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50" />
        <div className="relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {type === 'login' ? 'Welcome back!' : 'Create your account'}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {type === 'login'
                  ? 'Enter your details to access your account'
                  : 'Start shortening your URLs in seconds'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="group">
                <div className="relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                  </div>
                  <div className="relative">
                    <Mail className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300",
                      focused === 'email' ? "text-indigo-600" : "text-gray-400"
                    )} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused(null)}
                      placeholder="you@example.com"
                      className={cn(
                        "block w-full pl-10 pr-3 py-2.5 border rounded-xl bg-white/80 transition-all duration-300",
                        focused === 'email'
                          ? "border-indigo-600 ring-1 ring-indigo-600 shadow-sm shadow-indigo-100"
                          : "border-gray-300 hover:border-gray-400 group-hover:shadow-sm"
                      )}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300",
                      focused === 'password' ? "text-indigo-600" : "text-gray-400"
                    )} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocused('password')}
                      onBlur={() => setFocused(null)}
                      placeholder="••••••••"
                      className={cn(
                        "block w-full pl-10 pr-12 py-2.5 border rounded-xl bg-white/80 transition-all duration-300",
                        focused === 'password'
                          ? "border-indigo-600 ring-1 ring-indigo-600 shadow-sm shadow-indigo-100"
                          : "border-gray-300 hover:border-gray-400 group-hover:shadow-sm"
                      )}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "relative w-full py-2.5 px-4 flex items-center justify-center rounded-xl text-white font-medium overflow-hidden transition-all duration-300",
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:transform active:scale-[0.98] hover:shadow-lg"
              )}
            >
              <div className="relative z-10">
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  type === 'login' ? 'Sign in' : 'Create account'
                )}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}