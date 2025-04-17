import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react"; // Import Lucide Loader
import store from "@/redux/store";
import { useSelector } from "react-redux";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const {user}=useSelector(store=>store.auth)

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();

    if (!input.username || !input.email || !input.password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/user/register`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
        setInput({ username: "", email: "", password: "" });
        document.querySelector("input[name='username']").focus();
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
    <div className="flex items-center justify-center w-screen h-screen relative bg-gradient-to-br from-gray-900 via-blue-950 to-purple-900">
      <div className="absolute top-10 left-10 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>

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
            Connect with the world through photos & videos.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={signupHandler} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label className="text-gray-300 font-medium">Create a Username</Label>
              <Input
                type="text"
                name="username"
                value={input.username}
                onChange={changeEventHandler}
                placeholder="Choose your username"
                className="focus:ring-2 focus:ring-blue-500 border border-gray-300/40 bg-white/10 text-white px-4 py-2 rounded-md placeholder:text-gray-300/70 focus:shadow-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-gray-300 font-medium">Your Email Address</Label>
              <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                placeholder="Enter your email"
                className="focus:ring-2 focus:ring-blue-500 border border-gray-300/40 bg-white/10 text-white px-4 py-2 rounded-md placeholder:text-gray-300/70 focus:shadow-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-gray-300 font-medium">Set a Password</Label>
              <Input
                type="password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                placeholder="8+ characters, mix of symbols"
                className="focus:ring-2 focus:ring-blue-500 border border-gray-300/40 bg-white/10 text-white px-4 py-2 rounded-md placeholder:text-gray-300/70 focus:shadow-lg"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white font-semibold transition-all duration-300 rounded-lg py-2 flex items-center justify-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" /> Signing up...
                </>
              ) : (
                "Join InstaVista"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-300 mt-5">
            Already a member?{" "}
            <Link to="/login" className="text-blue-300 hover:underline">
              Sign in
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

export default Signup;
