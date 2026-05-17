"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function pdf() {

  const downloadPDF = async () => {

    const input = document.getElementById("attendance-table");

    if (!input) return;

    const canvas = await html2canvas(input);

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("l", "mm", "a4");

    const pdfWidth = 297;

    const pdfHeight =
      (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save("attendance.pdf");
  };

  return (
    <div>
      <button onClick={downloadPDF}>
        Download PDF
      </button>
    </div>
  );
}