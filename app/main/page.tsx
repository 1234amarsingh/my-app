import Navbar from "../Nvigation/navbar";
import Footer from "../Footer/page";
import RegisterPage from "../sing-in/page";
import AttendancePage from "../Attendance/page";
import LogIn from "../login/page";
// import { LogIn } from "lucide-react";

export default function MainPage() {

  return (

    <>
      <Navbar />
      <AttendancePage />
      <LogIn/>
      <RegisterPage />
      <Footer />
    </>
  );
}