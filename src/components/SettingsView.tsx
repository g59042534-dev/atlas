import React, { useState } from "react";
import { User, Clipboard, Database, RotateCcw, ShieldCheck, Lock, Save } from "lucide-react";

interface SettingsViewProps {
  investigatorName: string;
  setInvestigatorName: (name: string) => void;
  oabCode: string;
  setOabCode: (code: string) => void;
  officeName: string;
  setOfficeName: (office: string) => void;
  onResetData: () => void;
}

export default function SettingsView({
  investigatorName,
  setInvestigatorName,
  oabCode,
  setOabCode,
  officeName,
  setOfficeName,
  onResetData
}: SettingsViewProps) {
  const [localName, setLocalName] = useState(investigatorName);
  const [localOab, setLocalOab] = useState(oabCode);
  const [localOffice, setLocalOffice] = useState(officeName);

  const handleSaveSettings = () => {
    setInvestigatorName(localName);
    setOabCode(localOab);
    setOfficeName(localOffice);
    alert("Configurações salvas localmente! Os novos dados de cabeçalho serão aplicados por padrão em todos os laudos gerados.");
  };

  return (
    <div className="space-y-6 max-w-4xl font-sans animate-fadeIn">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-on-surface">Configurações</h2>
        <p className="text-secondary text-sm mt-1">Gerencie os dados que aparecem nos relatórios, assinaturas digitais e banco local.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Lawyer profile customizable fields (col span 2) */}
        <section className="md:col-span-2 space-y-6">
          <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/15 space-y-6">
            <h3 className="font-semibold text-base text-on-surface flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-primary" />
              <span>Dados de Identificação</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#9a8f80] uppercase tracking-wider block">Nome de Exibição</label>
                <input 
                  type="text"
                  value={localName}
                  onChange={(e) => setLocalName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#9a8f80] uppercase tracking-wider block">Inscrição Profissional (Opcional)</label>
                <input 
                  type="text"
                  value={localOab}
                  onChange={(e) => setLocalOab(e.target.value)}
                  placeholder="Ex: OAB/SP 000.000"
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#9a8f80] uppercase tracking-wider block">Organização ou Entidade</label>
              <input 
                type="text"
                value={localOffice}
                onChange={(e) => setLocalOffice(e.target.value)}
                className="w-full bg-surface-container-low border border-[1px] border-outline-variant/30 rounded-lg px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary outline-none"
              />
              <p className="text-[10px] text-outline italic">Estes dados constarão automaticamente no cabeçalho de integridade e no rodapé de cada relatório de evidência gerado.</p>
            </div>

            <div className="pt-4 border-t border-outline-variant/15 flex justify-end">
              <button 
                onClick={handleSaveSettings}
                className="bg-primary hover:bg-[#c5a059] px-6 py-2.5 rounded-lg text-on-primary font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </div>
        </section>

        {/* Database resetting (col span 1) */}
        <section className="space-y-6">
          <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/15 space-y-4">
            <h3 className="font-semibold text-base text-on-surface flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              <span>Banco de Dados Local</span>
            </h3>
            <p className="text-xs text-secondary leading-relaxed">Você pode restaurar o estado inicial padrão de casos fictícios, relatórios e arquivos para demonstração do Atlas Evidências.</p>
            
            <button 
              onClick={() => { if (confirm("Tem certeza que deseja apagar as alterações atuais e resetar todos os casos?")) onResetData(); }}
              className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Resetar Banco Local</span>
            </button>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 mx-auto">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider font-sans">Workspace Protegido</h4>
            <p className="text-[11px] text-secondary leading-relaxed">Sua plataforma preserva dados localmente em seu navegador com criptografia de ponta a ponta de forma privativa.</p>
            <div className="flex items-center gap-1.5 justify-center text-[10px] text-primary/70 font-mono font-bold pt-1.5 border-t border-primary/10">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Segurança Local Ativa</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
