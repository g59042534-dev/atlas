import React from "react";
import { Case, EvidenceFile, GeneratedReport } from "../types";
import { Plus, Folder, File, FileCheck, ArrowRight, MessageSquare, Instagram, Facebook, Mail, HelpCircle } from "lucide-react";

interface DashboardViewProps {
  cases: Case[];
  files: EvidenceFile[];
  reports: GeneratedReport[];
  onSelectCase: (caseId: string) => void;
  onOpenNewCase: () => void;
}

export default function DashboardView({
  cases,
  files,
  reports,
  onSelectCase,
  onOpenNewCase
}: DashboardViewProps) {
  const getEvidenceTypeIcon = (type: string) => {
    switch (type) {
      case "WhatsApp":
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case "Instagram":
        return <Instagram className="w-4 h-4 text-pink-400" />;
      case "Facebook":
        return <Facebook className="w-4 h-4 text-blue-400" />;
      case "E-mail":
        return <Mail className="w-4 h-4 text-amber-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">Visão Geral</h2>
          <p className="text-secondary text-sm mt-1">
            Plataforma técnica para registro de arquivos e cálculo de hashes de integridade matemática (SHA-256).
          </p>
        </div>
        <button
          onClick={onOpenNewCase}
          id="btn-novo-caso-dashboard"
          className="bg-primary hover:bg-[#c5a059] text-on-primary px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/10 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Caso</span>
        </button>
      </div>

      {/* Basic Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 - Total de Casos */}
        <div id="metric-card-casos" className="bg-surface-container p-6 rounded-xl border border-outline-variant/15 relative overflow-hidden flex flex-col justify-between h-32">
          <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-primary"></div>
          <div className="flex justify-between items-start">
            <span className="text-[#9a8f80] text-xs font-bold uppercase tracking-wider">Total de Casos</span>
            <Folder className="w-5 h-5 text-primary opacity-60" />
          </div>
          <p className="text-3xl font-extrabold text-on-surface">{cases.length}</p>
        </div>

        {/* Metric 2 - Total de Arquivos */}
        <div id="metric-card-arquivos" className="bg-surface-container p-6 rounded-xl border border-outline-variant/15 relative overflow-hidden flex flex-col justify-between h-32">
          <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-primary"></div>
          <div className="flex justify-between items-start">
            <span className="text-[#9a8f80] text-xs font-bold uppercase tracking-wider">Total de Arquivos</span>
            <File className="w-5 h-5 text-primary opacity-60" />
          </div>
          <p className="text-3xl font-extrabold text-on-surface">{files.length}</p>
        </div>

        {/* Metric 3 - Relatórios Gerados */}
        <div id="metric-card-relatorios" className="bg-surface-container p-6 rounded-xl border border-outline-variant/15 relative overflow-hidden flex flex-col justify-between h-32">
          <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-primary"></div>
          <div className="flex justify-between items-start">
            <span className="text-[#9a8f80] text-xs font-bold uppercase tracking-wider">Relatórios Gerados</span>
            <FileCheck className="w-5 h-5 text-primary opacity-60" />
          </div>
          <p className="text-3xl font-extrabold text-on-surface">{reports.length}</p>
        </div>
      </div>

      {/* Recents Cases Section */}
      <div className="bg-surface-container rounded-xl border border-outline-variant/15 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-high/20">
          <h3 className="font-semibold text-lg text-on-surface">Casos Recentes</h3>
          <span className="text-xs text-outline font-medium">Mostrando todos os {cases.length} casos</span>
        </div>

        {/* Desktop View Case Table */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/40 border-b border-outline-variant/15 text-outline text-xs uppercase font-bold tracking-wider">
                <th className="px-6 py-4">Nome do Caso</th>
                <th className="px-6 py-4">Origem</th>
                <th className="px-6 py-4">Data de Criação</th>
                <th className="px-6 py-4">Arquivos Anexados</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {cases.map((cs) => {
                const caseFilesCount = files.filter(f => f.caseId === cs.id).length;
                return (
                  <tr
                    key={cs.id}
                    onClick={() => onSelectCase(cs.id)}
                    className="hover:bg-primary/5 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-on-surface text-sm group-hover:text-primary transition-colors">
                          {cs.name}
                        </span>
                        <span className="text-xs text-outline mt-0.5 max-w-md truncate">
                          {cs.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-secondary text-sm">
                      <div className="flex items-center gap-2">
                        {getEvidenceTypeIcon(cs.evidenceType)}
                        <span>{cs.evidenceType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-secondary text-sm">
                      {cs.date}
                    </td>
                    <td className="px-6 py-4 text-secondary text-sm font-mono">
                      {caseFilesCount} arquivos
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        cs.status === "Concluído"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : cs.status === "Pendente"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : "bg-primary/10 text-primary border-primary/20"
                      }`}>
                        {cs.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCase(cs.id);
                        }}
                        className="text-primary hover:text-[#c5a059] p-2 hover:bg-primary/10 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-semibold focus:outline-none"
                      >
                        <span>Abrir</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View Case Cards */}
        <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
          {cases.map((cs) => {
            const caseFilesCount = files.filter(f => f.caseId === cs.id).length;
            return (
              <div
                key={cs.id}
                onClick={() => onSelectCase(cs.id)}
                className="bg-surface-container-low border border-outline-variant/15 rounded-xl p-4 space-y-3 cursor-pointer hover:border-primary/40 transition-all active:scale-[0.99]"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-bold text-on-surface text-base group-hover:text-primary leading-tight break-words">
                      {cs.name}
                    </h4>
                    <p className="text-xs text-outline leading-relaxed break-words line-clamp-2">
                      {cs.description}
                    </p>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                    cs.status === "Concluído"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : cs.status === "Pendente"
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      : "bg-primary/10 text-primary border-primary/20"
                  }`}>
                    {cs.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10 text-xs text-secondary">
                  <div className="flex items-center gap-1.5 font-medium">
                    {getEvidenceTypeIcon(cs.evidenceType)}
                    <span>{cs.evidenceType}</span>
                  </div>
                  <span>{cs.date}</span>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="font-semibold text-[#9a8f80]">{caseFilesCount} arquivos</span>
                  <div className="text-primary font-bold flex items-center gap-1">
                    <span>Acessar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
