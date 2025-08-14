import React from 'react';
import BusinessStats from '../components/BusinessStats';

export default function Stats() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Business Statistics</h1>
      </div>
      
      <BusinessStats />
    </div>
  );
}