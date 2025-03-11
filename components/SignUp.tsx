'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '@/appwrite/accounts';
import Link from 'next/link';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'guest',
    phone: '',
    profilePic: '',
  });

  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrorMessage(null);

    const { email, password, name, role, phone, profilePic } = formData;
    try {
      const response = await createUser(email, password, name, role, phone, profilePic);
      if(response.status==200){
        setMessage(response.message);
        setTimeout(() => router.push('/auth/sign-in'), 1500); // Redirect after success
      }else{
        setMessage(response.message);
      }
        
    } catch (error: any) {
      console.error('Error signing up:', error);
      setErrorMessage(error?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen  px-4">

      <div className="w-full max-w-md p-6 sm:p-8  rounded-lg ">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white tracking-tight">Create an Account</h2>

        {message && <p className="mt-3 text-center text-green-500 text-sm">{message}</p>}
        {errorMessage && <p className="mt-3 text-center text-red-500 text-sm">{errorMessage}</p>}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <InputField name="name" placeholder="Full Name" isRequired value={formData.name} onChange={handleChange} />
          <InputField name="email" type="email" isRequired placeholder="Email" value={formData.email} onChange={handleChange} />
          <InputField name="password" type="password" isRequired placeholder="Password" value={formData.password} onChange={handleChange} />

          <div>
            <label className="block text-gray-300 text-sm mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 text-gray-300 bg-black border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors duration-300"
            >
              <option value="guest">Guest</option>
              <option value="host">Host</option>
            </select>
          </div>

          <InputField name="phone" type="tel" placeholder="Phone (Optional)" value={formData.phone} onChange={handleChange} />
          <InputField name="profilePic" placeholder="Profile Pic URL (Optional)" value={formData.profilePic} onChange={handleChange} />

          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <Link href="/auth/sign-in" className="text-blue-400 hover:text-blue-300 transition-colors">
            Sign in
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

export default SignUp;
