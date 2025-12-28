import { Receipt } from '@/types/models';
import { formatDate, formatCurrency, getMembershipTypeName } from './membership.utils';

export const generateReceiptHTML = (
  receipt: Receipt,
  gymName: string = 'GYM HUB',
  gymLogo?: string
): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt - ${receipt.id}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    
    .receipt {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      background: linear-gradient(135deg, #84cc16 0%, #65a30d 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    
    .header p {
      font-size: 14px;
      opacity: 0.9;
    }
    
    .receipt-id {
      background: #f9fafb;
      padding: 20px;
      text-align: center;
      border-bottom: 2px dashed #e5e7eb;
    }
    
    .receipt-id label {
      display: block;
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .receipt-id .id {
      font-family: 'Courier New', monospace;
      font-size: 16px;
      font-weight: bold;
      color: #1f2937;
    }
    
    .amount-section {
      padding: 40px 30px;
      text-align: center;
      background: linear-gradient(to bottom, #f9fafb 0%, white 100%);
    }
    
    .amount-section label {
      display: block;
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .amount-section .amount {
      font-size: 48px;
      font-weight: bold;
      color: #84cc16;
    }
    
    .section {
      padding: 25px 30px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .section:last-child {
      border-bottom: none;
    }
    
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #84cc16;
    }
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f3f4f6;
    }
    
    .detail-row:last-child {
      border-bottom: none;
    }
    
    .detail-row .label {
      color: #6b7280;
      font-size: 14px;
    }
    
    .detail-row .value {
      color: #1f2937;
      font-weight: 600;
      font-size: 14px;
      text-align: right;
    }
    
    .total-row {
      background: #f9fafb;
      padding: 20px;
      margin-top: 10px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .total-row .label {
      font-size: 18px;
      font-weight: bold;
      color: #1f2937;
    }
    
    .total-row .value {
      font-size: 24px;
      font-weight: bold;
      color: #84cc16;
    }
    
    .footer {
      background: #f9fafb;
      padding: 30px;
      text-align: center;
      color: #6b7280;
    }
    
    .footer p {
      margin: 5px 0;
      font-size: 14px;
    }
    
    .footer .thank-you {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 10px;
    }
    
    .badge {
      display: inline-block;
      padding: 6px 12px;
      background: #dbeafe;
      color: #1e40af;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="receipt">
    <!-- Header -->
    <div class="header">
      ${gymLogo ? `<img src="${gymLogo}" alt="${gymName} Logo" style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 15px; border-radius: 10px;" />` : ''}
      <h1>${gymName}</h1>
      <p>Fitness & Wellness Center</p>
    </div>
    
    <!-- Receipt ID -->
    <div class="receipt-id">
      <label>Receipt ID</label>
      <div class="id">#${receipt.id.slice(-12).toUpperCase()}</div>
    </div>
    
    <!-- Amount -->
    <div class="amount-section">
      <label>Amount Paid</label>
      <div class="amount">${formatCurrency(receipt.amount)}</div>
      <p style="margin-top: 10px; color: #6b7280; font-size: 14px;">
        ${formatDate(receipt.generatedAt)}
      </p>
    </div>
    
    <!-- Client Details -->
    <div class="section">
      <div class="section-title">Client Details</div>
      <div class="detail-row">
        <span class="label">Name</span>
        <span class="value">${receipt.clientName}</span>
      </div>
      <div class="detail-row">
        <span class="label">Client ID</span>
        <span class="value">#${receipt.clientId.slice(-8).toUpperCase()}</span>
      </div>
    </div>
    
    <!-- Membership Details -->
    <div class="section">
      <div class="section-title">Membership Details</div>
      <div class="detail-row">
        <span class="label">Type</span>
        <span class="value">
          <span class="badge">${getMembershipTypeName(receipt.membershipType)}</span>
        </span>
      </div>
      <div class="detail-row">
        <span class="label">Start Date</span>
        <span class="value">${formatDate(receipt.startDate)}</span>
      </div>
      <div class="detail-row">
        <span class="label">End Date</span>
        <span class="value">${formatDate(receipt.endDate)}</span>
      </div>
      <div class="detail-row">
        <span class="label">Duration</span>
        <span class="value">
          ${receipt.membershipType === 'monthly' ? '1 Month' : 
            receipt.membershipType === 'quarterly' ? '3 Months' : '12 Months'}
        </span>
      </div>
    </div>
    
    <!-- Payment Summary -->
    <div class="section">
      <div class="section-title">Payment Summary</div>
      <div class="detail-row">
        <span class="label">Membership Fee</span>
        <span class="value">${formatCurrency(receipt.amount)}</span>
      </div>
      <div class="detail-row">
        <span class="label">Tax</span>
        <span class="value">₹0.00</span>
      </div>
      <div class="total-row">
        <span class="label">Total Paid</span>
        <span class="value">${formatCurrency(receipt.amount)}</span>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p class="thank-you">Thank you for your payment!</p>
      <p>This is a computer-generated receipt and does not require a signature.</p>
      <p style="margin-top: 15px; font-size: 12px;">
        ${gymName} • Fitness Management System
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
};
