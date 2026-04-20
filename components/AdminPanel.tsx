import React, { useState, useRef, useCallback } from 'react';
import { Product, Employee } from '../types';
import {
  Plus, Package, Tag, DollarSign, Layers, Image as ImageIcon,
  Cpu, BarChart, Trash2, UserPlus, Users,
  Edit, X, Save, Upload, Loader2, CheckCircle, AlertCircle, ImagePlus,
  Sparkles, Wand2
} from 'lucide-react';
import { supabase } from '../supabase';
import { uploadFileToSupabase, validateImageFile } from '../storageService';
import { useAuth } from '../context/AuthContext';
import { getProductSuggestion } from '../services/geminiService';

interface Props {
  products: Product[];
  onAdd: (p: Omit<Product, 'id' | 'created_at'>) => Promise<any>;
  onUpdate: (id: string, updates: Partial<Product>) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  totalProducts: number;
  lowStockCount: number;
  newProductsCount: number;
  userRole: string;
  employees: Employee[];
  onAddEmployee: (emp: Omit<Employee, 'id' | 'created_at'>) => Promise<any>;
  onUpdateEmployee: (id: string, updates: Partial<Employee>) => Promise<any>;
  onDeleteEmployee: (id: string) => Promise<any>;
  employeesLoading: boolean;
}

// ─── Reusable Image Uploader ──────────────────────────────────────────────────
interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  disabled?: boolean;
}

type UploadStatus = 'idle' | 'compressing' | 'uploading' | 'done' | 'error';

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange, folder, disabled }) => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    // Validate
    try { validateImageFile(file); }
    catch (e: any) { setUploadError(e.message); setUploadStatus('error'); return; }

    // Show local preview instantly
    const preview = URL.createObjectURL(file);
    setLocalPreview(preview);
    setUploadError('');
    setUploadStatus('compressing');
    setProgress(5);

    try {
      const url = await uploadFileToSupabase(file, folder, (pct) => {
        setProgress(pct);
        if (pct > 20) setUploadStatus('uploading');
      });
      setUploadStatus('done');
      setProgress(100);
      onChange(url);
      URL.revokeObjectURL(preview);
      setLocalPreview(null);
    } catch (e: any) {
      setUploadStatus('error');
      setUploadError(e.message ?? 'Upload failed. Try again.');
      setLocalPreview(null);
      URL.revokeObjectURL(preview);
    }
  }, [folder, onChange]);

  const reset = () => {
    setUploadStatus('idle');
    setProgress(0);
    setUploadError('');
    setLocalPreview(null);
  };

  const isLoading = uploadStatus === 'compressing' || uploadStatus === 'uploading';
  const displayImage = localPreview || value;

  return (
    <div className="space-y-2">
      {/* Drop zone / preview */}
      <div
        onClick={() => !isLoading && !disabled && fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); if (!isLoading && !disabled) handleFile(e.dataTransfer.files[0]); }}
        className={`relative border-2 border-dashed rounded-2xl overflow-hidden transition-all
          ${isLoading || disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:border-cyan-400 hover:bg-cyan-500/5'}
          ${uploadStatus === 'error' ? 'border-red-500/50' : uploadStatus === 'done' ? 'border-green-500/50' : 'border-slate-700'}`}
        style={{ minHeight: 120 }}
      >
        {displayImage ? (
          <img src={displayImage} alt="preview" className="w-full h-28 object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-28 gap-2">
            <ImagePlus size={24} className="text-slate-600" />
            <p className="text-xs text-slate-500 font-medium">Click or drag image</p>
            <p className="text-[10px] text-slate-600">JPEG · PNG · WebP · max 10 MB</p>
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-900/70 flex flex-col items-center justify-center gap-2">
            <Loader2 size={24} className="text-cyan-400 animate-spin" />
            <span className="text-white text-xs font-bold">
              {uploadStatus === 'compressing' ? 'Compressing…' : `Uploading ${progress}%`}
            </span>
            <div className="w-24 bg-white/20 rounded-full h-1">
              <div className="h-1 bg-cyan-400 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Done badge */}
        {uploadStatus === 'done' && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle size={14} className="text-white" />
          </div>
        )}

        {/* Clear */}
        {displayImage && !isLoading && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); reset(); onChange(''); }}
            className="absolute top-2 left-2 w-5 h-5 bg-slate-900/80 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
          >
            <X size={10} />
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => { if (e.target.files?.[0]) { handleFile(e.target.files[0]); e.target.value = ''; } }}
        disabled={isLoading || disabled}
      />

      {/* Error */}
      {uploadStatus === 'error' && uploadError && (
        <div className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
          <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
          <span>{uploadError}</span>
          <button onClick={reset} className="ml-auto underline text-[10px] font-bold whitespace-nowrap">Retry</button>
        </div>
      )}
    </div>
  );
};

