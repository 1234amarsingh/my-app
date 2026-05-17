"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Mail } from "lucide-react";
import Link from "next/link"; 

export default function StudentTable() {
  
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Java Backend API
        const res = await axios.get("http://localhost:8080/api/student");
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-white">
        Loading data...
      </div>
    );
  }

  return (
    <div className="p-8 bg-white min-h-screen text-white justify-center mt-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl justify font-bold mb-5 text-blue-900 text-center">
          STUDENT INFORMATION
        </h2>

        <div className="overflow-x-auto bg-gray-900 rounded-xl border border-gray-800 shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-700">
                <th className="p-3 font-semibold text-gray-300">ID</th>
                <th className="p-3 font-semibold text-gray-300">Name</th>
                <th className="p-3 font-semibold text-gray-300">Father Name</th>
                <th className="p-3 font-semibold text-gray-300">Enrollment</th>
                <th className="p-3 font-semibold text-gray-300">Email</th>
                <th className="p-3 font-semibold text-gray-300">Class</th>
                <th className="p-3 font-semibold text-gray-300">Semester</th>
                <th className="p-3 font-semibold text-gray-300">Session</th>
                <th className="p-3 font-semibold text-gray-300">Joining Date</th>
                <th className="p-3 font-semibold text-gray-300">Contact</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {students.map((std: any) => (
                <tr
                  key={std.id}
                  className="hover:bg-gray-800/30 transition-colors"
                >
                  {/* ID */}
                  <td className="p-3 text-gray-400 text-sm">
                    {std.id}
                  </td>

                  {/* Name */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-bold">
                        {std.name?.charAt(0) || "S"}
                      </div>
                      <span className="font-medium">
                        {std.name || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* Father Name */}
                  <td className="p-3 text-gray-300">
                    {std.fname || std.f_name || "N/A"}
                  </td>
                 <td className="p-3 text-gray-400 font-mono text-sm">
                    {std.enrollment || "N/A"}
                  </td>
                  {/* Email */}
                  <td className="p-3 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Mail
                        size={12}
                        className="text-gray-500"
                      />
                      {std.email || "N/A"}
                    </div>
                  </td>

                  {/* Class */}
                  <td className="p-3 text-gray-400">
                    {std.className || "N/A"}
                  </td>

                  {/* Semester */}
                  <td className="p-3">
                    <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs">
                      Sem {std.semester || "N/A"}
                    </span>
                  </td>

                  {/* Session */}
                  <td className="p-3 text-gray-300">
                    {std.session || "N/A"}
                  </td>

                  {/* Joining Date */}
                  <td className="p-3 text-gray-300">
                    {std.dob || "N/A"}
                  </td>

                  {/* Contact */}
                  <td className="p-3 text-gray-400 font-mono text-sm">
                    {std.contact || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {students.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              No students found in database.
            </div>
          )}
        </div>

                <Link href="/main"  className="w-full hover:bg-gray-100 text-gray-600 font-medium">← Back to Home </Link>
      </div>
  
          
         </div>     
            
  );
}