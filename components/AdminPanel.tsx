import React, { useState, useEffect } from 'react';
import { Product, Employee } from '../types';
import { Plus, Package, Tag, DollarSign, Layers, Image as ImageIcon, Cpu, BarChart, Trash2, UserPlus, Users } from 'lucide-react';
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
    github: '',
    image: '',
  });

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

  const handleImageUpload = async (file: File) => {
    try {
      validateImageFile(file);
      setUploading(true);
      setUploadError('');
      const url = await uploadToImgBB(file);
      setProductForm({...productForm, image: url});
    } catch (error: any) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

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
      specs: productForm.specs ? Object.fromEntries(productForm.specs.split(',').map(s => s.trim().split(':'))) : {},
    };

    await addDoc(collection(db, 'products'), newProduct);
    onAdd(newProduct);
    setProductForm({ ...productForm, name: '', price: '', originalPrice: '', badge: '', specs: '', image: '' });
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Delete this product?')) return;
    await deleteDoc(doc(db, 'products', productId));
    window.location.reload();
  };

  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEmp: Omit<Employee, 'id'> = {
      name: employeeForm.name,
      email: employeeForm.email,
      phone: employeeForm.phone,
      role: employeeForm.role,
      social: {
        linkedin: employeeForm.linkedin,
        twitter: employeeForm.twitter,
        github: employeeForm.github,
      },
      image: employeeForm.image || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`,
    };
    const docRef = await addDoc(collection(db, 'employees'), newEmp);
    setEmployees([...employees, { id: docRef.id, ...newEmp }]);
    setEmployeeForm({ name: '', email: '', phone: '', role: '', linkedin: '', twitter: '', github: '', image: '' });
  };

  const handleDeleteEmployee = async (empId: string) => {
    if (!confirm('Delete this employee?')) return;
    await deleteDoc(doc(db, 'employees', empId));
    setEmployees(employees.filter(e => e.id !== empId));
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
                        await handleImageUpload(e.target.files[0]);
                      }
                    }}
                    className="text-white text-xs bg-slate-800 p-3 rounded-xl w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400"
                  />
                  {uploading && <p className="text-cyan-400 text-xs mt-2">Uploading to ImgBB...</p>}
                  {uploadError && <p className="text-red-400 text-xs mt-2">{uploadError}</p>}
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
              <input
                type="text"
                value={productForm.badge}
                onChange={e => setProductForm({...productForm, badge: e.target.value})}
                placeholder="Badge (e.g., Best Seller)"
                className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-bold transition-all"
              />
            </div>
            <div className="col-span-full flex justify-between items-center">
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
              placeholder="Name"
              value={employeeForm.name}
              onChange={e => setEmployeeForm({...employeeForm, name: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={employeeForm.email}
              onChange={e => setEmployeeForm({...employeeForm, email: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white"
              required
            />
            <input
              type="text"
              placeholder="Phone"
              value={employeeForm.phone}
              onChange={e => setEmployeeForm({...employeeForm, phone: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white"
            />
            <input
              type="text"
              placeholder="Role"
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
              placeholder="GitHub URL"
              value={employeeForm.github}
              onChange={e => setEmployeeForm({...employeeForm, github: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white"
            />
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={employeeForm.image}
              onChange={e => setEmployeeForm({...employeeForm, image: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white"
            />
            <div className="col-span-full flex justify-end">
              <button type="submit" className="bg-cyan-500 text-slate-950 px-8 py-3 rounded-2xl font-black text-xs tracking-widest hover:bg-cyan-400 transition flex items-center gap-2">
                <UserPlus size={16} /> ADD EMPLOYEE
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {employees.map(emp => (
              <div key={emp.id} className="bg-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-white font-black">{emp.name}</p>
                  <p className="text-slate-400 text-xs">{emp.email} • {emp.role}</p>
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
