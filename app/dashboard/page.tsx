"use client";
import { useRouter } from "next/navigation";

import React, { useEffect, useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
DialogDescription,
DialogFooter,
} from "@/components/ui/dialog";
import axios from "axios";
export default function StudentAttendanceSheet() {


  const searchParams = useSearchParams();   // ✅ 1st hooks
  const urlSearch = searchParams.get("search") || "";

  const [searchEnrollment, setSearchEnrollment] = useState(urlSearch);

  useEffect(() => {
    setSearchEnrollment(urlSearch);
  }, [urlSearch]);


const [attendanceData, setAttendanceData] = useState<any[]>([]);
const [month, setMonth] = useState<Date>(new Date());
const [date, setDate] = useState<Date | undefined>(new Date());
const [today, setToday] = useState(new Date());
const [showAdminModal, setShowAdminModal] = useState(false);

const [adminCreds, setAdminCreds] = useState({
username: "",
password: "",
});
const router=useRouter();
const [error, setError] = useState("");
const [view, setView] = useState<"calendar" | "table">("calendar");

const [holidayModal, setHolidayModal] = useState(false);

const [holidayData, setHolidayData] = useState({
  day: 0,
  message: "",
});

const [holidayMessages, setHolidayMessages] = useState<any>({});


// const today = new Date();
const todayDay = today.getDate();

const isCurrentMonth =
month.getMonth() === today.getMonth() &&
month.getFullYear() === today.getFullYear();

const selectedStudent = attendanceData.find((s) => {
  const search = searchEnrollment.toLowerCase();

  return (
    s?.enrollment?.toLowerCase().includes(search) ||
    s?.name?.toLowerCase().includes(search)
  );
});
const calendarDays = useMemo(() => {
const year = month.getFullYear();
const m = month.getMonth();
const count = new Date(year, m + 1, 0).getDate();
return Array.from({ length: count }, (_, i) => {
const d = new Date(year, m, i + 1);
return {
  dayNum: i + 1,
  dayName: d.toLocaleDateString("en-US", {
    weekday: "short",
  }),
 isSunday: d.getDay() === 0,
isHoliday:
  d.getDay() === 0 || holidayMessages[i + 1],
};
});
}, [month]);
const fetchAttendance = async () => {
try {
const res = await axios.get(
`http://localhost:8080/api/attendance/report?month=${month.getMonth() + 1}&year=${month.getFullYear()}`
);
setAttendanceData(res.data || []);
} catch (err) {
console.error(err);
}
};
useEffect(() => {
fetchAttendance();
axios
.get(
"http://localhost:8080/api/attendance/today"
)
.then((res) => {

setToday(
new Date(res.data.date)
);
});
}, [month]);
const handleHolidayClick = (day: number) => {
  const existing =
    holidayMessages[day];
  if (existing) {
    const updated = {
      ...holidayMessages,
    };
    delete updated[day];
    setHolidayMessages(updated);
  } else {
    setHolidayData({
      day,
      message: "",
    });
    setHolidayModal(true);
  }
};
const handleCellClick = async (
enrollment: string,
day: number
) => {

if (!isCurrentMonth || day !== todayDay) {
alert("Only today's attendance can be changed");
return;
}
try {
const student = attendanceData.find(
(s) => s.enrollment === enrollment
);
const currentStatus =
student?.attendance?.[day] || "A";
const newStatus =
currentStatus === "L"
? "A"
: "L";

const dateStr =
`${today.getFullYear()}-${(
today.getMonth() + 1
)
.toString()
.padStart(2, "0")}-${day
.toString()
.padStart(2, "0")}`;

await axios.post(
"http://localhost:8080/api/attendance/mark",
{
enrollment,
date: dateStr,
status: newStatus,
});
fetchAttendance();
} catch (err) {
alert("Update Failed");
}};
const getRowStats = (
attendance: any
) => {

const vals = Object.values(
attendance || {}
);

const P = vals.filter(
(v) => v === "P"
).length;

const L = vals.filter(
(v) => v === "L"
).length;

const sundayHoliday =
calendarDays.filter(
(d) => d.isSunday
).length;

const specialHoliday =
Object.keys(
holidayMessages
).length;

const H =
new Set([
...calendarDays
.filter((d) => d.isSunday)
.map((d) => d.dayNum),

...Object.keys(
holidayMessages
).map(Number),
]).size;

// const h = Object.keys(
// holidayMessages
// ).length;

const A = calendarDays.filter(
(d) =>
!attendance[d.dayNum] &&
!holidayMessages[d.dayNum] &&
d.dayNum <=
(isCurrentMonth
? todayDay
: 31)
).length;

const finalPresent =
P + H + (L / 2);

const percent = (
(finalPresent /
calendarDays.length) *
100
).toFixed(1);

return {
P,
A,
L,
H,
percent,
};
};
const handleAdminVerify = () => {
if (
adminCreds.username === "csics" &&
adminCreds.password === "7293"
) {
setShowAdminModal(false);
setView("table");
setError("");
} else {
setError(
"Invalid Admin Credentials!"
);}};
const renderCalendarView = () => {
const todayAttendance =
attendanceData.reduce(
(acc, student) => {
const status =
student.attendance?.[
todayDay
];
if (status === "P") {
acc.present += 1;
} else if (
status === "L"
) {
acc.leave += 1;
} else {
acc.absent += 1;
}
return acc;
},
{
present: 0,
absent: 0,
leave: 0,
}
);

return (
<div className="space-y-6">
<div className="flex justify-between items-center">
<button
      onClick={() => router.push("/main")}
     
  className="rounded-2xl px-6 h-12 font-bold"
    >
      ← Back
    </button>

<div className="flex gap-3">

<Button
variant="outline"
className="rounded-xl"
onClick={() => {

const prev =
new Date(month);

prev.setMonth(
prev.getMonth() - 1
);

setMonth(prev);
}}
>
← Previous
</Button>
<div className="px-6 h-11 flex items-center rounded-xl bg-indigo-100 font-black text-indigo-700">
{month.toLocaleString(
"default",
{
month: "long",
year: "numeric",
}
)}
</div>

<Button
variant="outline"
className="rounded-xl"
onClick={() => {

const next =
new Date(month);

next.setMonth(
next.getMonth() + 1
);

setMonth(next);
}}
>
Next →
</Button>

</div></div>
<div className="grid md:grid-cols-2 gap-10 items-start">
<div className="bg-white rounded-[2.5rem] border shadow-2xl p-8 max-w-md w-full mx-auto">
<div className="mb-5 text-center">
<h2 className="text-3xl font-black text-indigo-900">
Attendance Dashboard
</h2>
<p className="text-slate-500 mt-2 font-medium">
Current Month & Year
</p>

</div>

<Input
placeholder="Search..."
value={searchEnrollment}
onChange={(e) =>
setSearchEnrollment(e.target.value)
}
className="mb-5 h-12 rounded-2xl"
/>

<Calendar
mode="single"
selected={date}
onSelect={setDate}
onMonthChange={setMonth}
month={month}
className="rounded-2xl scale-110"

modifiers={{

present: (day) => {
  if (!selectedStudent) return false;

  const status =
    selectedStudent.attendance?.[
      day.getDate()
    ];

  return status === "P";
},

leave: (day) => {
  if (!selectedStudent) return false;

  const status =
    selectedStudent.attendance?.[
      day.getDate()
    ];

  return status === "L";
},

holiday: (day) => {
  const isSunday = day.getDay() === 0;

  if (!isCurrentMonth) return isSunday;

  return isSunday || !!holidayMessages[day.getDate()];
},

absent: (day) => {
  if (!selectedStudent) return false;

  const status =
    selectedStudent.attendance?.[
      day.getDate()
    ];

  return (
    !status &&
    !holidayMessages[
      day.getDate()
    ] &&
    day.getMonth() ===
      month.getMonth() &&
    day.getDate() <= todayDay
  );
},
}}

modifiersClassNames={{
present:
  "bg-emerald-500 text-white hover:bg-emerald-500",
leave:
  "bg-yellow-400 text-black hover:bg-yellow-400",
holiday:
  "bg-blue-500 text-white hover:bg-blue-500",
absent:
  "bg-red-500 text-white hover:bg-red-500",
}}
/>
</div>

<div className="space-y-6">
{selectedStudent && (
<div className="bg-white rounded-[2rem] p-6 shadow-xl border">
<h2 className="text-2xl font-black text-indigo-900">
Student Monthly Status
</h2>
<div className="mt-4 space-y-2">
<p className="font-bold text-slate-700">
Name:
<span className="text-indigo-700 ml-2">
{selectedStudent.name}
</span>
</p>
<p className="font-bold text-slate-700">
Enrollment:
<span className="text-indigo-700 ml-2">
{selectedStudent.enrollment}
</span>
</p>
<div className="flex gap-3 mt-4">

<Badge className="bg-emerald-100 text-emerald-700">
Present:
{
Object.values(
selectedStudent.attendance || {}
).filter(
(v) => v === "P"
).length
}
</Badge>

<Badge className="bg-red-100 text-red-700">
Absent:
{
calendarDays.filter((d) => {

const st =
selectedStudent.attendance?.[
d.dayNum
];

return (
!st &&
d.dayNum <= todayDay
);
}).length
}
</Badge>

<Badge className="bg-yellow-100 text-yellow-700">
Leave:
{
Object.values(
selectedStudent.attendance || {}
).filter(
(v) => v === "L"
).length
}
</Badge>
</div>
</div>
</div>
)}
<div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100">
<div className="flex items-center justify-between mb-8">
<div>
<h2 className="text-3xl font-black text-slate-800">
TODAY STATUS
</h2>

<p className="text-slate-500 mt-1 font-medium">
{today.toDateString()}
</p>

</div>

<div className="h-16 w-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-3xl">
📅
</div>
</div>
<div className="grid grid-cols-3 gap-5">
<div className="rounded-[2rem] bg-emerald-50 border border-emerald-100 p-6 text-center shadow-sm">
<p className="text-5xl font-black text-emerald-600">
{todayAttendance.present}
</p>
<p className="mt-3 text-sm font-black tracking-widest text-emerald-700">
PRESENT
</p>
</div>
<div className="rounded-[2rem] bg-rose-50 border border-rose-100 p-6 text-center shadow-sm">
<p className="text-5xl font-black text-rose-600">
{todayAttendance.absent}
</p>
<p className="mt-3 text-sm font-black tracking-widest text-rose-700">
ABSENT
</p>
</div>
<div className="rounded-[2rem] bg-amber-50 border border-amber-100 p-6 text-center shadow-sm">
<p className="text-5xl font-black text-amber-600">
{todayAttendance.leave}
</p>


<p className="mt-3 text-sm font-black tracking-widest text-amber-700">
LEAVE
</p>
</div>

</div>
</div>
<Button
onClick={() =>
setShowAdminModal(true)
}
className="w-full h-16 rounded-[2rem] text-xl font-black bg-indigo-600 shadow-2xl hover:-translate-y-1 transition-all"
>
OPEN ATTENDANCE SHEET
</Button>
</div>
</div>
</div>
);
};

const renderTableView = () => (
<div className="flex flex-col h-full space-y-4">
<div className="flex justify-between items-center px-4 flex-wrap gap-4">
<div className="flex gap-3 items-center flex-wrap">
<Button
variant="outline"
onClick={() =>
setView("calendar")
}
className="rounded-xl"
>
← Back
</Button>
<Button
variant="outline"
onClick={() => {
const prev =
new Date(month);
prev.setMonth(
prev.getMonth() - 1
);
setMonth(prev);
}}
>
← Previous
</Button>

<div className="px-5 h-10 flex items-center rounded-xl bg-indigo-100 text-indigo-700 font-black">
{month.toLocaleString(
"default",
{
month: "long",
year: "numeric",
}
)}
</div>

<Button
variant="outline"
onClick={() => {

const next =
new Date(month);

next.setMonth(
next.getMonth() + 1
);

setMonth(next);
}}
>
Next →
</Button>
<Button
variant="outline"
className="rounded-xl border-blue-500 text-blue-600"
onClick={() => {
  setHolidayData({
    day: todayDay,
    message: "",
  });

  setHolidayModal(true);
}}
>
Add Holiday
</Button>
<Button
onClick={async () => {

try {

const response =
await axios.get(
`http://localhost:8080/api/attendance/download/excel?year=${month.getFullYear()}&month=${month.getMonth() + 1}`,
{
responseType:
"blob",
}
);

const url =
window.URL.createObjectURL(
new Blob([
response.data,
])
);

const link =
document.createElement(
"a"
);

link.href = url;

link.setAttribute(
"download",
`attendance_${month.getMonth() + 1}_${month.getFullYear()}.xlsx`
);

document.body.appendChild(
link
);
link.click();
link.remove();
} catch {

alert(
"Excel download failed"
);
}
}}
className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
>
Download Monthly Report
</Button>

</div>
<div className="flex gap-2 text-[10px] font-bold">
<Badge className="bg-emerald-100 text-emerald-700">
P: Present
</Badge>
<Badge className="bg-rose-100 text-rose-700">
A: Absent
</Badge>

<Badge className="bg-amber-100 text-amber-700">
L: Leave
</Badge>

<Badge className="bg-amber-100 text-blue-700">
H: Holiday
</Badge>

</div>

</div>

<div className="flex-1 overflow-auto border rounded-3xl shadow-inner bg-slate-50 max-h-[65vh]">

<table className="w-full border-collapse text-center">

<thead className="sticky top-0 z-30">

<tr className="bg-slate-800 text-white text-[10px]">

<th className="p-3 sticky left-0 bg-slate-800 border-r min-w-20 z-40">
Enrollment
</th>

<th className="p-3 sticky left-20 bg-slate-800 border-r min-w-32.5 z-40 text-left">
Student Name
</th>

<th className="p-3 border-r min-w-32.5 text-left">
Father Name
</th>

{calendarDays.map((d) => (

<th
key={d.dayNum}
className="p-1 border-r min-w-9.5"
>

<div className="text-[11px] font-bold">
{d.dayNum}
</div>

<div
className={`text-[8px] uppercase ${
d.isSunday
? "text-red-400"
: "text-slate-400"
}`}
>
{d.dayName}
</div>

</th>
))}

<th className="p-2 border-r bg-emerald-700">
P
</th>

<th className="p-2 border-r bg-rose-700">
A
</th>

<th className="p-2 border-r bg-amber-600">
L
</th>
<th className="p-2 border-r bg-blue-700">
H
</th>

<th className="p-2 bg-indigo-700">
%
</th>

</tr>

</thead>

<tbody className="divide-y divide-slate-100">

{attendanceData.map((s) => {

const stats =
getRowStats(
s.attendance
);

return (

<tr
key={s.enrollment}
className="bg-white hover:bg-indigo-50/50 transition-colors group"
>

<td className="p-2 sticky left-0 bg-white group-hover:bg-indigo-50/40 border-r text-[10px] z-20 shadow-sm">
{s.enrollment}
</td>

<td className="p-2 sticky left-20 bg-white group-hover:bg-indigo-50/40 border-r text-[10px] font-bold z-20 shadow-sm text-left">
{s.name}
</td>

<td className="p-2 border-r text-[10px] text-slate-500 text-left">
{s.fName}
</td>

{calendarDays.map((d) => {

const status =
  s.attendance?.[d.dayNum];

// ✅ HERE (correct place)
const holiday =
  isCurrentMonth ? holidayMessages[d.dayNum] : null;

const isPastOrToday =
  isCurrentMonth ? d.dayNum <= todayDay : true;

const display =
  holiday
    ? "H"
    : status
      ? status
      : isPastOrToday
        ? "A"
        : "•";
// ✅ TEXT COLOR
const color =
display === "P"
? "text-emerald-600"
: display === "L"
? "text-amber-500"
: display === "A"
? "text-rose-600"
: display === "H"
? "text-blue-600"
: "text-slate-200";

// ✅ BACKGROUND COLOR
const bg =
display === "P"
? "bg-emerald-50"
: display === "L"
? "bg-yellow-50"
: display === "A"
? "bg-red-50"
: display === "H"
? "bg-blue-50"
: "";

return (

<td
key={d.dayNum}
onClick={(e) => {

if (e.shiftKey) {

handleHolidayClick(
d.dayNum
);

} else {

handleCellClick(
s.enrollment,
d.dayNum
);
}
}}
className={`p-1 border-r font-extrabold text-[11px] cursor-pointer transition-all ${bg} ${
isCurrentMonth &&
d.dayNum ===
todayDay
? "ring-2 ring-blue-400"
: ""
}`}
>
<span
className={color}
>
{display}
</span>
{/* ✅ HOLIDAY MESSAGE */}
{display === "H" &&
holidayMessages[
d.dayNum
]?.message && (
<div className="text-[8px] text-blue-700 font-bold truncate max-w-10 mx-auto">
{
holidayMessages[
d.dayNum
]?.message
}
</div>
)}
</td>
);
})}

<td className="p-2 border-r bg-emerald-50/50 font-bold text-emerald-700 text-xs">
{stats.P}
</td>

<td className="p-2 border-r bg-rose-50/50 font-bold text-rose-700 text-xs">
{stats.A}
</td>

<td className="p-2 border-r bg-amber-50/50 font-bold text-amber-600 text-xs">
{stats.L}
</td>
<td className="p-2 border-r bg-blue-50/50 font-bold text-blue-700 text-xs">
{stats.H}
</td>

<td className="p-2 bg-indigo-50/50 font-black text-indigo-700 text-xs">
{stats.percent}%
</td>

</tr>
);
})}

</tbody>

</table>

</div>

</div>
);

return (

<div id="attendance-table" className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 md:p-10 flex items-center justify-center">

<Card className="max-w-7xl w-full rounded-[2.5rem] shadow-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">

<CardHeader className="py-8 border-b bg-white">

<CardTitle className="text-center text-4xl font-black text-indigo-900 tracking-tight uppercase">

{view === "calendar"
? "Dashboard"
: "Attendance Sheet"}

</CardTitle>

</CardHeader>

<CardContent className="p-8">

{view === "calendar"
? renderCalendarView()
: renderTableView()}

</CardContent>

</Card>

<Dialog
open={showAdminModal}
onOpenChange={
setShowAdminModal
}
>

<DialogContent className="sm:max-w-md rounded-[2rem] border-none p-8 shadow-2xl">

<DialogHeader>

<DialogTitle className="text-2xl font-black">
Admin Verify
</DialogTitle>

<DialogDescription>
Enter admin credentials to open attendance sheet.
</DialogDescription>

</DialogHeader>

<div className="space-y-4 py-4">

<Input
className="h-12 rounded-xl bg-slate-50 border-none"
placeholder="Admin ID"
value={
adminCreds.username
}
onChange={(e) =>
setAdminCreds({
...adminCreds,
username:
e.target.value,
})
}
/>

<Input
type="password"
className="h-12 rounded-xl bg-slate-50 border-none"
placeholder="Password"
value={
adminCreds.password
}
onChange={(e) =>
setAdminCreds({
...adminCreds,
password:
e.target.value,
})
}
/>

{error && (

<p className="text-rose-500 text-xs font-bold text-center italic">

{error}

</p>
)}

</div>

<DialogFooter>

<Button
onClick={
handleAdminVerify
}
className="w-full h-14 rounded-2xl font-black bg-indigo-600 uppercase tracking-widest"
>
Verify & Open
</Button>

</DialogFooter>

</DialogContent>

</Dialog>
<Dialog
  open={holidayModal}
  onOpenChange={setHolidayModal}
>

  <DialogContent className="sm:max-w-md rounded-[2rem] border-none p-8 shadow-2xl">

    <DialogHeader>

      <DialogTitle className="text-2xl font-black">
        Holiday Details
      </DialogTitle>

      <DialogDescription>
        Add holiday reason/message
      </DialogDescription>

    </DialogHeader>

    <div className="space-y-4 py-4">

      <div className="space-y-3">

<div className="font-bold text-indigo-700">
Select Holiday Date
</div>

<Input
type="number"
min="1"
max={calendarDays.length}
value={holidayData.day}
onChange={(e) =>
setHolidayData({
...holidayData,
day: Number(e.target.value),
})
}
className="h-12 rounded-2xl"
/>

<div className="text-sm text-slate-500 font-medium">
{month.toLocaleString("default", {
month: "long",
})}
{" "}
{holidayData.day},
{" "}
{month.getFullYear()}
</div>

</div>

      <Input
        placeholder="Holiday Message"
        value={holidayData.message}
        onChange={(e) =>
                            setHolidayData({
            ...holidayData,
            message: e.target.value,
          })
        }
      />

      {holidayMessages[holidayData.day]?.message && (

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-700 font-medium">

          {
            holidayMessages[
              holidayData.day
            ]?.message
          }

        </div>
      )}

    </div>

    <DialogFooter>

      <Button
        className="w-full rounded-2xl bg-blue-600"
        onClick={() => {

          setHolidayMessages({
            ...holidayMessages,

            [holidayData.day]: {
              message:
                holidayData.message,
                status:"H",
            },
          });

          setHolidayModal(false);
        }}
      >
        Save Holiday
      </Button>

    </DialogFooter>

  </DialogContent>

</Dialog>

</div>
);
}