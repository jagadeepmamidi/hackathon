import React from 'react';
import { BarChart, Users, DollarSign, ShoppingCart, Plus, Download, Upload } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryBox icon={<BarChart />} title="Total Sales" value="0" />
        <SummaryBox icon={<Users />} title="Total Users" value="1" />
        <SummaryBox icon={<DollarSign />} title="Revenue" value="$2" />
        <SummaryBox icon={<ShoppingCart />} title="Orders" value="3" />
      </div>
      
      <div className="flex flex-wrap gap-4">
        <ActionButton icon={<Plus />}>Add New Item</ActionButton>
        <ActionButton icon={<Download />}>Download Report</ActionButton>
        <ActionButton icon={<Upload />}>Upload Data</ActionButton>
      </div>
    </div>
  );
};

const SummaryBox = ({ icon, title, value }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <div className="text-blue-500">{icon}</div>
        <span className="text-sm font-medium text-gray-500">{title}</span>
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  );
};

const ActionButton = ({ icon, children }) => {
  return (
    <button className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
      {icon}
      <span className="ml-2">{children}</span>
    </button>
  );
};

export default Dashboard;