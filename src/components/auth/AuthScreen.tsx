import { useState } from 'react';

interface AuthScreenProps {
  onSuccess: () => void;
}

export default function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // for supabase
    // if (isLogin) {
    //   const { error } = await supabase.auth.signInWithPassword({ email, password });
    //   if (!error) onSuccess();
    // } else {
    //   const { error } = await supabase.auth.signUp({ email, password });
    //   if (!error) onSuccess(); // Or tell them to check their email
    // }
    
    // Mocking a successful login/signup delay for now
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f8fa] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border-t-4 border-[#3c99aa]">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#10374d]">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {isLogin 
              ? 'Enter your credentials to access your courses.' 
              : 'Sign up to start your learning journey.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#10374d]">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 transition-colors focus:border-[#3c99aa] focus:outline-none focus:ring-2 focus:ring-[#a9feed]/50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#10374d]">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 transition-colors focus:border-[#3c99aa] focus:outline-none focus:ring-2 focus:ring-[#a9feed]/50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full rounded-lg bg-[#10374d] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#3c99aa] disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-[#3c99aa] hover:text-[#10374d] transition-colors"
          >
            {isLogin ? 'Sign up here' : 'Sign in here'}
          </button>
        </div>
      </div>
    </div>
  );
}