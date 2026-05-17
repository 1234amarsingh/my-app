// "use client";

// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Smartphone, Lock, Mail } from "lucide-react";

// export default function LoginPage() {
//   const [openOtp, setOpenOtp] = useState(false);
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");

//   const adminLogin = () => {
//     if (!phone) {
//       alert("Please enter phone number");
//       return;
//     }

//     // Backend API Call Here
//     // Example:
//     // await fetch("/api/send-otp", { method: "POST" })

//     setOpenOtp(true);
//   };

//   const verifyOtp = () => {
//     // Verify OTP API
//     alert("Login Successful");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4">
//       <Card className="w-full max-w-md shadow-2xl rounded-3xl border border-slate-700 bg-slate-900/80 backdrop-blur">
//         <CardContent className="p-8 space-y-6">
//           <div className="text-center">
//             <h1 className="text-3xl font-bold text-white">
//               Login Account
//             </h1>
//             <p className="text-slate-400 mt-2">
//               Welcome back 👋
//             </p>
//           </div>

//           {/* Email */}
//           <div className="space-y-2">
//             <Label className="text-slate-200">Email</Label>

//             <div className="relative">
//               <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />

//               <Input
//                 type="email"
//                 placeholder="Enter email"
//                 className="pl-10 bg-slate-800 border-slate-700 text-white"
//               />
//             </div>
//           </div>

//           {/* Phone Number */}
//           <div className="space-y-2">
//             <Label className="text-slate-200">Phone Number</Label>

//             <div className="relative">
//               <Smartphone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />

//               <Input
//                 type="tel"
//                 placeholder="+91 9876543210"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 className="pl-10 bg-slate-800 border-slate-700 text-white"
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div className="space-y-2">
//             <Label className="text-slate-200">Password</Label>

//             <div className="relative">
//               <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />

//               <Input
//                 type="password"
//                 placeholder="Enter password"
//                 className="pl-10 bg-slate-800 border-slate-700 text-white"
//               />
//             </div>
//           </div>

//           {/* Login Button */}
//           <Button
//             onClick={adminLogin}
//             className="w-full h-11 rounded-xl text-base font-semibold"
//           >
//             Login
//           </Button>

//           <p className="text-center text-sm text-slate-400">
//             OTP will be sent to your phone number
//           </p>
//         </CardContent>
//       </Card>

//       {/* OTP Dialog */}
//       <Dialog open={openOtp} onOpenChange={setOpenOtp}>
//         <DialogContent className="bg-slate-900 border border-slate-700 text-white rounded-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-center text-2xl">
//               Verify OTP
//             </DialogTitle>
//           </DialogHeader>

//           <div className="space-y-4 mt-4">
//             <p className="text-center text-slate-400">
//               OTP sent to {phone}
//             </p>

//             <Input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="bg-slate-800 border-slate-700 text-white text-center tracking-[8px] text-lg"
//             />

