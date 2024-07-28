'use client';

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/useUserStore";
import 'bootstrap/dist/css/bootstrap.min.css';

const HelloWorld = () => {
  const { data: session } = useSession();
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  const handleLogout = async () => {
    const token = useAuthStore.getState().token;
    console.log(token);
    try {
      await axios.post('http://localhost:3001/logout', { token });
      signOut({ callbackUrl: '/login' });
    } catch (error) {
      toast.error("Failed to log out.");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(session);
    try {
      await axios.put('http://localhost:3001/update-user', { email: session?.user?.email, phone });
      toast.success("Phone number updated!");
    } catch (error) {
      console.log(session?.user?.email);
      toast.error("Failed to update phone number.");
    }
  };

  return (
    <div className="container mt-5">
      <Toaster />
      <h1 className="text-center">Hello, World!</h1>
      <p className="text-center">Welcome, {session?.user?.email}</p>
      <div className="text-center mb-3">
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>
      <form className="w-50 mx-auto" onSubmit={handleUpdate}>
        <div className="form-group mb-3">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="number"
            className="form-control"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary">Update Phone</button>
        </div>
      </form>
    </div>
  );
};

export default HelloWorld;
