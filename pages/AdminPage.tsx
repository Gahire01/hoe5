import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { useEmployees } from '../hooks/useEmployees';
import AdminPanel from '../components/AdminPanel';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Loader2, ShieldAlert } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { 
    products, 
    loading: productsLoading, 
    addProduct, 
    updateProduct, 
    deleteProduct 
  } = useProducts();
  const { 
    employees, 
    loading: employeesLoading, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee 
  } = useEmployees();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
      </div>
    );
  }

  if (!user || (user.role !== 'admin' && user.email !== 'homeofelectronics20@gmail.com')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-[2rem] flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
          <ShieldAlert size={40} />
        </div>
        <h1 className="text-3xl font-black text-white mb-4 tracking-tighter">ACCESS RESTRICTED</h1>
        <p className="text-slate-400 max-w-md mb-8 font-medium">
          This sector is reserved for authorized personnel only. Current User: {user?.email} <br/>
          Please authenticate with admin credentials to proceed.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-cyan-500 text-slate-950 px-8 py-3 rounded-xl font-black text-xs tracking-widest uppercase"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 selection:bg-cyan-500/30">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 lg:py-20">
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-4 mb-3">
            <span className="h-px w-12 bg-cyan-500/50" />
            <span className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Command Center</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
            ADMINISTRATIVE <br/> <span className="text-cyan-500">DASHBOARD</span>
          </h1>
          <p className="mt-6 text-slate-500 text-sm sm:text-base font-medium max-w-xl">
            Operational control panel for Home of Electronics. Manage your global inventory, personnel, and system configurations with precision.
          </p>
        </div>

        <div className="animate-in fade-in zoom-in-95 duration-1000 delay-300">
          <AdminPanel
            products={products}
            onAdd={addProduct}
            onUpdate={updateProduct}
            onDelete={deleteProduct}
            totalProducts={products.length}
            lowStockCount={products.filter(p => p.stock < 5).length}
            newProductsCount={products.filter(p => p.isNew).length}
            userRole={user.role}
            employees={employees}
            onAddEmployee={addEmployee}
            onUpdateEmployee={updateEmployee}
            onDeleteEmployee={deleteEmployee}
            employeesLoading={employeesLoading}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
