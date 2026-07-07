import { Bell, HelpCircle, Search, Menu } from "lucide-react";
import React, { useState } from "react";

interface HeaderProps {
  onSearch: (query: string) => void;
  searchPlaceholder?: string;
  activeTab: string;
  responsibleName: string;
  onMenuToggle?: () => void;
}

export default function Header({ 
  onSearch, 
  searchPlaceholder = "Buscar por casos, arquivos ou detalhes...", 
  activeTab,
  responsibleName,
  onMenuToggle
}: HeaderProps) {
  const [searchValue, setSearchValue] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: "O relatório consolidado do Caso CAS-7719 foi concluído.", time: "há 10 min", unread: true },
    { id: 2, text: "Novo arquivo de prova adicionado ao Caso CAS-7721.", time: "há 2 horas", unread: false },
    { id: 3, text: "Backup local das suas evidências realizado com sucesso.", time: "há 5 horas", unread: false },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    onSearch(val);
  };

  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-260px)] h-16 bg-surface-dim border-b border-outline-variant/15 flex justify-between items-center px-4 md:px-6 z-40 font-sans transition-all duration-300">
      {/* Search Bar & Mobile Menu Trigger */}
      <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0 mr-2">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer hover:bg-surface-container-high rounded-lg mr-1 shrink-0 flex items-center justify-center"
          title="Abrir Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-sm md:max-w-md group min-w-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9a8f80]/80 group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg pl-9 pr-3 py-1.5 text-xs md:text-sm text-on-surface placeholder:text-[#9a8f80]/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all truncate"
          />
        </div>
      </div>

      {/* Action Badges & Profile */}
      <div className="flex items-center gap-2 md:gap-6 shrink-0">
        <div className="flex items-center gap-1.5 md:gap-3 relative">
          {/* Notifications Button */}
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors relative focus:outline-none cursor-pointer hover:bg-surface-container-high rounded-lg"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary border border-surface-dim rounded-full animate-pulse"></span>
          </button>

          {/* Help Button */}
          <button 
            onClick={() => alert("Atlas Evidências - Plataforma de preservação segura de mídias, conversas e documentos com hash de integridade certificada.")}
            className="p-2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none cursor-pointer hover:bg-surface-container-high rounded-lg"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Quick Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-72 md:w-80 bg-surface-container border border-outline-variant/30 rounded-xl p-3.5 shadow-xl z-50">
              <h4 className="font-bold text-sm text-primary mb-2.5">Notificações</h4>
              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 hover:bg-surface-container-high rounded-lg transition-colors text-xs border-b border-outline-variant/10 last:border-none">
                    <div className="flex justify-between items-start gap-1.5">
                      <p className={`flex-1 ${n.unread ? 'font-semibold text-on-surface' : 'text-[#d1c5b4]/80'}`}>
                        {n.text}
                      </p>
                      {n.unread && <span className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0"></span>}
                    </div>
                    <span className="text-[10px] text-outline mt-1 block font-mono">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-[1px] bg-outline-variant/30"></div>

        {/* Profile Card */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-on-surface leading-tight">{responsibleName}</p>
            <p className="text-[10px] text-[#9a8f80] uppercase tracking-wider font-semibold">
              Usuário Atlas
            </p>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-primary/30 flex items-center justify-center bg-surface-container-high ring-2 ring-primary/10 select-none text-primary font-bold text-sm md:text-base capitalize">
            {responsibleName ? responsibleName.charAt(0).toUpperCase() : "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
