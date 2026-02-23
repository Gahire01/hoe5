import React from 'react';
import { TeamMember } from '../types';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import { Mail, Phone } from 'lucide-react';

interface Props {
  members: TeamMember[];
}

const TeamSection: React.FC<Props> = ({ members }) => {
  return (
    <section className="py-16 md:py-24">
      <div className="text-center mb-12">
        <span className="text-cyan-600 font-black text-xs uppercase tracking-[0.5em] mb-4 block">Our Team</span>
        <h2 className="text-4xl md:text-5xl font-black text-slate-950 mb-4 tracking-tighter">Meet the Architects</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">The experts behind your technology journey.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map(member => (
          <div key={member.id} className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-2xl transition group">
            <div className="relative mb-6">
              <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-cyan-500 group-hover:scale-105 transition-transform" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 text-center mb-1">{member.name}</h3>
            <p className="text-cyan-600 font-bold text-sm text-center mb-4">{member.role}</p>
            <div className="space-y-2 text-slate-600 text-sm">
              <div className="flex items-center justify-center gap-2">
                <Mail size={16} className="text-cyan-500" />
                <a href={`mailto:${member.email}`} className="hover:text-cyan-600">{member.email}</a>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Phone size={16} className="text-cyan-500" />
                <span>{member.phone}</span>
              </div>
            </div>
            {member.social && (
              <div className="flex justify-center gap-4 mt-6 pt-4 border-t border-slate-100">
                {member.social.linkedin && <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-600"><FaLinkedin size={20} /></a>}
                {member.social.twitter && <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-600"><FaTwitter size={20} /></a>}
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
