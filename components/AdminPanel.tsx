import React, { useState, useEffect } from 'react';
import { Product, Employee } from '../types';
import {
  Plus, Package, Tag, DollarSign, Layers, Image as ImageIcon,
  Cpu, BarChart, Trash2, UserPlus, Users, Instagram, Twitter,
  Github, Linkedin, Facebook, Edit, X, Save
} from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { uploadToImgBB, validateImageFile } from '../services/imgbbService';

interface Props {
  onAdd: (p: Product) => void;
  onUpdate: (id: string, updates: Partial<Product>) => void;
  onDelete: (id: string) => void;
  products: Product[];
  totalProducts: number;
  lowStockCount: number;
  newProductsCount: number;
  userRole: string;
}

const AdminPanel: React.FC<Props> = ({
  onAdd, onUpdate, onDelete, products,
  totalProducts, lowStockCount, newProductsCount, userRole
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'employees'>('products');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

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
    facebook: '',
    github: '',
    image: '',
  });

  const badgeOptions = ['New', 'Hot', 'Limited', 'Best Seller', 'Premium', 'Sale', 'Featured'];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'employees'));
      const emps: Employee[] = [];
      querySnapshot.forEach((doc) => {
        emps.push({ id: doc.id, ...doc.data() } as Employee);
      });
      setEmployees(emps);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setUploadError('Failed to load employees.');
    }
  };

  const handleImageUpload = async (file: File, target: 'product' | 'employee' | 'editProduct' | 'editEmployee', editId?: string) => {
    try {
      validateImageFile(file);
      setUploading(true);
      setUploadError('');
      const url = await uploadToImgBB(file);
      if (target === 'product') {
        setProductForm({ ...productForm, image: url });
      } else if (target === 'employee') {
        setEmployeeForm({ ...employeeForm, image: url });
      } else if (target === 'editProduct' && editingProduct) {
        setEditingProduct({ ...editingProduct, image: url });
      } else if (target === 'editEmployee' && editingEmployee) {
        setEditingEmployee({ ...editingEmployee, image: url });
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
        if (key && value) acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
  };

  const stringifySpecs = (specs: Record<string, string>): string => {
    return Object.entries(specs).map(([k, v]) => `${k}:${v}`).join(', ');
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    setSubmitSuccess('');
    setSubmitting(true);

    if (!productForm.name || !productForm.price) {
      setUploadError('Name and price are required.');
      setSubmitting(false);
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
      setProductForm({
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
    } catch (error: any) {
      console.error('Product add error:', error);
      setUploadError('Failed to add product: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setUploadError('');
    setSubmitSuccess('');
    setSubmitting(true);

    try {
      await updateDoc(doc(db, 'products', editingProduct.id), {
        name: editingProduct.name,
        price: editingProduct.price,
        originalPrice: editingProduct.originalPrice,
        category: editingProduct.category,
        image: editingProduct.image,
        stock: editingProduct.stock,
        isNew: editingProduct.isNew,
        badge: editingProduct.badge,
        specs: editingProduct.specs,
      });
      onUpdate(editingProduct.id, editingProduct);
      setSubmitSuccess('Product updated successfully!');
      setEditingProduct(null);
    } catch (error: any) {
      console.error('Product update error:', error);
      setUploadError('Failed to update product: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      onDelete(id);
    } catch (error: any) {
      alert('Delete failed: ' + error.message);
    }
  };

  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    setSubmitSuccess('');
    setSubmitting(true);

    if (!employeeForm.name || !employeeForm.email || !employeeForm.role) {
      setUploadError('Name, email, and role are required.');
      setSubmitting(false);
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
          facebook: employeeForm.facebook,
          github: employeeForm.github,
        },
        image: employeeForm.image || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`,
      };
      const docRef = await addDoc(collection(db, 'employees'), newEmp);
      setEmployees([...employees, { id: docRef.id, ...newEmp }]);
      setSubmitSuccess('Employee added successfully!');
      setEmployeeForm({
        name: '',
        email: '',
        phone: '',
        role: '',
        linkedin: '',
        twitter: '',
        instagram: '',
        tiktok: '',
        facebook: '',
        github: '',
        image: '',
      });
    } catch (error: any) {
      console.error('Employee add error:', error);
      setUploadError('Failed to add employee: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;
    setUploadError('');
    setSubmitSuccess('');
    setSubmitting(true);

    try {
      await updateDoc(doc(db, 'employees', editingEmployee.id), {
        name: editingEmployee.name,
        email: editingEmployee.email,
        phone: editingEmployee.phone,
        role: editingEmployee.role,
        social: editingEmployee.social,
        image: editingEmployee.image,
      });
      setEmployees(employees.map(emp => emp.id === editingEmployee.id ? editingEmployee : emp));
      setSubmitSuccess('Employee updated successfully!');
      setEditingEmployee(null);
    } catch (error: any) {
      console.error('Employee update error:', error);
      setUploadError('Failed to update employee: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Delete this employee?')) return;
    try {
      await deleteDoc(doc(db, 'employees', id));
      setEmployees(employees.filter(e => e.id !== id));
    } catch (error: any) {
      alert('Delete failed: ' + error.message);
    }
  };

  if (userRole !== 'admin') return null;

  return (
    <div className="bg-slate-900 rounded-[3rem] p-4 md:p-10 border border-slate-800 shadow-2xl overflow-hidden relative group">
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

      <div className="flex gap-2 mb-8 border-b border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'products' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-white'}`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === 'employees' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-white'}`}
        >
          Employees
        </button>
      </div>

      {activeTab === 'products' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 relative z-10">
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

          {/* Product List */}
          <div className="mb-8 space-y-3">
            <h3 className="text-white font-black text-sm uppercase tracking-widest">Existing Products</h3>
            {products.map(product => (
              <div key={product.id} className="bg-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <p className="text-white font-black text-sm">{product.name}</p>
                    <p className="text-slate-400 text-xs">{product.price.toLocaleString()} Rwf • Stock: {product.stock}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingProduct(product)} className="text-cyan-400 hover:text-cyan-300">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDeleteProduct(product.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {/* ... product form fields (same as before) ... */}
            <div className="space-y-3 md:col-span-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Tag size={12} /> Model Designation *
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
                <DollarSign size={12} /> Price (Rwf) *
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
            <div className="space-y-3 md:col-span-2 lg:col-span-3">
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
                    disabled={uploading}
                    className="text-white text-xs bg-slate-800 p-3 rounded-xl w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400 disabled:opacity-50"
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
            <div className="space-y-3 md:col-span-2">
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
            <div className="space-y-3 flex flex-wrap items-center gap-4 md:col-span-2 lg:col-span-3">
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
              <button
                type="submit"
                disabled={submitting || uploading}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-12 py-4 rounded-2xl font-black text-xs tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    INJECTING...
                  </>
                ) : (
                  <>
                    <Plus size={16} /> INJECT UNIT
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Edit Product Modal */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-slate-900">Edit Product</h3>
                  <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-slate-100 rounded-full">
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleUpdateProduct} className="space-y-4">
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3"
                    placeholder="Product Name"
                    required
                  />
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3"
                    placeholder="Price"
                    required
                  />
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3"
                    placeholder="Original Price (optional)"
                  />
                  <select
                    value={editingProduct.category}
                    onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3"
                  >
                    <option>Smartphone</option>
                    <option>Audio</option>
                    <option>Watches</option>
                    <option>Computer & Laptop</option>
                    <option>Games & Consoles</option>
                  </select>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={editingProduct.image}
                      onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      className="flex-1 border border-slate-200 rounded-xl px-4 py-3"
                      placeholder="Image URL"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          await handleImageUpload(e.target.files[0], 'editProduct');
                        }
                      }}
                      className="text-sm"
                    />
                  </div>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3"
                    placeholder="Stock"
                  />
                  <textarea
                    value={stringifySpecs(editingProduct.specs || {})}
                    onChange={e => setEditingProduct({ ...editingProduct, specs: parseSpecs(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3"
                    placeholder="Specs (key:value, comma separated)"
                    rows={3}
                  />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingProduct.isNew || false}
                        onChange={e => setEditingProduct({ ...editingProduct, isNew: e.target.checked })}
                      />
                      <span>New</span>
                    </label>
                    <select
                      value={editingProduct.badge || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, badge: e.target.value || undefined })}
                      className="border border-slate-200 rounded-xl px-4 py-2"
                    >
                      <option value="">No Badge</option>
                      {badgeOptions.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-6 py-3 border border-slate-200 rounded-xl font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
                    >
                      {submitting ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'employees' && (
        <div className="relative z-10">
          <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
            <Users size={16} /> Manage Employees
          </h3>

          {/* Employee List */}
          <div className="mb-8 space-y-3">
            {employees.map(emp => (
              <div key={emp.id} className="bg-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {emp.image && (
                    <img src={emp.image} alt={emp.name} className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500" />
                  )}
                  <div>
                    <p className="text-white font-black">{emp.name}</p>
                    <p className="text-slate-400 text-xs">{emp.email} • {emp.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingEmployee(emp)} className="text-cyan-400 hover:text-cyan-300">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDeleteEmployee(emp.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleEmployeeSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <input
              type="text"
              placeholder="Full Name *"
              value={employeeForm.name}
              onChange={e => setEmployeeForm({...employeeForm, name: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white"
              required
            />
            <input
              type="email"
              placeholder="Email *"
              value={employeeForm.email}
              onChange={e => setEmployeeForm({...employeeForm, email: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white"
              required
            />
            <input
              type="tel"
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
              placeholder="Facebook URL"
              value={employeeForm.facebook}
              onChange={e => setEmployeeForm({...employeeForm, facebook: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white"
            />
            <input
              type="url"
              placeholder="GitHub URL"
              value={employeeForm.github}
              onChange={e => setEmployeeForm({...employeeForm, github: e.target.value})}
              className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white"
            />
            <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
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
                    disabled={uploading}
                    className="text-white text-xs bg-slate-800 p-3 rounded-xl w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-full flex justify-end">
              <button
                type="submit"
                disabled={submitting || uploading}
                className="bg-cyan-500 text-slate-950 px-8 py-3 rounded-2xl font-black text-xs tracking-widest hover:bg-cyan-400 transition flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    ADDING...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} /> ADD EMPLOYEE
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Edit Employee Modal */}
          {editingEmployee && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-slate-900">Edit Employee</h3>
                  <button onClick={() => setEditingEmployee(null)} className="p-2 hover:bg-slate-100 rounded-full">
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleUpdateEmployee} className="space-y-4">
                  <input
                    type="text"
                    value={editingEmployee.name}
                    onChange={e => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3"
                    placeholder="Full Name"
                    required
                  />
                  <input
                    type="email"
                    value={editingEmployee.email}
                    onChange={e => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3"
                    placeholder="Email"
                    required
                  />
                  <input
                    type="tel"
                    value={editingEmployee.phone || ''}
                    onChange={e => setEditingEmployee({ ...editingEmployee, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3"
                    placeholder="Phone"
                  />
                  <input
                    type="text"
                    value={editingEmployee.role}
                    onChange={e => setEditingEmployee({ ...editingEmployee, role: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3"
                    placeholder="Role"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="url"
                      value={editingEmployee.social?.linkedin || ''}
                      onChange={e => setEditingEmployee({
                        ...editingEmployee,
                        social: { ...editingEmployee.social, linkedin: e.target.value }
                      })}
                      placeholder="LinkedIn"
                      className="border border-slate-200 rounded-xl px-4 py-3"
                    />
                    <input
                      type="url"
                      value={editingEmployee.social?.twitter || ''}
                      onChange={e => setEditingEmployee({
                        ...editingEmployee,
                        social: { ...editingEmployee.social, twitter: e.target.value }
                      })}
                      placeholder="Twitter"
                      className="border border-slate-200 rounded-xl px-4 py-3"
                    />
                    <input
                      type="url"
                      value={editingEmployee.social?.instagram || ''}
                      onChange={e => setEditingEmployee({
                        ...editingEmployee,
                        social: { ...editingEmployee.social, instagram: e.target.value }
                      })}
                      placeholder="Instagram"
                      className="border border-slate-200 rounded-xl px-4 py-3"
                    />
                    <input
                      type="url"
                      value={editingEmployee.social?.tiktok || ''}
                      onChange={e => setEditingEmployee({
                        ...editingEmployee,
                        social: { ...editingEmployee.social, tiktok: e.target.value }
                      })}
                      placeholder="TikTok"
                      className="border border-slate-200 rounded-xl px-4 py-3"
                    />
                    <input
                      type="url"
                      value={editingEmployee.social?.facebook || ''}
                      onChange={e => setEditingEmployee({
                        ...editingEmployee,
                        social: { ...editingEmployee.social, facebook: e.target.value }
                      })}
                      placeholder="Facebook"
                      className="border border-slate-200 rounded-xl px-4 py-3"
                    />
                    <input
                      type="url"
                      value={editingEmployee.social?.github || ''}
                      onChange={e => setEditingEmployee({
                        ...editingEmployee,
                        social: { ...editingEmployee.social, github: e.target.value }
                      })}
                      placeholder="GitHub"
                      className="border border-slate-200 rounded-xl px-4 py-3"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={editingEmployee.image || ''}
                      onChange={e => setEditingEmployee({ ...editingEmployee, image: e.target.value })}
                      className="flex-1 border border-slate-200 rounded-xl px-4 py-3"
                      placeholder="Image URL"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          await handleImageUpload(e.target.files[0], 'editEmployee');
                        }
                      }}
                      className="text-sm"
                    />
                  </div>
                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditingEmployee(null)}
                      className="px-6 py-3 border border-slate-200 rounded-xl font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
                    >
                      {submitting ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
