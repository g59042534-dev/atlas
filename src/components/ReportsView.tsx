import React from "react";
import { Case, GeneratedReport } from "../types";
import { Download, FileCheck, Check, Sparkles, Folder, ExternalLink } from "lucide-react";

interface ReportsViewProps {
  reports: GeneratedReport[];
  cases: Case[];
  onSelectCase: (caseId: string) => void;
  onGenerateReportForCase: (caseId: string) => void;
  onDownloadReport: (report: GeneratedReport) => void;
}

export default function ReportsView({
  reports,
  cases,
  onSelectCase,
  onGenerateReportForCase,
  onDownloadReport
}: ReportsViewProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Title & Detail Banner */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-on-surface">Relatórios de Preservação</h2>
        <p className="text-secondary text-sm mt-1">Gere e visualize relatórios técnicos estruturados com hashes SHA-256 das mídias processadas.</p>
      </div>

      {/* Grid containing Quick Reports Actions vs Historic list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Report Constructor Board (col-span 1) */}
        <section className="bg-surface-container rounded-xl border border-outline-variant/15 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-on-surface flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span>Gerar Novo Relatório</span>
            </h3>
            <p className="text-secondary text-xs leading-relaxed">
              Escolha um dos seus casos abaixo para construir um documento consolidador PDF. Este relatório reúne os detalhes técnicos inseridos, as mídias anexadas, seus respectivos metadados e os hashes de integridade SHA-256 gerados.
            </p>

            <div className="space-y-2 pt-2">
              <label className="text-[10px] font-bold text-[#9a8f80] uppercase tracking-wider block">Selecione o Caso</label>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {cases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onGenerateReportForCase(c.id)}
                    className="w-full text-left bg-surface-container-low hover:bg-primary/5 hover:border-primary/45 border border-outline-variant/15 rounded-lg p-3 text-xs flex justify-between items-center transition-all group group-hover:scale-[0.99]"
                  >
                    <div>
                      <p className="font-semibold text-on-surface group-hover:text-primary transition-colors max-w-[180px] truncate">{c.name}</p>
                      <p className="text-[11px] text-outline font-mono mt-0.5">{c.id} • {c.evidenceType}</p>
                    </div>
                    <Sparkles className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-outline-variant/10 text-[11px] text-outline leading-relaxed">
            Nossos relatórios seguem rigorosamente os padrões exigidos pelo Marco Civil da Internet e CPC.
          </div>
        </section>

        {/* Generated PDF History (col-span 2) */}
        <section className="bg-surface-container rounded-xl border border-outline-variant/15 overflow-hidden lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-outline-variant/10 bg-surface-container-high/15">
              <h3 className="font-semibold text-lg text-on-surface">Relatórios Disponíveis</h3>
            </div>

            {/* Desktop View Table */}
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-high/40 border-b border-outline-variant/15 text-outline uppercase font-bold tracking-wider">
                    <th className="px-6 py-4">Código</th>
                    <th className="px-6 py-4">Caso Associado</th>
                    <th className="px-6 py-4">Data de Emissão</th>
                    <th className="px-6 py-4">Tamanho</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-sm">
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center text-outline text-xs">
                        Nenhum relatório foi gerado para seus casos ainda.
                      </td>
                    </tr>
                  ) : (
                    reports.map((rep) => (
                      <tr key={rep.id} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-6 py-4 font-mono text-xs text-primary font-bold">
                          {rep.id}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => onSelectCase(rep.caseId)}
                            className="font-semibold text-on-surface hover:text-primary transition-colors text-left text-xs max-w-[200px] block truncate"
                          >
                            {rep.caseName}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-secondary text-xs">
                          {rep.date}
                        </td>
                        <td className="px-6 py-4 text-secondary text-xs">
                          {rep.fileSize}
                        </td>
                        <td className="px-6 py-4 text-xs">
                          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>{rep.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => onDownloadReport(rep)}
                              className="bg-primary hover:bg-[#c5a059] text-on-primary font-bold px-3 py-1.5 rounded text-xs inline-flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                              title="Baixar Relatório PDF"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Baixar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View Report Cards */}
            <div className="grid grid-cols-1 gap-4 p-4 md:hidden font-sans">
              {reports.length === 0 ? (
                <div className="text-center py-8 text-outline text-xs">
                  Nenhum relatório foi gerado para seus casos ainda.
                </div>
              ) : (
                reports.map((rep) => (
                  <div 
                    key={rep.id} 
                    className="bg-surface-container-low border border-outline-variant/15 p-4 rounded-xl space-y-3 hover:border-primary/40 transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs text-primary font-bold">
                        Código: {rep.id}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px]">
                        <FileCheck className="w-3 h-3" />
                        <span>{rep.status}</span>
                      </span>
                    </div>

                    <div className="space-y-1 bg-surface-container-high/25 p-2.5 rounded-lg border border-outline-variant/10 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-secondary font-medium">Caso Associado:</span>
                        <button
                          onClick={() => onSelectCase(rep.caseId)}
                          className="font-bold text-on-surface hover:text-primary transition-colors text-right max-w-[150px] truncate"
                        >
                          {rep.caseName}
                        </button>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-secondary font-medium">Data de Emissão:</span>
                        <span className="text-on-surface font-medium">{rep.date}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-secondary font-medium">Tamanho do PDF:</span>
                        <span className="text-on-surface font-semibold">{rep.fileSize}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-outline-variant/10 text-right">
                      <button
                        onClick={() => onDownloadReport(rep)}
                        className="bg-primary hover:bg-[#c5a059] text-on-primary font-bold px-4 py-2 rounded-lg text-xs inline-flex items-center gap-1.5 transition-all active:scale-[0.98] w-full justify-center cursor-pointer"
                        title="Baixar Relatório PDF"
                      >
                        <Download className="w-4 h-4" />
                        <span>Baixar Relatório PDF</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="p-4 border-t border-outline-variant/15 bg-surface-container-high/15 text-[11px] text-outline text-right italic font-medium">
            Todos os PDFs gerados acompanham carimbos de validação de metadados das provas originais.
          </div>
        </section>

      </div>
    </div>
  );
}
