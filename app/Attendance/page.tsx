"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";


export default function AttendancePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [faceapi, setFaceapi] = useState<any>(null);
  const [faceMatcher, setFaceMatcher] = useState<any>(null);

  const [lastMarked, setLastMarked] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [totalMarked, setTotalMarked] = useState(0);

  const [studentMap, setStudentMap] = useState<Record<string, string>>({});
  const [localMarkedList, setLocalMarkedList] = useState<Set<string>>(new Set());

  // DATE + ADMIN LOGIN
  const [currentDate, setCurrentDate] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [adminPass, setAdminPass] = useState("");

  // INIT SYSTEM
  useEffect(() => {
    const init = async () => {
      const today = new Date().toISOString().split("T")[0];
      setCurrentDate(today);

      const faceApiModule = await import("@vladmandic/face-api");
      setFaceapi(faceApiModule);

      const MODEL_URL = "/models";

      await Promise.all([
        faceApiModule.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceApiModule.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceApiModule.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceApiModule.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      ]);

      const labeled = await loadStudents(faceApiModule);

      if (labeled.length > 0) {
        setFaceMatcher(new faceApiModule.FaceMatcher(labeled, 0.45));
      }

      startVideo();
    };

    init();
  }, []);

  // AUTO DATE RESET
  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = new Date().toISOString().split("T")[0];

      if (newDate !== currentDate) {
        setCurrentDate(newDate);
        setLocalMarkedList(new Set());
        setLogs([]);
        setTotalMarked(0);
        setLastMarked("📅 New Day Auto Reset Done");
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [currentDate]);

  // LOAD STUDENTS
  const loadStudents = async (faceApiModule: any) => {
    const res = await axios.get("http://localhost:8080/api/student");
    const students = res.data;

    const tempMap: Record<string, string> = {};

    const results = await Promise.all(
      students.map(async (s: any) => {
        try {
          tempMap[s.enrollment] = s.name;

          const img = await faceApiModule.fetchImage(
            `http://localhost:8080/api/student/image/${s.id}`
          );

          const det = await faceApiModule
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (!det) return null;

          return new faceApiModule.LabeledFaceDescriptors(s.enrollment, [
            det.descriptor,
          ]);
        } catch {
          return null;
        }
      })
    );

    setStudentMap(tempMap);
    return results.filter(Boolean);
  };

  // CAMERA START
  const startVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  // DETECTION LOOP
  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (!videoRef.current || !canvasRef.current || !faceMatcher || !faceapi)
        return;

      const display = { width: 640, height: 480 };
      faceapi.matchDimensions(canvasRef.current, display);

      const detections = await faceapi
        .detectAllFaces(
          videoRef.current,
          new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 })
        )
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resized = faceapi.resizeResults(detections, display);

      canvasRef.current.getContext("2d")?.clearRect(0, 0, 640, 480);

      resized.forEach(async (d: any) => {
        const result = faceMatcher.findBestMatch(d.descriptor);

        const id = result.label;
        const name = studentMap[id] || id;

        new faceapi.draw.DrawBox(d.detection.box, {
          label: name,
        }).draw(canvasRef.current);

        if (id !== "unknown" && !localMarkedList.has(id)) {
          markAttendance(id);
        }
      });
    }, 2000);
  };

  // MARK ATTENDANCE
  const markAttendance = async (id: string) => {
    try {
      const today = new Date().toISOString().split("T")[0];

      await axios.post("http://localhost:8080/api/attendance/mark", {
        enrollment: id,
        status: "P",
        date: today,
      });

      const msg = `Marked: ${studentMap[id] || id}`;

      setLastMarked(msg);
      setLogs((p) => [msg, ...p.slice(0, 4)]);
      setTotalMarked((p) => p + 1);

      setLocalMarkedList((p) => new Set(p).add(id));
    } catch {
      const msg = `Already Marked: ${studentMap[id] || id}`;

      setLastMarked(msg);
      setLogs((p) => [msg, ...p.slice(0, 4)]);
      setLocalMarkedList((p) => new Set(p).add(id));
    }
  };

  // RESET LOGIN OPEN
  const resetSession = () => setShowLogin(true);

  // ADMIN LOGIN
  const handleLogin = () => {
    if (adminId === "admin" && adminPass === "1234") {
      setLocalMarkedList(new Set());
      setLogs([]);
      setTotalMarked(0);
      setLastMarked("🔐 Admin Reset Successful");

      setShowLogin(false);
      setAdminId("");
      setAdminPass("");
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#ffe9cc] via-white to-white text-black p-6">

      {/* HEADER */}
      <h1 className="text-center text-4xl font-bold text-cyan-600">
        AI &nbsp; ATTENDANCE &nbsp; SYSTEM
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-3 max-w-3xl mx-auto mt-6">

        <div className="bg-black/5 p-3 rounded-xl text-center border border-black/10">
          LIVE
        </div>

        <div className="bg-black/5 p-3 rounded-xl text-center border border-black/10">
          Marked: {totalMarked}
        </div>

        <div className="bg-black/5 p-3 rounded-xl text-center border border-black/10 animate-pulse">
          Scanner ON
        </div>

      </div>

      {/* MAIN */}
      <div className="flex gap-6 justify-center mt-6 flex-wrap">

        {/* CAMERA */}
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            onPlay={handleVideoOnPlay}
            className="w-160black0 rounded-xl"
        />
          <canvas ref={canvasRef} className="absolute top-0 left-0" />
        </div>
        {/* SIDE PANEL */}
        <div className="w-80 space-y-3">
          <div className="bg-black/5 p-3 rounded-xl border border-black/10">
            {lastMarked || "Waiting for detection..."}
          </div>
          <div className="bg-black/5 p-3 rounded-xl border border-black/10">
            {logs.map((l, i) => (
              <div key={i} className="text-xs mb-1">
                {l}
              </div>
            ))}
          </div>

          <button
            onClick={resetSession}
            className="w-full bg-blue-400/20 hover:bg-red-500/30 text-gray-900 py-2 rounded-xl"
          >
            Reset Session
          </button>
        </div>
      </div>
      {/* MODERN ADMIN LOGIN */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
          <div className="w-[380px] bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
            {/* HEADER */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-cyan-400">
                Admin Login
              </h2>
              <p className="text-xs text-gray-300">
                Secure System Access
              </p>
            </div>
            {/* INPUTS */}
            <input
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="Admin ID"
              className="w-full mb-3 p-3 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 outline-none"
            />
            <input
              type="password"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              placeholder="Password"
              className="w-full mb-5 p-3 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 outline-none"/>
            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={handleLogin}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 py-3 rounded-xl font-semibold"
              >
                Login
              </button>
              <button
                onClick={() => setShowLogin(false)}
                className="flex-1 bg-white/10 py-3 rounded-xl"
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}
      {/* FOOTER */}
      <div className="text-center mt-6">
        <Link href="/main" className="text-gray-400 text-sm">
          ← Back Home
        </Link>
      </div>
    </div>
  );
}