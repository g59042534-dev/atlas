import React from "react";
import { 
  X, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  ShieldAlert, 
  FileText, 
  Image as ImageIcon, 
  FileCode, 
  HelpCircle,
  Clock,
  Check
} from "lucide-react";

export interface BatchUploadFile {
  name: string;
  size: string;
  status: "pending" | "hashing" | "registering" | "completed" | "duplicate" | "error";
  progress: number;
  hash?: string;
}

interface BatchUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: BatchUploadFile[];
  summary: {
    successCount: number;
    duplicateCount: number;
    ignoredNames: string[];
    isFinished: boolean;
  } | null;
}

export default function BatchUploadModal({
  isOpen,
  onClose,
  files,
  summary
}: BatchUploadModalProps) {
  if (!isOpen) return null;

  // Calculate overall progress across all files
  const totalProgressSum = files.reduce((acc, f) => acc + f.progress, 0);
  const overallProgress = files.length > 0 ? Math.round(totalProgressSum / files.length) : 0;

  // Count files by status
  const completedCount = files.filter(f => f.status === "completed").length;
  const duplicateCount = files.filter(f => f.status === "duplicate").length;
  const processingCount = files.filter(f => f.status === "hashing" || f.status === "registering").length;
  const pendingCount = files.filter(f => f.status === "pending").length;

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) {
      return <ImageIcon className="w-5 h-5 text-primary shrink-0" />;
    } else if (["mp3", "wav", "ogg"].includes(ext)) {
      return <FileCode className="w-5 h-5 text-emerald-400 shrink-0" />;
    } else if (["pdf", "docx", "txt", "rtf"].includes(ext)) {
      return <FileText className="w-5 h-5 text-[#9a8f80] shrink-0" />;
    }
    return <HelpCircle className="w-5 h-5 text-secondary shrink-0" />;
  };

  const getStatusBadge = (status: BatchUploadFile["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center gap-1.5 text-xs text-[#9a8f80]/70 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>Na fila</span>
          </span>
        );
      case "hashing":
        return (
          <span className="flex items-center gap-1.5 text-xs text-primary font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Gerando Hash SHA-256...</span>
          </span>
        );
      case "registering":
        return (
          <span className="flex items-center gap-1.5 text-xs text-primary/80 font-medium font-bold">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Registrando...</span>
          </span>
        );
      case "completed":
        return (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <Check className="w-3.5 h-3.5" />
            <span>Processado</span>
          </span>
        );
      case "duplicate":
        return (
          <span className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Ignorado (Duplicado)</span>
          </span>
        );
      case "error":
        return (
          <span className="flex items-center gap-1.5 text-xs text-error font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Falha de leitura</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans animate-fadeIn">
      <div className="bg-surface-container border border-outline-variant/20 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header section with overall speed title */}
        <div className="px-6 py-4 bg-surface-container-high/60 border-b border-outline-variant/15 flex justify-between items-center text-on-surface">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/25">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">Processando Lote de Evidências</h3>
              <p className="text-xs text-secondary">
                {summary && summary.isFinished 
                  ? "Processamento de lote finalizado" 
                  : `Processamento paralelo • ${files.length} arquivo(s) em lote`}
              </p>
            </div>
          </div>
          {summary && summary.isFinished && (
            <button 
              onClick={onClose} 
              className="p-1 px-2.5 py-1 text-xs text-secondary hover:text-white rounded bg-surface-container hover:bg-surface-container-highest cursor-pointer border border-outline-variant/10"
            >
              Fechar
            </button>
          )}
        </div>

        {/* Scrollable contents zone */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Progress indicators panel */}
          <div className="bg-surface-container-low border border-outline-variant/15 p-5 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-on-surface">Progresso Geral do Lote</span>
              <span className="text-sm font-mono font-bold text-primary">{overallProgress}%</span>
            </div>

            {/* Combined progress bar */}
            <div className="w-full bg-surface-container-high rounded-full h-3 overflow-hidden border border-outline-variant/10">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-300" 
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-2 text-center border-t border-outline-variant/10 text-[11px] text-[#9a8f80]">
              <div>
                <p className="font-mono text-xs font-bold text-secondary">{files.length}</p>
                <p className="opacity-70">Total</p>
              </div>
              <div>
                <p className="font-mono text-xs font-bold text-emerald-400">{completedCount}</p>
                <p className="text-emerald-400 opacity-90">Preservados</p>
              </div>
              <div>
                <p className="font-mono text-xs font-bold text-amber-400">{duplicateCount}</p>
                <p className="text-amber-400 opacity-90">Duplicados</p>
              </div>
              <div>
                <p className="font-mono text-xs font-bold text-primary">{processingCount + pendingCount}</p>
                <p className="opacity-70">Restantes</p>
              </div>
            </div>
          </div>

          {/* Results Summary banner - Shown when finished */}
          {summary && summary.isFinished && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-primary tracking-widest uppercase border-b border-outline-variant/10 pb-1">
                Relatório de Processamento
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Success Card */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-emerald-400 text-sm">Upload Concluído</h4>
                    <p className="text-xs text-secondary mt-1">
                      <strong>{summary.successCount}</strong> arquivo(s) processado(s) com sucesso. Algoritmo de hash SHA-256 executado localmente.
                    </p>
                  </div>
                </div>

                {/* Duplicates Card */}
                <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-400 text-sm">Controle de Duplicidade</h4>
                    <p className="text-xs text-secondary mt-1">
                      <strong>{summary.duplicateCount}</strong> arquivo(s) ignorado(s) por duplicidade. Integridade mantida.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ignored duplicates list details */}
              {summary.duplicateCount > 0 && (
                <div className="bg-surface-container-low border border-outline-variant/15 rounded-xl p-4 space-y-2">
                  <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                    Lista de Arquivos Ignorados (Já Existentes no Caso)
                  </div>
                  <ul className="divide-y divide-outline-variant/10 max-h-[120px] overflow-y-auto text-xs pr-1">
                    {summary.ignoredNames.map((name, index) => (
                      <li key={index} className="py-2 flex justify-between items-center text-secondary">
                        <span className="truncate max-w-[80%] font-semibold text-[11px]" title={name}>
                          {name}
                        </span>
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono font-medium">
                          Este arquivo já foi preservado neste caso.
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Individual items checklist */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-secondary tracking-widest uppercase border-b border-outline-variant/10 pb-1">
              Fila de Ingestão de Provas
            </div>
            
            <div className="max-h-[220px] overflow-y-auto border border-outline-variant/10 rounded-xl divide-y divide-outline-variant/10 bg-surface-container-low/45">
              {files.map((file, i) => (
                <div key={i} className="p-3 bg-surface-container-low flex flex-col gap-2 transition-colors">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3 truncate">
                      {getFileIcon(file.name)}
                      <div className="truncate">
                        <p className="text-xs font-bold text-on-surface truncate" title={file.name}>{file.name}</p>
                        <p className="text-[10px] text-outline font-medium mt-0.5">{file.size}</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {getStatusBadge(file.status)}
                    </div>
                  </div>

                  {/* Individual mini progress bar */}
                  {file.status !== "completed" && file.status !== "duplicate" && file.status !== "error" && (
                    <div className="w-full bg-surface-container-high rounded-full h-1 overflow-hidden mt-1">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-150" 
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>
                  )}

                  {file.hash && (
                    <div className="text-[9px] font-mono bg-surface-container rounded p-1 text-primary break-all border border-outline-variant/5">
                      SHA-256: <span className="font-semibold text-secondary">{file.hash}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal footer screen */}
        <div className="px-6 py-4 bg-surface-container-high/60 border-t border-outline-variant/15 flex justify-end gap-3">
          {summary && summary.isFinished ? (
            <button
              onClick={onClose}
              id="confirm-batch-upload-btn"
              className="bg-primary hover:bg-[#c5a059] text-on-primary text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg border-none cursor-pointer transition-all active:scale-95 shadow-md shadow-primary/10"
            >
              Concluir e Fechar
            </button>
          ) : (
            <div className="flex items-center gap-2.5 text-xs text-secondary font-medium">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span>Protegendo cadeia de custódia...</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
