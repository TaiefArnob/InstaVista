import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();
  const dispatch=useDispatch()
  const {user}=useSelector(store=>store.auth)

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();

    if (!input.email || !input.password) {
      toast.error("Email and Password are required!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/user/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user))
        navigate('/')
        toast.success(res.data.message);
        setInput({ email: "", password: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(user){
      navigate('/')
    }
  },[])
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-purple-900 relative">
      <Card className="w-[420px] shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-extrabold text-white transition-all duration-300 hover:scale-105 hover:text-blue-400">
            <span className="text-blue-300 hover:text-purple-300 transition-all duration-300">
              Insta
            </span>
            <span className="text-purple-300 hover:text-blue-300 transition-all duration-300">
              Vista
            </span>
          </CardTitle>
          <p className="text-gray-300 text-sm mt-1">
            Welcome back! Log in to continue.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={loginHandler} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label className="text-gray-300 font-medium">Email Address</Label>
              <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                placeholder="Enter your email"
                className="bg-white/10 text-white px-4 py-2 rounded-md placeholder:text-gray-300/70 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-gray-300 font-medium">Password</Label>
              <Input
                type="password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                placeholder="Enter your password"
                className="bg-white/10 text-white px-4 py-2 rounded-md placeholder:text-gray-300/70 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white font-semibold rounded-lg py-2 transition-all duration-300"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 mx-auto" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-300 mt-5">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-300 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>

      <p className="absolute bottom-5 text-gray-400 text-sm text-center w-full">
        Created by{" "}
        <span className="font-semibold text-white hover:text-blue-300 transition-all duration-300">
          TaiefArnob
        </span>
      </p>
    </div>
  );
};

export default Login;
