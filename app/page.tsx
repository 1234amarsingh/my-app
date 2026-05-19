"use client";

import React,{ useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";

import {
  Mail,
  Lock,
  Smartphone,
  Building2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

export default function AdminLoginPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const handleLogin = async (e:any) => {

    e.preventDefault();

    if (
      !email ||
      !phone ||
      !password
    ) {

      alert("Please fill all fields");

      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            phone,
            password,
          }),
        }
      );

      const data =
        await response.text();

      if (response.ok) {

        alert("Login Successful");

        router.push("/main");

      } else {

        alert(data);
      }

    } catch (error) {

      alert("Server Error");
    }

    setLoading(false);
  };

  return (

    <div className="min-h-screen bg-white flex items-center justify-center p-4">

      <Card className="w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">

        <div className="grid lg:grid-cols-2">

          {/* LEFT SIDE */}

          <div className="hidden lg:flex relative overflow-hidden rounded-l-[32px]">

            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2070&auto=format&fit=crop"
              alt="University"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

            <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">

              <div>

                <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur flex items-center justify-center mb-10 border border-white/20">

                  <Building2 className="w-12 h-12" />

                </div>

                <h1 className="text-6xl font-black leading-tight">
                  Welcome
                  <br />
                  Back
                </h1>

                <p className="mt-6 text-lg leading-relaxed text-white/80 max-w-md">
                  Access your institute dashboard,
                  attendance system, analytics and
                  secure management portal.
                </p>

                <div className="grid grid-cols-2 gap-5 mt-12">

                  <div className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur">

                    <h3 className="text-lg font-bold">
                      Secure Login
                    </h3>

                    <p className="text-sm text-white/70 mt-2">
                      Advanced authentication system
                    </p>

                  </div>

                  <div className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur">

                    <h3 className="text-lg font-bold">
                      Smart Access
                    </h3>

                    <p className="text-sm text-white/70 mt-2">
                      Modern institute management
                    </p>

                  </div>

                </div>

              </div>

              <p className="text-sm text-white/70">
                AI Powered Attendance System
              </p>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <CardContent className="p-8 md:p-14 bg-black/40 backdrop-blur-xl">

            <div className="mb-10">

              <div className="lg:hidden flex justify-center mb-6">

                <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center">

                  <Building2 className="w-10 h-10 text-white" />

                </div>

              </div>

              <h2 className="text-4xl font-black text-white">
                Admin Login
              </h2>

              <p className="text-slate-400 mt-3 text-base">
                Login using your registered
                institute credentials
              </p>

            </div>

            <form
              onSubmit={handleLogin}
              className="space-y-6"
            >

              {/* EMAIL */}

              <div className="space-y-2">

                <Label className="text-slate-200">
                  Email Address
                </Label>

                <div className="relative">

                  <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

                  <Input
                    type="email"
                    placeholder="admin@email.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    className="h-14 pl-12 rounded-2xl bg-white border-white/10 text-white placeholder:text-slate-400"
                  />

                </div>

              </div>

              {/* PHONE */}

              <div className="space-y-2">

                <Label className="text-slate-200">
                  Phone Number
                </Label>

                <div className="relative">

                  <Smartphone className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

                  <Input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value
                      )
                    }
                    className="h-14 pl-12 rounded-2xl bg-white border-white/10 text-white placeholder:text-slate-600"
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="space-y-2">

                <Label className="text-slate-200">
                  Password
                </Label>

                <div className="relative">

                  <Lock className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

                  <Input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    className="h-14 pl-12 pr-12 rounded-2xl bg-white border-white/10 text-white placeholder:text-slate-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-4 text-slate-400"
                  >

                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}

                  </button>

                </div>

              </div>

              {/* BUTTON */}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl text-base font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:opacity-90"
              >

                {loading ? (

                  <div className="flex items-center gap-2">

                    <Loader2 className="w-5 h-5 animate-spin" />

                    Logging In...

                  </div>

                ) : (
                  "Login"
                )}

              </Button>

            </form>
            <p className="text-center text-sm text-slate-500 mt-8">
              Protected Institute Authentication
            </p>

          </CardContent>

        </div>

      </Card>

    </div>
  );
}