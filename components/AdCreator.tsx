import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Loader2, Sparkles, Wand2, Target, CheckCircle2, ImagePlus, RefreshCw, Palette, Trash2 } from 'lucide-react';
import { generateAdCopy, generateAdImage, refineAdImage } from '../services/geminiService';
import { GeneratedAd, AdContent } from '../types';
import AdPreview from './AdPreview';

const AdCreator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  
  // Ad State
  const [generatedAd, setGeneratedAd] = useState<GeneratedAd | null>(null);
  
  // Image Studio State
  const [imageCandidates, setImageCandidates] = useState<string[]>([]);
  const [visualPrompt, setVisualPrompt] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      // @ts-ignore
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US'; // Defaulting to EN, but could be dynamic
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
      };
      
      recognitionRef.current = recognition;
    }
  }, []);

  const handleMicClick = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedAd(null);
    setImageCandidates([]);
    setError(null);
    setCurrentStep('Analyzing intent and generating copy...');

    try {
      // Step 1: Generate Text Content
      const adContent: AdContent = await generateAdCopy(prompt);
      setVisualPrompt(adContent.visualPrompt);
      
      setCurrentStep(`Designing visual assets for ${adContent.platform}...`);
      
      // Step 2: Generate Image
      const imageUrl = await generateAdImage(adContent.visualPrompt);

      const newAd: GeneratedAd = {
        ...adContent,
        id: Math.random().toString(36).substr(2, 9),
        imageUrl,
        createdAt: new Date(),
      };

      setGeneratedAd(newAd);
      setImageCandidates([imageUrl]);
      setCurrentStep('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateNewImage = async () => {
    if (!visualPrompt) return;
    setIsImageLoading(true);
    try {
      const newImageUrl = await generateAdImage(visualPrompt);
      setImageCandidates(prev => [newImageUrl, ...prev]);
      if (generatedAd) {
        setGeneratedAd({ ...generatedAd, imageUrl: newImageUrl });
      }
    } catch (err: any) {
      setError("Failed to generate new image: " + err.message);
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleRefineImage = async () => {
    if (!visualPrompt || !generatedAd?.imageUrl) return;
    setIsImageLoading(true);
    try {
      const refinedImageUrl = await refineAdImage(generatedAd.imageUrl, visualPrompt);
      setImageCandidates(prev => [refinedImageUrl, ...prev]);
      setGeneratedAd({ ...generatedAd, imageUrl: refinedImageUrl });
    } catch (err: any) {
      setError("Failed to refine image: " + err.message);
    } finally {
      setIsImageLoading(false);
    }
  };

  const selectImage = (url: string) => {
    if (generatedAd) {
      setGeneratedAd({ ...generatedAd, imageUrl: url });
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col lg:flex-row gap-8">
      {/* Left Panel: Input & Image Studio */}
      <div className="flex-1 flex flex-col">
        {/* Main Creation Form - Hide only if we are in 'view' mode but keep accessible */}
        <div className={`bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-6 transition-all ${generatedAd ? 'order-2' : 'order-1'}`}>
          {!generatedAd ? (
            <>
               <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Campaign</h1>
                <p className="text-slate-500">
                  Describe your goal, audience, and style in one sentence. AdVantage handles the rest.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="relative">
                <div className="relative group">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Promote my new vegan bakery opening in downtown Lisbon to foodies, style is warm and rustic."
                    className="w-full h-32 p-4 pr-12 text-lg bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none transition-all placeholder:text-slate-400"
                    disabled={isGenerating}
                  />
                  <button
                    type="button"
                    onClick={handleMicClick}
                    className={`absolute right-4 bottom-4 p-2 rounded-full transition-all ${
                      isListening 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                    }`}
                  >
                    <Mic size={20} />
                  </button>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">AI Powered</span>
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-100">Multi-Platform</span>
                  </div>
                  <button
                    type="submit"
                    disabled={!prompt.trim() || isGenerating}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                      !prompt.trim() || isGenerating
                        ? 'bg-slate-300 cursor-not-allowed'
                        : 'bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/30'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 size={20} />
                        Generate Ad
                      </>
                    )}
                  </button>
                </div>
              </form>

              {isGenerating && (
                <div className="mt-8 p-4 bg-brand-50 rounded-lg border border-brand-100 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                    <Loader2 size={20} className="text-brand-600 animate-spin" />
                    <span className="text-brand-700 font-medium">{currentStep}</span>
                </div>
              )}
            </>
          ) : (
            // IMAGE STUDIO
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                   <Palette size={20} className="text-brand-600" />
                   AI Image Studio
                 </h2>
                 <button onClick={() => setGeneratedAd(null)} className="text-sm text-slate-500 hover:text-slate-800">
                   Start Over
                 </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                 <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Visual Description Prompt</label>
                 <textarea 
                    value={visualPrompt}
                    onChange={(e) => setVisualPrompt(e.target.value)}
                    className="w-full h-24 p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                    placeholder="Describe the image you want..."
                 />
                 <div className="flex gap-2 mt-3">
                   <button 
                    onClick={handleGenerateNewImage}
                    disabled={isImageLoading}
                    className="flex-1 bg-slate-900 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                   >
                     {isImageLoading ? <Loader2 size={16} className="animate-spin"/> : <ImagePlus size={16} />}
                     Generate New
                   </button>
                   <button 
                    onClick={handleRefineImage}
                    disabled={isImageLoading}
                    className="flex-1 bg-white border border-slate-300 text-slate-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                   >
                     {isImageLoading ? <Loader2 size={16} className="animate-spin"/> : <RefreshCw size={16} />}
                     Refine Selected
                   </button>
                 </div>
              </div>

              {imageCandidates.length > 0 && (
                <div>
                   <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Generated Candidates</label>
                   <div className="flex gap-3 overflow-x-auto pb-4">
                      {imageCandidates.map((img, idx) => (
                        <button 
                          key={idx}
                          onClick={() => selectImage(img)}
                          className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                            generatedAd.imageUrl === img ? 'border-brand-600 ring-2 ring-brand-100' : 'border-slate-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt={`Candidate ${idx}`} className="w-full h-full object-cover" />
                          {generatedAd.imageUrl === img && (
                            <div className="absolute inset-0 bg-brand-600/10 flex items-center justify-center">
                               <CheckCircle2 size={24} className="text-white drop-shadow-md bg-brand-600 rounded-full" />
                            </div>
                          )}
                        </button>
                      ))}
                   </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-100 text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Features / Tips (Only show if no ad yet) */}
        {!generatedAd && !isGenerating && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 order-3">
            <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
               <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-3">
                 <Target size={20} />
               </div>
               <h3 className="font-semibold text-slate-900 mb-1">Smart Targeting</h3>
               <p className="text-sm text-slate-500">AI identifies your ideal audience automatically.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
               <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 mb-3">
                 <Sparkles size={20} />
               </div>
               <h3 className="font-semibold text-slate-900 mb-1">Visual Generation</h3>
               <p className="text-sm text-slate-500">Unique visuals created for your brand identity.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
               <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-3">
                 <CheckCircle2 size={20} />
               </div>
               <h3 className="font-semibold text-slate-900 mb-1">Platform Ready</h3>
               <p className="text-sm text-slate-500">Formatted specifically for social algorithms.</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel: Preview */}
      <div className="w-full lg:w-[400px] order-1 lg:order-2">
        {generatedAd ? (
          <div className="sticky top-8 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Preview</h2>
            <AdPreview ad={generatedAd} />
            
            <div className="mt-6 space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">Target Audience</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{generatedAd.targetAudience}</p>
              </div>
              
              <button className="w-full py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30">
                <Send size={18} />
                Publish Campaign
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[400px] bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center sticky top-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <Wand2 size={32} className="text-slate-300" />
            </div>
            <p className="font-medium">Your ad preview will appear here</p>
            <p className="text-sm mt-2">Enter a command to see the magic happen.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdCreator;