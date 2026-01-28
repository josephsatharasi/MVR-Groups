import React, { useState, useEffect } from 'react';
import { X, User, Phone, MapPin, Home, DollarSign, Edit2, CreditCard, Plus, Download, Calendar } from 'lucide-react';
import { updateCustomer } from '../utils/storage';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CustomerDetails = ({ customer, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [newPayment, setNewPayment] = useState({ amount: '', date: '', note: '' });
  const [formData, setFormData] = useState({
    name: customer.name || '',
    mobile: customer.phone || customer.mobile || '',
    whatsapp: customer.whatsapp || '',
    address: customer.address || '',
    projectName: customer.projectName || '',
    plotNo: customer.plotNo || '',
    totalAmount: customer.totalAmount || '',
    bookingAmount: customer.bookingAmount || '',
    balanceAmount: customer.balanceAmount || ''
  });

  useEffect(() => {
    loadPaymentHistory();
  }, [customer]);

  const loadPaymentHistory = () => {
    const history = JSON.parse(localStorage.getItem(`payment_history_${customer._id || customer.id}`) || '[]');
    
    // If no payment history exists and booking amount is present, add it as first payment
    if (history.length === 0 && customer.bookingAmount && parseFloat(customer.bookingAmount) > 0) {
      const bookingPayment = {
        amount: parseFloat(customer.bookingAmount),
        date: customer.createdAt ? new Date(customer.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        note: 'Booking Amount',
        timestamp: customer.createdAt || new Date().toISOString()
      };
      history.push(bookingPayment);
      localStorage.setItem(`payment_history_${customer._id || customer.id}`, JSON.stringify(history));
    }
    
    setPaymentHistory(history);
  };

  const calculateAmounts = () => {
    const total = parseFloat(customer.totalAmount) || 0;
    const totalPaid = paymentHistory.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const pending = total - totalPaid;
    return { total, totalPaid, pending };
  };

  const { total, totalPaid, pending } = calculateAmounts();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateCustomer(customer._id || customer.id, formData);
      toast.success('Customer updated successfully!');
      setIsEditing(false);
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      toast.error('Failed to update customer');
    }
  };

  const handleAddPayment = () => {
    if (!newPayment.amount || parseFloat(newPayment.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!newPayment.date) {
      toast.error('Please select a date');
      return;
    }

    const paymentAmount = parseFloat(newPayment.amount);
    if (paymentAmount > pending) {
      toast.error(`Payment amount cannot exceed pending amount of ₹${pending.toLocaleString('en-IN')}`);
      return;
    }

    const payment = {
      amount: paymentAmount,
      date: newPayment.date,
      note: newPayment.note,
      timestamp: new Date().toISOString()
    };

    const updatedHistory = [...paymentHistory, payment];
    localStorage.setItem(`payment_history_${customer._id || customer.id}`, JSON.stringify(updatedHistory));
    setPaymentHistory(updatedHistory);
    
    // Update customer balance amount
    const newBalance = pending - paymentAmount;
    updateCustomer(customer._id || customer.id, { balanceAmount: newBalance.toString() });
    
    setNewPayment({ amount: '', date: '', note: '' });
    setShowPaymentModal(false);
    toast.success('Payment added successfully!');
    if (onUpdate) onUpdate();
  };

  const downloadPaymentHistory = () => {
    const doc = new jsPDF();
    
    // Company Header
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('MVR Groups', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Real Estate Management', 105, 22, { align: 'center' });
    
    // Title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Payment History', 14, 35);
    
    // Customer Details
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`Customer: ${customer.name}`, 14, 43);
    doc.text(`Phone: ${customer.phone || customer.mobile}`, 14, 49);
    doc.text(`Project: ${customer.projectName || '-'}`, 14, 55);
    
    const tableData = paymentHistory.map((p, index) => [
      index + 1,
      new Date(p.date).toLocaleDateString('en-IN'),
      parseFloat(p.amount).toLocaleString('en-IN'),
      p.note || '-'
    ]);
    
    autoTable(doc, {
      startY: 62,
      head: [['S.No', 'Date', 'Amount', 'Note']],
      body: tableData,
      foot: [['', 'Total Paid:', totalPaid.toLocaleString('en-IN'), '']],
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold' },
      footStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 4 },
    });
    
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`Total Amount: Rs. ${total.toLocaleString('en-IN')}`, 14, finalY);
    doc.text(`Total Paid: Rs. ${totalPaid.toLocaleString('en-IN')}`, 14, finalY + 7);
    doc.setFont(undefined, 'bold');
    doc.text(`Pending Amount: Rs. ${pending.toLocaleString('en-IN')}`, 14, finalY + 14);
    
    doc.save(`payment-history-${customer.name}.pdf`);
    toast.success('Payment history downloaded!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="text-white p-6 flex justify-between items-center" style={{background: '#1e3a8a'}}>
          <h2 className="text-2xl font-bold">{isEditing ? 'Edit Customer' : 'Customer Details'}</h2>
          <div className="flex gap-2">
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors" title="Edit Customer">
                <Edit2 size={24} />
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <User className="mt-1" style={{color: '#1e3a8a'}} size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Customer Name</p>
                {isEditing ? (
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                ) : (
                  <p className="font-semibold" style={{color: '#1e3a8a'}}>{customer.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-1" style={{color: '#1e3a8a'}} size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Mobile Number</p>
                {isEditing ? (
                  <input type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                ) : (
                  <p className="font-semibold" style={{color: '#1e3a8a'}}>{customer.phone || customer.mobile}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-1" style={{color: '#1e3a8a'}} size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">WhatsApp Number</p>
                {isEditing ? (
                  <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                ) : (
                  <p className="font-semibold" style={{color: '#1e3a8a'}}>{customer.whatsapp || '-'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Home className="mt-1" style={{color: '#1e3a8a'}} size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Project Name</p>
                {isEditing ? (
                  <input type="text" name="projectName" value={formData.projectName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                ) : (
                  <p className="font-semibold" style={{color: '#1e3a8a'}}>{customer.projectName || '-'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Home className="mt-1" style={{color: '#1e3a8a'}} size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Plot No</p>
                {isEditing ? (
                  <input type="text" name="plotNo" value={formData.plotNo} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                ) : (
                  <p className="font-semibold" style={{color: '#1e3a8a'}}>{customer.plotNo || '-'}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-1" style={{color: '#1e3a8a'}} size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold" style={{color: '#1e3a8a'}}>{customer.location || '-'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="mt-1" style={{color: '#1e3a8a'}} size={20} />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Address</p>
              {isEditing ? (
                <textarea name="address" value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" rows="2" />
              ) : (
                <p className="font-semibold" style={{color: '#1e3a8a'}}>{customer.address || '-'}</p>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold mb-4" style={{color: '#1e3a8a'}}>Payment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <DollarSign className="mt-1" style={{color: '#1e3a8a'}} size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  {isEditing ? (
                    <input type="number" name="totalAmount" value={formData.totalAmount} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                  ) : (
                  <p className="font-semibold text-lg" style={{color: '#1e3a8a'}}>₹{parseFloat(customer.totalAmount || 0).toLocaleString('en-IN')}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="mt-1 text-green-600" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Booking Amount</p>
                  {isEditing ? (
                    <input type="number" name="bookingAmount" value={formData.bookingAmount} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                  ) : (
                  <p className="font-semibold text-lg text-green-600">₹{parseFloat(customer.bookingAmount || 0).toLocaleString('en-IN')}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="mt-1 text-red-600" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Balance Amount</p>
                  <p className="font-semibold text-lg text-red-600">₹{pending.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold" style={{color: '#1e3a8a'}}>Payment History</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm flex items-center gap-1 hover:bg-green-700"
                >
                  <Plus size={16} /> Add Payment
                </button>
                {paymentHistory.length > 0 && (
                  <button
                    onClick={downloadPaymentHistory}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-1 hover:bg-blue-700"
                  >
                    <Download size={16} /> Download
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">Total Amount</p>
                <p className="text-lg font-bold text-blue-700">₹{total.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">Total Paid</p>
                <p className="text-lg font-bold text-green-700">₹{totalPaid.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">Pending Amount</p>
                <p className="text-lg font-bold text-red-700">₹{pending.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {paymentHistory.length > 0 ? (
              <div className="max-h-60 overflow-y-auto border rounded-lg">
                <table className="w-full">
                  <thead className="bg-blue-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Date</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Amount</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map((payment, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-2 text-sm">{new Date(payment.date).toLocaleDateString('en-IN')}</td>
                        <td className="px-3 py-2 text-sm text-right font-semibold text-green-600">₹{parseFloat(payment.amount).toLocaleString('en-IN')}</td>
                        <td className="px-3 py-2 text-sm text-gray-600">{payment.note || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Calendar className="mx-auto mb-2 text-gray-400" size={48} />
                <p className="text-gray-500">No payment history yet</p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold mb-2" style={{color: '#1e3a8a'}}>Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              <p><span className="font-semibold">Customer ID:</span> #{customer._id || customer.id}</p>
              <p><span className="font-semibold">Aadhar No:</span> {customer.aadharNo || '-'}</p>
              <p><span className="font-semibold">Pin Code:</span> {customer.pinCode || '-'}</p>
              <p><span className="font-semibold">Payment Type:</span> {customer.paymentType || '-'}</p>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 justify-end">
              <button onClick={() => setIsEditing(false)} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} className="px-6 py-2 text-white rounded-lg transition-colors" style={{background: '#1e3a8a'}}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="text-white p-4 flex justify-between items-center" style={{background: '#1e3a8a'}}>
              <h3 className="text-lg font-bold">Add Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="p-1 rounded hover:bg-white hover:bg-opacity-20">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Payment Amount * (Max: ₹{pending.toLocaleString('en-IN')})</label>
                <input
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  max={pending}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Payment Date *</label>
                <input
                  type="date"
                  value={newPayment.date}
                  onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Note (Optional)</label>
                <textarea
                  value={newPayment.note}
                  onChange={(e) => setNewPayment({ ...newPayment, note: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter payment note"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddPayment}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Payment
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;

