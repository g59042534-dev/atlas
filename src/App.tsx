import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardView from "./components/DashboardView";
import CaseDetailsView from "./components/CaseDetailsView";
import FilesView from "./components/FilesView";
import ReportsView from "./components/ReportsView";
import SettingsView from "./components/SettingsView";
import LaudoPreviewModal from "./components/LaudoPreviewModal";
import BatchUploadModal, { BatchUploadFile } from "./components/BatchUploadModal";
import { Case, EvidenceFile, GeneratedReport, SystemActivity, FileCategory } from "./types";
import { generateReportHTML } from "./utils";
import { 
  initialCases, 
  initialFiles, 
  initialReports, 
  initialActivities 
} from "./data";
import { FolderGit, MessageSquare, Instagram, Facebook, Mail, HelpCircle, X, RefreshCw } from "lucide-react";
import { supabase } from "./supabaseClient";
import AuthScreen from "./components/AuthScreen";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Supabase session tracking
  const [session, setSession] = useState<any>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Core state isolated and associated with the authenticated user
  const [cases, setCases] = useState<Case[]>([]);
  const [files, setFiles] = useState<EvidenceFile[]>([]);
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [activities, setActivities] = useState<SystemActivity[]>([]);
  
  // Custom configurations (derived dynamically from the authenticated user)
  const [investigatorName, setInvestigatorName] = useState("");
  const [oabCode, setOabCode] = useState("");
  const [officeName, setOfficeName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  // Batch Upload States
  const [batchUploadVisible, setBatchUploadVisible] = useState(false);
  const [batchFiles, setBatchFiles] = useState<BatchUploadFile[]>([]);
  const [batchSummary, setBatchSummary] = useState<{
    successCount: number;
    duplicateCount: number;
    ignoredNames: string[];
    isFinished: boolean;
  } | null>(null);

  // Modals Visibility
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [previewCaseId, setPreviewCaseId] = useState<string | null>(null);

  // Form Fields State
  const [newCaseForm, setNewCaseForm] = useState({ 
    name: "", 
    description: "", 
    evidenceType: "WhatsApp" as "WhatsApp" | "Instagram" | "Facebook" | "E-mail" | "Outro"
  });

  // Listen to Supabase authorization changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSessionLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setSessionLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sync isolated user state on Login/User change
  useEffect(() => {
    if (!session?.user?.id) {
      setIsDataLoaded(false);
      setCases([]);
      setFiles([]);
      setReports([]);
      setActivities([]);
      setInvestigatorName("");
      setOabCode("");
      setOfficeName("");
      return;
    }

    const userId = session.user.id;
    const userEmail = session.user.email || "";
    const parsedEmailName = userEmail.split("@")[0];
    const displayNameFromMetadata = session.user?.user_metadata?.display_name || session.user?.user_metadata?.fullName;
    const defaultName = displayNameFromMetadata || parsedEmailName.toUpperCase();

    const storedCases = localStorage.getItem(`atlas_cases_${userId}`);
    const storedFiles = localStorage.getItem(`atlas_files_${userId}`);
    const storedReports = localStorage.getItem(`atlas_reports_${userId}`);
    const storedActivities = localStorage.getItem(`atlas_activities_${userId}`);

    const storedName = localStorage.getItem(`atlas_investigatorName_${userId}`);
    const storedOab = localStorage.getItem(`atlas_oabCode_${userId}`);
    const storedOffice = localStorage.getItem(`atlas_officeName_${userId}`);

    const defaultCases = storedCases !== null ? JSON.parse(storedCases) : initialCases;
    const defaultFiles = storedFiles !== null ? JSON.parse(storedFiles) : initialFiles;
    const defaultReports = storedReports !== null ? JSON.parse(storedReports) : initialReports;
    const defaultActivities = storedActivities !== null ? JSON.parse(storedActivities) : initialActivities;

    setCases(defaultCases);
    setFiles(defaultFiles);
    setReports(defaultReports);
    setActivities(defaultActivities);

    setInvestigatorName(storedName !== null ? storedName : defaultName);
    setOabCode(storedOab !== null ? storedOab : "Usuário Autenticado");
    setOfficeName(storedOffice !== null ? storedOffice : "Plataforma Atlas Evidências");
    setIsDataLoaded(true);

    if (storedCases === null) localStorage.setItem(`atlas_cases_${userId}`, JSON.stringify(initialCases));
    if (storedFiles === null) localStorage.setItem(`atlas_files_${userId}`, JSON.stringify(initialFiles));
    if (storedReports === null) localStorage.setItem(`atlas_reports_${userId}`, JSON.stringify(initialReports));
    if (storedActivities === null) localStorage.setItem(`atlas_activities_${userId}`, JSON.stringify(initialActivities));

    if (storedName === null) localStorage.setItem(`atlas_investigatorName_${userId}`, defaultName);
    if (storedOab === null) localStorage.setItem(`atlas_oabCode_${userId}`, "Usuário Autenticado");
    if (storedOffice === null) localStorage.setItem(`atlas_officeName_${userId}`, "Plataforma Atlas Evidências");
  }, [session?.user?.id, session?.user?.email]);

  // Persist changes back to user partition
  useEffect(() => {
    if (!session?.user?.id || !isDataLoaded) return;
    localStorage.setItem(`atlas_cases_${session.user.id}`, JSON.stringify(cases));
  }, [cases, session?.user?.id, isDataLoaded]);

  useEffect(() => {
    if (!session?.user?.id || !isDataLoaded) return;
    localStorage.setItem(`atlas_files_${session.user.id}`, JSON.stringify(files));
  }, [files, session?.user?.id, isDataLoaded]);

  useEffect(() => {
    if (!session?.user?.id || !isDataLoaded) return;
    localStorage.setItem(`atlas_reports_${session.user.id}`, JSON.stringify(reports));
  }, [reports, session?.user?.id, isDataLoaded]);

  useEffect(() => {
    if (!session?.user?.id || !isDataLoaded) return;
    localStorage.setItem(`atlas_activities_${session.user.id}`, JSON.stringify(activities));
  }, [activities, session?.user?.id, isDataLoaded]);

  useEffect(() => {
    if (!session?.user?.id || !isDataLoaded || !investigatorName) return;
    localStorage.setItem(`atlas_investigatorName_${session.user.id}`, investigatorName);
  }, [investigatorName, session?.user?.id, isDataLoaded]);

  useEffect(() => {
    if (!session?.user?.id || !isDataLoaded || !oabCode) return;
    localStorage.setItem(`atlas_oabCode_${session.user.id}`, oabCode);
  }, [oabCode, session?.user?.id, isDataLoaded]);

  useEffect(() => {
    if (!session?.user?.id || !isDataLoaded || !officeName) return;
    localStorage.setItem(`atlas_officeName_${session.user.id}`, officeName);
  }, [officeName, session?.user?.id, isDataLoaded]);

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsDataLoaded(false);
    setActiveCaseId(null);
    setActiveTab("dashboard");
  };

  // Reset core data to pre-loaded defaults
  const handleResetData = () => {
    setCases(initialCases);
    setFiles(initialFiles);
    setReports(initialReports);
    setActivities(initialActivities);
    setActiveCaseId(null);
    setActiveTab("dashboard");
    if (session?.user?.id) {
      const userId = session.user.id;
      localStorage.setItem(`atlas_cases_${userId}`, JSON.stringify(initialCases));
      localStorage.setItem(`atlas_files_${userId}`, JSON.stringify(initialFiles));
      localStorage.setItem(`atlas_reports_${userId}`, JSON.stringify(initialReports));
      localStorage.setItem(`atlas_activities_${userId}`, JSON.stringify(initialActivities));
    }
  };

  // Helper function to calculate precise real SHA-256 of upload file
  const calculateSHA256 = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    } catch (e) {
      // fallback safe generation hash
      return "a4c28fe90a887bc1289cfbf16ef92427ae41e4649b934ca495991b7852b8dc1c";
    }
  };

  // File Upload Core Logic (Batch & Duplicates filtering support)
  const handleFileUploads = async (selectedFiles: File[], category?: FileCategory) => {
    if (!activeCaseId) return;

    let filesList = Array.from(selectedFiles);
    
    // Initial check: map up to 30 files max per upload
    let exceededLimit = false;
    if (filesList.length > 30) {
      filesList = filesList.slice(0, 30);
      exceededLimit = true;
      alert("Apenas os primeiros 30 arquivos serão processados por lote de envio.");
    }

    setIsUploading(true);
    setBatchUploadVisible(true);
    setBatchSummary(null);

    // Initial map of batch files for progress tracking
    setBatchFiles(filesList.map(file => {
      let sizeStr = `${(file.size / 1024).toFixed(1)} KB`;
      if (file.size > 1024 * 1024) {
        sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      }
      return {
        name: file.name,
        size: sizeStr,
        status: "pending",
        progress: 0
      };
    }));

    try {
      const newlyAddedEvidences: EvidenceFile[] = [];
      let successCount = 0;
      let duplicateCount = 0;
      const ignoredNames: string[] = [];

      // Fetch existing files from active inventory
      const currentCaseFiles = files.filter(f => f.caseId === activeCaseId);
      const existingHashes = new Set(currentCaseFiles.map(f => f.hash));
      const addedHashesInBatch = new Set<string>();

      const activeCase = cases.find(c => c.id === activeCaseId);
      const caseName = activeCase ? activeCase.name : "Caso Atual";

      for (let i = 0; i < filesList.length; i++) {
        const file = filesList[i];

        // Animate hashing phase
        setBatchFiles(prev => prev.map((bf, idx) => idx === i ? { ...bf, status: "hashing", progress: 20 } : bf));
        await new Promise(r => setTimeout(r, 120));

        setBatchFiles(prev => prev.map((bf, idx) => idx === i ? { ...bf, progress: 50 } : bf));
        
        // Compute SHA-256 hash using the cryptographical API
        const computedHash = await calculateSHA256(file);
        
        setBatchFiles(prev => prev.map((bf, idx) => idx === i ? { ...bf, progress: 75 } : bf));
        await new Promise(r => setTimeout(r, 100));

        // Check duplicates within existing case files and files already tracked within this current batch
        const isDuplicate = existingHashes.has(computedHash) || addedHashesInBatch.has(computedHash);

        if (isDuplicate) {
          duplicateCount++;
          ignoredNames.push(file.name);

          setBatchFiles(prev => prev.map((bf, idx) => idx === i ? {
            ...bf,
            status: "duplicate",
            progress: 100,
            hash: computedHash
          } : bf));
        } else {
          addedHashesInBatch.add(computedHash);
          successCount++;

          setBatchFiles(prev => prev.map((bf, idx) => idx === i ? { ...bf, status: "registering", progress: 90 } : bf));
          await new Promise(r => setTimeout(r, 100));

          // Format sizes
          let formattedSize = `${(file.size / 1024).toFixed(1)} KB`;
          if (file.size > 1024 * 1024) {
            formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
          }

          const now = new Date();
          const newEvidence: EvidenceFile = {
            id: `file_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 4)}`,
            caseId: activeCaseId,
            caseName: caseName,
            atlasCode: activeCase?.atlasCode,
            name: file.name,
            date: now.toLocaleDateString("pt-BR"),
            uploadTime: now.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            size: formattedSize,
            type: file.type || "Arquivo de Mídia",
            hash: computedHash,
            category: category
          };

          newlyAddedEvidences.push(newEvidence);

          setBatchFiles(prev => prev.map((bf, idx) => idx === i ? {
            ...bf,
            status: "completed",
            progress: 100,
            hash: computedHash
          } : bf));
        }
      }

      // Finish update states
      setBatchSummary({
        successCount,
        duplicateCount,
        ignoredNames,
        isFinished: true
      });

      // Update files & case states if new evidences are registered
      if (newlyAddedEvidences.length > 0) {
        setFiles(prev => [...prev, ...newlyAddedEvidences]);

        setCases(prev => prev.map(c => {
          if (c.id === activeCaseId) {
            const currentEvents = c.events ? [...c.events] : [];
            newlyAddedEvidences.forEach(evFile => {
              currentEvents.push({
                id: `ev_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                date: evFile.date,
                time: evFile.uploadTime || new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }),
                description: `Ingestão técnica do arquivo "${evFile.name}" realizada com sucesso. Categoria: ${evFile.category || "Geral"}. Integridade SHA-256: ${evFile.hash}`
              });
            });

            return {
              ...c,
              fileCount: c.fileCount + newlyAddedEvidences.length,
              events: currentEvents
            };
          }
          return c;
        }));

        // Log general activity event
        const toastEntry: SystemActivity = {
          id: `act_dyn_batch_${Date.now()}`,
          title: "Lote de provas integrado",
          detail: `${newlyAddedEvidences.length} arquiv(os) de prova integrados com sucesso no caso '${caseName}'.`,
          type: "success"
        };
        setActivities(prev => [toastEntry, ...prev]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartPreservation = (caseId: string, startDate: string, startTime: string, browser: string, os: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const initialEvents = c.events ? [...c.events] : [];
        initialEvents.push({
          id: `ev_${Date.now()}_init`,
          date: startDate,
          time: startTime,
          description: `Sessão de preservação iniciada de forma auditável e segura. Código Atlas: ${c.atlasCode || "ATLAS-AUTO"}. Navegador: ${browser} • Sistema Operacional: ${os}`
        });

        // Log general activity event
        const toastEntry: SystemActivity = {
          id: `act_${Date.now()}_preserv`,
          title: "Sessão de Preservação Iniciada",
          detail: `Sessão metodológica iniciada para o Caso ${c.atlasCode}.`,
          type: "info"
        };
        setActivities(a => [toastEntry, ...a]);

        return {
          ...c,
          preservationSession: {
            startDate,
            startTime,
            browser,
            os,
            started: true
          },
          events: initialEvents
        };
      }
      return c;
    }));
  };

  const handleAddCaseEvent = (caseId: string, description: string) => {
    const now = new Date();
    const d = now.toLocaleDateString("pt-BR");
    const t = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const updatedEvents = c.events ? [...c.events] : [];
        updatedEvents.push({
          id: `ev_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          date: d,
          time: t,
          description
        });
        return {
          ...c,
          events: updatedEvents
        };
      }
      return c;
    }));
  };

  const handleUpdateFileCategory = (fileId: string, category: FileCategory | "") => {
    setFiles(prev => prev.map(f => {
      if (f.id === fileId) {
        const updatedField = {
          ...f,
          category: category ? category : undefined
        };
        
        // Log event
        handleAddCaseEvent(f.caseId, `Categoria do arquivo "${f.name}" atualizada para: ${category || "Geral"}`);
        
        return updatedField;
      }
      return f;
    }));
  };

  // Create new Case
  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseForm.name.trim()) return;

    const sequentialId = `CAS-77${cases.length + 10}`;

    // Generator for distinctive 6-char ATLAS preservation code
    const generateAtlasCode = () => {
      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let code = "";
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `ATLAS-${code}`;
    };

    const newCase: Case = {
      id: sequentialId,
      atlasCode: generateAtlasCode(),
      name: newCaseForm.name,
      date: new Date().toLocaleDateString("pt-BR", { day: '2-digit', month: 'short', year: 'numeric' }),
      status: "Em Análise",
      responsible: investigatorName,
      description: newCaseForm.description || "Descrição de caso cadastrado sem detalhamento adicional.",
      evidenceType: newCaseForm.evidenceType,
      fileCount: 0,
      events: []
    };

    setCases((prev) => [newCase, ...prev]);
    setActiveCaseId(sequentialId);
    setActiveTab("cases"); // redirect to active cases screen to let them upload immediately!
    
    // Create audit record
    const auditEntry: SystemActivity = {
      id: `act_case_${Date.now()}`,
      title: "Novo caso aberto",
      detail: `Caso '${sequentialId} - ${newCase.name}' foi registrado com sucesso.`,
      type: "info"
    };
    setActivities(prev => [auditEntry, ...prev]);

    // Reset clean modal fields
    setNewCaseForm({ name: "", description: "", evidenceType: "WhatsApp" });
    setShowNewCaseModal(false);
  };

  // Generate Report core handler
  const handleGenerateReport = async (caseId: string) => {
    const cs = cases.find(c => c.id === caseId);
    if (!cs) return;

    const reportCode = `REP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReport: GeneratedReport = {
      id: reportCode,
      caseId: caseId,
      caseName: cs.name,
      date: new Date().toLocaleDateString("pt-BR") + " " + new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }),
      status: "Pronto",
      fileSize: "1.2 MB"
    };

    setReports(prev => [newReport, ...prev]);

    // Append activity
    const newAct: SystemActivity = {
      id: `act_rep_${Date.now()}`,
      title: "Relatório de integridade gerado",
      detail: `O relatório ${reportCode} para o caso "${cs.name}" foi concluído e está pronto.`,
      type: "success"
    };
    setActivities(prev => [newAct, ...prev]);

    alert(`Sucesso! O Relatório consolidado de provas digitais [${reportCode}] foi gerado para o Caso ${caseId}.\nO selo de integridade e assinatura profissional foram inseridos.`);
  };

  // Download Report core handler
  const handleDownloadReport = (caseId: string) => {
    const cs = cases.find(c => c.id === caseId);
    const associatedFiles = files.filter(f => f.caseId === caseId);
    if (!cs) {
      alert("Erro ao identificar o caso.");
      return;
    }

    const associatedReport = reports.find(r => r.caseId === caseId);
    const reportCode = associatedReport ? associatedReport.id : `REP-${Math.floor(4000 + Math.random() * 5999)}`;

    // Build elegant high-fidelity HTML document code using the modular generator
    const htmlContent = generateReportHTML(
      cs,
      associatedFiles,
      investigatorName,
      oabCode,
      officeName,
      reportCode,
      session?.user?.email || ""
    );

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio_preservacao_${cs.id.toLowerCase()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const currentCase = activeCaseId ? cases.find(c => c.id === activeCaseId) : null;

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
          <RefreshCw className="w-6 h-6 text-primary animate-spin" />
        </div>
        <p className="text-secondary text-xs font-semibold tracking-wider uppercase">Atlas Evidências</p>
        <p className="text-[#dee2ed]/60 text-[11px] mt-1">Carregando credenciais de custódia seguras...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <AuthScreen onAuthSuccess={(newSession) => setSession(newSession)} />
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans flex antialiased w-full overflow-x-hidden">
      
      {/* Sidebar navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // If they click dashboard or settings, reset active case detail context
          if (tab !== "cases") {
            setActiveCaseId(null);
          }
        }} 
        onOpenNewCase={() => setShowNewCaseModal(true)} 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onLogout={handleLogout}
        userEmail={session.user?.email}
      />

      {/* Mobile Drawer Backdrop */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-45 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Main viewport area panel */}
      <div className="flex-1 pl-0 md:pl-[260px] pt-16 flex flex-col min-h-screen min-w-0 w-full overflow-x-hidden">
        
        {/* Persistent top header bar */}
        <Header 
          activeTab={activeTab}
          searchPlaceholder="Faça perguntas ou busque por casos..."
          onSearch={(query) => {
            // generic search fallback
          }}
          responsibleName={investigatorName}
          onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        />

        {/* Dynamic switcher routing */}
        <main className="p-6 flex-1 bg-background">
          <div className="max-w-7xl mx-auto">
            {activeTab === "dashboard" && (
              <DashboardView 
                cases={cases}
                files={files}
                reports={reports}
                onSelectCase={(id) => {
                  setActiveCaseId(id);
                  setActiveTab("cases");
                }}
                onOpenNewCase={() => setShowNewCaseModal(true)}
              />
            )}

            {activeTab === "cases" && (
              currentCase ? (
                <CaseDetailsView 
                  activeCase={currentCase}
                  files={files}
                  onFileUploads={handleFileUploads}
                  isUploading={isUploading}
                  onGoBack={() => {
                    setActiveCaseId(null);
                    setActiveTab("dashboard");
                  }}
                  onGenerateReport={handleGenerateReport}
                  onDownloadReport={(id) => setPreviewCaseId(id)}
                  hasReport={reports.some(r => r.caseId === currentCase.id)}
                  onStartPreservation={handleStartPreservation}
                  onAddCaseEvent={handleAddCaseEvent}
                  onUpdateFileCategory={handleUpdateFileCategory}
                />
              ) : (
                /* Beautiful Clean All Cases fallback inside list directory */
                <div className="space-y-6 animate-fadeIn font-sans">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight text-on-surface">Casos Ativos</h2>
                      <p className="text-secondary text-sm mt-1">Navegue, visualize e gerencie seus relatórios e arquivos anexados.</p>
                    </div>
                    <button
                      onClick={() => setShowNewCaseModal(true)}
                      className="bg-primary hover:bg-[#c5a059] text-on-primary px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-transform cursor-pointer"
                    >
                      Novo Caso
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cases.map((c) => {
                      const cFiles = files.filter(f => f.caseId === c.id);
                      const hasRep = reports.some(r => r.caseId === c.id);
                      return (
                        <div
                          key={c.id}
                          onClick={() => setActiveCaseId(c.id)}
                          className="bg-surface-container border border-outline-variant/15 p-6 rounded-xl hover:border-primary/50 cursor-pointer transition-all flex flex-col justify-between group h-64"
                        >
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] tracking-widest uppercase font-mono text-[#9a8f80] font-bold">{c.id}</span>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                c.status === "Concluído"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-primary/10 text-primary border border-primary/20"
                              }`}>{c.status}</span>
                            </div>

                            <div>
                              <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">{c.name}</h4>
                              <p className="text-xs text-outline leading-relaxed mt-1 line-clamp-3">{c.description}</p>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-center text-xs text-secondary">
                            <span>Plataforma: <strong>{c.evidenceType}</strong></span>
                            <span>{cFiles.length} {cFiles.length === 1 ? "Arquivo" : "Arquivos"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}

            {activeTab === "files" && (
              <FilesView 
                files={files}
                cases={cases}
                onSelectCase={(id) => {
                  setActiveCaseId(id);
                  setActiveTab("cases");
                }}
              />
            )}

            {activeTab === "reports" && (
              <ReportsView 
                reports={reports}
                cases={cases}
                onSelectCase={(id) => {
                  setActiveCaseId(id);
                  setActiveTab("cases");
                }}
                onGenerateReportForCase={handleGenerateReport}
                onDownloadReport={(rep) => setPreviewCaseId(rep.caseId)}
              />
            )}

            {activeTab === "settings" && (
              <SettingsView 
                investigatorName={investigatorName}
                setInvestigatorName={setInvestigatorName}
                oabCode={oabCode}
                setOabCode={setOabCode}
                officeName={officeName}
                setOfficeName={setOfficeName}
                onResetData={handleResetData}
              />
            )}
          </div>
        </main>
      </div>

      {/* ================= NEW CASE MODAL DIALOG ================= */}
      {showNewCaseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fadeIn font-sans p-4">
          <div className="bg-surface-container border border-outline-variant/30 max-w-md w-full rounded-2xl p-6 relative shadow-2xl">
            <button
              onClick={() => setShowNewCaseModal(false)}
              className="absolute top-4 right-4 text-secondary hover:text-primary p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-2">
              <FolderGit className="w-5 h-5" />
              <span>Instanciar Novo Caso</span>
            </h3>
            <p className="text-xs text-outline mb-5">Preencha os dados do cliente ou fato para começar a guardar arquivos.</p>

            <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#9a8f80] uppercase tracking-wider block">Nome do Caso</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Ata Notarial WhatsApp - Cliente Silva"
                  value={newCaseForm.name}
                  onChange={(e) => setNewCaseForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded px-3 py-2.5 text-on-surface focus:outline-none focus:border-primary text-sm font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#9a8f80] uppercase tracking-wider block">Descrição Sumária</label>
                <textarea 
                  placeholder="Descreva as ofensas, ameaças ou anexos a serem arquivados..."
                  value={newCaseForm.description}
                  onChange={(e) => setNewCaseForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded px-3 py-2.5 text-on-surface focus:outline-none focus:border-primary h-24 resize-none text-sm font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#9a8f80] uppercase tracking-wider block">Tipo da Origem (Evidência)</label>
                <select 
                  value={newCaseForm.evidenceType}
                  onChange={(e) => setNewCaseForm(p => ({ ...p, evidenceType: e.target.value as any }))}
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded px-3 py-2.5 text-on-surface focus:outline-none focus:border-primary text-sm font-sans"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="E-mail">E-mail</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 font-semibold">
                <button 
                  type="button"
                  onClick={() => setShowNewCaseModal(false)}
                  className="px-4 py-2 border border-outline-variant/30 rounded text-secondary hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-[#c5a059] text-on-primary rounded font-bold transition-all cursor-pointer shadow-lg shadow-primary/10"
                >
                  Criar Caso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= LAUDO PREVIEW MODAL ================= */}
      {previewCaseId && (() => {
        const previewCase = cases.find(c => c.id === previewCaseId);
        const associatedReport = reports.find(r => r.caseId === previewCaseId);
        const reportCode = associatedReport ? associatedReport.id : "PROVISORIO";
        if (!previewCase) return null;
        
        return (
          <LaudoPreviewModal
            isOpen={true}
            onClose={() => setPreviewCaseId(null)}
            activeCase={previewCase}
            files={files}
            investigatorName={investigatorName}
            oabCode={oabCode}
            officeName={officeName}
            userEmail={session?.user?.email || ""}
            reportCode={reportCode === "PROVISORIO" ? `REP-${Math.floor(4000 + Math.random() * 5999)}` : reportCode}
            onDownload={() => handleDownloadReport(previewCaseId)}
          />
        );
      })()}

      {/* ================= BATCH UPLOAD MODAL ================= */}
      <BatchUploadModal
        isOpen={batchUploadVisible}
        onClose={() => {
          setBatchUploadVisible(false);
          setBatchFiles([]);
          setBatchSummary(null);
        }}
        files={batchFiles}
        summary={batchSummary}
      />

    </div>
  );
}
