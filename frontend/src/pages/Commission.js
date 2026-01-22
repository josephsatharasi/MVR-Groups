import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, X, TrendingUp } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { toast } from 'react-toastify';
import { getCadres, getCustomers } from '../utils/storage';
import axios from 'axios';

const Commission = () => {
  const [cadres, setCadres] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [commissionData, setCommissionData] = useState([]);
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [advanceNote, setAdvanceNote] = useState('');

  const rolePercentages = {
    'FO': 4,
    'TL': 2,
    'STL': 1,
    'DO': 1,
    'SDO': 1,
    'MM': 1,
    'SMM': 1,
    'GM': 1,
    'SGM': 1
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const cadreData = await getCadres();
      const customerData = await getCustomers();
      
      setCadres(cadreData);
      setCustomers(customerData);
      calculateCommissions(cadreData, customerData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const calculateCommissions = (cadreData, customerData) => {
    const allPersons = cadreData.map(c => ({ ...c, type: 'Cadre', role: c.cadreRole, id: c.cadreId }));

    const roleHierarchy = ['FO', 'TL', 'STL', 'DO', 'SDO', 'MM', 'SMM', 'GM', 'SGM'];
    const getCumulativePercentage = (currentRole) => {
      const currentIndex = roleHierarchy.indexOf(currentRole);
      let total = 0;
      for (let i = 0; i <= currentIndex; i++) {
        total += rolePercentages[roleHierarchy[i]] || 0;
      }
      return total;
    };

    const commissions = allPersons.map(person => {
      const percentage = rolePercentages[person.role] || 0;
      const cumulativePercentage = getCumulativePercentage(person.role);
      
      // Get all team members under this cadre (direct and indirect)
      const getTeamMembers = (cadreId) => {
        const directMembers = cadreData.filter(c => c.introducerId === cadreId);
        let allMembers = [...directMembers];
        directMembers.forEach(member => {
          allMembers = [...allMembers, ...getTeamMembers(member.cadreId)];
        });
        return allMembers;
      };
      
      const teamMembers = getTeamMembers(person.id);
      
      // Calculate earnings from own customers with cumulative percentage
      const ownCustomers = customerData.filter(customer => 
        customer.cadreCode === person.id || customer.agentCode === person.id
      );
      
      const ownEarnings = ownCustomers.reduce((sum, customer) => {
        const amount = parseFloat(customer.totalAmount) || 0;
        return sum + (amount * cumulativePercentage / 100);
      }, 0);
      
      // Calculate earnings from team members' customers with cumulative percentage
      const teamEarnings = teamMembers.reduce((sum, member) => {
        const memberCustomers = customerData.filter(customer => 
          customer.cadreCode === member.cadreId || customer.agentCode === member.cadreId
        );
        
        const memberEarnings = memberCustomers.reduce((mSum, customer) => {
          const amount = parseFloat(customer.totalAmount) || 0;
          return mSum + (amount * cumulativePercentage / 100);
        }, 0);
        
        return sum + memberEarnings;
      }, 0);
      
      const totalEarnings = ownEarnings + teamEarnings;

      // Get advances (stored in localStorage for now)
      const advances = JSON.parse(localStorage.getItem(`advances_${person._id}`) || '[]');
      const totalAdvance = advances.reduce((sum, adv) => sum + parseFloat(adv.amount), 0);
      const balance = totalEarnings - totalAdvance;

      return {
        ...person,
        percentage,
        totalEarnings,
        totalAdvance,
        balance,
        advances
      };
    });

    setCommissionData(commissions);
  };

  const handleGiveAdvance = () => {
    if (!advanceAmount || parseFloat(advanceAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const advances = JSON.parse(localStorage.getItem(`advances_${selectedPerson._id}`) || '[]');
    advances.push({
      amount: parseFloat(advanceAmount),
      note: advanceNote,
      date: new Date().toISOString()
    });
    localStorage.setItem(`advances_${selectedPerson._id}`, JSON.stringify(advances));

    toast.success('Advance given successfully!');
    setShowAdvanceModal(false);
    setAdvanceAmount('');
    setAdvanceNote('');
    loadData();
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Commission & Advance</h1>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#1e3a8a' }}>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Role</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Commission %</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Total Earned</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Advance Taken</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Balance</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {commissionData.map((person, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50" style={{backgroundColor: idx % 2 !== 0 ? '#f9fafb' : 'white'}}>
                  <td className="px-4 py-3 text-sm font-semibold text-blue-700">{person.name}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 rounded text-xs font-semibold" style={{backgroundColor: person.type === 'Agent' ? '#1e3a8a' + '33' : '#3b82f6' + '33', color: person.type === 'Agent' ? '#1e3a8a' : '#3b82f6'}}>
                      {person.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{person.id || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{person.role}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600">{person.percentage}%</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600">₹{person.totalEarnings.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-red-600">₹{person.totalAdvance.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-semibold" style={{color: person.balance >= 0 ? '#16a34a' : '#dc2626'}}>
                    ₹{person.balance.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => {
                        setSelectedPerson(person);
                        setShowAdvanceModal(true);
                      }}
                      className="px-3 py-1 bg-blue-600 rounded text-white text-xs flex items-center gap-1 hover:bg-blue-700"
                    >
                      <Plus size={12} /> Give Advance
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {commissionData.length === 0 && (
          <div className="text-center py-8 text-gray-500">No cadres found</div>
        )}
      </Card>

      {/* Give Advance Modal */}
      {showAdvanceModal && selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-800">
                Give Advance to {selectedPerson.name}
              </h2>
              <button onClick={() => setShowAdvanceModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Total Earned:</p>
                    <p className="font-semibold text-green-600">₹{selectedPerson.totalEarnings.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Already Taken:</p>
                    <p className="font-semibold text-red-600">₹{selectedPerson.totalAdvance.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Available Balance:</p>
                    <p className="font-semibold text-lg text-blue-700">₹{selectedPerson.balance.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <FormInput
                label="Advance Amount"
                type="number"
                value={advanceAmount}
                onChange={(e) => setAdvanceAmount(e.target.value)}
                required
                placeholder="Enter amount"
              />
              <FormInput
                label="Note (Optional)"
                type="textarea"
                value={advanceNote}
                onChange={(e) => setAdvanceNote(e.target.value)}
                placeholder="Enter note"
                rows={3}
              />

              <div className="flex gap-2 mt-4">
                <Button variant="primary" onClick={handleGiveAdvance}>
                  Give Advance
                </Button>
                <Button variant="secondary" onClick={() => setShowAdvanceModal(false)}>
                  Cancel
                </Button>
              </div>

              {selectedPerson.advances.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="font-semibold mb-2 text-gray-800">Advance History</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedPerson.advances.map((adv, idx) => (
                      <div key={idx} className="bg-gray-50 p-2 rounded text-sm">
                        <div className="flex justify-between">
                          <span className="font-semibold">₹{parseFloat(adv.amount).toLocaleString()}</span>
                          <span className="text-gray-500">{new Date(adv.date).toLocaleDateString()}</span>
                        </div>
                        {adv.note && <p className="text-gray-600 text-xs mt-1">{adv.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Commission;
