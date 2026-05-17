"use client";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  // ✅ SEARCH FUNCTION (ENTER + CLICK BOTH SAFE)  
  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/dashboard?search=${encodeURIComponent(query)}`);
    setSearchQuery("");
    setIsMenuOpen(false);
  };
  // Enter key support
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const navLinks = [
    { name: "Login", href: "/login" },
    { name: "Registration", href: "/sing-in" },
    { name: "Face", href: "/Attendance" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Information", href: "/StudentInfo" },
    { name: "Adnim", href: "/Admin" },
  ];
  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 text-white relative">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-xl font-bold tracking-wider hover:text-gray-300 transition cursor-pointer">
            ATTENDANCE
          </h1>
        </Link>
        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-8 text-lg font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-orange-500 transition"
            >
              {link.name}
            </Link>
          ))}
        </div>
        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* SEARCH */}
          <div className="hidden sm:flex items-center bg-gray-900 border border-gray-700 rounded-full px-3 py-1 focus-within:border-blue-500 transition">
            <Search size={16} className="text-gray-400" />

            <input
              type="text"
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none px-2 text-sm text-white w-24 md:w-48"
            />

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="text-xs px-2 py-1 bg-indigo-600 rounded-full ml-2 hover:bg-indigo-700 transition"
            >
              Go
            </button>
          </div>
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 border-gray-700 hover:bg-gray-800 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-16 right-6 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden lg:hidden">
            <div className="flex flex-col py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium hover:bg-gray-800 hover:text-orange-500 border-b border-gray-800 last:border-none transition"
                  onClick={() => setIsMenuOpen(false)}>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
    
  );
}