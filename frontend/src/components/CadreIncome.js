import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const CadreIncomeFilter = ({ linkedCustomers, caders, selectedCader, getCumulativePercentage }) => {
  const [filterType, setFilterType] = useState('monthly');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredCommission, setFilteredCommission] = useState(0);

  useEffect(() => {
    calculateFilteredCommission();
  }, [filterType, month, year, startDate, endDate, linkedCustomers]);

  const getTotalPaid = (customerId) => {
    const paymentHistory = JSON.parse(localStorage.getItem(`payment_history_${customerId}`) || '[]');
    return paymentHistory.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  };

  const getFilteredPayments = (customerId) => {
    const paymentHistory = JSON.parse(localStorage.getItem(`payment_history_${customerId}`) || '[]');
    return paymentHistory.filter(payment => {
      const paymentDate = new Date(payment.date);
      if (filterType === 'monthly') {
        return paymentDate.getMonth() + 1 === parseInt(month) && paymentDate.getFullYear() === parseInt(year);
      } else if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return paymentDate >= start && paymentDate <= end;
      }
      return true;
    });
  };

  const calculateFilteredCommission = () => {
    const cumulativePercentage = getCumulativePercentage(selectedCader.cadreRole);
    
    // Own customers commission
    const ownCustomers = linkedCustomers.filter(c => 
      c.cadreCode === selectedCader.cadreId || c.agentCode === selectedCader.cadreId
    );
    const ownEarnings = ownCustomers.reduce((sum, customer) => {
      const filteredPayments = getFilteredPayments(customer._id || customer.id);
      const paidAmount = filteredPayments.reduce((s, p) => s + parseFloat(p.amount || 0), 0);
      return sum + (paidAmount * cumulativePercentage / 100);
    }, 0);
    
    // Team customers commission
    const getTeamMembers = (cadreId) => {
      const directMembers = caders.filter(c => c.introducerId === cadreId);
      let allMembers = [...directMembers];
      directMembers.forEach(member => {
        allMembers = [...allMembers, ...getTeamMembers(member.cadreId)];
      });
      return allMembers;
    };
    
    const team = getTeamMembers(selectedCader.cadreId);
    const teamEarnings = team.reduce((sum, member) => {
      const memberCustomers = linkedCustomers.filter(c => 
        c.cadreCode === member.cadreId || c.agentCode === member.cadreId
      );
      const memberCumulativePercentage = getCumulativePercentage(member.cadreRole);
      const mySharePercentage = cumulativePercentage - memberCumulativePercentage;
      
      return sum + memberCustomers.reduce((mSum, customer) => {
        const filteredPayments = getFilteredPayments(customer._id || customer.id);
        const paidAmount = filteredPayments.reduce((s, p) => s + parseFloat(p.amount || 0), 0);
        return mSum + (paidAmount * mySharePercentage / 100);
      }, 0);
    }, 0);
    
    setFilteredCommission(ownEarnings + teamEarnings);
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">Commission by Period</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg border">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setFilterType('monthly')}
            className={`px-4 py-2 rounded-lg font-medium ${filterType === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setFilterType('custom')}
            className={`px-4 py-2 rounded-lg font-medium ${filterType === 'custom' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Custom Range
          </button>
        </div>

        {filterType === 'monthly' ? (
          <div className="flex gap-4">
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="px-4 py-2 border rounded-lg">
              {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
            <select value={year} onChange={(e) => setYear(e.target.value)} className="px-4 py-2 border rounded-lg">
              {[...Array(5)].map((_, i) => {
                const y = new Date().getFullYear() - i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </div>
        ) : (
          <div className="flex gap-4">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-4 py-2 border rounded-lg" />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-4 py-2 border rounded-lg" />
          </div>
        )}
      </div>

      <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
        <p className="text-sm text-gray-600 mb-2">
          {filterType === 'monthly' 
            ? `Commission for ${months[month - 1]} ${year}`
            : startDate && endDate 
              ? `Commission from ${new Date(startDate).toLocaleDateString('en-IN')} to ${new Date(endDate).toLocaleDateString('en-IN')}`
              : 'Select date range'}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg">Total Commission:</span>
          <span className="font-bold text-2xl text-green-600">₹{filteredCommission.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
      </div>
    </div>
  );
};

export default CadreIncomeFilter;
