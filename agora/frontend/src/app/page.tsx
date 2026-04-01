'use client';

import { Clock, BookOpen, Target, Activity, ChevronRight } from 'lucide-react';

export default function Home() {
  const stats = [
    { label: 'Hoje', value: '4h 20m', icon: Clock, color: 'text-blue-500' },
    { label: 'Concluído', value: '12', icon: BookOpen, color: 'text-emerald-500' },
    { label: 'Foco', value: '94%', icon: Activity, color: 'text-amber-500' },
    { label: 'Meta', value: '85%', icon: Target, color: 'text-rose-500' },
  ];

  const recentSubjects = [
    { name: 'Cálculo I', time: '1h 30m', status: 'Concluído' },
    { name: 'Arquitetura de Software', time: '2h 15m', status: 'Em progresso' },
    { name: 'Banco de Dados', time: '45m', status: 'Pendente' },
  ];

  return (
    <div className="flex-1 w-full bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Bom dia, <span className="text-primary">Estudante</span>! 📚
          </h1>
          <p className="text-secondary text-lg max-w-2xl">
            Sua jornada de conhecimento continua aqui. O que vamos aprender hoje?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div 
              key={i}
              className="bg-card-bg backdrop-blur-xl border border-card-border p-6 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-inner group-hover:scale-110 transition-transform ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Subjects */}
          <div className="lg:col-span-2 bg-card-bg backdrop-blur-xl border border-card-border rounded-[32px] p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Matérias Recentes</h2>
              <button className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                Ver todas <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="space-y-4">
              {recentSubjects.map((subject, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors border border-transparent hover:border-card-border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {subject.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-base">{subject.name}</p>
                      <p className="text-xs text-secondary font-medium">{subject.time} estudados</p>
                    </div>
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full ${
                    subject.status === 'Concluído' ? 'bg-emerald-100 text-emerald-700' : 
                    subject.status === 'Em progresso' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {subject.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Goals */}
          <div className="bg-primary/5 border border-primary/10 rounded-[32px] p-8">
            <h2 className="text-2xl font-bold text-foreground tracking-tight mb-6">Metas Rápidas</h2>
            <div className="space-y-6">
              {[
                { label: 'Leitura: Clean Architecture', progress: 65 },
                { label: 'Exercícios: Álgebra Linear', progress: 30 },
                { label: 'Projeto: Alexandria', progress: 90 },
              ].map((goal, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-foreground/80">{goal.label}</span>
                    <span className="text-xs font-bold text-primary">{goal.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000" 
                      style={{ width: `${goal.progress}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-10 bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-hover transition-all">
              <Target size={20} /> Nova Meta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
