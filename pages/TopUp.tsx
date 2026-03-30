import React, { useState, useRef } from 'react';
import {
  Smartphone, RefreshCw, Award, Upload, X,
  CheckCircle, AlertCircle, Loader2, ImagePlus
} from 'lucide-react';
import { User } from '../types';
import { CONTACT_INFO } from '../constants';
import { uploadFileToSupabase, validateImageFile } from '../storageService';

interface Props {
  user: User | null;
}

const WHATSAPP_NUMBER = CONTACT_INFO.whatsapp;
const MAX_IMAGES = 5;

// ─── Page ─────────────────────────────────────────────────────────────────────
const TopUp: React.FC<Props> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="inline-block bg-cyan-100 text-cyan-700 text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full mb-4">
            Services
          </span>
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">
            Phone Top-Up &amp; Upgrade
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl">
            Trade in your old device and get credit toward a new one. Battery replacements, screen repairs, and more.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: RefreshCw, title: 'Trade-In', desc: 'Get up to 50% off a new phone when you trade in your old one.', badge: 'Most Popular' },
            { icon: Smartphone, title: 'Battery Replacement', desc: "Extend your phone's life with a genuine battery, installed in under an hour.", badge: null },
            { icon: Award, title: 'Screen Repair', desc: 'Cracked screen? Genuine parts with a 3-month warranty on all repairs.', badge: null },
          ].map(({ icon: Icon, title, desc, badge }) => (
            <div key={title} className="relative bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              {badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-400 text-slate-900 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full">
                  {badge}
                </span>
              )}
              <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-cyan-100 transition">
                <Icon size={32} className="text-cyan-500" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-3 bg-cyan-400 text-slate-900 px-12 py-5 rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-cyan-300 transition-all shadow-xl shadow-cyan-200 hover:scale-105 active:scale-100"
          >
            <Upload size={18} />
            Request Top-Up Now
          </button>
          <p className="text-slate-400 text-sm mt-4">
            Upload your payment proof — admin will confirm via WhatsApp
          </p>
        </div>
      </div>

      {isOpen && <TopUpModal onClose={() => setIsOpen(false)} user={user} />}
    </div>
  );
};

// ─── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  user: User | null;
  onClose: () => void;
}

type Status = 'idle' | 'uploading' | 'success' | 'error';

