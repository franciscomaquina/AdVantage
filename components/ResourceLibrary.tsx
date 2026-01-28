import React from 'react';
import { Search, Image as ImageIcon, Film, FileText, Download } from 'lucide-react';

const ResourceLibrary: React.FC = () => {
  const resources = [
    { id: 1, type: 'image', name: 'Office Meeting', size: '2.4 MB', url: 'https://picsum.photos/400/300?random=1' },
    { id: 2, type: 'image', name: 'Product Showcase', size: '1.8 MB', url: 'https://picsum.photos/400/300?random=2' },
    { id: 3, type: 'video', name: 'Hero Background', size: '14.2 MB', url: 'https://picsum.photos/400/300?random=3' },
    { id: 4, type: 'image', name: 'Team Portrait', size: '3.1 MB', url: 'https://picsum.photos/400/300?random=4' },
    { id: 5, type: 'text', name: 'Ad Copy Templates', size: '15 KB', url: 'https://picsum.photos/400/300?random=5' },
    { id: 6, type: 'image', name: 'Abstract Texture', size: '4.5 MB', url: 'https://picsum.photos/400/300?random=6' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Resource Library</h1>
          <p className="text-slate-500">Curated assets to enhance your advertisements.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search assets..." 
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none w-full md:w-64"
          />
        </div>
      </div>

      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {['All', 'Images', 'Videos', 'Templates'].map((filter, idx) => (
          <button 
            key={filter}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              idx === 0 
                ? 'bg-slate-900 text-white' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {resources.map((res) => (
          <div key={res.id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-video bg-slate-100 relative overflow-hidden">
               {res.type !== 'text' ? (
                 <img src={res.url} alt={res.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-slate-50">
                   <FileText size={48} className="text-slate-300" />
                 </div>
               )}
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button className="bg-white p-2 rounded-full text-slate-900 hover:scale-110 transition-transform">
                   <Download size={20} />
                 </button>
               </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                {res.type === 'image' && <ImageIcon size={14} className="text-blue-500" />}
                {res.type === 'video' && <Film size={14} className="text-red-500" />}
                {res.type === 'text' && <FileText size={14} className="text-slate-500" />}
                <span className="text-xs font-medium text-slate-500 uppercase">{res.type}</span>
              </div>
              <h3 className="font-semibold text-slate-900 truncate">{res.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{res.size}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceLibrary;
