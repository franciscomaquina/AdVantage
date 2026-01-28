import React from 'react';
import { GeneratedAd, AdPlatform } from '../types';
import { Heart, MessageCircle, Share2, MoreHorizontal, ThumbsUp, MessageSquare, Repeat } from 'lucide-react';

interface AdPreviewProps {
  ad: GeneratedAd;
}

const AdPreview: React.FC<AdPreviewProps> = ({ ad }) => {
  // Helper to render platform specific wrapper
  const renderPlatformShell = () => {
    switch (ad.platform) {
      case AdPlatform.INSTAGRAM:
        return (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm max-w-sm mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 to-purple-600 rounded-full p-[2px]">
                  <div className="w-full h-full bg-white rounded-full border-2 border-transparent overflow-hidden">
                    <img src="https://picsum.photos/100/100" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">YourBusiness</p>
                  <p className="text-xs text-slate-500">Sponsored</p>
                </div>
              </div>
              <MoreHorizontal size={20} className="text-slate-400" />
            </div>

            {/* Content Image */}
            <div className="aspect-square bg-slate-100 relative">
               {ad.imageUrl ? (
                  <img src={ad.imageUrl} alt={ad.visualPrompt} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
               )}
               {/* CTA Overlay simulating platform behavior */}
               <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-3 flex justify-between items-center">
                 <span className="text-white text-sm font-medium">{ad.cta}</span>
                 <span className="text-white/80 text-xs">Learn More &gt;</span>
               </div>
            </div>

            {/* Actions */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <Heart size={24} className="text-slate-800" />
                  <MessageCircle size={24} className="text-slate-800" />
                  <Share2 size={24} className="text-slate-800" />
                </div>
              </div>
              <p className="text-sm text-slate-900 mb-1 font-semibold">{ad.headline}</p>
              <p className="text-sm text-slate-800">
                <span className="font-semibold mr-2">YourBusiness</span>
                {ad.body}
              </p>
            </div>
          </div>
        );

      case AdPlatform.LINKEDIN:
        return (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm max-w-md mx-auto">
            <div className="p-3 flex gap-3">
              <img src="https://picsum.photos/100/100" className="w-10 h-10 rounded-sm" alt="Logo" />
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-sm text-slate-900">Your Business Name</span>
                  <span className="text-xs text-slate-500">• Promoted</span>
                </div>
                <p className="text-xs text-slate-500">12,453 followers</p>
              </div>
            </div>
            
            <div className="px-3 pb-2">
              <p className="text-sm text-slate-800 mb-2">{ad.body}</p>
              <p className="text-sm font-semibold text-slate-900">{ad.headline}</p>
            </div>

            <div className="w-full aspect-video bg-slate-100">
                {ad.imageUrl && <img src={ad.imageUrl} alt="Ad Visual" className="w-full h-full object-cover" />}
            </div>
            
            <div className="bg-slate-50 px-3 py-2 flex items-center justify-between border-t border-slate-100">
               <span className="text-xs font-semibold text-slate-500 uppercase">Sign Up</span>
               <button className="px-4 py-1 rounded-full border border-brand-600 text-brand-600 text-sm font-semibold hover:bg-brand-50">
                 {ad.cta}
               </button>
            </div>

             <div className="px-3 py-2 flex items-center justify-between border-t border-slate-100 text-slate-500">
                <div className="flex items-center gap-1 text-xs font-medium"><ThumbsUp size={16} /> Like</div>
                <div className="flex items-center gap-1 text-xs font-medium"><MessageSquare size={16} /> Comment</div>
                <div className="flex items-center gap-1 text-xs font-medium"><Repeat size={16} /> Repost</div>
                <div className="flex items-center gap-1 text-xs font-medium"><Share2 size={16} /> Send</div>
            </div>
          </div>
        );

      default: // Generic/Twitter style
         return (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm max-w-md mx-auto p-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                 <img src="https://picsum.photos/100/100" alt="Avatar" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-1">
                  <span className="font-bold text-slate-900">Your Brand</span>
                  <span className="text-slate-500 text-sm">@brandname</span>
                  <span className="text-slate-400 text-sm">· Ad</span>
                </div>
                <p className="text-slate-900 mb-3 text-[15px]">{ad.body}</p>
                {ad.imageUrl && (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 mb-2 aspect-video">
                     <img src={ad.imageUrl} alt="Ad asset" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                   <span className="text-xs text-slate-500">yourbrand.com</span>
                   <button className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-full font-bold hover:bg-slate-800">
                     {ad.cta}
                   </button>
                </div>
              </div>
            </div>
          </div>
         )
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-4 text-center">
        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
          Preview: {ad.platform}
        </span>
      </div>
      {renderPlatformShell()}
    </div>
  );
};

export default AdPreview;
