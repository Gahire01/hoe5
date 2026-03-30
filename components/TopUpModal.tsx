import React, { useState, useRef } from 'react';
import { X, Upload, AlertCircle, Loader2, CheckCircle, ImagePlus, User } from 'lucide-react';
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
    if (!phone.trim()) {
      setErrorMsg('Please enter your phone number.');
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

      setProgress(100);

      const imageLines = imageUrls
        .map((url, i) => `📸 Image ${i + 1}: ${url}`)
        .join('\n');

      const waText = [
        '🔔 *NEW TRADE‑IN REQUEST*',
        '',
        `👤 Name: ${authUser.name ?? 'Guest'}`,
        `📞 Phone: ${phone.trim()}`,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Trade‑In Request</h2>
            <p className="text-slate-400 text-sm mt-0.5">Upload photos of your device</p>
          </div>
          <button
            onClick={onClose}
            disabled={status === 'uploading'}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition disabled:opacity-30"
          >
            <X size={20} />
          </button>
        </div>

        {status === 'success' ? (
          <div className="p-10 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Request Sent! 🎉</h3>
            <p className="text-slate-500 mb-2">
              WhatsApp opened with your request and direct links to your photos.
              The admin will review and contact you shortly.
            </p>
            <button
              onClick={() => { reset(); onClose(); }}
              className="mt-6 bg-cyan-400 text-slate-900 font-black px-8 py-3 rounded-xl hover:bg-cyan-300 transition"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {errorMsg && (
              <div className="flex items-start gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {!authUser && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-sm text-amber-800 font-medium mb-3">
                  Please sign in to continue with your trade‑in request.
                </p>
                <button
                  onClick={() => openAuthModal?.()}
                  className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-amber-600 transition"
                >
                  <User size={16} /> Sign In
                </button>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Your Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+250 7XX XXX XXX"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                disabled={status === 'uploading' || !authUser}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Device Model *</label>
              <input
                type="text"
                value={phoneModel}
                onChange={e => setPhoneModel(e.target.value)}
                placeholder="e.g. iPhone 12 Pro, Samsung S21"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                disabled={status === 'uploading' || !authUser}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Photos of Your Device *
                <span className="text-slate-400 font-normal ml-1">(up to {MAX_IMAGES})</span>
              </label>
              <div
                onClick={() => status === 'idle' && authUser && fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); if (authUser) handleFiles(e.dataTransfer.files); }}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all group
                  ${status === 'idle' && authUser ? 'cursor-pointer hover:border-cyan-400 hover:bg-cyan-50/40' : 'opacity-60 cursor-not-allowed'}
                  ${previews.length > 0 ? 'border-cyan-200 bg-cyan-50/20' : 'border-slate-200'}`}
              >
                <ImagePlus size={24} className="mx-auto text-slate-300 group-hover:text-cyan-400 mb-2 transition-colors" />
                <p className="text-sm font-semibold text-slate-500">Click or drag photos here</p>
                <p className="text-xs text-slate-400 mt-1">JPEG, PNG, WebP — max 10 MB each</p>
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
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {previews.map((url, i) => (
                    <div key={i} className="relative group aspect-square">
                      <img src={url} alt={`device-${i}`} className="w-full h-full object-cover rounded-xl border border-slate-100" />
                      {status === 'idle' && (
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
                        >
                          <X size={10} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {status === 'uploading' && (
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Loader2 size={12} className="animate-spin" />
                    Uploading photos…
                  </span>
                  <span className="font-bold">{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 bg-cyan-400 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {status === 'error' && (
              <button onClick={reset} className="text-sm text-cyan-600 font-semibold underline underline-offset-2">
                ↺ Try again
              </button>
            )}

            <button
              onClick={handleSubmit}
              disabled={status !== 'idle' || !authUser}
              className="w-full flex items-center justify-center gap-2 bg-cyan-400 text-slate-900 font-black py-4 rounded-xl hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm tracking-widest uppercase shadow-lg shadow-cyan-200"
            >
              {status === 'uploading' ? (
                <><Loader2 size={16} className="animate-spin" /> Uploading {progress}%…</>
              ) : !authUser ? (
                <><User size={16} /> Sign In to Continue</>
              ) : (
                <><Upload size={16} /> Send Request via WhatsApp</>
              )}
            </button>

            <p className="text-center text-xs text-slate-400">
              Your photos are uploaded securely. The admin will receive direct links to view them.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopUpModal;
