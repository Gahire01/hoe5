import React from 'react';
import { useEmployees } from '../hooks/useEmployees';
import { useAuth } from '../hooks/useAuth'; // we need this
import { FaLinkedin, FaTwitter, FaGithub, FaFacebook, FaInstagram } from 'react-icons/fa';
import { Mail, Phone, Edit, Trash2 } from 'lucide-react';

const TeamSection: React.FC = () => {
  const { employees, loading, deleteEmployee } = useEmployees();
  const { user } = useAuth(); // custom hook that returns current user

  if (loading) return <div className="text-center py-12">Loading team...</div>;

  return (
    <section className="py-16 md:py-24">
      <div className="text-center mb-12">
        <span className="text-cyan-600 font-black text-xs uppercase tracking-[0.5em] mb-4 block">Our Team</span>
        <h2 className="text-4xl md:text-5xl font-black text-slate-950 mb-4 tracking-tighter">Meet the Architects</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">The experts behind your technology journey.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {employees.map(member => (
          <div key={member.id} className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-2xl transition group relative">
            {user?.role === 'admin' && (
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-cyan-50">
                  <Edit size={16} className="text-cyan-600" />
                </button>
                <button
                  onClick={() => deleteEmployee(member.id)}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-red-50"
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
            )}
            <div className="relative mb-6">
              <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-cyan-500 group-hover:scale-105 transition-transform" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 text-center mb-1">{member.name}</h3>
            <p className="text-cyan-600 font-bold text-sm text-center mb-4">{member.role}</p>
            <div className="space-y-2 text-slate-600 text-sm">
              {member.email && (
                <div className="flex items-center justify-center gap-2">
                  <Mail size={16} className="text-cyan-500" />
                  <a href={`mailto:${member.email}`} className="hover:text-cyan-600">{member.email}</a>
                </div>
              )}
              {member.phone && (
                <div className="flex items-center justify-center gap-2">
                  <Phone size={16} className="text-cyan-500" />
                  <span>{member.phone}</span>
                </div>
              )}
            </div>
            {member.social && (
              <div className="flex justify-center gap-4 mt-6 pt-4 border-t border-slate-100">
                {member.social.linkedin && <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-600"><FaLinkedin size={20} /></a>}
                {member.social.twitter && <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-600"><FaTwitter size={20} /></a>}
                {member.social.facebook && <a href={member.social.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-600"><FaFacebook size={20} /></a>}
                {member.social.instagram && <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-600"><FaInstagram size={20} /></a>}
                {member.social.github && <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-600"><FaGithub size={20} /></a>}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