// ─── AdminPanel ───────────────────────────────────────────────────────────────
const AdminPanel: React.FC<Props> = ({
  products, onAdd, onUpdate, onDelete,
  totalProducts, lowStockCount, newProductsCount, userRole,
  employees, onAddEmployee, onUpdateEmployee, onDeleteEmployee, employeesLoading
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'employees' | 'profile'>('products');
  const [globalError, setGlobalError] = useState('');
  const [globalSuccess, setGlobalSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [generatingSpecs, setGeneratingSpecs] = useState(false);

  const [productForm, setProductForm] = useState({
    name: '', price: '', originalPrice: '',
    category: 'Smartphone', image: '',
    stock: '10', isNew: false, badge: '', specs: '',
  });

  const [employeeForm, setEmployeeForm] = useState({
    name: '', email: '', phone: '', role: '',
    linkedin: '', twitter: '', instagram: '',
    tiktok: '', facebook: '', github: '', image: '',
  });

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '', email: user?.email || '',
    phone: user?.phone || '', avatar: user?.avatar || '',
    role: user?.role || '',
  });

  const badgeOptions = ['New', 'Hot', 'Limited', 'Best Seller', 'Premium', 'Sale', 'Featured'];

  const showSuccess = (msg: string) => {
    setGlobalSuccess(msg);
    setGlobalError('');
    setTimeout(() => setGlobalSuccess(''), 3500);
  };
  const showError = (msg: string) => {
    setGlobalError(msg);
    setGlobalSuccess('');
  };

  const parseSpecs = (s: string): Record<string, string> =>
    s.trim() ? Object.fromEntries(
      s.split(',').map(p => p.trim()).filter(p => p.includes(':'))
        .map(p => p.split(':').map(x => x.trim()) as [string, string])
        .filter(([k, v]) => k && v)
    ) : {};

  const stringifySpecs = (specs: Record<string, string>) =>
    Object.entries(specs).map(([k, v]) => `${k}:${v}`).join(', ');

  // ── Product CRUD ──
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!productForm.name || !productForm.price) { showError('Name and price are required.'); return; }
    if (!productForm.image) { showError('Please upload a product image or enter a URL.'); return; }

    setSubmitting(true);
    try {
      const payload = {
        name: productForm.name,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        category: productForm.category,
        image: productForm.image,
        stock: Number(productForm.stock),
        rating: 5,
        isNew: productForm.isNew,
        badge: productForm.badge || undefined,
        specs: parseSpecs(productForm.specs),
      };
      await onAdd(payload);
      showSuccess('Product added successfully!');
      setProductForm({ name: '', price: '', originalPrice: '', category: 'Smartphone', image: '', stock: '10', isNew: false, badge: '', specs: '' });
      setShowAddProduct(false);
    } catch (e: any) {
      showError('Failed to add product: ' + (e.message ?? 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || submitting) return;
    setSubmitting(true);
    try {
      await onUpdate(editingProduct.id, {
        name: editingProduct.name, price: editingProduct.price,
        originalPrice: editingProduct.originalPrice, category: editingProduct.category,
        image: editingProduct.image, stock: editingProduct.stock,
        isNew: editingProduct.isNew, badge: editingProduct.badge, specs: editingProduct.specs,
      });
      showSuccess('Product updated!');
      setEditingProduct(null);
    } catch (e: any) {
      showError('Failed to update: ' + (e.message ?? 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await onDelete(id);
      showSuccess('Product deleted!');
    } catch (e: any) { alert('Delete failed: ' + e.message); }
  };

  const handleGenerateSpecs = async () => {
    if (!productForm.name) {
      showError('Please enter a product name first.');
      return;
    }
    setGeneratingSpecs(true);
    try {
      const suggestion = await getProductSuggestion(productForm.name, {});
      // Assuming suggestion returns something like "Key:Value, Key2:Value2"
      // or at least a description we can use.
      // For now, let's just prepend it to specs or use it as a base.
      setProductForm(prev => ({
        ...prev,
        specs: prev.specs ? `${prev.specs}, AI Suggestion: ${suggestion}` : `AI Insight: ${suggestion}`
      }));
      showSuccess('AI Specifications generated!');
    } catch (error) {
      showError('AI Generation failed. Please input manually.');
    } finally {
      setGeneratingSpecs(false);
    }
  };

  // ── Employee CRUD ──
  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!employeeForm.name || !employeeForm.email || !employeeForm.role) { showError('Name, email, and role are required.'); return; }
    if (!employeeForm.image) { showError('Please upload a profile picture or enter a URL.'); return; }

    setSubmitting(true);
    try {
      const payload: Omit<Employee, 'id' | 'created_at'> = {
        name: employeeForm.name, email: employeeForm.email, phone: employeeForm.phone,
        role: employeeForm.role, image: employeeForm.image,
        social: {
          linkedin: employeeForm.linkedin, twitter: employeeForm.twitter,
          instagram: employeeForm.instagram, tiktok: employeeForm.tiktok,
          facebook: employeeForm.facebook, github: employeeForm.github,
        },
      };
      await onAddEmployee(payload);
      showSuccess('Employee added!');
      setEmployeeForm({ name: '', email: '', phone: '', role: '', linkedin: '', twitter: '', instagram: '', tiktok: '', facebook: '', github: '', image: '' });
      setShowAddEmployee(false);
    } catch (e: any) {
      showError('Failed to add employee: ' + (e.message ?? 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee || submitting) return;
    setSubmitting(true);
    try {
      await onUpdateEmployee(editingEmployee.id, {
        name: editingEmployee.name, email: editingEmployee.email,
        phone: editingEmployee.phone, role: editingEmployee.role,
        social: editingEmployee.social, image: editingEmployee.image,
      });
      showSuccess('Employee updated!');
      setEditingEmployee(null);
    } catch (e: any) {
      showError('Failed to update: ' + (e.message ?? 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Delete this employee?')) return;
    try { await onDeleteEmployee(id); }
    catch (e: any) { alert('Delete failed: ' + e.message); }
  };

  // ── Profile ──
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const { error: dbErr } = await supabase.from('users').update({
        name: profileForm.name, phone: profileForm.phone, avatar: profileForm.avatar, role: profileForm.role,
      }).eq('id', user?.id);
      if (dbErr) throw dbErr;
      await supabase.auth.updateUser({ data: { name: profileForm.name, avatar: profileForm.avatar } });
      showSuccess('Profile updated!');
    } catch (e: any) {
      showError('Failed to update profile: ' + (e.message ?? 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  // Removed strict check here since parent AdminPage already handles security
  // if (userRole !== 'admin') return null;

  // ── Shared field styles ──
  const inputCls = 'w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold transition-all placeholder-slate-600';
  const labelCls = 'text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2';
  const tabCls = (t: string) => `px-6 py-3 text-xs font-black uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === t ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-white'}`;

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-[3rem] p-4 md:p-10 border border-slate-800 shadow-2xl overflow-hidden relative group">
      {/* Abstract decorative elements */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Decorative bg icon */}
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
        <Package size={120} stroke="white" strokeWidth={1} />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg">
            <Cpu size={28} />
          </div>
          <div>
            <h2 className="text-white font-black text-2xl tracking-tighter uppercase">Command Center</h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Operational System Control</p>
          </div>
        </div>
        
        <div className="bg-slate-800/50 px-5 py-3 rounded-2xl border border-slate-700/50 flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Authorized: <span className="text-white">{user?.name}</span>
          </p>
        </div>
      </div>

      {/* Alerts */}
      {globalSuccess && (
        <div className="mb-6 flex items-center gap-2 bg-emerald-500/20 border border-emerald-500 text-emerald-300 px-4 py-3 rounded-xl text-xs font-bold">
          <CheckCircle size={14} /> {globalSuccess}
        </div>
      )}
      {globalError && (
        <div className="mb-6 flex items-center gap-2 bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-xl text-xs font-bold">
          <AlertCircle size={14} /> {globalError}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-slate-800 overflow-x-auto">
        <button onClick={() => setActiveTab('products')} className={tabCls('products')}>Products</button>
        <button onClick={() => setActiveTab('employees')} className={tabCls('employees')}>Employees</button>
        <button onClick={() => setActiveTab('profile')} className={tabCls('profile')}>Profile</button>
      </div>

      {/* ───── PRODUCTS TAB ───── */}
      {activeTab === 'products' && (
        <>
          {/* Stats & Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 w-full">
              {[
                { label: 'Total Products', value: totalProducts, icon: BarChart },
                { label: 'Low Stock (<5)', value: lowStockCount, icon: Package },
                { label: 'New This Month', value: newProductsCount, icon: Plus },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-3xl border border-slate-700/50 hover:border-cyan-500/30 transition-colors">
                  <p className="text-slate-500 text-[10px] uppercase font-black flex items-center gap-1.5 mb-1">
                    <Icon size={12} className="text-cyan-500" />{label}
                  </p>
                  <p className="text-white text-2xl font-black tracking-tighter">{value}</p>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setShowAddProduct(!showAddProduct)}
              className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-xs tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95
                ${showAddProduct 
                  ? 'bg-slate-800 text-white border border-slate-700 hover:bg-slate-700' 
                  : 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400'
                }`}
            >
              {showAddProduct ? <><X size={16} />CANCEL</> : <><Plus size={16} />NEW INJECTION</>}
            </button>
          </div>

          {/* Add product form */}
          {showAddProduct && (
            <div className="mb-16 bg-slate-800/30 border border-slate-700/50 rounded-[2.5rem] p-6 md:p-10 relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase tracking-widest">Protocol Injection</h3>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Input New Hardware Data</p>
                </div>
              </div>
              
              <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className={labelCls}><Tag size={12} />Model Designation *</label>
                  <input type="text" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className={inputCls} placeholder="e.g. iPhone 15 Pro Max" required />
                </div>
                <div className="space-y-3">
                  <label className={labelCls}><DollarSign size={12} />Price (Rwf) *</label>
                  <input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} className={inputCls} placeholder="0" required />
                </div>
                <div className="space-y-3">
                  <label className={labelCls}><DollarSign size={12} />Original Price (discount)</label>
                  <input type="number" value={productForm.originalPrice} onChange={e => setProductForm({ ...productForm, originalPrice: e.target.value })} className={inputCls} placeholder="Optional" />
                </div>
                <div className="space-y-3">
                  <label className={labelCls}><Layers size={12} />Category</label>
                  <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} className={inputCls + ' appearance-none cursor-pointer'}>
                    {['Smartphone', 'Audio', 'Watches', 'Computer & Laptop', 'Games & Consoles', 'Camera', 'Accessories'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className={labelCls}><Package size={12} />Stock Quantity</label>
                  <input type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} className={inputCls} />
                </div>
                <div className="space-y-3">
                  <label className={labelCls}>Badge</label>
                  <select value={productForm.badge} onChange={e => setProductForm({ ...productForm, badge: e.target.value })} className={inputCls + ' appearance-none cursor-pointer'}>
                    <option value="">No Badge</option>
                    {badgeOptions.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>

                {/* Image — URL + uploader */}
                <div className="space-y-3 md:col-span-2 lg:col-span-3">
                  <label className={labelCls}><ImageIcon size={12} />Product Image *</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-700/50">
                      <p className="text-[10px] text-slate-500 mb-4 font-black uppercase tracking-[0.2em]">Upload Direct File</p>
                      <ImageUploader
                        value={productForm.image}
                        onChange={(url) => setProductForm(p => ({ ...p, image: url }))}
                        folder="products"
                        disabled={submitting}
                      />
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-700/50 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] text-slate-500 mb-4 font-black uppercase tracking-[0.2em]">External Asset URL</p>
                        <input
                          type="url"
                          value={productForm.image}
                          onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                          className={inputCls}
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                      {productForm.image && (
                        <div className="mt-4 w-full h-24 rounded-2xl overflow-hidden border border-slate-700">
                          <img src={productForm.image} alt="preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.parentElement!.style.display = 'none')} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 md:col-span-2 lg:col-span-3">
                  <div className="flex justify-between items-center mb-1">
                    <label className={labelCls}><Cpu size={12} />Technical Specifications</label>
                    <button
                      type="button"
                      onClick={handleGenerateSpecs}
                      disabled={generatingSpecs || !productForm.name}
                      className="text-[9px] font-black uppercase tracking-widest text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20 transition-all disabled:opacity-30"
                    >
                      {generatingSpecs ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                      Insight Specs
                    </button>
                  </div>
                  <input type="text" value={productForm.specs} onChange={e => setProductForm({ ...productForm, specs: e.target.value })} className={inputCls} placeholder="Processor:A17 Pro, RAM:8GB, Storage:256GB" />
                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest ml-1 italic">Format: Key:Value, separated by commas</p>
                </div>

                <div className="col-span-full flex flex-col sm:flex-row justify-between items-center gap-6 pt-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input type="checkbox" checked={productForm.isNew} onChange={e => setProductForm({ ...productForm, isNew: e.target.checked })} className="w-6 h-6 rounded-lg bg-slate-800 border-slate-700 text-cyan-500 focus:ring-offset-0 focus:ring-0 transition-all cursor-pointer" />
                    </div>
                    <span className="text-xs font-black text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">Identify as New Arrival</span>
                  </label>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 px-16 py-5 rounded-2xl font-black text-xs tracking-[0.3em] transition-all shadow-xl shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-3"
                  >
                    {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />SYNCING…</> : <><Save size={16} />INJECT UNIT</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Product list */}
          <div className="mb-12 space-y-8 relative z-10">
            <div className="flex justify-between items-end border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-white font-black text-sm uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Layers size={16} className="text-cyan-500" /> Active Inventory
                </h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Manage Live Catalog Data</p>
              </div>
              <div className="text-right">
                <span className="text-cyan-500 font-black text-2xl tracking-tighter">{products.length}</span>
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-2">Verified Units</span>
              </div>
            </div>
            
            {products.length === 0 ? (
              <div className="bg-slate-800/20 border border-dashed border-slate-800 rounded-[3rem] p-20 text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-700">
                  <Package size={40} />
                </div>
                <p className="text-slate-600 font-black text-xs uppercase tracking-[0.3em]">No Hardware Detected</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-[2rem] p-5 hover:bg-slate-800/50 transition-all group relative overflow-hidden">
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    
                    <div className="flex gap-5 relative z-10">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0 border border-slate-700/50 shadow-inner group-hover:scale-105 transition-transform duration-500">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-white font-black text-[11px] truncate uppercase tracking-widest group-hover:text-cyan-400 transition-colors">{product.name}</h4>
                            <div className="flex gap-1">
                              <button onClick={() => setEditingProduct(product)} className="text-slate-600 hover:text-cyan-400 p-1.5 hover:bg-cyan-500/10 rounded-lg transition-all"><Edit size={14} /></button>
                              <button onClick={() => handleDeleteProduct(product.id)} className="text-slate-600 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={14} /></button>
                            </div>
                          </div>
                          <p className="text-cyan-500 font-black text-sm mt-1">{product.price.toLocaleString()} Rwf</p>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1.5">
                            <Package size={12} className="text-slate-600" />
                            <span className={`text-[10px] font-black uppercase tracking-wider ${product.stock < 5 ? 'text-amber-500' : 'text-slate-500'}`}>{product.stock} Units</span>
                          </div>
                          <span className="text-[9px] font-black text-slate-500 bg-slate-900/50 border border-slate-800 px-2 py-1 rounded-md uppercase tracking-tighter">{product.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Edit Product Modal */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-slate-900">Edit Product</h3>
                  <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                </div>
                <form onSubmit={handleUpdateProduct} className="space-y-4">
                  {[
                    { label: 'Product Name', key: 'name', type: 'text', required: true },
                    { label: 'Price (Rwf)', key: 'price', type: 'number', required: true },
                    { label: 'Original Price', key: 'originalPrice', type: 'number' },
                    { label: 'Stock', key: 'stock', type: 'number' },
                  ].map(({ label, key, type, required }) => (
                    <input
                      key={key}
                      type={type}
                      value={(editingProduct as any)[key] ?? ''}
                      onChange={e => setEditingProduct({ ...editingProduct, [key]: type === 'number' ? (e.target.value ? Number(e.target.value) : undefined) : e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      placeholder={label}
                      required={required}
                    />
                  ))}
                  <select value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm">
                    {['Smartphone', 'Audio', 'Watches', 'Computer & Laptop', 'Games & Consoles', 'Camera', 'Accessories'].map(c => <option key={c}>{c}</option>)}
                  </select>

                  {/* Image uploader in edit modal */}
                  <div>
                    <p className="text-xs font-bold text-slate-600 mb-2">Product Image</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-slate-400 mb-1">Upload</p>
                        <ImageUploader
                          value={editingProduct.image}
                          onChange={(url) => setEditingProduct(p => p ? { ...p, image: url } : p)}
                          folder="products"
                          disabled={submitting}
                        />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 mb-1">Or paste URL</p>
                        <input
                          type="url"
                          value={editingProduct.image}
                          onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>

                  <textarea
                    value={stringifySpecs(editingProduct.specs || {})}
                    onChange={e => setEditingProduct({ ...editingProduct, specs: parseSpecs(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none"
                    placeholder="Specs (key:value, comma separated)"
                    rows={2}
                  />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={editingProduct.isNew || false} onChange={e => setEditingProduct({ ...editingProduct, isNew: e.target.checked })} />
                      New
                    </label>
                    <select value={editingProduct.badge || ''} onChange={e => setEditingProduct({ ...editingProduct, badge: e.target.value || undefined })} className="border border-slate-200 rounded-xl px-4 py-2 text-sm">
                      <option value="">No Badge</option>
                      {badgeOptions.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setEditingProduct(null)} className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition">Cancel</button>
                    <button type="submit" disabled={submitting} className="bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-cyan-400 disabled:opacity-50 transition">
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={15} />}
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* ───── EMPLOYEES TAB ───── */}
      {activeTab === 'employees' && (
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
            <div>
              <h3 className="text-white font-black text-sm uppercase tracking-widest mb-1 flex items-center gap-2">
                <Users size={16} className="text-cyan-500" /> Human Resources
              </h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Manage Global Operations Team</p>
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="text-right hidden sm:block mr-4">
                <span className="text-cyan-500 font-black text-2xl tracking-tighter">{employees.length}</span>
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest ml-2">Agents</span>
              </div>
              <button
                onClick={() => setShowAddEmployee(!showAddEmployee)}
                className={`flex-1 sm:flex-none px-8 py-4 rounded-2xl font-black text-xs tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95
                  ${showAddEmployee 
                    ? 'bg-slate-800 text-white border border-slate-700 hover:bg-slate-700' 
                    : 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400'
                  }`}
              >
                {showAddEmployee ? <><X size={16} />CANCEL</> : <><UserPlus size={16} />RECRUIT AGENT</>}
              </button>
            </div>
          </div>

          {/* Add employee form */}
          {showAddEmployee && (
            <div className="mb-16 bg-slate-800/30 border border-slate-700/50 rounded-[2.5rem] p-6 md:p-10 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase tracking-widest">Recruitment Protocol</h3>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Initialize New Personnel File</p>
                </div>
              </div>

              <form onSubmit={handleEmployeeSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className={labelCls}>Full Legal Name *</label>
                  <input type="text" placeholder="e.g. Jean-Luc Nkurunziza" value={employeeForm.name} onChange={e => setEmployeeForm({ ...employeeForm, name: e.target.value })} className={inputCls} required disabled={submitting} />
                </div>
                <div className="space-y-3">
                  <label className={labelCls}>Corporate Email *</label>
                  <input type="email" placeholder="email@example.com" value={employeeForm.email} onChange={e => setEmployeeForm({ ...employeeForm, email: e.target.value })} className={inputCls} required disabled={submitting} />
                </div>
                <div className="space-y-3">
                  <label className={labelCls}>Communication Line</label>
                  <input type="tel" placeholder="+250 7XX XXX XXX" value={employeeForm.phone} onChange={e => setEmployeeForm({ ...employeeForm, phone: e.target.value })} className={inputCls} disabled={submitting} />
                </div>
                <div className="space-y-3">
                  <label className={labelCls}>Operational Role *</label>
                  <input type="text" placeholder="e.g. Senior Tech Analyst" value={employeeForm.role} onChange={e => setEmployeeForm({ ...employeeForm, role: e.target.value })} className={inputCls} required disabled={submitting} />
                </div>

                <div className="col-span-full grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { ph: 'LinkedIn', key: 'linkedin', icon: <Users size={12}/> },
                    { ph: 'Twitter', key: 'twitter', icon: <Users size={12}/> },
                    { ph: 'Instagram', key: 'instagram', icon: <Users size={12}/> },
                    { ph: 'TikTok', key: 'tiktok', icon: <Users size={12}/> },
                    { ph: 'Facebook', key: 'facebook', icon: <Users size={12}/> },
                    { ph: 'GitHub', key: 'github', icon: <Users size={12}/> },
                  ].map(({ ph, key, icon }) => (
                    <div key={key} className="space-y-2">
                      <label className={labelCls}>{icon}{ph}</label>
                      <input type="url" placeholder="https://..." value={(employeeForm as any)[key]} onChange={e => setEmployeeForm({ ...employeeForm, [key]: e.target.value })} className={inputCls.replace('py-4', 'py-3')} disabled={submitting} />
                    </div>
                  ))}
                </div>

                {/* Profile picture */}
                <div className="col-span-full space-y-4">
                  <label className={labelCls}><ImageIcon size={12} />Personnel Identification Image *</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-700/50">
                      <p className="text-[10px] text-slate-500 mb-4 font-black uppercase tracking-[0.2em]">Upload Direct File</p>
                      <ImageUploader
                        value={employeeForm.image}
                        onChange={(url) => setEmployeeForm(f => ({ ...f, image: url }))}
                        folder="employees"
                        disabled={submitting}
                      />
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-700/50 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] text-slate-500 mb-4 font-black uppercase tracking-[0.2em]">External Asset URL</p>
                        <input type="url" value={employeeForm.image} onChange={e => setEmployeeForm({ ...employeeForm, image: e.target.value })} className={inputCls} placeholder="https://..." disabled={submitting} />
                      </div>
                      {employeeForm.image && (
                        <div className="mt-4 w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-500/50 self-center shadow-lg">
                          <img src={employeeForm.image} alt="preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-span-full flex justify-end pt-4">
                  <button type="submit" disabled={submitting} className="w-full sm:w-auto bg-cyan-500 text-slate-950 px-16 py-5 rounded-2xl font-black text-xs tracking-[0.3em] hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-3">
                    {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />INITIALIZING…</> : <><Save size={16} />REGISTER AGENT</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List */}
          <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employeesLoading ? (
              <div className="col-span-full flex flex-col items-center justify-center p-20 bg-slate-800/20 rounded-[3rem] border border-slate-800">
                <Loader2 size={32} className="text-cyan-500 animate-spin mb-4" />
                <p className="text-slate-500 font-black text-xs uppercase tracking-[0.3em]">Accessing Personnel Database…</p>
              </div>
            ) : employees.length === 0 ? (
              <div className="col-span-full bg-slate-800/20 border border-dashed border-slate-800 rounded-[3rem] p-20 text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-700">
                  <Users size={40} />
                </div>
                <p className="text-slate-600 font-black text-xs uppercase tracking-[0.3em]">No Personnel Detected</p>
              </div>
            ) : (
              employees.map(emp => (
                <div key={emp.id} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-[2rem] p-5 hover:bg-slate-800/50 transition-all group relative overflow-hidden">
                  <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-700/50 bg-slate-900 flex-shrink-0 group-hover:border-cyan-500/50 transition-all duration-500 group-hover:scale-105">
                      {emp.image
                        ? <img src={emp.image} alt={emp.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        : <div className="w-full h-full flex items-center justify-center text-slate-500 font-black text-xl bg-slate-800">{emp.name[0]}</div>
                      }
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-white font-black text-[11px] uppercase tracking-widest truncate group-hover:text-cyan-400 transition-colors">{emp.name}</h4>
                        <div className="flex gap-1">
                          <button onClick={() => setEditingEmployee(emp)} className="text-slate-600 hover:text-cyan-400 p-1.5 hover:bg-cyan-500/10 rounded-lg transition-all"><Edit size={14} /></button>
                          <button onClick={() => handleDeleteEmployee(emp.id)} className="text-slate-600 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <p className="text-cyan-500 font-black text-[10px] uppercase tracking-wider mt-1">{emp.role}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-[9px] font-black text-slate-500 truncate uppercase tracking-tighter opacity-60">{emp.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Edit Employee Modal */}
          {editingEmployee && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-slate-900">Edit Employee</h3>
                  <button onClick={() => setEditingEmployee(null)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                </div>
                <form onSubmit={handleUpdateEmployee} className="space-y-4">
                  {[
                    { ph: 'Full Name', key: 'name', type: 'text', required: true },
                    { ph: 'Email', key: 'email', type: 'email', required: true },
                    { ph: 'Phone', key: 'phone', type: 'tel' },
                    { ph: 'Role', key: 'role', type: 'text', required: true },
                  ].map(({ ph, key, type, required }) => (
                    <input key={key} type={type} value={(editingEmployee as any)[key] ?? ''} onChange={e => setEditingEmployee({ ...editingEmployee, [key]: e.target.value })} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder={ph} required={required} />
                  ))}
                  <div className="grid grid-cols-2 gap-3">
                    {['linkedin', 'twitter', 'instagram', 'tiktok', 'facebook', 'github'].map(key => (
                      <input key={key} type="url" value={(editingEmployee.social as any)?.[key] ?? ''} onChange={e => setEditingEmployee({ ...editingEmployee, social: { ...editingEmployee.social, [key]: e.target.value } })} placeholder={key.charAt(0).toUpperCase() + key.slice(1)} className="border border-slate-200 rounded-xl px-4 py-3 text-sm" />
                    ))}
                  </div>

                  {/* Image */}
                  <div>
                    <p className="text-xs font-bold text-slate-600 mb-2">Profile Picture</p>
                    <div className="grid grid-cols-2 gap-3">
                      <ImageUploader value={editingEmployee.image ?? ''} onChange={(url) => setEditingEmployee(e => e ? { ...e, image: url } : e)} folder="employees" disabled={submitting} />
                      <input type="url" value={editingEmployee.image ?? ''} onChange={e => setEditingEmployee({ ...editingEmployee, image: e.target.value })} className="border border-slate-200 rounded-xl px-4 py-3 text-sm self-start" placeholder="Or paste URL" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setEditingEmployee(null)} className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition">Cancel</button>
                    <button type="submit" disabled={submitting} className="bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-cyan-400 disabled:opacity-50 transition">
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={15} />}
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───── PROFILE TAB ───── */}
      {activeTab === 'profile' && (
        <div className="relative z-10">
          <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2"><Users size={16} />Admin Profile</h3>
          <form onSubmit={handleProfileUpdate} className="max-w-md space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-cyan-500 bg-slate-700 flex-shrink-0">
                {profileForm.avatar
                  ? <img src={profileForm.avatar} alt="Profile" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>
                }
              </div>
              <div className="w-full">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Profile Picture</p>
                <ImageUploader
                  value={profileForm.avatar}
                  onChange={(url) => setProfileForm(f => ({ ...f, avatar: url }))}
                  folder="avatars"
                  disabled={submitting}
                />
              </div>
            </div>

            <input type="text" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} className={inputCls} placeholder="Full Name" required disabled={submitting} />
            <input type="email" value={profileForm.email} disabled className={inputCls + ' opacity-50 cursor-not-allowed'} />
            <input type="tel" value={profileForm.phone || ''} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} className={inputCls} placeholder="Phone" disabled={submitting} />
            <input type="text" value={profileForm.role} disabled className={inputCls + ' opacity-50 cursor-not-allowed'} />

            <button type="submit" disabled={submitting} className="w-full bg-cyan-500 text-slate-950 py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-cyan-400 transition flex items-center justify-center gap-2 disabled:opacity-50">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />SAVING…</> : <><Save size={16} />UPDATE PROFILE</>}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;