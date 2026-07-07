import React, { useState } from "react";
import { Case, EvidenceFile, FileCategory } from "../types";
import { 
  Calendar, 
  User, 
  Upload, 
  FileText, 
  Download, 
  ShieldCheck, 
  FileCheck, 
  ArrowLeft, 
  Image as ImageIcon, 
  MessageSquare, 
  Instagram, 
  Facebook, 
  Mail, 
  HelpCircle,
  FileCode,
  Sparkles,
  ExternalLink,
  Laptop,
  CheckCircle2
} from "lucide-react";
import { getBrowserAndOS } from "../utils";

interface CaseDetailsViewProps {
  activeCase: Case;
  files: EvidenceFile[];
  onFileUploads: (files: File[], category?: FileCategory) => Promise<void>;
  isUploading: boolean;
  onGoBack: () => void;
  onGenerateReport: (caseId: string) => void;
  onDownloadReport: (caseId: string) => void;
  hasReport: boolean;
  onStartPreservation?: (caseId: string, startDate: string, startTime: string, browser: string, os: string) => void;
  onAddCaseEvent?: (caseId: string, description: string) => void;
  onUpdateFileCategory?: (fileId: string, category: FileCategory | "") => void;
}

export default function CaseDetailsView({
  activeCase,
  files,
  onFileUploads,
  isUploading,
  onGoBack,
  onGenerateReport,
  onDownloadReport,
  hasReport,
  onStartPreservation,
  onAddCaseEvent,
  onUpdateFileCategory
}: CaseDetailsViewProps) {
  const caseFiles = files.filter(f => f.caseId === activeCase.id);
  const [selectedCategory, setSelectedCategory] = useState<FileCategory | "">("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await onFileUploads(Array.from(e.target.files), selectedCategory || undefined);
      e.target.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await onFileUploads(Array.from(e.dataTransfer.files), selectedCategory || undefined);
    }
  };

  const getEvidenceTypeIcon = (type: string) => {
    switch (type) {
      case "WhatsApp":
        return <MessageSquare className="w-5 h-5 text-emerald-400" />;
      case "Instagram":
        return <Instagram className="w-5 h-5 text-pink-400" />;
      case "Facebook":
        return <Facebook className="w-5 h-5 text-blue-400" />;
      case "E-mail":
        return <Mail className="w-5 h-5 text-amber-400" />;
      default:
        return <HelpCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
      return <ImageIcon className="w-5 h-5 text-primary" />;
    } else if (['mp3', 'wav', 'ogg'].includes(ext)) {
      return <FileCode className="w-5 h-5 text-emerald-400" />;
    } else if (['pdf', 'docx', 'txt', 'rtf'].includes(ext)) {
      return <FileText className="w-5 h-5 text-[#9a8f80]" />;
    }
    return <FileText className="w-5 h-5 text-[#d1c5b4]" />;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Back button and case details top bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onGoBack}
          className="text-secondary hover:text-primary p-2 hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-secondary text-sm font-medium">Voltar para a lista</span>
      </div>

      {/* Case Header Details Panel */}
      <section className="bg-surface-container rounded-xl border border-outline-variant/15 p-6 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-primary"></div>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-amber-500 font-mono text-[10px] font-bold bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {activeCase.atlasCode || "ATLAS-XXX"}
              </span>
              <span className="text-primary font-mono text-[10px] font-bold bg-primary/10 px-2.5 py-1 rounded border border-primary/20 uppercase">
                ID: {activeCase.id}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-secondary bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant/10">
                {getEvidenceTypeIcon(activeCase.evidenceType)}
                <span className="font-semibold">{activeCase.evidenceType}</span>
              </span>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                activeCase.status === "Concluído"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-primary/10 text-primary border-primary/20"
              }`}>
                {activeCase.status}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-on-surface">{activeCase.name}</h2>
            <p className="text-secondary text-sm leading-relaxed max-w-3xl">{activeCase.description}</p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-outline text-xs pt-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Registrado em: <strong className="text-on-surface-variant font-medium">{activeCase.date}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span>Responsável: <strong className="text-on-surface-variant font-medium">{activeCase.responsible}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={() => onGenerateReport(activeCase.id)}
              className="px-5 py-2.5 rounded-lg bg-primary hover:bg-[#c5a059] text-on-primary font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-lg shadow-primary/5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gerar Relatório</span>
            </button>

            <button
              onClick={() => onDownloadReport(activeCase.id)}
              disabled={!hasReport}
              className={`px-5 py-2.5 rounded-lg border font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                hasReport
                  ? "border-primary/40 text-primary bg-primary/5 hover:bg-primary/10 hover:border-primary"
                  : "border-outline-variant/20 text-[#9a8f80]/40 bg-surface-container-low cursor-not-allowed"
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Baixar Relatório</span>
            </button>
          </div>
        </div>
      </section>

      {/* PAINEL DE PRESERVAÇÃO ATLAS */}
      <section className="bg-surface-container rounded-xl border border-outline-variant/15 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-semibold text-base text-on-surface flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              Sessão de Preservação Factual
            </h3>
            <p className="text-secondary text-xs mt-0.5">
              Controle metodológico para o registro de evidências e integridade probatória do Caso {activeCase.atlasCode || activeCase.id}
            </p>
          </div>

          {activeCase.preservationSession?.started ? (
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 text-xs font-bold uppercase tracking-wider animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Sessão de Preservação Iniciada
            </div>
          ) : (
            <div className="text-outline text-xs font-semibold uppercase bg-surface-container-high px-3 py-1.5 rounded border border-outline-variant/10">
              Sessão Não Iniciada
            </div>
          )}
        </div>

        {activeCase.preservationSession?.started ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-outline font-bold uppercase tracking-wider block">Data de Início</span>
              <span className="text-xs font-semibold text-on-surface">{activeCase.preservationSession.startDate}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-outline font-bold uppercase tracking-wider block">Hora de Início</span>
              <span className="text-xs font-semibold text-on-surface">{activeCase.preservationSession.startTime}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-outline font-bold uppercase tracking-wider block">Sistema Operacional</span>
              <span className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-primary" />
                {activeCase.preservationSession.os}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-outline font-bold uppercase tracking-wider block">Navegador Local</span>
              <span className="text-xs font-semibold text-on-surface truncate block" title={activeCase.preservationSession.browser}>
                {activeCase.preservationSession.browser}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/5 text-center py-6 space-y-4">
            <p className="text-secondary text-xs max-w-xl mx-auto leading-relaxed">
              Para iniciar o registro forense, carregar arquivos categorizados e habilitar o rastreamento imutável de eventos deste caso sob a metodologia Atlas, clique no botão abaixo.
            </p>
            <button
              onClick={() => {
                const { browser, os } = getBrowserAndOS();
                const now = new Date();
                const d = now.toLocaleDateString("pt-BR");
                const t = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
                onStartPreservation?.(activeCase.id, d, t, browser, os);
              }}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs tracking-wider uppercase rounded-lg transition-all active:scale-95 cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Iniciar Preservação</span>
            </button>
          </div>
        )}

        {activeCase.preservationSession?.started && (
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-emerald-500/5 p-3.5 rounded-lg border border-emerald-500/10">
            <p className="text-secondary text-[11px] leading-relaxed flex-1">
              A metodologia Atlas está monitorando proativamente a integridade do caso. Para preservar conversações, perfis ou logins direto do WhatsApp Web, utilize o fluxo automatizado.
            </p>
            <button
              onClick={() => {
                const now = new Date();
                const d = now.toLocaleDateString("pt-BR");
                const t = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
                onAddCaseEvent?.(activeCase.id, `Acesso ao WhatsApp Web iniciado pelo usuário na aba secundária. Código Atlas: ${activeCase.atlasCode}`);
                window.open("https://web.whatsapp.com", "_blank", "noopener,noreferrer");
              }}
              className="px-5 py-2 font-bold text-xs text-white bg-[#075e54] hover:bg-[#128c7e] rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer w-full sm:w-auto"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir WhatsApp Web</span>
            </button>
          </div>
        )}
      </section>

      {/* Upload zone & uploaded files list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Drag and drop panel (span 5) */}
        <div className="lg:col-span-5 h-full">
          <div className="bg-surface-container rounded-xl border border-outline-variant/15 p-6 flex flex-col justify-between h-full min-h-[300px]">
            <h3 className="font-semibold text-base text-on-surface mb-3">Adicionar Arquivos de Prova</h3>
            
            {/* Category selection before uploading */}
            <div className="mb-3.5 space-y-1.5">
              <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                Definir Categoria para Ingestão (Opcional)
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as FileCategory | "")}
                className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface text-xs font-semibold rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="">Nenhuma Categoria (Geral)</option>
                <option value="QR Code">QR Code</option>
                <option value="Pós Login">Pós Login</option>
                <option value="Perfil">Perfil</option>
                <option value="Informações do Contato">Informações do Contato</option>
                <option value="Conversa">Conversa / Mensagens</option>
                <option value="Outros">Outras Evidências</option>
              </select>
            </div>
            
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`flex-1 border-2 border-dashed rounded-xl bg-surface-container-low/50 flex flex-col items-center justify-center p-6 text-center group cursor-pointer transition-all ${
                isUploading
                  ? "border-primary bg-primary/5 animate-pulse"
                  : "border-outline-variant/30 hover:border-primary/50 hover:bg-primary/10"
              }`}
            >
              <input
                type="file"
                id="case-file-uploader"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
                multiple
              />
              <label htmlFor="case-file-uploader" className="cursor-pointer flex flex-col items-center w-full py-4">
                <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-3 transition-transform group-hover:scale-115">
                  <Upload className="w-6 h-6 text-primary" />
                </div>

                {isUploading ? (
                  <>
                    <h4 className="font-bold text-on-surface text-sm mb-1 animate-bounce">Processando arquivo...</h4>
                    <p className="text-secondary text-[11px] px-2 max-w-xs">Garantindo integridade e registrando hash de preservação...</p>
                  </>
                ) : (
                  <>
                    <h4 className="font-bold text-on-surface text-sm mb-1">Arraste seus arquivos aqui</h4>
                    <p className="text-secondary text-[11px] px-2 max-w-xs">Ou clique para selecionar imagens, capturas de tela ou arquivos de mídia do dispositivo.</p>
                  </>
                )}
              </label>
            </div>

            <div className="mt-4 p-3 bg-slate-500/5 border border-slate-500/10 rounded-lg flex items-start gap-2.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-secondary text-[11px] leading-relaxed">
                Cada arquivo processado gera um identificador unívoco de hash SHA-256 e tem seu registro original marcado no sistema em tempo real de forma objetiva.
              </p>
            </div>
          </div>
        </div>

        {/* Files tabular list (span 7) */}
        <div className="lg:col-span-7 bg-surface-container border border-outline-variant/15 rounded-xl flex flex-col overflow-hidden justify-between">
          <div>
            <div className="p-6 border-b border-outline-variant/15 bg-surface-container-high/10 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-base text-on-surface">Arquivos Enviados</h3>
                <p className="text-xs text-secondary mt-0.5">Clique para carregar e gerenciar os itens anexados a este caso</p>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded border border-primary/20">
                {caseFiles.length} {caseFiles.length === 1 ? "Arquivo" : "Arquivos"}
              </span>
            </div>

            {/* Desktop View Table */}
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-high/35 border-b border-outline-variant/15 text-outline uppercase font-bold tracking-wider">
                    <th className="px-6 py-3.5">Nome de Arquivo</th>
                    <th className="px-6 py-3.5">Categoria</th>
                    <th className="px-6 py-3.5">Tamanho / Formato</th>
                    <th className="px-6 py-3.5">Hash SHA-256</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {caseFiles.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center text-outline">
                        <FileCheck className="w-10 h-10 text-outline/50 mx-auto mb-3" />
                        Nenhum arquivo enviado a este caso ainda.
                      </td>
                    </tr>
                  ) : (
                    caseFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {getFileIcon(file.name)}
                            <div>
                              <p className="font-semibold text-on-surface text-sm max-w-[180px] truncate" title={file.name}>
                                {file.name}
                              </p>
                              <p className="text-[11px] text-outline mt-0.5 font-normal">
                                {file.date} {file.uploadTime ? `às ${file.uploadTime}` : ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={file.category || ""}
                            onChange={(e) => onUpdateFileCategory?.(file.id, e.target.value as FileCategory)}
                            className="bg-surface-container-low border border-outline-variant/30 text-on-surface rounded px-2 py-1 text-xs focus:ring-1 focus:ring-primary focus:border-primary font-medium cursor-pointer"
                          >
                            <option value="">Sem Marcador</option>
                            <option value="QR Code">QR Code</option>
                            <option value="Pós Login">Pós Login</option>
                            <option value="Perfil">Perfil</option>
                            <option value="Informações do Contato">Informações do Contato</option>
                            <option value="Conversa">Conversa</option>
                            <option value="Outros">Outros</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-on-surface font-medium">{file.size}</p>
                          <p className="text-[11px] text-outline mt-0.5 font-semibold uppercase">{file.type.split("/").pop()}</p>
                        </td>
                        <td className="px-6 py-4 font-mono text-[10px] text-primary select-all">
                          {file.hash ? `${file.hash.slice(0, 10)}...${file.hash.slice(-10)}` : "calculando..."}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View File Cards */}
            <div className="grid grid-cols-1 gap-3 p-4 md:hidden font-sans">
              {caseFiles.length === 0 ? (
                <div className="text-center py-8 text-outline text-xs">
                  <FileCheck className="w-8 h-8 text-outline/30 mx-auto mb-2" />
                  Nenhum arquivo enviado a este caso ainda.
                </div>
              ) : (
                caseFiles.map((file) => (
                  <div 
                    key={file.id} 
                    className="bg-surface-container-low border border-outline-variant/15 p-3.5 rounded-xl space-y-3 hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      {getFileIcon(file.name)}
                      <div className="min-w-0">
                        <p className="font-bold text-on-surface text-sm break-all leading-snug" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-[11px] text-outline mt-0.5">{file.date} {file.uploadTime ? `às ${file.uploadTime}` : ""}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-outline font-bold uppercase tracking-wider block">Categoria do Arquivo</span>
                      <select
                        value={file.category || ""}
                        onChange={(e) => onUpdateFileCategory?.(file.id, e.target.value as FileCategory)}
                        className="w-full bg-surface-container/30 border border-outline-variant/30 text-on-surface rounded-lg p-2 text-xs font-semibold focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
                      >
                        <option value="">Sem Marcador (Geral)</option>
                        <option value="QR Code">QR Code</option>
                        <option value="Pós Login">Pós Login</option>
                        <option value="Perfil">Perfil</option>
                        <option value="Informações do Contato">Informações do Contato</option>
                        <option value="Conversa">Conversa</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-surface-container/20 p-2 rounded-lg border border-outline-variant/5">
                      <span className="text-secondary font-medium">Tamanho / Formato:</span>
                      <span className="text-on-surface font-semibold">{file.size} <span className="text-outline uppercase font-bold">({file.type.split("/").pop()})</span></span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-outline font-bold uppercase tracking-wider block">Assinatura SHA-256</span>
                      <div 
                        title="Clique de cópia rápida"
                        onClick={() => {
                          if (file.hash) {
                            navigator.clipboard.writeText(file.hash);
                            alert("Hash SHA-256 copiado para a área de transferência:\n" + file.hash);
                          }
                        }}
                        className="flex items-center justify-between gap-1.5 font-mono text-[10px] bg-surface-container-high border border-outline-variant/30 rounded-lg p-2 cursor-pointer hover:bg-surface-container-highest transition-all active:scale-[0.98] select-all w-full"
                      >
                        <span className="font-bold break-all leading-normal text-primary select-all">
                          {file.hash || "calculando..."}
                        </span>
                        <span className="text-outline shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style={{ flexShrink: 0 }}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 border-t border-outline-variant/15 bg-surface-container-high/15 text-[11px] text-outline flex justify-between items-center">
            <span>Listando {caseFiles.length} de {caseFiles.length} arquivos preservados</span>
            <span className="text-secondary italic">Preservação protegida por Algoritmo de Integridade</span>
          </div>
        </div>

      </div>

      {/* Forensic Audit Log / Atlas Timeline */}
      <section className="bg-surface-container rounded-xl border border-outline-variant/15 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/10 pb-3">
          <div>
            <h3 className="font-semibold text-base text-on-surface">Histórico de Preservação (Espinha Dorsal Atlas)</h3>
            <p className="text-secondary text-xs mt-0.5">Logs cronológicos e auditáveis de todas as ações e evidências registradas</p>
          </div>
          <span className="text-[9px] font-mono tracking-widest font-bold text-amber-700 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30 uppercase">
            Causalidade Segura ✓
          </span>
        </div>

        <div className="relative border-l-2 border-outline-variant/30 ml-4 py-2 space-y-5">
          {activeCase.events && activeCase.events.length > 0 ? (
            [...activeCase.events].reverse().map((ev, idx) => (
              <div key={idx} className="relative pl-6 animate-fadeIn">
                {/* Node indicator badge styled forensically */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#1e1b18] border-2 border-amber-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                </div>
                
                <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-4 space-y-1 hover:border-amber-500/10 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-amber-600">Registro: {ev.date} às {ev.time}</span>
                    <span className="text-[9px] font-mono font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-surface-container-highest border border-outline-variant/10 text-outline">
                      SEQ-#{activeCase.events!.length - idx} • VÁLIDO
                    </span>
                  </div>
                  <p className="text-on-surface text-xs font-medium leading-relaxed">{ev.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="pl-6 text-outline italic text-xs">
              Nenhuma ação ou evento de preservação capturado. Adicione provas ou inicie a sessão metodológica Atlas para registrar o histórico factual.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
