

"use client";

import axios from "axios";
import { useRef, useState } from "react";
import Link from "next/link"; 

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    fName: "",
    mName: "",
    dob: "",
    fullname:"",
    enrollment: "",
    password: "",
    email: "",
    address: "",
    contact: "",
    gender: "", 
    className: "",
    semester: "",
    session: "",
  });
  const [showCamera,setShowCamera]=useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const [sclass, setSclass] = useState("");
   const [gender,setGender] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!form.name || !form.fullname || !form.enrollment || !form.fName || !form.mName || !form.email || !form.address || !form.password ||
       !form.semester || !form.contact || !form.className || !form.dob 
     ){
      alert(" ⚠️ Please fill the currect information!")
   return;
     }

   
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    
    if (image) {
      formData.append("image", image);
    } else {
      alert("Please capture or select an image first!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", 
          },
        }
      );

      console.log("Response:", res.data);
      alert("Registered Successfully ✅");
      window.location.reload();
    } catch (err: any) {
      console.error("Error Detail:", err.response?.data || err.message);
      alert("Registration Failed ❌");
    }
  };

  
  const capture = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    if (!video) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
     
        const file = new File([blob], `form_${Date.now()}.jpg`, { type: "image/jpeg" });
        setImage(file);
        const Stream= video.srcObject as MediaStream;
        Stream.getTracks().forEach(track => track.stop());
        alert("Photo captured successfully!");
      }
    }, "image/jpeg");
  };

  const sessions = [];
  for (let i = 2020; i <= 2030; i++) {
    sessions.push(`${i}-${i + 1}`);
  }

  const semesterData: any = {
    bca: ["I","II","III","IV","V","VI"],
    bcom: ["I","II","III","IV","V","VI"],
    dca: ["I","II"],
    msc: ["I","II","III","IV"],
    pgdca: ["I","II"],
  };

const openCamera = async () => {
    setShowCamera(true);
  try {
    
    const stream = await navigator.mediaDevices.getUserMedia({ video: true}); 
  
    
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play();
      };
    }
  } catch (err: any) {
    console.error("Camera Error: ", err);
    if (err.name === "NotAllowedError") {
      alert("Camera Access are lock !Please give to browser setting permission ");
    } else if (err.name === "NotFoundError") {
      alert("Do not find in your device");
    } else {
      alert("Problem open the camera: " + err.message);
    }
  }

};

  return (
<>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-[850px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              Create Account
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="grid grid-cols-2 gap-4 ">
                <div className=" mb-8 flex-col justify-between  ">
                 <p className="text-center text-orange-500">FIll in the Authenticate information</p>
                  <Input name="name" className=" mb-4 mt-4" placeholder="Name" 
                    value={form.name} onChange={handleChange} required />
                  <Input name="fullname" className="mb-4" placeholder="Last Name"
                    value={form.fullname} onChange={handleChange} required/>
                <Input name="fName" className="mb-4" placeholder="Father Name"
                  value={form.fName} onChange={handleChange} required/>
                <Input name="mName" placeholder="Mother Name"
                  value={form.mName} onChange={handleChange}required />
                </div> 
                 <div 
                      className=" text-center cursor-pointer "
                      onClick={openCamera} 
                    >
                      {image ? `Photo Captured: ${image.name}` : "Click here..."}
                    <div className="flex flex-col items-center">
                      <video ref={videoRef} autoPlay className="w-full max-w-[275px]  rounded-lg shadow" />
                      <Button type="button" onClick={capture} className="mt-1 bg-blue-500">
                        Take Photo
                      </Button>
                    </div>
                    </div> 

                {/* Date */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {date ? format(date, "PPP") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(value) => {
                        setDate(value);
                        setForm({
                          ...form,
                          dob: value ? format(value, "yyyy-MM-dd") : ""
                        });
                      }}
                    />
                  </PopoverContent>
                </Popover>

                {/* Gender */}
                <RadioGroup value={gender}
                  onValueChange={(value) => {
                    setGender(value);
                    setForm({ ...form, gender: value });
                  }}>
                  <div className="flex gap-2">
                    <RadioGroupItem value="male" /> Male
                    <RadioGroupItem value="female" /> Female
                  </div>
                </RadioGroup>

                <Input name="address" placeholder="Address"
                  value={form.address} onChange={handleChange} required/>
                <Input name="contact" placeholder="Contact"
                  value={form.contact} onChange={handleChange}required />

                <Input name="email" placeholder="Email"
                  value={form.email} onChange={handleChange} required/>
                <Input type="password" name="password" placeholder="Password"
                  value={form.password} onChange={handleChange}required />

                {/* Class */}
                <Select onValueChange={(value) => {
                  setSclass(value);
                  setForm({ ...form, className: value, semester: "" });
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bca">BCA</SelectItem>
                    <SelectItem value="bcom">Bcom</SelectItem>
                    <SelectItem value="dca">DCA</SelectItem>
                    <SelectItem value="msc">Msc</SelectItem>
                    <SelectItem value="pgdca">PGDCA</SelectItem>
                  </SelectContent>
                </Select>

                {/* Semester */}
                <Select onValueChange={(value) =>
                  setForm({ ...form, semester: value })
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {sclass &&
                      semesterData[sclass].map((item: string) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <Input name="enrollment" placeholder="Enrollment"
                  value={form.enrollment} onChange={handleChange}required />

                {/* Session */}
                <Select onValueChange={(value) =>
                  setForm({ ...form, session: value })
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Session" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            <Button type="submit" className="w-full"> Register</Button>
             <Link href="/main" className="hover:bg-transparent text-gray-600 font-medium">← Back</Link>
            </form>
          </CardContent>
        </Card>
      </div>

        </>
  );
}




