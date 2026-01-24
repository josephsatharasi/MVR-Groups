# Commission Calculation - Payment Based System

## Overview
Commission is now calculated based on **actual payments received** from customers, not on the total amount.

## How It Works

### Before (Total Amount Based):
- Customer Total Amount: ₹10,00,000
- Commission calculated immediately: ₹10,00,000 × 4% = ₹40,000
- Cadre gets full commission even if customer hasn't paid

### After (Payment Based):
- Customer Total Amount: ₹10,00,000
- Booking Amount Paid: ₹2,00,000
- Commission on booking: ₹2,00,000 × 4% = ₹8,000
- Customer pays ₹3,00,000 more
- Additional commission: ₹3,00,000 × 4% = ₹12,000
- Total commission so far: ₹20,000
- Remaining commission when full payment received: ₹20,000

## Example Scenario

**Customer Details:**
- Total Amount: ₹10,00,000
- Cadre: FO (4% commission)

**Payment Timeline:**

| Date | Payment | Commission Earned | Total Commission |
|------|---------|-------------------|------------------|
| Day 1 | ₹2,00,000 (Booking) | ₹8,000 | ₹8,000 |
| Day 30 | ₹3,00,000 | ₹12,000 | ₹20,000 |
| Day 60 | ₹2,00,000 | ₹8,000 | ₹28,000 |
| Day 90 | ₹3,00,000 (Final) | ₹12,000 | ₹40,000 |

## Key Changes Made

### 1. Commission.js (Line 47-62)
- Added `getTotalPaid()` function to fetch payment history from localStorage
- Changed commission calculation from `totalAmount` to `paidAmount`
- Commission now updates automatically when new payments are added

### 2. Customers.js (Line 385-392)
- Updated commission preview to show calculation on booking amount
- Added note: "Commission calculated on paid amount only"

### 3. CadreDetails.js
- Added `getTotalPaid()` function
- Updated commission calculation to use paid amount
- Added new columns: Total Amount, Paid Amount, Balance
- Commission now shows based on actual payments received

### 4. Caders.js (Details Modal)
- Updated `handleRowClick()` to calculate commission on paid amount
- Added balance column in customer table
- Shows: Total Amount, Paid Amount, Balance, Commission
- Commission calculation uses payment history

## Benefits

1. **Fair Commission**: Cadres earn commission only on money actually received
2. **Cash Flow Aligned**: Commission payout matches company's cash inflow
3. **Risk Reduction**: No commission on unpaid amounts
4. **Automatic Updates**: Commission recalculates when payments are added
5. **Transparent Tracking**: Shows total, paid, and balance amounts clearly

## How to Use

1. **Add Customer**: Enter booking amount - commission calculated on this
2. **Add Payments**: Go to customer details → Add Payment
3. **View Commission**: Commission page shows updated earnings based on all payments
4. **Track Progress**: Payment history shows all transactions
5. **Cadre Details**: Click on cadre to see detailed breakdown with balance amounts

## Display Columns

All commission views now show:
- **Total Amount**: Full property/plot value
- **Paid Amount**: Sum of all payments received (green)
- **Balance**: Remaining amount to be paid (red)
- **Commission**: Calculated on paid amount only (green)

## Technical Implementation

```javascript
// Get total paid amount for a customer
const getTotalPaid = (customerId) => {
  const paymentHistory = JSON.parse(localStorage.getItem(`payment_history_${customerId}`) || '[]');
  return paymentHistory.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
};

// Calculate commission on paid amount
const paidAmount = getTotalPaid(customer._id || customer.id);
const commission = paidAmount * percentage / 100;
```

## Important Notes

- Commission is calculated in real-time based on payment history
- Payment history is stored in localStorage: `payment_history_{customerId}`
- Booking amount is automatically added as first payment
- Commission updates immediately when new payments are added
- Works for both direct sales and team hierarchy commissions
- Balance column helps track pending payments at a glance
