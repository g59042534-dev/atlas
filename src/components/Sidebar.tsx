import React from "react";
import { 
  FolderOpen, 
  Settings, 
  HelpCircle, 
  LogOut, 
  PlusCircle,
  LayoutDashboard,
  File,
  FileCheck,
  X
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewCase: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  onLogout: () => void;
  userEmail?: string;
}

export default function Sidebar({ activeTab, setActiveTab, onOpenNewCase, isOpen = false, onClose, onLogout, userEmail }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "cases", label: "Casos", icon: FolderOpen },
    { id: "files", label: "Arquivos", icon: File },
    { id: "reports", label: "Relatórios", icon: FileCheck },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onClose?.();
  };

  return (
    <aside className={`fixed top-0 h-full w-[260px] bg-surface-container-lowest border-r border-outline-variant/15 flex flex-col py-4 z-50 transition-all duration-300 ${
      isOpen ? "left-0" : "-left-[260px]"
    } md:left-0`}>
      {/* Branding Header */}
      <div className="px-6 mb-8 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img 
            alt="Atlas Evidências Logo" 
            className="w-10 h-10 object-contain hover:scale-105 transition-transform shrink-0" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjF9JusWwDzpZmdIIUZaQza4tPVKTyL_yo4Y4RCIG8r9QEy20i9WbZ14795nZejE3flCApnVMDgSkilbCknJzJFNQjJPoGeHi4Uguy2vVCoZG75JrT7BFriqGvn4-dsmbqXNbexcNviGb-7ZmtWdDnEGkS3a8Ilvxb748E0_9rawg6wyxLlYgtE4NIo1THO-P7w8fyneJNaEXKgkoXuetgCTF2NNp-sEJnvVh0N1j2XIgEvqElCR6brRxZPea6wa4mKE4aJqgCYSI"
          />
          <div className="min-w-0">
            <h1 className="font-sans text-base font-bold text-primary leading-tight tracking-tight truncate">
              Atlas Evidências
            </h1>
            <p className="text-[9px] uppercase tracking-widest text-[#9a8f80]/80 font-bold truncate">
              Evidências Digitais
            </p>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="md:hidden p-1.5 text-secondary hover:text-primary rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
          title="Fechar Menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <div className="mb-4">
          <button 
            onClick={() => {
              onOpenNewCase();
              onClose?.();
            }}
            id="sidebar-new-case-btn"
            className="w-full bg-primary hover:bg-[#c5a059] text-on-primary py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/10 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 animate-pulse" />
            <span className="text-xs uppercase tracking-wider font-bold">Novo Caso</span>
          </button>
        </div>

        <div className="space-y-1 font-sans">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-left transition-all duration-200 group cursor-pointer ${
                  isActive 
                    ? "text-primary font-bold border-r-2 border-primary bg-primary/5" 
                    : "text-secondary hover:bg-surface-container-high hover:text-primary"
                }`}
              >
                <IconComponent className={`w-5 h-5 transition-transform group-hover:scale-105 ${isActive ? "text-primary text-opacity-100" : "text-[#d1c5b4]/70"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          
          <button
            onClick={() => handleTabClick("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-left transition-all duration-200 group cursor-pointer ${
              activeTab === "settings"
                ? "text-primary font-bold border-r-2 border-primary bg-primary/5" 
                : "text-secondary hover:bg-surface-container-high hover:text-primary"
            }`}
          >
            <Settings className="w-5 h-5 text-[#d1c5b4]/70" />
            <span>Configurações</span>
          </button>
        </div>
      </nav>

      {/* Footer Navigation */}
      <footer className="px-4 pt-4 border-t border-outline-variant/15 space-y-1 font-sans mt-auto">
        {userEmail && (
          <div className="px-4 py-2 mb-2 text-[10px] text-[#dee2ed]/60 bg-surface-container-high/40 rounded-lg border border-outline-variant/10">
            <span className="text-[#9a8f80]/80">Acessado como:</span>
            <div className="font-semibold text-primary truncate mt-0.5" title={userEmail}>
              {userEmail}
            </div>
          </div>
        )}
        <a 
          href="#help" 
          onClick={(e) => { e.preventDefault(); alert("Atlas Evidências v3.0 - Auxílio e Suporte Técnico integrado."); onClose?.(); }}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-xs text-secondary hover:bg-surface-container-high hover:text-primary transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-[#d1c5b4]/60" />
          <span>Suporte Técnico</span>
        </a>
        <a 
          href="#logout" 
          onClick={(e) => { e.preventDefault(); onLogout(); onClose?.(); }}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-xs text-error/80 hover:bg-error/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair do Sistema</span>
        </a>
      </footer>
    </aside>
  );
}
