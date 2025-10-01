/**
 * Order Summary PDF Generator
 * 
 * Generates a simple order summary PDF for offline orders.
 * This is NOT an official invoice - just a receipt for the customer.
 * 
 * @module lib/pdf/orderSummary
 */

import jsPDF from 'jspdf';
import { Order } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

/**
 * Generate Order Summary PDF
 * 
 * @param order - Order to generate summary for
 * @returns PDF blob
 */
export async function generateOrderSummaryPDF(order: Order): Promise<Blob> {
  const doc = new jsPDF();
  
  // Colors
  const primaryColor = '#4F46E5';
  const grayColor = '#6B7280';
  const dangerColor = '#DC2626';
  
  let yPos = 20;
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(primaryColor);
  doc.text('ORDER SUMMARY', 105, yPos, { align: 'center' });
  
  yPos += 8;
  doc.setFontSize(11);
  doc.setTextColor(dangerColor);
  doc.text('(Pending Confirmation - Not an Invoice)', 105, yPos, { align: 'center' });
  
  yPos += 15;
  
  // Order Information
  doc.setFontSize(10);
  doc.setTextColor(grayColor);
  doc.text('Order Number:', 20, yPos);
  doc.setTextColor('#000000');
  doc.text(order.orderNumber, 60, yPos);
  
  yPos += 7;
  doc.setTextColor(grayColor);
  doc.text('Date:', 20, yPos);
  doc.setTextColor('#000000');
  doc.text(formatDate(order.date), 60, yPos);
  
  yPos += 7;
  doc.setTextColor(grayColor);
  doc.text('Customer:', 20, yPos);
  doc.setTextColor('#000000');
  doc.text(order.customerName, 60, yPos);
  
  if (order.deliveryAddress) {
    yPos += 7;
    doc.setTextColor(grayColor);
    doc.text('Delivery:', 20, yPos);
    doc.setTextColor('#000000');
    const addressLines = doc.splitTextToSize(order.deliveryAddress, 130);
    doc.text(addressLines, 60, yPos);
    yPos += (addressLines.length - 1) * 5;
  }
  
  yPos += 15;
  
  // Line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, 190, yPos);
  
  yPos += 10;
  
  // Table Header
  doc.setFillColor(245, 245, 245);
  doc.rect(20, yPos - 5, 170, 8, 'F');
  
  doc.setFontSize(9);
  doc.setTextColor(grayColor);
  doc.text('Product', 22, yPos);
  doc.text('Qty', 110, yPos);
  doc.text('Price', 135, yPos);
  doc.text('Discount', 155, yPos);
  doc.text('Total', 180, yPos, { align: 'right' });
  
  yPos += 10;
  
  // Order Items
  doc.setFontSize(9);
  doc.setTextColor('#000000');
  
  order.items.forEach((item) => {
    // Check if we need a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    // Product name (truncate if too long)
    const productName = item.productName.length > 35 
      ? item.productName.substring(0, 32) + '...'
      : item.productName;
    doc.text(productName, 22, yPos);
    
    // Quantity
    doc.text(String(item.quantity), 110, yPos);
    
    // Unit Price
    doc.text(formatCurrency(item.unitPrice), 135, yPos);
    
    // Discount
    if (item.discount && item.discount > 0) {
      doc.setTextColor('#059669');
      doc.text(`${item.discount}%`, 155, yPos);
      doc.setTextColor('#000000');
    } else {
      doc.text('-', 155, yPos);
    }
    
    // Subtotal
    doc.text(formatCurrency(item.subtotal), 180, yPos, { align: 'right' });
    
    yPos += 7;
  });
  
  yPos += 5;
  
  // Line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, 190, yPos);
  
  yPos += 10;
  
  // Totals
  doc.setFontSize(10);
  
  // Subtotal
  doc.setTextColor(grayColor);
  doc.text('Subtotal:', 130, yPos);
  doc.setTextColor('#000000');
  doc.text(formatCurrency(order.subtotal), 180, yPos, { align: 'right' });
  
  yPos += 7;
  
  // Tax
  doc.setTextColor(grayColor);
  doc.text('VAT (15%):', 130, yPos);
  doc.setTextColor('#000000');
  doc.text(formatCurrency(order.tax), 180, yPos, { align: 'right' });
  
  yPos += 10;
  
  // Line separator
  doc.setDrawColor(100, 100, 100);
  doc.line(130, yPos, 190, yPos);
  
  yPos += 8;
  
  // Total
  doc.setFontSize(12);
  doc.setTextColor('#000000');
  doc.text('Total:', 130, yPos);
  doc.setTextColor(primaryColor);
  doc.text(formatCurrency(order.total), 180, yPos, { align: 'right' });
  
  yPos += 15;
  
  // Notes
  if (order.notes) {
    doc.setFontSize(9);
    doc.setTextColor(grayColor);
    doc.text('Notes:', 20, yPos);
    yPos += 5;
    doc.setTextColor('#000000');
    const notesLines = doc.splitTextToSize(order.notes, 170);
    doc.text(notesLines, 20, yPos);
    yPos += notesLines.length * 5;
  }
  
  yPos += 10;
  
  // Important Notice
  doc.setFillColor(254, 242, 242);
  doc.rect(20, yPos, 170, 25, 'F');
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setTextColor(dangerColor);
  doc.text('⚠ IMPORTANT NOTICE', 105, yPos, { align: 'center' });
  
  yPos += 6;
  doc.setFontSize(8);
  doc.setTextColor(grayColor);
  doc.text('This is NOT an official tax invoice.', 105, yPos, { align: 'center' });
  
  yPos += 5;
  doc.text('Official invoice will be emailed to the customer within 24 hours.', 105, yPos, { align: 'center' });
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(grayColor);
  doc.text('Mauritius Meat Market', 105, pageHeight - 20, { align: 'center' });
  doc.text('Thank you for your business!', 105, pageHeight - 15, { align: 'center' });
  
  // Convert to blob
  return doc.output('blob');
}

/**
 * Download Order Summary PDF
 * 
 * @param order - Order to download
 */
export async function downloadOrderSummary(order: Order): Promise<void> {
  const blob = await generateOrderSummaryPDF(order);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Order-${order.orderNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
