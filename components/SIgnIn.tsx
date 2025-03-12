'use client';

import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { logIn, getCurrentSession } from '@/appwrite/accounts';
import { getUser } from '@/appwrite/users';
import { userContext } from '@/context/UserContext';

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const userCtx = useContext(userContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const { email, password } = formData;

    try {
      const response = await logIn(email, password);
      if (response.status === 200 && response.data) {
        fetchUser();
        router.push('/');
      } else {
        setErrorMessage(response.message);
      }
    } catch (error: any) {
      setErrorMessage(error?.message || 'Invalid credentials, please try again.');
    }
  };

  const fetchUser = async () => {
    try {
      const session = await getCurrentSession();
      if (!session.status || !session.data?.email) {
        userCtx?.setUser(undefined);
        userCtx?.setIsLoggedIn(false);
        return;
      }

      const userResponse = await getUser(session.data.email);
      if (userResponse.status === 200 && userResponse.data) {
        userCtx?.setUser({
          name: userResponse.data.name,
          email: userResponse.data.email,
          role: userResponse.data.role,
          phone: userResponse.data.phone,
          profilePic: userResponse.data.profilePic,
        });
        userCtx?.setIsLoggedIn(true);
      } else {
        userCtx?.setUser(undefined);
        userCtx?.setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      userCtx?.setUser(undefined);
      userCtx?.setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white tracking-tight">Sign In</h2>

        {errorMessage && <p className="mt-3 text-center text-red-500 text-sm">{errorMessage}</p>}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <InputField name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} isRequired />
          <InputField name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} isRequired />

          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400 text-sm">
          Don’t have an account?{' '}
          <Link href="/auth/sign-up" className="text-blue-400 hover:text-blue-300 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

const InputField = ({ name, type = 'text', placeholder, value, onChange, isRequired = false }: any) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full px-4 py-2 bg-black text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base transition-colors duration-300"
    required={isRequired}
  />
);

export default SignIn;