//             <Button
//               onClick={verifyOtp}
//               className="w-full rounded-xl"
//             >
//               Verify OTP
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import {
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Hash,
  Landmark,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export default function Page() {

  const router = useRouter();

  // ==========================
  // STATES
  // ==========================

  const [instituteName, setInstituteName] =
    useState("");

  const [directorName, setDirectorName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [contact, setContact] =
    useState("");

  const [pincode, setPincode] =
    useState("");

  const [state, setState] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  // ==========================
  // REGISTER FUNCTION
  // ==========================

  const handleRegister = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (
      !instituteName ||
      !directorName ||
      !email ||
      !password ||
      !address ||
      !contact ||
      !pincode ||
      !state
    ) {

      alert("Please fill all fields");

      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:8080/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            instituteName,
            directorName,
            email,
            password,
            address,
            contact,
            pincode,
            state,
          }),
        }
      );

      const data =
        await response.text();

      if (response.ok) {

        alert(data);

        // Redirect Login Page
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
    <div className="min-h-screen relative overflow-hidden bg-slate-950 flex items-center justify-center p-4">

      {/* BACKGROUND */}

      <div className="absolute inset-0">

        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl" />

      </div>

      {/* CARD */}

      <Card className="relative z-10 w-full max-w-6xl overflow-hidden rounded-[32px] border border-slate-800 bg-slate-900/80 backdrop-blur-2xl shadow-[0_0_60px_rgba(79,70,229,0.25)]">

        <div className="grid lg:grid-cols-2">

          {/* LEFT SIDE */}

          <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-12 text-white relative overflow-hidden">

            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />

            <div className="relative z-10">

              <div className="w-24 h-24 rounded-3xl bg-white/15 backdrop-blur flex items-center justify-center border border-white/20 mb-10">

                <Building2 className="w-12 h-12" />

              </div>

              <h1 className="text-6xl font-black leading-tight">
                Institute
                <br />
                Registration
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-white/80 max-w-md">
                Create your institute admin
                account and manage attendance,
                analytics, students and teachers
                from one smart dashboard.
              </p>

              <div className="grid grid-cols-2 gap-5 mt-12">

                <div className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur">

                  <ShieldCheck className="w-10 h-10 mb-4" />

                  <h3 className="text-lg font-bold">
                    Secure
                  </h3>

                  <p className="text-sm text-white/70 mt-2">
                    Advanced admin authentication
                  </p>

                </div>

                <div className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur">

                  <Building2 className="w-10 h-10 mb-4" />

                  <h3 className="text-lg font-bold">
                    Smart Dashboard
                  </h3>

                  <p className="text-sm text-white/70 mt-2">
                    AI powered institute management
                  </p>

                </div>

              </div>

            </div>

            <p className="relative z-10 text-sm text-white/70">
              AI Powered Attendance System
            </p>

          </div>

          {/* RIGHT SIDE */}

          <CardContent className="p-8 md:p-12">

            <div className="mb-10">

              <div className="lg:hidden flex justify-center mb-6">

                <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center">

                  <Building2 className="w-10 h-10 text-white" />

                </div>

              </div>

              <h2 className="text-4xl font-black text-white">
                Create Admin Account
              </h2>

              <p className="text-slate-400 mt-3">
                Fill institute details below
              </p>

            </div>

            <form
              onSubmit={handleRegister}
              className="space-y-6"
            >
              {/* INSTITUTE NAME */}

              <div className="space-y-2">

                <Label className="text-slate-200">
                  Institute Name
                </Label>

                <div className="relative">

                  <Building2 className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

                  <Input
                    placeholder="Enter institute name"
                    value={instituteName}
                    onChange={(e) =>
                      setInstituteName(
                        e.target.value
                      )
                    }
                    className="h-14 pl-12 rounded-2xl bg-slate-800/70 border-slate-700 text-white"
                  />

                </div>

              </div>

              {/* DIRECTOR NAME */}

              <div className="space-y-2">

                <Label className="text-slate-200">
                  Director Name
                </Label>

                <div className="relative">

                  <User className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

                  <Input
                    placeholder="Enter director name"
                    value={directorName}
                    onChange={(e) =>
                      setDirectorName(
                        e.target.value
                      )
                    }
                    className="h-14 pl-12 rounded-2xl bg-slate-800/70 border-slate-700 text-white"
                  />

                </div>

              </div>

              {/* EMAIL + PASSWORD */}

              <div className="grid md:grid-cols-2 gap-5">

                <div className="space-y-2">

                  <Label className="text-slate-200">
                    Email
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
                      className="h-14 pl-12 rounded-2xl bg-slate-800/70 border-slate-700 text-white"
                    />

                  </div>

                </div>

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
                      className="h-14 pl-12 pr-12 rounded-2xl bg-slate-800/70 border-slate-700 text-white"
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

              </div>

              {/* ADDRESS */}

              <div className="space-y-2">

                <Label className="text-slate-200">
                  Address
                </Label>

                <div className="relative">

                  <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

                  <Textarea
                    placeholder="Enter institute address"
                    value={address}
                    onChange={(e) =>
                      setAddress(
                        e.target.value
                      )
                    }
                    className="pl-12 pt-4 min-h-[120px] rounded-2xl bg-slate-800/70 border-slate-700 text-white"
                  />

                </div>

              </div>

              {/* CONTACT + PINCODE */}

              <div className="grid md:grid-cols-2 gap-5">

                <div className="space-y-2">

                  <Label className="text-slate-200">
                    Contact Number
                  </Label>

                  <div className="relative">

                    <Phone className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

                    <Input
                      type="tel"
                      placeholder="+91 9876543210"
                      value={contact}
                      onChange={(e) =>
                        setContact(
                          e.target.value
                        )
                      }
                      className="h-14 pl-12 rounded-2xl bg-slate-800/70 border-slate-700 text-white"
                    />

                  </div>

                </div>

                <div className="space-y-2">

                  <Label className="text-slate-200">
                    Pincode
                  </Label>

                  <div className="relative">

                    <Hash className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

                    <Input
                      placeholder="226001"
                      value={pincode}
                      onChange={(e) =>
                        setPincode(
                          e.target.value
                        )
                      }
                      className="h-14 pl-12 rounded-2xl bg-slate-800/70 border-slate-700 text-white"
                    />

                  </div>

                </div>

              </div>

              {/* STATE */}

              <div className="space-y-2">

                <Label className="text-slate-200">
                  State
                </Label>

                <div className="relative">

                  <Landmark className="absolute left-4 top-4 h-5 w-5 text-slate-400" />

                  <Input
                    placeholder="Uttar Pradesh"
                    value={state}
                    onChange={(e) =>
                      setState(
                        e.target.value
                      )
                    }
                    className="h-14 pl-12 rounded-2xl bg-slate-800/70 border-slate-700 text-white"
                  />

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

                    Creating Account...

                  </div>
                ) : (
                  "Create Admin Account"
                )}

              </Button>

              <p className="text-center text-sm text-slate-500">
                Secure institute onboarding system
              </p>

            </form>

          </CardContent>

        </div>

      </Card>
    </div>
  );
}