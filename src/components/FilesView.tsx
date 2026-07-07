import React, { useState } from "react";
import { Case, EvidenceFile } from "../types";
import { File, Search, ExternalLink, Image as ImageIcon, FileText, FileCode, Check, Copy } from "lucide-react";

interface FilesViewProps {
  files: EvidenceFile[];
  cases: Case[];
  onSelectCase: (caseId: string) => void;
}

export default function FilesView({ files, cases, onSelectCase }: FilesViewProps) {
  const [search, setSearch] = useState("");
  const [selectedCaseFilter, setSelectedCaseFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(search.toLowerCase()) || 
                          file.hash.toLowerCase().includes(search.toLowerCase());
    const matchesCase = selectedCaseFilter === "all" || file.caseId === selectedCaseFilter;
    return matchesSearch && matchesCase;
  });

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
      return <ImageIcon className="w-5 h-5 text-primary" />;
    } else if (['mp3', 'wav', 'ogg'].includes(ext)) {
      return <FileCode className="w-5 h-5 text-emerald-400" />;
    }
    return <FileText className="w-5 h-5 text-[#9a8f80]" />;
  };

  const handleCopyHash = (fileId: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(fileId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-on-surface">Arquivos de Evidência</h2>
        <p className="text-secondary text-sm mt-1">Busque e gerencie todos os arquivos de fatos e mídias depositados em todos os casos.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search Input Container */}
        <div className="relative w-full sm:max-w-xs group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome do arquivo ou hash..."
            className="w-full bg-surface-container border border-outline-variant/30 rounded-lg pl-9 pr-4 py-2 text-sm text-on-surface placeholder:text-outline/40 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-sans"
          />
        </div>

        {/* Case Filter Selector */}
        <div className="w-full sm:w-auto font-sans">
          <select 
            value={selectedCaseFilter}
            onChange={(e) => setSelectedCaseFilter(e.target.value)}
            className="w-full sm:w-auto bg-surface-container border border-outline-variant/30 rounded-lg px-4 py-2 text-sm text-on-surface focus:border-primary outline-none"
          >
            <option value="all">Filtro: Todos os Casos</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Files Table Section */}
      <div className="bg-surface-container rounded-xl border border-outline-variant/15 overflow-hidden">
        {/* Desktop View Table */}
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="bg-surface-container-high/40 border-b border-outline-variant/15 text-outline uppercase font-bold tracking-wider">
                <th className="px-6 py-4">Arquivo</th>
                <th className="px-6 py-4">Caso Associado</th>
                <th className="px-6 py-4">Preservado em</th>
                <th className="px-6 py-4">Tamanho</th>
                <th className="px-6 py-4">Assinatura / Hash SHA-256</th>
                <th className="px-6 py-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-outline">
                    Não encontramos arquivos com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.name)}
                        <div>
                          <p className="font-semibold text-on-surface text-sm max-w-[180px] truncate" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-[11px] text-outline mt-0.5">{file.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-secondary text-sm font-semibold">
                      <button
                        onClick={() => onSelectCase(file.caseId)}
                        className="hover:text-primary transition-colors text-left font-semibold cursor-pointer max-w-[180px] block truncate"
                        title="Ir para os detalhes do caso"
                      >
                        {file.caseName || cases.find(c => c.id === file.caseId)?.name || "Caso Desconhecido"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-secondary text-sm">
                      {file.date}
                    </td>
                    <td className="px-6 py-4 text-on-surface font-medium text-sm">
                      {file.size}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-mono text-[11px] bg-surface-container-low px-2.5 py-1 rounded border border-outline-variant/10 w-fit">
                        <span>{file.hash.slice(0, 10)}...{file.hash.slice(-6)}</span>
                        <button 
                          onClick={() => handleCopyHash(file.id, file.hash)}
                          className="text-[#9a8f80] hover:text-primary transition-colors focus:outline-none cursor-pointer"
                        >
                          {copiedId === file.id ? (
                            <Check className="w-3.5 h-3.5 text-green-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onSelectCase(file.caseId)}
                        className="text-primary hover:text-[#c5a059] font-bold flex items-center gap-1 hover:underline text-xs ml-auto cursor-pointer"
                      >
                        Ver Caso
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View File Cards */}
        <div className="grid grid-cols-1 gap-4 p-4 md:hidden font-sans">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-8 text-outline text-xs">
              Não encontramos arquivos com os filtros aplicados.
            </div>
          ) : (
            filteredFiles.map((file) => (
              <div 
                key={file.id} 
                className="bg-surface-container-low border border-outline-variant/15 p-4 rounded-xl space-y-4 hover:border-primary/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(file.name)}
                  <div className="min-w-0">
                    <p className="font-bold text-on-surface text-sm break-all leading-snug" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[11px] text-outline mt-0.5 uppercase tracking-wider font-semibold">{file.type.split("/").pop()}</p>
                  </div>
                </div>

                <div className="space-y-1 bg-surface-container-high/25 p-2.5 rounded-lg border border-outline-variant/5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-secondary font-medium">Caso Associado:</span>
                    <button
                      onClick={() => onSelectCase(file.caseId)}
                      className="text-primary hover:underline font-bold max-w-[150px] truncate"
                    >
                      {file.caseName || cases.find(c => c.id === file.caseId)?.name || "Caso Desconhecido"}
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-secondary font-medium">Preservado em:</span>
                    <span className="text-on-surface font-medium">{file.date}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-secondary font-medium">Tamanho:</span>
                    <span className="text-on-surface font-semibold">{file.size}</span>
                  </div>
                </div>

                {/* Highly readable easy-copy SHA-256 block */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-outline font-bold uppercase tracking-wider block">Assinatura SHA-256</span>
                  <div 
                    title="Clique para copiar"
                    onClick={() => handleCopyHash(file.id, file.hash)}
                    className="flex items-center justify-between gap-2 font-mono text-[10.5px] bg-surface-container border border-outline-variant/20 rounded-lg p-2.5 cursor-pointer hover:bg-surface-container-high hover:border-primary/30 transition-all select-all active:scale-[0.98]"
                  >
                    <span className="font-bold break-all leading-normal text-primary select-all">
                      {file.hash}
                    </span>
                    <span className="text-outline hover:text-primary shrink-0 transition-colors">
                      {copiedId === file.id ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-outline-variant/10 text-right">
                  <button
                    onClick={() => onSelectCase(file.caseId)}
                    className="text-primary hover:text-[#c5a059] font-bold inline-flex items-center gap-1 text-xs"
                  >
                    Abrir Caso
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
