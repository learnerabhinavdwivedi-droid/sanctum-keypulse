"use client";

import React, { Suspense, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useKeyManager } from '../../hooks/useKeyManager';
import { GoogleIntegrationFetcher } from '../../components/GoogleIntegrationFetcher';
import { famousApis } from '../../data/famousApis';
import { Search } from 'lucide-react';

export default function ApiFetcherPage() {
  const { keys, appendKey } = useKeyManager();
  const [searchQuery, setSearchQuery] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [triggerFetch, setTriggerFetch] = useState(0);

  const filteredApis = famousApis.filter(api => 
    api.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    api.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApiSelect = (endpoint: string) => {
    setExternalUrl(endpoint);
    setTriggerFetch(prev => prev + 1);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row h-full gap-8">
        
        {/* Left Column: The Universal Fetcher */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-black">Universal Fetcher</h1>
            <p className="text-lg font-bold text-black uppercase tracking-widest mt-2">Execute direct HTTP extractions securely</p>
          </div>
          
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64 w-full border-4 border-black"></div>}>
            <GoogleIntegrationFetcher 
              onIntegrationSuccess={appendKey} 
              externalUrl={externalUrl} 
              triggerFetch={triggerFetch}
              vaultKeys={keys}
            />
          </Suspense>
        </div>

        {/* Right Column: API Directory Sidebar */}
        <div className="w-full lg:w-96 flex flex-col bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 h-[600px] lg:h-auto overflow-hidden">
          
          {/* Header & Search */}
          <div className="p-4 border-b-4 border-black bg-[#FFD200]">
            <h3 className="text-xl font-black uppercase tracking-widest mb-4">API Directory</h3>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
              <input 
                type="text" 
                placeholder="Search APIs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-4 border-black rounded-none px-4 py-2 pl-10 font-bold uppercase tracking-widest focus:outline-none focus:bg-white bg-[#FAF8F5] transition-colors placeholder-gray-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
          </div>

          {/* List of APIs */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-[#FAF8F5]">
            {filteredApis.length > 0 ? filteredApis.map(api => (
              <button 
                key={api.id}
                onClick={() => handleApiSelect(api.endpoint)}
                className="w-full text-left bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:bg-[#00E5FF]/10 transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black uppercase tracking-widest text-lg group-hover:text-[#00E5FF] transition-colors">{api.name}</h4>
                    <p className="font-bold text-xs text-gray-500 uppercase tracking-widest mt-1">{api.category}</p>
                  </div>
                </div>
              </button>
            )) : (
              <div className="p-4 text-center font-black uppercase tracking-widest text-gray-500">
                No APIs found
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
