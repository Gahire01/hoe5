import React, { useState, useRef } from 'react';
import { X, Upload, AlertCircle, Loader2, CheckCircle, ImagePlus, User, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabase';
import { uploadFileToSupabase, validateImageFile } from '../storageService';
import { CONTACT_INFO } from '../constants';
import { useAuth } from '../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const MAX_IMAGES = 5;
const WHATSAPP_NUMBER = CONTACT_INFO.whatsapp;

const TopUpModal: React.FC<Props> = ({ isOpen, onClose, user }) => {
  const { user: authUser, openAuthModal } = useAuth();
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [phoneModel, setPhoneModel] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const allowed = MAX_IMAGES - images.length;
    const newFiles = Array.from(files).slice(0, allowed);
    const valid: File[] = [];
    const validPreviews: string[] = [];
    for (const f of newFiles) {
      try {
        validateImageFile(f);
        valid.push(f);
        validPreviews.push(URL.createObjectURL(f));
      } catch (e: any) {
        setErrorMsg(e.message);
      }
    }
    if (valid.length) {
      setImages(prev => [...prev, ...valid]);
      setPreviews(prev => [...prev, ...validPreviews]);
      setErrorMsg('');
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]);
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!authUser) {
      openAuthModal?.();
      return;
    }
    const normalizedPhone = phone.replace(/\s+/g, '');
    if (!normalizedPhone) {
      setErrorMsg('Please enter your phone number.');
      return;
    }
    if (!/^\+?\d{9,15}$/.test(normalizedPhone)) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }
    if (!phoneModel.trim()) {
      setErrorMsg('Please enter the model of the phone you want to trade in.');
      return;
    }
    if (images.length === 0) {
      setErrorMsg('Please upload at least one photo of your device.');
      return;
    }

    setErrorMsg('');
    setStatus('uploading');
    setProgress(0);

    try {
      const imageUrls: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const url = await uploadFileToSupabase(
          images[i],
          'tradein-proofs',
          (pct) => {
            const overall = Math.round(((i + pct / 100) / images.length) * 100);
            setProgress(overall);
          }
        );
        imageUrls.push(url);
      }

      // ─── SAVE TO SUPABASE ────────────────────────────────────────────────────────
      const { error: dbError } = await supabase
        .from('topup_requests')
        .insert([{
          user_id: authUser.id,
          user_name: authUser.name,
          phone: normalizedPhone,
          amount: 0, // Not applicable for trade-ins, or we can use it for estimated value
          images: imageUrls,
          message: `Trade-in request for model: ${phoneModel.trim()}`,
          status: 'pending'
        }]);

      if (dbError) throw dbError;

      setProgress(100);

      const imageLines = imageUrls
        .map((url, i) => `📸 Image ${i + 1}: ${url}`)
        .join('\n');

      const waText = [
        '🔔 *NEW TRADE‑IN REQUEST*',
        '',
        `🧾 Sent by customer from website: YES`,
        `👤 Name: ${authUser.name ?? 'Guest'}`,
        `📞 Phone: ${normalizedPhone}`,
        `📱 Device Model: ${phoneModel.trim()}`,
        '',
        `📸 Device Photos (${imageUrls.length}):`,
        imageLines,
        '',
        '👆 Tap any link above to view the photos.',
      ].join('\n');

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;
      window.open(waUrl, '_blank');

      setStatus('success');
    } catch (e: any) {
      setStatus('error');
      setErrorMsg(e.message ?? 'Upload failed. Please try again.');
    }
  };

  const reset = () => {
    setStatus('idle');
    setProgress(0);
    setErrorMsg('');
    images.forEach((_, i) => URL.revokeObjectURL(previews[i]));
    setImages([]);
    setPreviews([]);
    setPhone(user?.phone ?? '');
    setPhoneModel('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl w-full max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={status === 'uploading'}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition disabled:opacity-30"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Trade‑In Request</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Upload photos of your device</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={status === 'uploading'}
            className="p-3 -mr-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition disabled:opacity-30"
          >
            <X size={24} />
          </button>
        </div>

        {status === 'success' ? (
          <div className="p-8 sm:p-10 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Request Sent! 🎉</h3>
            <p className="text-slate-500 mb-6 text-sm">
              WhatsApp opened with your request and direct links to your photos.
              The admin will review and contact you shortly.
            </p>
            <button
              onClick={() => { reset(); onClose(); }}
              className="w-full sm:w-auto bg-cyan-400 text-slate-900 font-black px-12 py-4 rounded-2xl hover:bg-cyan-300 transition shadow-lg shadow-cyan-200"
            >
              DONE
            </button>
          </div>
        ) : (
          <div className="p-6 pb-10 space-y-6">
            {errorMsg && (
              <div className="flex items-start gap-3 bg-red-50 text-red-600 text-xs sm:text-sm px-4 py-4 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {!authUser && (
              <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-6 text-center">
                <p className="text-sm text-amber-800 font-bold mb-4">
                  Please sign in to continue with your trade‑in request.
                </p>
                <button
                  onClick={() => openAuthModal?.()}
                  className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white py-4 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-amber-600 transition shadow-lg shadow-amber-200"
                >
                  <User size={16} /> Sign In
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Your Phone Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+250 7XX XXX XXX"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                  disabled={status === 'uploading' || !authUser}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Device Model *</label>
                <input
                  type="text"
                  value={phoneModel}
                  onChange={e => setPhoneModel(e.target.value)}
                  placeholder="e.g. iPhone 12 Pro, Samsung S21"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                  disabled={status === 'uploading' || !authUser}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Photos of Your Device *
                <span className="text-slate-400 font-normal ml-2 lowercase">({images.length}/{MAX_IMAGES})</span>
              </label>
              <div
                onClick={() => status === 'idle' && authUser && fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); if (authUser) handleFiles(e.dataTransfer.files); }}
                className={`border-2 border-dashed rounded-[2rem] p-8 text-center transition-all group
                  ${status === 'idle' && authUser ? 'cursor-pointer border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/40' : 'opacity-60 cursor-not-allowed border-slate-100'}
                  ${previews.length > 0 ? 'border-cyan-200 bg-cyan-50/20' : ''}`}
              >
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-cyan-100 group-hover:text-cyan-600 transition-colors text-slate-400">
                  <ImagePlus size={28} />
                </div>
                <p className="text-sm font-black text-slate-700">Add Photos</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">JPEG, PNG, WebP · MAX 10MB</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
                  disabled={status !== 'idle' || !authUser || images.length >= MAX_IMAGES}
                />
              </div>

              {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                  {previews.map((url, i) => (
                    <div key={i} className="relative group aspect-square">
                      <img src={url} alt={`device-${i}`} className="w-full h-full object-cover rounded-xl border border-slate-100 shadow-sm" />
                      {status === 'idle' && (
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {status === 'uploading' && (
              <div className="space-y-3 animate-in fade-in duration-500">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-cyan-500" />
                    Transmitting Data…
                  </span>
                  <span className="text-cyan-600">{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {status === 'error' && (
              <button onClick={reset} className="w-full py-3 text-xs font-black uppercase tracking-widest text-cyan-600 hover:text-cyan-700 transition-colors">
                ↺ Initialization Failed. Retry Protocol.
              </button>
            )}

            <button
              onClick={handleSubmit}
              disabled={status !== 'idle' || !authUser}
              className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs tracking-[0.2em] uppercase shadow-xl shadow-slate-200 active:scale-[0.98]"
            >
              {status === 'uploading' ? (
                <><Loader2 size={18} className="animate-spin" /> PROCESSING {progress}%</>
              ) : !authUser ? (
                <><User size={18} /> AUTHORIZATION REQUIRED</>
              ) : (
                <><Upload size={18} /> INITIATE TRADE-IN</>
              )}
            </button>

            <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
              Secure transmission layer active. <br/> WhatsApp endpoint: 250780615795
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopUpModal;
