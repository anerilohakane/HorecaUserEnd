import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Simple number to words function for self-contained execution
function amountToWords(amount: number): string {
  const sng = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const dec = ["Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  
  function convertLessThanOneThousand(n: number): string {
    if (n < 20) return sng[n];
    const digit = n % 10;
    if (n < 100) return dec[Math.floor(n / 10) - 2] + (digit ? "-" + sng[digit] : "");
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    return sng[hundred] + " Hundred" + (rest ? " and " + convertLessThanOneThousand(rest) : "");
  }

  try {
    const num = Math.floor(amount);
    if (num === 0) return "INR ZERO ONLY";
    
    let words = "";
    const crore = Math.floor(num / 10000000);
    let rest = num % 10000000;
    const lakh = Math.floor(rest / 100000);
    rest = rest % 100000;
    const thousand = Math.floor(rest / 1000);
    rest = rest % 1000;
    
    if (crore) words += convertLessThanOneThousand(crore) + " Crore ";
    if (lakh) words += convertLessThanOneThousand(lakh) + " Lakh ";
    if (thousand) words += convertLessThanOneThousand(thousand) + " Thousand ";
    if (rest) words += convertLessThanOneThousand(rest) + " ";
    
    return `INR ${words.trim().toUpperCase()} ONLY`;
  } catch (e) {
    return `INR ${amount.toFixed(2)} ONLY`;
  }
}

export function generateCreditNotePDF(cn: any) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  
  doc.setFont("helvetica", "normal");
  
  let currentY = margin + 5;

  // --- HEADER SECTION ---
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text("CREDIT NOTE", pageWidth - margin, currentY, { align: "right" });

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("UNIFOODS GLOBAL PVT LTD", margin, currentY);
  
  currentY += 5;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text("1ST FLOOR, ABOVE BISLERI BOLTING UNIT", margin, currentY);
  currentY += 4;
  doc.text("OPP BPCL MATERIAL GATE, MAHUL", margin, currentY);
  currentY += 4;
  doc.text("CHEMBUR, MUMBAI 400074", margin, currentY);
  currentY += 4;
  doc.text("GSTIN/UIN: 27AADCU8306P1ZR", margin, currentY);
  currentY += 4;
  doc.text("Email: sales@unifoods.co", margin, currentY);

  currentY += 10;
  
  // --- DIVIDER ---
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  // --- INFO SECTION ---
  const customerName = cn.customer?.businessName || cn.customer?.name || "N/A";
  const cityState = [cn.customer?.address?.city, cn.customer?.address?.state].filter(Boolean).join(", ");
  
  // Left Column (Bill To)
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text("Bill To:", margin, currentY);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(customerName, margin, currentY + 5);
  
  let addressY = currentY + 10;
  if (cn.customer?.address?.street) {
    const lines = doc.splitTextToSize(cn.customer.address.street, 80);
    doc.text(lines, margin, addressY);
    addressY += lines.length * 4;
  }
  if (cityState) {
    doc.text(cityState, margin, addressY);
    addressY += 4;
  }
  if (cn.customer?.gstNumber) {
    doc.text(`GSTIN: ${cn.customer.gstNumber}`, margin, addressY);
  }

  // Right Column (CN Details)
  const rightColX = pageWidth - margin - 60;
  doc.setFont("helvetica", "bold");
  doc.text("Credit Note #:", rightColX, currentY);
  doc.text("Date:", rightColX, currentY + 5);
  doc.text("Ref Invoice:", rightColX, currentY + 10);
  
  doc.setFont("helvetica", "normal");
  doc.text(cn.cnNumber || "Draft", rightColX + 30, currentY);
  doc.text(cn.createdAt ? new Date(cn.createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'), rightColX + 30, currentY + 5);
  doc.text(cn.originalInvoiceNo || "N/A", rightColX + 30, currentY + 10);

  currentY = Math.max(addressY + 10, currentY + 20);

  // --- ITEMS TABLE ---
  let items = cn.items && cn.items.length > 0 ? cn.items : [{
    description: cn.reason || "Return / Dispute adjustment",
    hsnSac: "",
    quantity: 1,
    rate: cn.amount || 0,
    amount: cn.amount || 0,
  }];

  const tableBody = items.map((item: any, idx: number) => {
    let desc = item.description;
    if (cn.items && cn.items.length > 0 && cn.reason) {
      desc = `${cn.reason}\nProduct: ${item.description}`;
    }
    
    return [
      idx + 1,
      desc,
      item.quantity,
      item.rate?.toFixed(2),
      item.amount?.toFixed(2)
    ];
  });

  const totalAmount = cn.amount || 0;

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'Description', 'Qty', 'Rate', 'Total Amount']],
    body: tableBody,
    foot: [[{ content: 'Total', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } }, totalAmount.toFixed(2)]],
    theme: 'grid',
    headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [200, 200, 200], lineWidth: 0.1 },
    bodyStyles: { lineColor: [200, 200, 200], lineWidth: 0.1 },
    footStyles: { fillColor: [250, 250, 250], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [200, 200, 200], lineWidth: 0.1 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' },
    },
    styles: { fontSize: 9, cellPadding: 4 },
    margin: { left: margin, right: margin }
  });

  // @ts-ignore
  const finalY = doc.lastAutoTable.finalY + 10;

  // --- FOOTER SECTION ---
  const amountWords = amountToWords(totalAmount);

  doc.setFont("helvetica", "bold");
  doc.text("Amount in Words:", margin, finalY);
  doc.setFont("helvetica", "normal");
  doc.text(amountWords, margin, finalY + 5);

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Remarks: " + (cn.reason || "N/A"), margin, finalY + 15);
  doc.text("Company PAN: AADCU8306P", margin, finalY + 20);
  doc.text("Subject to Mumbai Jurisdiction.", margin, finalY + 25);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("for UNIFOODS GLOBAL PVT LTD", pageWidth - margin, finalY + 15, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.text("Authorised Signatory", pageWidth - margin, finalY + 25, { align: "right" });

  doc.save(`Credit_Note_${cn.cnNumber || 'Draft'}.pdf`);
}
