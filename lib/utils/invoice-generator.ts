import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '@/lib/types/checkout';

// Helper to safely format date
const formatDate = (dateString: any) => {
    try {
        const d = new Date(dateString || Date.now());
        if (isNaN(d.getTime())) return new Date().toLocaleDateString('en-IN');
        return d.toLocaleDateString('en-IN');
    } catch (e) {
        return new Date().toLocaleDateString('en-IN');
    }
};

export const generateInvoice = (order: any) => {
    const doc = new jsPDF();

    // --- Header Background ---
    doc.setFillColor(255, 247, 237); // Light Orange bg
    doc.rect(0, 0, 210, 50, 'F');

    doc.setFontSize(24);
    doc.setTextColor(217, 119, 6); // Brand Orange
    doc.setFont("helvetica", "bold");
    doc.text('Unifoods', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text('123 Food Street, Business District', 14, 26);
    doc.text('Pune, Maharashtra - 411001', 14, 30);
    doc.text('GSTIN: 27ABCDE1234F1Z5', 14, 34);
    doc.text('Email: support@unifoods.com', 14, 38);

    // --- Invoice Info ---
    doc.setFontSize(20);
    doc.setTextColor(33, 33, 33);
    doc.setFont("helvetica", "bold");
    doc.text('INVOICE', 196, 20, { align: 'right' });

    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.setFont("helvetica", "normal");

    const invoiceNo = order.invoice?.invoiceNumber || `INV-${(order.orderNumber || '000').replace('#', '')}`;
    const orderDate = formatDate(order.date || order.placedAt || order.createdAt);

    doc.text(`Invoice No: ${invoiceNo}`, 196, 28, { align: 'right' });
    doc.text(`Date: ${orderDate}`, 196, 33, { align: 'right' });
    doc.text(`Order ID: ${order.orderNumber || order._id || 'N/A'}`, 196, 38, { align: 'right' });

    // --- Details Section ---
    const startY = 60;

    // Bill To / Ship To Container
    doc.setDrawColor(230);
    doc.setFillColor(252, 252, 252);
    doc.roundedRect(14, startY, 90, 35, 2, 2, 'FD');

    doc.setFontSize(11);
    doc.setTextColor(217, 119, 6); // Brand Orange
    doc.setFont("helvetica", "bold");
    doc.text('Bill To:', 20, startY + 8);

    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.setFont("helvetica", "normal");

    const addr = order.shippingAddress || {};
    doc.text(addr.fullName || 'Guest User', 20, startY + 14);
    doc.text(addr.addressLine1 || '', 20, startY + 19);

    let currentY = startY + 19;
    if (addr.addressLine2) {
        currentY += 5;
        doc.text(addr.addressLine2, 20, currentY);
    }

    doc.text(`${addr.city || ''} ${addr.state ? '- ' + addr.state : ''} ${addr.pincode || ''}`, 20, currentY + 5);
    doc.text(`Phone: +91 ${addr.phone || 'N/A'}`, 20, currentY + 10);

    // --- Table ---
    const tableColumn = ["Item Description", "Unit Price", "Qty", "Total"];
    const tableRows = (order.items || []).map((item: any) => {
        // Robust extraction
        const price = typeof item.price === 'number' ? item.price : (typeof item.unitPrice === 'number' ? item.unitPrice : 0);
        const quantity = item.quantity || 1;
        const total = price * quantity;
        const name = item.productName || item.name || item.title || "Product";

        return [
            name,
            `Rs. ${price.toFixed(2)}`,
            quantity,
            `Rs. ${total.toFixed(2)}`
        ];
    });

    autoTable(doc, {
        startY: startY + 45,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: {
            fillColor: [217, 119, 6],
            textColor: 255,
            fontStyle: 'bold',
            halign: 'center'
        },
        styles: {
            fontSize: 10,
            cellPadding: 4,
            textColor: 50,
            valign: 'middle'
        },
        columnStyles: {
            0: { cellWidth: 'auto' },    // Item
            1: { halign: 'right', cellWidth: 30 },  // Price
            2: { halign: 'center', cellWidth: 20 }, // Qty
            3: { halign: 'right', cellWidth: 35 }   // Total
        },
        footStyles: {
            fillColor: [245, 245, 245],
            textColor: 50,
            fontStyle: 'bold'
        }
    });

    // --- Totals ---
    // @ts-ignore
    let finalY = doc.lastAutoTable.finalY + 10;
    const rightAlignX = 196;

    const printTotal = (label: string, value: string, isBold = false, isHighlight = false) => {
        doc.setFontSize(isHighlight ? 12 : 10);
        doc.setTextColor(isBold ? 0 : 80);
        doc.setFont("helvetica", isBold ? "bold" : "normal");

        const yPos = finalY;

        if (isHighlight) {
            doc.setFillColor(255, 247, 237);
            doc.roundedRect(120, finalY - 5, 80, 10, 1, 1, 'F');
            doc.setTextColor(217, 119, 6);
        }

        doc.text(label, 130, yPos);
        doc.text(value, rightAlignX, yPos, { align: 'right' });
        finalY += (isHighlight ? 10 : 7);
    };

    // 1. Calculate Subtotal
    const calculatedSubtotal = (order.items || []).reduce((acc: number, item: any) => {
        const price = typeof item.price === 'number' ? item.price : (typeof item.unitPrice === 'number' ? item.unitPrice : 0);
        const qty = item.quantity || 1;
        return acc + (price * qty);
    }, 0);

    // 2. Shipping
    const dbShipping = order.shipping ?? (order as any).shippingCharges;
    const calculatedShipping = dbShipping !== undefined
        ? dbShipping
        : (calculatedSubtotal >= 500 ? 0 : 20);

    // 3. Discount
    const discountVal = order.discount || (order as any).discounts || 0;

    // 4. Tax (18%)
    const taxableAmount = Math.max(0, calculatedSubtotal - discountVal);
    const calculatedTax = taxableAmount * 0.18;

    // 5. Platform Fee
    const platformFee = 5;

    // 6. Total
    const calculatedTotal = calculatedSubtotal - discountVal + calculatedTax + calculatedShipping + platformFee;


    printTotal("Subtotal:", `Rs. ${calculatedSubtotal.toFixed(2)}`);
    if (discountVal > 0) {
        printTotal("Discount:", `- Rs. ${discountVal.toFixed(2)}`);
    }
    printTotal("Platform Fee:", `Rs. ${platformFee.toFixed(2)}`);
    printTotal("Delivery Charges:", calculatedShipping === 0 ? "FREE" : `Rs. ${calculatedShipping.toFixed(2)}`);
    printTotal("Tax (GST 18%):", `Rs. ${calculatedTax.toFixed(2)}`);

    doc.setDrawColor(220);
    doc.line(130, finalY - 3, 196, finalY - 3);

    printTotal("Grand Total:", `Rs. ${calculatedTotal.toFixed(2)}`, true, true);

    // --- Signatures / Footer ---
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.setFont("helvetica", "italic");
    doc.text("Authorized Signatory", 196, pageHeight - 40, { align: 'right' });

    doc.setFontSize(8);
    doc.text("Thank you for your business!", 105, pageHeight - 20, { align: "center" });
    doc.text("This invoice is computer generated and requires no signature.", 105, pageHeight - 15, { align: "center" });

    doc.save(`Invoice_${order.orderNumber || 'Draft'}.pdf`);
};
