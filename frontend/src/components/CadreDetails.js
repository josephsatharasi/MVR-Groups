import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, MapPin, Briefcase, Award, DollarSign, CreditCard, Hash, Users } from 'lucide-react';
import { getCustomers } from '../utils/storage';

const CadreDetails = ({ cadre, onClose }) => {
  const [linkedCustomers, setLinkedCustomers] = useState([]);
  const [totalCommission, setTotalCommission] = useState(0);

  useEffect(() => {
    loadLinkedCustomers();
  }, [cadre]);

  const getTotalPaid = (customerId) => {
    const paymentHistory = JSON.parse(localStorage.getItem(`payment_history_${customerId}`) || '[]');
    return paymentHistory.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  };

  const loadLinkedCustomers = async () => {
    const customers = await getCustomers();
    const linked = customers.filter(c => c.agentCode === cadre.cadreId || c.cadreCode === cadre.cadreId);
    setLinkedCustomers(linked);
    
    // Calculate commission based on PAID AMOUNT
    const total = linked.reduce((sum, customer) => {
      const paidAmount = getTotalPaid(customer._id || customer.id);
      const sellerCadreId = customer.agentCode || customer.cadreCode;
      
      if (sellerCadreId === cadre.cadreId) {
        const percentage = getCumulativePercentage(cadre.cadreRole);
        return sum + (paidAmount * percentage / 100);
      } else {
        return sum;
      }
    }, 0);
    setTotalCommission(total);
  };
  const caderRoles = [
    { value: 'FO', label: 'FIELD OFFICER (FO)', percentage: 4 },
    { value: 'TL', label: 'TEAM LEADER (TL)', percentage: 2 },
    { value: 'STL', label: 'SENIOR TEAM LEADER (STL)', percentage: 1 },
    { value: 'DO', label: 'DEVELOPMENT OFFICE (DO)', percentage: 1 },
    { value: 'SDO', label: 'SENIOR DEVELOPMENT OFFICE (SDO)', percentage: 1 },
    { value: 'MM', label: 'MARKETING MANAGER (MM)', percentage: 1 },
    { value: 'SMM', label: 'SENIOR MARKETING MANAGER (SMM)', percentage: 1 },
    { value: 'GM', label: 'GENERAL MANAGER (GM)', percentage: 1 },
    { value: 'SGM', label: 'SENIOR GENERAL MANAGER (SGM)', percentage: 1 },
  ];

  const getRoleLabel = (value) => caderRoles.find(r => r.value === value)?.label || value;
  const getPercentage = (value) => caderRoles.find(r => r.value === value)?.percentage || 0;
  
  const getCumulativePercentage = (role) => {
    const roleHierarchy = ['FO', 'TL', 'STL', 'DO', 'SDO', 'MM', 'SMM', 'GM', 'SGM'];
    const roleIndex = roleHierarchy.indexOf(role);
    let total = 0;
    for (let i = 0; i <= roleIndex; i++) {
      total += getPercentage(roleHierarchy[i]);
    }
    return total;
  };

  const formatIndianNumber = (num) => {
    if (!num) return '0';
    const number = parseFloat(num);
    if (isNaN(number)) return '0';
    return number.toLocaleString('en-IN');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="text-white p-6 flex justify-between items-center" style={{background: '#1e3a8a'}}>
          <h2 className="text-2xl font-bold">Cadre Details</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Section */}
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
            <h3 className="text-xl font-bold text-blue-900 mb-2">{cadre.name}</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold">
                {getRoleLabel(cadre.cadreRole)}
              </span>
              <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-semibold">
                {getCumulativePercentage(cadre.cadreRole)}% Commission
              </span>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h4 className="font-bold text-lg mb-4 pb-2 border-b" style={{color: '#1e3a8a'}}>Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="mt-1" style={{color: '#1e3a8a'}} size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-semibold" style={{color: '#1e3a8a'}}>{cadre.name || '-'}</p>
                </div>
              </div>

              {cadre.relationType && (
                <div className="flex items-start gap-3">
                  <User className="mt-1" style={{color: '#1e3a8a'}} size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Relation</p>
                    <p className="font-semibold" style={{color: '#1e3a8a'}}>{cadre.relationType} {cadre.relation}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Phone className="mt-1" style={{color: '#1e3a8a'}} size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Mobile Number</p>
                  <p className="font-semibold" style={{color: '#1e3a8a'}}>{cadre.mobile || '-'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-1" style={{color: '#1e3a8a'}} size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">WhatsApp Number</p>
                  <p className="font-semibold" style={{color: '#1e3a8a'}}>{cadre.whatsapp || '-'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-1" style={{color: '#1e3a8a'}} size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Email Address</p>
                  <p className="font-semibold" style={{color: '#1e3a8a'}}>{cadre.email || '-'}</p>
                </div>
              </div>

              {cadre.dob && (
                <div className="flex items-start gap-3">
                  <User className="mt-1" style={{color: '#1e3a8a'}} size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-semibold" style={{color: '#1e3a8a'}}>{cadre.dob}</p>
                  </div>
                </div>
              )}

              {cadre.age && (
                <div className="flex items-start gap-3">
                  <User className="mt-1" style={{color: '#1e3a8a'}} size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="font-semibold" style={{color: '#1e3a8a'}}>{cadre.age} years</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cadre Information */}
          <div>
            <h4 className="font-bold text-lg mb-4 pb-2 border-b" style={{color: '#1e3a8a'}}>Cadre Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Hash className="mt-1 text-blue-600" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Cadre ID</p>
                  <p className="font-bold text-lg text-blue-700">{cadre.cadreId || '-'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="mt-1" style={{color: '#1e3a8a'}} size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Company Code</p>
                  <p className="font-semibold" style={{color: '#1e3a8a'}}>{cadre.companyCode || '-'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Award className="mt-1" style={{color: '#1e3a8a'}} size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Cadre Role</p>
                  <p className="font-semibold" style={{color: '#1e3a8a'}}>{getRoleLabel(cadre.cadreRole)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="mt-1 text-green-600" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Commission Percentage</p>
                  <p className="font-bold text-lg text-green-600">{getCumulativePercentage(cadre.cadreRole)}%</p>
                </div>
              </div>

              {cadre.cadreDhamaka && (
                <div className="flex items-start gap-3">
                  <CreditCard className="mt-1" style={{color: '#1e3a8a'}} size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Cadre Dhamaka</p>
                    <p className="font-semibold" style={{color: '#1e3a8a'}}>₹{parseFloat(cadre.cadreDhamaka).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              )}

              {cadre.registrationDhamaka && (
                <div className="flex items-start gap-3">
                  <CreditCard className="mt-1" style={{color: '#1e3a8a'}} size={20} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Registration Dhamaka</p>
                    <p className="font-semibold" style={{color: '#1e3a8a'}}>₹{parseFloat(cadre.registrationDhamaka).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Address & Documents */}
          {(cadre.address || cadre.pinCode || cadre.aadharNo || cadre.panNo) && (
            <div>
              <h4 className="font-bold text-lg mb-4 pb-2 border-b" style={{color: '#1e3a8a'}}>Address & Documents</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cadre.address && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="mt-1" style={{color: '#1e3a8a'}} size={20} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-semibold" style={{color: '#1e3a8a'}}>{cadre.address}</p>
                    </div>
                  </div>
                )}

                {cadre.pinCode && (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1" style={{color: '#1e3a8a'}} size={20} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Pin Code</p>
                      <p className="font-semibold" style={{color: '#1e3a8a'}}>{cadre.pinCode}</p>
                    </div>
                  </div>
                )}

                {cadre.aadharNo && (
                  <div className="flex items-start gap-3">
                    <CreditCard className="mt-1" style={{color: '#1e3a8a'}} size={20} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Aadhar Number</p>
                      <p className="font-semibold" style={{color: '#1e3a8a'}}>{cadre.aadharNo}</p>
                    </div>
                  </div>
                )}

                {cadre.panNo && (
                  <div className="flex items-start gap-3">
                    <CreditCard className="mt-1" style={{color: '#1e3a8a'}} size={20} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">PAN Number</p>
                      <p className="font-semibold" style={{color: '#1e3a8a'}}>{cadre.panNo}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Linked Customers & Commission */}
          <div>
            <h4 className="font-bold text-lg mb-4 pb-2 border-b" style={{color: '#1e3a8a'}}>Linked Customers & Commission</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-start gap-3">
                <Users className="mt-1 text-blue-600" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <p className="font-bold text-2xl text-blue-700">{linkedCustomers.length}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="mt-1 text-green-600" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Total Commission</p>
                  <p className="font-bold text-2xl text-green-600">₹{formatIndianNumber(totalCommission.toFixed(2))}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Award className="mt-1 text-purple-600" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Commission Rate</p>
                  <p className="font-bold text-2xl text-purple-600">{getCumulativePercentage(cadre.cadreRole)}%</p>
                </div>
              </div>
            </div>

            {linkedCustomers.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Customer List:</p>
                <div className="max-h-60 overflow-y-auto border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-blue-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Name</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Project</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Total Amount</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Paid Amount</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Balance</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Commission</th>
                      </tr>
                    </thead>
                    <tbody>
                      {linkedCustomers.map((customer, idx) => {
                        const totalAmount = parseFloat(customer.totalAmount) || 0;
                        const paidAmount = getTotalPaid(customer._id || customer.id);
                        const balance = totalAmount - paidAmount;
                        const sellerCadreId = customer.agentCode || customer.cadreCode;
                        let commission = 0;
                        
                        if (sellerCadreId === cadre.cadreId) {
                          commission = paidAmount * getCumulativePercentage(cadre.cadreRole) / 100;
                        }
                        
                        return (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="px-3 py-2 text-sm">{customer.name}</td>
                            <td className="px-3 py-2 text-sm">{customer.projectName || '-'}</td>
                            <td className="px-3 py-2 text-sm text-right">₹{formatIndianNumber(totalAmount)}</td>
                            <td className="px-3 py-2 text-sm text-right font-semibold text-green-600">₹{formatIndianNumber(paidAmount)}</td>
                            <td className="px-3 py-2 text-sm text-right font-semibold text-red-600">₹{formatIndianNumber(balance)}</td>
                            <td className="px-3 py-2 text-sm text-right font-semibold text-green-600">₹{formatIndianNumber(commission.toFixed(2))}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {linkedCustomers.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Users className="mx-auto mb-2 text-gray-400" size={48} />
                <p className="text-gray-500">No customers linked to this cadre yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadreDetails;
