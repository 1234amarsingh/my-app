"use cleint"

import Link from "next/link";

export default function page() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10 m-3 hover:bg-cyan-950 transition duration-300 ease-in-out rounded-2xl">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo / About */}
        <div>
          <h2 className="text-xl font-bold text-white">Ai ATTENDANCE</h2>
          <p className="mt-3 text-sm">
            A modern student Face Recogination.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">LINKS</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">
              <Link href="/login" className=" font-xl hover:text-orange-500 transition">
            Login
          </Link></li>
            <li className="hover:text-white cursor-pointer"><Link href="/sing-in" className=" font-xl hover:text-orange-500 transition">
             Register
          </Link></li>
            <li className="hover:text-white cursor-pointer"><Link href="/dashboard" className=" font-xl hover:text-orange-500 transition">
           Attendance
          </Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-white font-semibold mb-3">OUR SERVICES</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer"><Link href="/sing-in" className=" font-xl hover:text-orange-300 transition">Student Registration</Link></li>
            <li className="hover:text-white cursor-pointer"><Link href="/StudentInfo" className=" font-xl hover:text-orange-300 transition">Student Information</Link></li>
            <li className="hover:text-white cursor-pointer"><Link href="/dashboard" className=" font-xl hover:text-orange-300 transition">Student Dashboard</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>
          <p className="text-sm">Aiattendance@gmail.com</p>
          <p className="text-sm"> +91 9876543210</p>
          <p className="text-sm"> Chitrakoot (MP), India</p>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 text-center py-4 text-sm">
        © {new Date().getFullYear()} Attendance. All rights reserved.
      </div>
    </footer>
  );
}