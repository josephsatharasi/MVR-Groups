import jsPDF from 'jspdf';

export const generateReceipt = (customer) => {
  const doc = new jsPDF();
  
  doc.setFillColor(25, 55, 109);
  doc.rect(0, 0, 210, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.text('MKL ENTERPRISES', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('WE CARE ABOUT WHAT YOU DRINK', 105, 32, { align: 'center' });
  doc.setFontSize(10);
  doc.text('Water Purifier Rental Services', 105, 40, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('SUBSCRIPTION RECEIPT', 105, 60, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Receipt ID: #${customer.id}`, 20, 75);
  doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 150, 75);
  
  doc.setDrawColor(25, 55, 109);
  doc.setLineWidth(0.5);
  doc.line(20, 80, 190, 80);
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('CUSTOMER DETAILS:', 20, 92);
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Name: ${customer.name}`, 20, 102);
  doc.text(`Phone: ${customer.phone}`, 20, 110);
  doc.text(`Email: ${customer.email}`, 20, 118);
  doc.text(`Address: ${customer.address}`, 20, 126, { maxWidth: 170 });
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('SUBSCRIPTION DETAILS:', 20, 145);
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Partner: ${customer.partnerName}`, 20, 155);
  doc.text(`Plan Duration: ${customer.plan} Months`, 20, 163);
  doc.text(`Start Date: ${customer.startDate}`, 20, 171);
  doc.text(`End Date: ${customer.endDate}`, 20, 179);
  
  doc.setFillColor(240, 240, 240);
  doc.rect(20, 190, 170, 25, 'F');
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('PAYMENT DETAILS:', 25, 200);
  doc.setFontSize(14);
  doc.setTextColor(0, 128, 0);
  doc.text(`Total Amount: ₹${customer.amount}`, 25, 210);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont(undefined, 'italic');
  doc.text('Terms & Conditions:', 20, 230);
  doc.setFontSize(8);
  doc.text('1. Regular maintenance included as per plan', 20, 237);
  doc.text('2. Customer must notify 7 days before plan expiry for renewal', 20, 243);
  doc.text('3. Installation charges may apply for new connections', 20, 249);
  
  doc.setDrawColor(25, 55, 109);
  doc.line(20, 260, 190, 260);
  
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.text('Thank you for choosing MKL Enterprises!', 105, 270, { align: 'center' });
  doc.text('For support: support@mklenterprises.com | +91 1234567890', 105, 277, { align: 'center' });
  
  doc.save(`MKL_Receipt_${customer.name}_${customer.id}.pdf`);
};