const TopUpModal: React.FC<ModalProps> = ({ user, onClose }) => {
  const [phone, setPhone]     = useState(user?.phone ?? '');
  const [amount, setAmount]   = useState('');
  const [message, setMessage] = useState('');
  const [previews, setPreviews] = useState<{ file: File; localUrl: string }[]>([]);
  const [status, setStatus]   = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // ── File selection ──
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const allowed = MAX_IMAGES - previews.length;
    const arr = Array.from(files).slice(0, allowed);
    const valid: { file: File; localUrl: string }[] = [];
    for (const f of arr) {
      try { validateImageFile(f); }
      catch (e: any) { setErrorMsg(e.message); continue; }
      valid.push({ file: f, localUrl: URL.createObjectURL(f) });
    }
    setErrorMsg('');
    setPreviews(prev => [...prev, ...valid]);
  };

  const removeImage = (i: number) => {
    setPreviews(prev => {
      URL.revokeObjectURL(prev[i].localUrl);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  // ── Submit ──
  // Flow: upload images → get public URLs → build WhatsApp message with real links
  // Admin opens the links in WhatsApp and sees the actual images
  const handleSubmit = async () => {
    if (!phone.trim()) { setErrorMsg('Please enter your phone number.'); return; }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) { setErrorMsg('Please enter a valid amount.'); return; }
    if (previews.length === 0) { setErrorMsg('Please attach at least one payment proof image.'); return; }

    setErrorMsg('');
    setStatus('uploading');
    setProgress(0);

    try {
      // Upload each image one at a time to avoid auth lock conflicts
      const imageUrls: string[] = [];
      for (let i = 0; i < previews.length; i++) {
        const url = await uploadFileToSupabase(
          previews[i].file,
          'topup-proofs',
          (pct) => {
            // Overall progress = done images + current image progress
            const overall = Math.round(((i + pct / 100) / previews.length) * 100);
            setProgress(overall);
          }
        );
        imageUrls.push(url);
      }

      setProgress(100);

      // Build WhatsApp message with real clickable image URLs
      // Admin taps any link → image opens in browser instantly
      const imageLines = imageUrls
        .map((url, i) => `📸 Image ${i + 1}: ${url}`)
        .join('\n');

      const waText = [
        '🔔 *NEW TOP-UP REQUEST*',
        '',
        `👤 Name: ${user?.name ?? 'Guest'}`,
        `📞 Phone: ${phone.trim()}`,
        `💰 Amount: ${Number(amount).toLocaleString()} Rwf`,
        message.trim() ? `💬 Note: ${message.trim()}` : null,
        '',
        `📸 Payment Proof (${imageUrls.length} image${imageUrls.length > 1 ? 's' : ''}):`,
        imageLines,
        '',
        '👆 Tap any link above to view the payment screenshot.',
      ].filter(l => l !== null).join('\n');

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
    previews.forEach(p => URL.revokeObjectURL(p.localUrl));
    setPreviews([]);
    setAmount('');
    setMessage('');
    setPhone(user?.phone ?? '');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Top-Up Request</h2>
            <p className="text-slate-400 text-sm mt-0.5">Images uploaded securely, links sent to admin</p>
          </div>
          <button
            onClick={onClose}
            disabled={status === 'uploading'}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <X size={20} />
          </button>
        </div>

        {/* SUCCESS */}
        {status === 'success' ? (
          <div className="p-10 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Request Sent! 🎉</h3>
            <p className="text-slate-500 mb-2">
              WhatsApp opened with your request and <strong>direct image links</strong>. The admin can tap to view your screenshots instantly.
            </p>
            <p className="text-slate-400 text-sm mb-6">Confirmation usually within a few minutes.</p>
            <button
              onClick={() => { reset(); onClose(); }}
              className="bg-cyan-400 text-slate-900 font-black px-8 py-3 rounded-xl hover:bg-cyan-300 transition"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-5">

            {/* Error */}
            {errorMsg && (
              <div className="flex items-start gap-2 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Your Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+250 7XX XXX XXX"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                disabled={status === 'uploading'}
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Amount (Rwf) *</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                disabled={status === 'uploading'}
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Note (optional)</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Any extra info for the admin..."
                rows={2}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                disabled={status === 'uploading'}
              />
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Payment Screenshots *
                <span className="text-slate-400 font-normal ml-1">(up to {MAX_IMAGES})</span>
              </label>

              <div
                onClick={() => status === 'idle' && fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all group
                  ${status === 'idle' ? 'cursor-pointer hover:border-cyan-400 hover:bg-cyan-50/40' : 'opacity-60 cursor-not-allowed'}
                  ${previews.length > 0 ? 'border-cyan-200 bg-cyan-50/20' : 'border-slate-200'}`}
              >
                <ImagePlus size={24} className="mx-auto text-slate-300 group-hover:text-cyan-400 mb-2 transition-colors" />
                <p className="text-sm font-semibold text-slate-500">Click or drag screenshots here</p>
                <p className="text-xs text-slate-400 mt-1">JPEG · PNG · WebP — max 10 MB each</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
                  disabled={status !== 'idle' || previews.length >= MAX_IMAGES}
                />
              </div>

              {/* Previews */}
              {previews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {previews.map((p, i) => (
                    <div key={i} className="relative group aspect-square">
                      <img src={p.localUrl} alt={`proof-${i}`} className="w-full h-full object-cover rounded-xl border border-slate-100" />
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

            {/* Upload progress */}
            {status === 'uploading' && (
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Loader2 size={12} className="animate-spin" />
                    Uploading images…
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

            {/* Error retry */}
            {status === 'error' && (
              <button onClick={reset} className="text-sm text-cyan-600 font-semibold underline underline-offset-2">
                ↺ Try again
              </button>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={status !== 'idle'}
              className="w-full flex items-center justify-center gap-2 bg-cyan-400 text-slate-900 font-black py-4 rounded-xl hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm tracking-widest uppercase shadow-lg shadow-cyan-200"
            >
              {status === 'uploading' ? (
                <><Loader2 size={16} className="animate-spin" />Uploading {progress}%…</>
              ) : (
                <><Upload size={16} />Upload &amp; Send via WhatsApp</>
              )}
            </button>

            <p className="text-center text-xs text-slate-400">
              Images are uploaded securely. Admin receives direct links to view them in WhatsApp.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopUp;
