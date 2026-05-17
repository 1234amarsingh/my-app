import "./globals.css";

export const metadata = {
  title: "AI Attendance System",
  description: "Face Recognition Attendance",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}