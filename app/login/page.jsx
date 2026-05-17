"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [studentName, setStudentName] = useState("");
  const [enrollment, setEnrollment] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:8080/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentName,
            enrollment,
            password,
          }),
        }
      );

      if (res.ok) {
        alert("Login Successful ✅");
        router.push("/dashboard");
      } else {
        alert("Invalid Credentials ❌");
      }
    } catch (error) {
      alert("Server Error ⚠️");
    }
  };

  return (
    <div className="min-h-screen w-579px flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative">

        {/* Back Button */}

        <h1 className="text-3xl font-black text-center mb-8 mt-6">
          Student Login
        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          {/* Student Name */}
          <input
            type="text"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) =>
              setStudentName(e.target.value)
            }
            className="w-full border-2 border-gray-200 rounded-2xl p-4 outline-none focus:border-black"
            required
          />

          {/* Enrollment */}
          <input
            type="text"
            placeholder="Enrollment"
            value={enrollment}
            onChange={(e) =>
              setEnrollment(e.target.value)
            }
            className="w-full border-2 border-gray-200 rounded-2xl p-4 outline-none focus:border-black"
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border-2 border-gray-200 rounded-2xl p-4 outline-none focus:border-black"
            required
          />

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-black text-white rounded-2xl p-4 font-bold text-lg hover:scale-[1.02] duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Do not have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-bold"
          >
            Sign Up
          </Link>
        </p>
        <button
          onClick={() => router.back()}
          className="absolute down-5 left-5 text-black px-4 py-2 rounded-xl text-sm font-bold hover:scale-105 duration-200"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}