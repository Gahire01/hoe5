import React, { useState, useRef } from 'react';
import { X, Upload, Send, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabase';
import { uploadMultipleToSupabase, validateImageFile } from '../storageService';
import { CONTACT_INFO } from '../constants';
import { useAuth } from '../hooks/useAuth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TopUpModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setError(null);
    try {
      // Validate each file
      files.forEach(file => validateImageFile(file));

      // Check for duplicates (by name and size)
      const newFiles = files.filter(file =>
        !images.some(img => img.name === file.name && img.size === file.size)
      );
      if (newFiles.length < files.length) {
        setError('Some images are duplicates and were ignored.');
      }

      // Enforce min 4 and max 6 images
      if (images.length + newFiles.length < 4) {
        setError('Please upload at least 4 proof images.');
        return;
      }
      if (images.length + newFiles.length > 6) {
        setError('Maximum 6 images allowed.');
        return;
      }

      setImages(prev => [...prev, ...newFiles]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (images.length - 1 < 4 && !error?.includes('at least')) {
      setError('Please upload at least 4 proof images.');
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('Please sign in to request a top-up.');
      return;
    }
    if (!amount || !phone) {
      setError('Amount and phone number are required.');
      return;
    }
    if (images.length < 4) {
      setError('Please upload at least 4 proof images.');
      return;
    }
    if (images.length > 6) {
      setError('Maximum 6 images allowed.');
      return;
    }
    if (submittingRef.current) return; // Prevent double submission
    submittingRef.current = true;

    setUploading(true);
    setError(null);

    try {
      // Upload images to Supabase Storage (concurrency limited inside the service)
      const imageUrls = await uploadMultipleToSupabase(images, 'topup');

      // Save to topup_requests table
      const requestData = {
        user_id: user.id,
        user_name: user.name,
        phone,
        amount: parseFloat(amount),
        images: imageUrls,
        message,
        status: 'pending',
        created_at: new Date(),
      };

      const { error: dbError } = await supabase
        .from('topup_requests')
        .insert([requestData]);
      if (dbError) throw dbError;

      // Send WhatsApp message to admin
      const waMessage = encodeURIComponent(
        `*TOP-UP REQUEST*\n\n` +
        `*Name:* ${requestData.user_name}\n` +
        `*Phone:* ${phone}\n` +
        `*Amount:* ${amount} RWF\n` +
        `*Message:* ${message}\n\n` +
        `*Proof Images:*\n${imageUrls.join('\n')}`
      );
      window.open(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${waMessage}`, '_blank');

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setAmount('');
        setPhone('');
        setMessage('');
        setImages([]);
        submittingRef.current = false;
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
      submittingRef.current = false;
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200">
          <X size={20} />
        </button>

        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black mb-2">Request Sent!</h2>
              <p className="text-slate-500">We'll contact you shortly via WhatsApp.</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Request Top-Up</h2>
              <p className="text-sm text-slate-500 mb-6">Upload 4‑6 proof images. We'll confirm via WhatsApp.</p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-xs">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="Amount (RWF) *"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Your phone number *"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <textarea
                  placeholder="Additional details (optional)"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={2}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-cyan-500 transition"
                >
                  <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500">Click to upload proof images (4‑6 images)</p>
                  <p className="text-xs text-slate-400 mt-1">JPEG, PNG, GIF up to 32MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {images.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-black text-slate-700">Selected images ({images.length}/6)</p>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2">
                      {images.map((img, i) => (
                        <div key={i} className="relative group">
                          <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
                            <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-full object-cover" />
                          </div>
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={uploading || images.length < 4 || images.length > 6}
                  className="w-full bg-cyan-500 text-white py-4 rounded-xl font-black hover:bg-cyan-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Submit Request
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopUpModal;
