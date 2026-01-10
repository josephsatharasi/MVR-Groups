import React from 'react';
import { Trash2, RotateCcw } from 'lucide-react';
import Table from '../components/Table';
import Card from '../components/Card';
import { toast } from 'react-toastify';

const RecycleBin = () => {
  const deletedItems = [
    { id: 1, name: 'Old Apartment', type: 'Property', deletedDate: '2024-01-15', deletedBy: 'Admin' },
    { id: 2, name: 'John Doe', type: 'Client', deletedDate: '2024-01-10', deletedBy: 'Admin' },
    { id: 3, name: 'Downtown Office', type: 'Property', deletedDate: '2024-01-05', deletedBy: 'Manager' },
  ];

  const handleRestore = (row) => {
    toast.success(`${row.name} restored successfully!`);
  };

  const handlePermanentDelete = (row) => {
    toast.error(`${row.name} permanently deleted!`);
  };

  const columns = [
    { header: 'Name', field: 'name' },
    { header: 'Type', field: 'type' },
    { header: 'Deleted Date', field: 'deletedDate' },
    { header: 'Deleted By', field: 'deletedBy' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: '#5F9EA0' }}>
      <div className="flex items-center gap-3 mb-6">
        <Trash2 className="text-white" size={32} />
        <h1 className="text-2xl md:text-3xl font-bold text-white">Recycle Bin</h1>
      </div>

      <Card>
        <Table 
          columns={columns} 
          data={deletedItems}
          onView={(row) => (
            <button
              onClick={() => handleRestore(row)}
              className="px-3 py-1 rounded text-white text-xs flex items-center gap-1"
              style={{ backgroundColor: '#2C7A7B' }}
            >
              <RotateCcw size={12} /> Restore
            </button>
          )}
          onDelete={handlePermanentDelete}
        />
      </Card>
    </div>
  );
};

export default RecycleBin;
