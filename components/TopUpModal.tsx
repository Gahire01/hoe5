import React, { useState, useRef } from 'react';
import { X, Camera, Send, Upload } from 'lucide-react';
import { User } from '../types';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { CONTACT_INFO } from '../constants';
import { uploadMultipleToImgBB, validateImageFile } from '../services/imgbbService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const TopUpModal: React.FC<Props> = ({ isOpen, onClose, user }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [model, setModel] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadError('');

    try {
      files.forEach(file => validateImageFile(file));
      setImages(prev => [...prev, ...files]);
    } catch (error: any) {
      setUploadError(error.message);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('Please sign in to request a top-up');
      return;
    }

    if (!phone || !model) {
      alert('Please fill in all required fields');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      // Upload images to ImgBB
      let imageUrls: string[] = [];
      if (images.length > 0) {
        imageUrls = await uploadMultipleToImgBB(images);
      }

      // Save to Firestore
      const request = {
        userId: user.uid,
        userName: user.name,
        phone,
        model,
        images: imageUrls,
        message,
        status: 'pending',
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'topupRequests'), request);

      // Send WhatsApp message to admin
      const text = `*TOP-UP REQUEST*\n\n*Name:* ${user.name}\n*Phone:* ${phone}\n*Model:* ${model}\n*Message:* ${message}\n\n*Images:*\n${imageUrls.join('\n')}`;
      const whatsappUrl = `https://wa.me/${CONTACT_INFO.phone.replace(/\s+/g, '').replace('+', '')}?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');

      onClose();
      alert('Request sent successfully!');
    } catch (err: any) {
      setUploadError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200">
          <X size={20} />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Request Top-Up</h2>
          <p className="text-sm text-slate-500 mb-6">Tell us about your device, and we'll get back to you on WhatsApp.</p>

          {step === 1 && (
            <div className="space-y-4">
              <input
                type="tel"
                placeholder="Your phone number *"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
              <input
                type="text"
                placeholder="Phone model (e.g., iPhone 12) *"
                value={model}
                onChange={e => setModel(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
              <textarea
                placeholder="Additional details (optional)"
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={3}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                onClick={() => setStep(2)}
                className="w-full bg-cyan-500 text-white py-4 rounded-xl font-black hover:bg-cyan-600 transition"
              >
                Next: Add Photos
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-cyan-500 transition"
              >
                <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-500">Click to upload photos of your device</p>
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

              {uploadError && (
                <p className="text-red-500 text-xs">{uploadError}</p>
              )}

              {images.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-black text-slate-700">Selected images ({images.length})</p>
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

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200"
                  disabled={uploading}
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={uploading || !phone || !model}
                  className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-black hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Send Request
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopUpModal;
