import React, { useState, useEffect } from 'react';
import { Product, Employee } from '../types';
import { Plus, Package, Tag, DollarSign, Layers, Image as ImageIcon, Cpu, BarChart, Trash2, UserPlus, Users, Instagram, Twitter, Github, Linkedin } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { uploadToImgBB, validateImageFile } from '../services/imgbbService';

interface Props {
  onAdd: (p: Product) => void;
  totalProducts: number;
  lowStockCount: number;
  newProductsCount: number;
  userRole: string;
}

const AdminPanel: React.FC<Props> = ({ onAdd, totalProducts, lowStockCount, newProductsCount, userRole }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'employees'>('products');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'Smartphone',
    image: '',
    stock: '10',
    isNew: false,
    badge: '',
    specs: '',
  });

  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    tiktok: '',
    github: '',
    image: '',
  });

  const badgeOptions = ['New', 'Hot', 'Limited', 'Best Seller', 'Premium', 'Sale', 'Featured'];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const querySnapshot = await getDocs(collection(db, 'employees'));
    const emps: Employee[] = [];
    querySnapshot.forEach((doc) => {
      emps.push({ id: doc.id, ...doc.data() } as Employee);
    });
    setEmployees(emps);
  };

  const handleImageUpload = async (file: File, target: 'product' | 'employee') => {
    try {
      validateImageFile(file);
      setUploading(true);
      setUploadError('');
      const url = await uploadToImgBB(file);
      if (target === 'product') {
        setProductForm({ ...productForm, image: url });
      } else {
        setEmployeeForm({ ...employeeForm, image: url });
      }
    } catch (error: any) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const parseSpecs = (specsString: string): Record<string, string> => {
    if (!specsString.trim()) return {};
    return specsString
      .split(',')
      .map(pair => pair.trim())
      .filter(pair => pair.includes(':'))
      .reduce((acc, pair) => {
        const [key, value] = pair.split(':').map(s => s.trim());
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    setSubmitSuccess('');

    if (!productForm.name || !productForm.price) {
      setUploadError('Name and price are required.');
      return;
    }

    try {
      const newProduct: Product = {
        id: `p-${Date.now()}`,
        name: productForm.name,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        category: productForm.category,
        image: productForm.image || `https://picsum.photos/seed/${Date.now()}/600/600`,
        stock: Number(productForm.stock),
        rating: 5,
        isNew: productForm.isNew,
        badge: productForm.badge || undefined,
        specs: parseSpecs(productForm.specs),
      };

      await addDoc(collection(db, 'products'), newProduct);
      onAdd(newProduct);
      setSubmitSuccess('Product added successfully!');
      setProductForm({ ...productForm, name: '', price: '', originalPrice: '', badge: '', specs: '', image: '' });
    } catch (error: any) {
      setUploadError('Failed to add product: ' + error.message);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', productId));
      window.location.reload(); // Simple refresh to update list
    } catch (error: any) {
      alert('Delete failed: ' + error.message);
    }
  };

  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    setSubmitSuccess('');

    if (!employeeForm.name || !employeeForm.email || !employeeForm.role) {
      setUploadError('Name, email, and role are required.');
      return;
    }

    try {
      const newEmp: Omit<Employee, 'id'> = {
        name: employeeForm.name,
        email: employeeForm.email,
        phone: employeeForm.phone,
        role: employeeForm.role,
        social: {
          linkedin: employeeForm.linkedin,
          twitter: employeeForm.twitter,
          instagram: employeeForm.instagram,
          tiktok: employeeForm.tiktok,
          github: employeeForm.github,
        },
        image: employeeForm.image || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`,
      };
      const docRef = await addDoc(collection(db, 'employees'), newEmp);
      setEmployees([...employees, { id: docRef.id, ...newEmp }]);
      setSubmitSuccess('Employee added successfully!');
      setEmployeeForm({ name: '', email: '', phone: '', role: '', linkedin: '', twitter: '', instagram: '', tiktok: '', github: '', image: '' });
    } catch (error: any) {
      setUploadError('Failed to add employee: ' + error.message);
    }
  };

  const handleDeleteEmployee = async (empId: string) => {
    if (!confirm('Delete this employee?')) return;
    try {
      await deleteDoc(doc(db, 'employees', empId));
      setEmployees(employees.filter(e => e.id !== empId));
    } catch (error: any) {
      alert('Delete failed: ' + error.message);
    }
  };

  if (userRole !== 'admin') return null;

  return (
    <div className="bg-slate-900 rounded-[3rem] p-10 border border-slate-800 shadow-2xl overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
        <Package size={120} stroke="white" strokeWidth={1} />
      </div>

      <div className="flex items-center gap-6 mb-10 relative z-10">
        <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg">
          <Cpu size={28} />
        </div>
        <div>
          <h2 className="text-white font-black text-2xl tracking-tighter">DATASET INJECTION</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Publish Live Product Protocol</p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {submitSuccess && (
        <div className="mb-6 bg-emerald-500/20 border border-emerald-500 text-emerald-300 px-4 py-3 rounded-xl text-xs font-bold">
          {submitSuccess}
        </div>
      )}
      {uploadError && (
        <div className="mb-6 bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-xl text-xs font-bold">
          {uploadError}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'products' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-white'}`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'employees' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-white'}`}
        >
          Employees
        </button>
      </div>

      {activeTab === 'products' && (
        <>
          {/* Analytics Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8 relative z-10">
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
              <p className="text-slate-400 text-[10px] uppercase font-black flex items-center gap-1">
                <BarChart size={12} /> Total Products
              </p>
              <p className="text-white text-2xl font-black">{totalProducts}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
              <p className="text-slate-400 text-[10px] uppercase font-black">Low Stock (&lt;5)</p>
              <p className="text-white text-2xl font-black">{lowStockCount}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
              <p className="text-slate-400 text-[10px] uppercase font-black">New This Month</p>
              <p className="text-white text-2xl font-black">{newProductsCount}</p>
            </div>
          </div>

          <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Tag size={12} /> Model Designation
              </label>
              <input
                type="text"
                name="product-name"
                autoComplete="off"
                value={productForm.name}
                onChange={e => setProductForm({...productForm, name: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold transition-all"
                placeholder="e.g. iPhone 15 Pro Max"
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <DollarSign size={12} /> Price (Rwf)
              </label>
              <input
                type="number"
                name="product-price"
                autoComplete="off"
                value={productForm.price}
                onChange={e => setProductForm({...productForm, price: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold transition-all"
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <DollarSign size={12} /> Discount (Original Price)
              </label>
              <input
                type="number"
                name="product-original-price"
                autoComplete="off"
                value={productForm.originalPrice}
                onChange={e => setProductForm({...productForm, originalPrice: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold transition-all"
                placeholder="Optional"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Layers size={12} /> Category
              </label>
              <select
                value={productForm.category}
                onChange={e => setProductForm({...productForm, category: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none font-bold appearance-none cursor-pointer"
              >
                <option>Smartphone</option>
                <option>Audio</option>
                <option>Watches</option>
                <option>Computer & Laptop</option>
                <option>Games & Consoles</option>
              </select>
            </div>
            <div className="space-y-3 col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon size={12} /> Product Image
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="url"
                  value={productForm.image}
                  onChange={e => setProductForm({...productForm, image: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold transition-all"
                  placeholder="https://..."
                />
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        await handleImageUpload(e.target.files[0], 'product');
                      }
                    }}
                    className="text-white text-xs bg-slate-800 p-3 rounded-xl w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Package size={12} /> Stock Quantity
              </label>
              <input
                type="number"
                value={productForm.stock}
                onChange={e => setProductForm({...productForm, stock: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold transition-all"
              />
            </div>
            <div className="space-y-3 col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Cpu size={12} /> Specs (key:value, comma separated)
              </label>
              <input
                type="text"
                value={productForm.specs}
                onChange={e => setProductForm({...productForm, specs: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold transition-all"
                placeholder="Processor:M3 Max, RAM:36GB, Storage:1TB"
              />
            </div>
            <div className="space-y-3 flex items-center gap-4 col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={productForm.isNew}
                  onChange={e => setProductForm({...productForm, isNew: e.target.checked})}
                  className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stable (New)</span>
              </label>
              <select
                value={productForm.badge}
                onChange={e => setProductForm({...productForm, badge: e.target.value})}
                className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none font-bold"
              >
                <option value="">No Badge</option>
                {badgeOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="col-span-full flex justify-end">
              <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-12 py-4 rounded-2xl font-black text-xs tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center gap-2">
                <Plus size={16} /> INJECT UNIT
              </button>
            </div>
          </form>
        </>
      )}

      {activeTab === 'employees' && (
        <div className="relative z-10">
          <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
            <Users size={16} /> Manage Employees
          </h3>
          <form onSubmit={handleEmployeeSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Full Name *"
              value={employeeForm.name}
              onChange={e => setEmployeeForm({...employeeForm, name: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white"
              required
            />
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email *"
              value={employeeForm.email}
              onChange={e => setEmployeeForm({...employeeForm, email: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white"
              required
            />
            <input
              type="tel"
              name="tel"
              autoComplete="tel"
              placeholder="Phone"
              value={employeeForm.phone}
              onChange={e => setEmployeeForm({...employeeForm, phone: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white"
            />
            <input
              type="text"
              placeholder="Role *"
              value={employeeForm.role}
              onChange={e => setEmployeeForm({...employeeForm, role: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white"
              required
            />
            <input
              type="url"
              placeholder="LinkedIn URL"
              value={employeeForm.linkedin}
              onChange={e => setEmployeeForm({...employeeForm, linkedin: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white"
            />
            <input
              type="url"
              placeholder="Twitter URL"
              value={employeeForm.twitter}
              onChange={e => setEmployeeForm({...employeeForm, twitter: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white"
            />
            <input
              type="url"
              placeholder="Instagram URL"
              value={employeeForm.instagram}
              onChange={e => setEmployeeForm({...employeeForm, instagram: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white"
            />
            <input
              type="url"
              placeholder="TikTok URL"
              value={employeeForm.tiktok}
              onChange={e => setEmployeeForm({...employeeForm, tiktok: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white"
            />
            <input
              type="url"
              placeholder="GitHub URL"
              value={employeeForm.github}
              onChange={e => setEmployeeForm({...employeeForm, github: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white"
            />
            <div className="col-span-2 flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Picture</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="url"
                  placeholder="Image URL (optional)"
                  value={employeeForm.image}
                  onChange={e => setEmployeeForm({...employeeForm, image: e.target.value})}
                  className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white"
                />
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        await handleImageUpload(e.target.files[0], 'employee');
                      }
                    }}
                    className="text-white text-xs bg-slate-800 p-3 rounded-xl w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-full flex justify-end">
              <button type="submit" className="bg-cyan-500 text-slate-950 px-8 py-3 rounded-2xl font-black text-xs tracking-widest hover:bg-cyan-400 transition flex items-center gap-2">
                <UserPlus size={16} /> ADD EMPLOYEE
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {employees.map(emp => (
              <div key={emp.id} className="bg-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {emp.image && (
                    <img src={emp.image} alt={emp.name} className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500" />
                  )}
                  <div>
                    <p className="text-white font-black">{emp.name}</p>
                    <p className="text-slate-400 text-xs">{emp.email} • {emp.role}</p>
                    <div className="flex gap-2 mt-1">
                      {emp.social?.linkedin && <a href={emp.social.linkedin} target="_blank" rel="noopener" className="text-slate-500 hover:text-cyan-400"><Linkedin size={14} /></a>}
                      {emp.social?.twitter && <a href={emp.social.twitter} target="_blank" rel="noopener" className="text-slate-500 hover:text-cyan-400"><Twitter size={14} /></a>}
                      {emp.social?.instagram && <a href={emp.social.instagram} target="_blank" rel="noopener" className="text-slate-500 hover:text-cyan-400"><Instagram size={14} /></a>}
                      {emp.social?.tiktok && <a href={emp.social.tiktok} target="_blank" rel="noopener" className="text-slate-500 hover:text-cyan-400">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                      </a>}
                      {emp.social?.github && <a href={emp.social.github} target="_blank" rel="noopener" className="text-slate-500 hover:text-cyan-400"><Github size={14} /></a>}
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDeleteEmployee(emp.id)} className="text-red-400 hover:text-red-300">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
