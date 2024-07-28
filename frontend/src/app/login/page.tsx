'use client';
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuthStore } from '../store/useUserStore';
import { getSession } from 'next-auth/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { data: session } = useSession();
  const setToken = useAuthStore((state) => state.setToken);

 useEffect(() => {
    if (session?.user) {
      setToken(session.user.token);
      console.log('User ID:', session.user.id);
      console.log('User Email:', session.user.email);
      router.push("/hello-world")
    }
  }, [session, setToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        const session = await getSession();
        setToken(session?.user?.token || '');
        toast.success('Login successful');
        router.push('/hello-world');
      } else {
        throw new Error(result?.error || 'Login failed');
      }
    } catch (error: any) {
      toast.error(`Login error: ${error.message}`);
    }
  };

  const redirectToRegister = () => {
    router.push('/register');
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Login to Your Account
              </h1>
              <p className="text-gray-600 md:text-xl">
                Enter your credentials to access your account
              </p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Login
              </button>
            </form>
            <div className="flex justify-center">
              <button
                onClick={redirectToRegister}
                className="text-sm text-gray-600 hover:underline"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default Login;

