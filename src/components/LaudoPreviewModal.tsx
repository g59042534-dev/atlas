import React from "react";
import { Case, EvidenceFile } from "../types";
import { X, Download, Printer, Shield, CheckCircle } from "lucide-react";
import { generateQrCodeSvg, generateReportHTML } from "../utils";

interface LaudoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCase: Case;
  files: EvidenceFile[];
  investigatorName: string;
  oabCode: string;
  officeName: string;
  userEmail: string;
  reportCode: string;
  onDownload: () => void;
}

export default function LaudoPreviewModal({
  isOpen,
  onClose,
  activeCase,
  files,
  investigatorName,
  oabCode,
  officeName,
  userEmail,
  reportCode,
  onDownload
}: LaudoPreviewModalProps) {
  if (!isOpen) return null;

  const associatedFiles = files.filter(f => f.caseId === activeCase.id);
  const currentTimestamp = new Date().toLocaleString("pt-BR");
  const printDocValidationHash = `VAL-${reportCode}-${activeCase.id}-8C29D8`;
  
  // Dynamic deterministic QR code SVG for preview
  const qrSvgCode = generateQrCodeSvg(activeCase.id, reportCode);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Por favor, permita pop-ups para acionar o preparatório de impressão.");
      return;
    }

    const htmlToPrint = generateReportHTML(
      activeCase,
      associatedFiles,
      investigatorName,
      oabCode,
      officeName,
      reportCode,
      userEmail
    );

    const htmlWithAutoPrint = htmlToPrint.replace(
      "</body>",
      `<script>window.onload = function() { window.print(); window.close(); }</script></body>`
    );

    printWindow.document.write(htmlWithAutoPrint);
    printWindow.document.close();
    return;

    // Remaining legacy code bypassed:
    // @ts-ignore
    const printDocValidationHash = `VAL-${reportCode}-${activeCase.id}-8C29D8`;
    const htmlToPrint_legacy = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Laudo - ${activeCase.id}</title>
    <!-- PDF/A-3b Compliance Metadata -->
    <meta name="pdfa-compliance" content="PDF/A-3b">
    <script type="application/xml">
        <?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?>
        <x:xmpmeta xmlns:x="adobe:ns:meta/">
            <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
                <rdf:Description rdf:about="" xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/">
                    <pdfaid:part>3</pdfaid:part>
                    <pdfaid:conformance>B</pdfaid:conformance>
                </rdf:Description>
            </rdf:RDF>
        </x:xmpmeta>
        <?xpacket end="w"?>
    </script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
        @page { size: A4; margin: 20mm 15mm 20mm 15mm; }
        body { font-family: 'Inter', sans-serif; color: #1e293b; line-height: 1.6; margin: 0; padding: 0; font-size: 13px; }
        .document-container { max-width: 800px; margin: 0 auto; padding: 0; }
        .doc-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #c5a059; padding-bottom: 20px; margin-bottom: 30px; }
        .brand-section { display: flex; align-items: center; gap: 14px; }
        .brand-logo { width: 52px; height: 52px; object-fit: contain; }
        .brand-title { margin: 0; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.5px; }
        .brand-subtitle { margin: 2px 0 0 0; font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; font-weight: 700; }
        .meta-section { text-align: right; }
        .meta-badge { font-size: 9px; font-weight: 700; color: #c5a059; border: 1px solid rgba(197, 160, 89, 0.3); background-color: rgba(197, 160, 89, 0.05); padding: 3px 8px; border-radius: 4px; display: inline-block; margin-bottom: 6px; }
        .registry-code { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0; }
        .case-key { font-size: 11px; color: #64748b; margin: 4px 0 0 0; }
        .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-top: 35px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; }
        .meta-grid { display: grid; grid-template-cols: repeat(2, 1fr); gap: 15px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #c5a059; padding: 16px 20px; border-radius: 6px; }
        .meta-item { display: flex; flex-direction: column; gap: 4px; }
        .meta-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; }
        .meta-value { font-size: 12px; font-weight: 600; color: #1e293b; }
        .summary-text { color: #334155; font-size: 12.5px; text-align: justify; margin-bottom: 20px; }
        .files-table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 25px; }
        .files-table th { background-color: #f1f5f9; color: #475569; font-weight: 700; text-transform: uppercase; font-size: 9px; padding: 10px 12px; border: 1px solid #e2e8f0; text-align: left; }
        .files-table td { padding: 10px 12px; border: 1px solid #e2e8f0; vertical-align: middle; }
        .files-table tr:nth-child(even) { background-color: #fafafa; }
        .file-name { font-weight: 600; color: #0f172a; font-size: 11.5px; word-break: break-all; }
        .file-meta { font-size: 10px; color: #64748b; margin-top: 2px; }
        .hash-container { display: flex; align-items: center; justify-content: space-between; gap: 8px; background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 10px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600; color: #0f172a; word-break: break-all; cursor: pointer; }
        .custody-block { display: flex; gap: 25px; align-items: flex-start; margin-top: 25px; }
        .custody-statement { flex: 1; font-size: 11.5px; color: #334155; text-align: justify; line-height: 1.6; }
        .qr-section { border: none; padding: 0; display: flex; flex-direction: column; align-items: center; width: fit-content; }
        .signatures-grid { display: grid; grid-template-cols: repeat(2, 1fr); gap: 30px; margin-top: 45px; }
        .signature-box { display: flex; flex-direction: column; align-items: center; text-align: center; font-size: 11px; }
        .signature-line { width: 80%; height: 1px; background-color: #94a3b8; margin-top: 40px; margin-bottom: 12px; }
        .signature-name { font-weight: 700; color: #0f172a; font-size: 12px; }
        .signature-title { font-size: 10px; color: #64748b; }
        .stamp-box { border: 1px dashed #cbd5e1; background-color: #f8fafc; padding: 12px; border-radius: 6px; display: flex; flex-direction: column; align-items: center; width: 85%; }
        .stamp-icon { color: #64748b; font-weight: bold; font-size: 14px; margin-bottom: 4px; }
        .stamp-text { color: #475569; font-size: 9px; font-weight: 700; text-transform: uppercase; }
        .stamp-details { font-size: 8px; text-align: center; color: #64748b; margin-top: 3px; font-family: 'JetBrains Mono', monospace; }
        .doc-footer { border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 45px; display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: #94a3b8; }
    </style>
</head>
<body>
    <div class="document-container">
        <header class="doc-header">
            <div class="brand-section">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjF9JusWwDzpZmdIIUZaQza4tPVKTyL_yo4Y4RCIG8r9QEy20i9WbZ14795nZejE3flCApnVMDgSkilbCknJzJFNQjJPoGeHi4Uguy2vVCoZG75JrT7BFriqGvn4-dsmbqXNbexcNviGb-7ZmtWdDnEGkS3a8Ilvxb748E0_9rawg6wyxLlYgtE4NIo1THO-P7w8fyneJNaEXKgkoXuetgCTF2NNp-sEJnvVh0N1j2XIgEvqElCR6brRxZPea6wa4mKE4aJqgCYSI" class="brand-logo" alt="Logo">
                <div>
                    <h1 class="brand-title">Atlas Evidências</h1>
                    <p class="brand-subtitle">Relatório de Preservação Local de Provas</p>
                </div>
            </div>
            <div class="meta-section">
                <div class="meta-badge">Relatório Técnico Local</div>
                <h2 class="registry-code">RELATÓRIO DE PRESERVAÇÃO Nº ${reportCode}</h2>
                <p class="case-key">Chave de Integridade: <strong>${activeCase.id}</strong></p>
            </div>
        </header>

        <section class="meta-grid">
            <div class="meta-item">
                <span class="meta-label">ID / CHAVE DO CASO</span>
                <span class="meta-value">${activeCase.id}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">DATA DE REGISTRO</span>
                <span class="meta-value">${activeCase.date}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">USUÁRIO DA PLATAFORMA</span>
                <span class="meta-value">${investigatorName}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">CONTA</span>
                <span class="meta-value">${userEmail}</span>
            </div>
        </section>

        <div class="section-title">
            <span>1. Resumo de Registro Factual</span>
            <span style="font-size: 8.5px; opacity: 0.6; font-family: monospace;">Local software ledger</span>
        </div>
        
        <div class="meta-item" style="margin-bottom: 12px;">
            <span class="meta-label">Título do Caso</span>
            <p style="font-size: 13px; font-weight: bold; margin: 4px 0 10px 0; color: #0f172a;">${activeCase.name}</p>
        </div>

        <div class="meta-item" style="margin-bottom: 20px;">
            <span class="meta-label">Escopo / Descritivo Técnico do Caso</span>
            <div class="summary-text" style="margin-top: 5px;">
                ${activeCase.description}
            </div>
        </div>

        <div class="section-title">
            <span>2. Lista de Arquivos Processados (${associatedFiles.length} item/itens)</span>
        </div>

        <table class="files-table">
            <thead>
                <tr>
                    <th style="width: 35%;">Arquivo</th>
                    <th style="width: 20%;">Tipo / Formato</th>
                    <th style="width: 15%;">Tamanho</th>
                    <th style="width: 30%;">Soma de Verificação (SHA-256)</th>
                </tr>
            </thead>
            <tbody>
                ${associatedFiles.length === 0 ? `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 25px; color: #64748b; font-style: italic;">
                        Nenhum arquivo de prova foi anexado a este laudo de preservação até o presente momento.
                    </td>
                </tr>
                ` : associatedFiles.map((f) => `
                <tr>
                    <td>
                        <div class="file-name">${f.name}</div>
                        <div class="file-meta">Adicionado em: ${f.date}</div>
                    </td>
                    <td><span style="font-weight: 500; text-transform: uppercase;">${f.type.split("/").pop()}</span></td>
                    <td style="font-weight: 600; color: #0f172a;">${f.size}</td>
                    <td>
                        <div class="hash-container" onclick="navigator.clipboard.writeText('${f.hash}'); alert('Hash SHA-256 copiado:\n${f.hash}');" title="Clique para copiar">
                            <span style="font-family: inherit; word-break: break-all; font-size: 9.5px;">${f.hash}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; opacity: 0.5; margin-left: 6px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </div>
                    </td>
                </tr>
                `).join("")}
            </tbody>
        </table>

        <div class="section-title">
            <span>3. Declaração de Registro Técnico de Arquivos</span>
        </div>

        <div class="custody-block">
            <div class="custody-statement">
                Os arquivos listados no presente documento foram inseridos pelo usuário autenticado (<strong>${investigatorName}</strong>, conta: <strong>${userEmail}</strong>) durante a sessão Atlas e foram processados pela ferramenta local Atlas Evidências na data e no horário registrados. Durante o processamento de cada arquivo, foi calculada a soma de verificação por meio do algoritmo de hash unilateral <strong>SHA-256</strong> (Secure Hash Algorithm 256-bit).
                <br><br>
                A soma de verificação gerada atua como um identificador numérico de integridade matemática específico para o conteúdo exato de cada arquivo. Toda e qualquer alteração subsequente nos dados listados resultará em uma soma de verificação SHA-256 completamente distinta, viabilizando a auditoria fidedigna de integridade por terceiros interessados.
            </div>
            
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; flex-shrink: 0; min-width: 170px; background-color: #fafbfd; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px;">
                <div class="qr-section">
                    ${qrSvgCode}
                </div>
                <div style="text-align: left; width: 100%; font-family: 'JetBrains Mono', monospace; font-size: 8px; color: #475569; line-height: 1.3; border-top: 1px dashed #cbd5e1; padding-top: 6px;">
                    <strong style="color: #0f172a; text-transform: uppercase; font-size: 8px; display: block; margin-bottom: 4px; letter-spacing: 0.5px;">✓ QR Código:</strong>
                    Laudo: ${reportCode}<br>
                    Caso: ${activeCase.id}<br>
                    Emissão: ${currentTimestamp}<br>
                    Identificador: <span style="font-weight: 600; color: #b18e4c;">${printDocValidationHash}</span>
                </div>
            </div>
        </div>

        <div class="section-title">
            <span>4. Detalhes de Registro e Assinatura Técnica</span>
        </div>

        <div class="signatures-grid">
            <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-name">${investigatorName}</div>
                <div class="signature-title">${oabCode}</div>
                <div class="signature-title" style="font-weight: 500;">${officeName}</div>
                
                <!-- Internal Metadata Block -->
                <div style="margin-top: 15px; width: 85%; border: 1px solid #cbd5e1; background-color: #fafafa; padding: 8px; border-radius: 4px; text-align: left; font-family: 'JetBrains Mono', monospace; font-size: 8px; color: #475569;">
                    <strong style="color: #64748b; text-transform: uppercase; font-size: 8px; display: block; margin-bottom: 2px;">🔏 Processamento de Tempo:</strong>
                    Geração: Horário Local do Cliente<br>
                    Sincronia: Relógio do Sistema Operacional<br>
                    Método: JavaScript Date API<br>
                    Status: Registro Factual Concluído
                </div>
            </div>
            <div class="signature-box">
                <div class="stamp-box">
                    <div class="stamp-icon">✓</div>
                    <div class="stamp-text">SOMA DE VERIFICAÇÃO CALCULADA</div>
                    <div class="stamp-details">
                        STATUS: CÁLCULO DE HASH REALIZADO<br>
                        ALGORITMO: SHA-256 CRYPTO-HASH<br>
                        MÉTODO: Local Web Crypto API<br>
                        SAÍDA: 64 Caracteres Hexadecimais<br>
                        ESCOPO: Registro Individual de Arquivos
                    </div>
                </div>
                <div class="signature-title" style="margin-top: 8px; font-weight: 600; font-size: 8.5px; text-transform: uppercase; color: #64748b;">
                    Cálculo de Integridade Matemática
                </div>
            </div>
        </div>

        <footer class="doc-footer">
            <div style="font-weight: bold;">Atlas Evidências</div>
            <div>Relatório factual gerado pelo usuário por meio do navegador local • Página 1 de 1</div>
        </footer>
    </div>
    <script>
        window.onload = function() { window.print(); window.close(); }
    </script>
</body>
</html>`;

    printWindow.document.write(htmlToPrint);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex flex-col justify-start overflow-y-auto z-50 p-4 sm:p-6 md:p-10 font-sans animate-fadeIn">
      
      {/* Action floating bar */}
      <div className="max-w-4xl w-full mx-auto bg-[#1e1b18] border border-outline-variant/30 rounded-xl px-6 py-4 flex justify-between items-center gap-4 mb-6 shadow-xl sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-on-surface font-bold text-sm">Painel do Laudo Pericial</h3>
            <p className="text-[10px] text-secondary font-mono">Reg: {reportCode} • Chave: {activeCase.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/15 text-on-surface hover:text-primary p-2 sm:px-4 sm:py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
            title="Abrir Preparador de PDF"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimir / Salvar PDF</span>
          </button>

          <button
            onClick={onDownload}
            className="bg-primary hover:bg-[#c5a059] text-on-primary p-2 sm:px-4 sm:py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-primary/20"
            title="Download HTML Certificado"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Baixar HTML</span>
          </button>

          <button
            onClick={onClose}
            className="bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/15 text-[#9a8f80] hover:text-[#fff] p-2 rounded-lg transition-colors cursor-pointer"
            title="Fechar Visualização"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Visual representation of the core page */}
      <div className="max-w-4xl w-full mx-auto bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-4 sm:p-12 md:p-16 relative mb-12 selection:bg-primary/20">
        <div className="absolute top-0 left-0 right-0 h-[6px] bg-[#c5a059] rounded-t-2xl"></div>

        {/* Header bar layout */}
        <section className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-primary/20 pb-6 mb-8">
          <div className="flex items-center gap-3.5">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjF9JusWwDzpZmdIIUZaQza4tPVKTyL_yo4Y4RCIG8r9QEy20i9WbZ14795nZejE3flCApnVMDgSkilbCknJzJFNQjJPoGeHi4Uguy2vVCoZG75JrT7BFriqGvn4-dsmbqXNbexcNviGb-7ZmtWdDnEGkS3a8Ilvxb748E0_9rawg6wyxLlYgtE4NIo1THO-P7w8fyneJNaEXKgkoXuetgCTF2NNp-sEJnvVh0N1j2XIgEvqElCR6brRxZPea6wa4mKE4aJqgCYSI" className="w-[50px] h-[50px] object-contain" alt="Atlas Evidências Logo" />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">Atlas Evidências</h1>
              <p className="text-[9px] uppercase tracking-widest font-bold text-slate-500">Relatório de Preservação Local de Provas</p>
            </div>
          </div>

          <div className="sm:text-right">
            <div className="inline-block text-[8.5px] font-bold text-[#c5a059] uppercase tracking-wider bg-[#c5a059]/5 border border-[#c5a059]/30 px-2 py-0.5 rounded mb-1">
              Relatório Técnico Local
            </div>
            <h2 className="text-sm font-bold text-slate-900 uppercase">Relatório de Registro Nº {reportCode}</h2>
            <p className="text-[10px] text-slate-500 mt-1">
              Código Atlas: <strong className="font-semibold text-amber-700">{activeCase.atlasCode || "Não Iniciado"}</strong> • Chave: <strong className="font-semibold text-slate-700">{activeCase.id}</strong>
            </p>
          </div>
        </section>

        {/* Metadata Details Container Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-50 border border-slate-200 border-l-[3px] border-primary p-4 rounded-lg mb-4 text-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Código Atlas</span>
            <span className="text-xs font-mono font-bold text-amber-700">{activeCase.atlasCode || "Não Iniciado"}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">ID / Chave do Caso</span>
            <span className="text-xs font-semibold text-slate-800">{activeCase.id}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Registrado em</span>
            <span className="text-xs font-semibold text-slate-800">{activeCase.date}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Conta do Usuário</span>
            <span className="text-xs font-semibold text-slate-800 truncate" title={userEmail}>{userEmail}</span>
          </div>
        </section>

        {activeCase.preservationSession?.started && (
          <section className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-emerald-50/50 border border-emerald-200 border-l-[3px] border-emerald-500 p-4 rounded-lg mb-6 text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Sessão de Preservação</span>
              <span className="text-xs font-bold text-emerald-700 uppercase">✔ Ativa e Vinculada</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Iniciada em</span>
              <span className="text-xs font-semibold text-slate-800">{activeCase.preservationSession.startDate} às {activeCase.preservationSession.startTime}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Sistema Operacional</span>
              <span className="text-xs font-semibold text-slate-800">{activeCase.preservationSession.os}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Navegador Utilizado</span>
              <span className="text-xs font-semibold text-slate-800 truncate" title={activeCase.preservationSession.browser}>{activeCase.preservationSession.browser}</span>
            </div>
          </section>
        )}

        {/* Section 1 summary description */}
        <section className="mb-6">
          <div className="text-[10px] font-bold tracking-wider text-slate-800 border-b border-slate-100 pb-1 mb-3 uppercase flex justify-between items-center">
            <span>1. Resumo de Registro Factual</span>
            <span className="text-[8px] opacity-40 font-mono">Local software ledger</span>
          </div>
          
          <div className="mb-3">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">Título do Caso</span>
            <span className="text-sm font-bold text-slate-800 block mt-0.5">{activeCase.name}</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed text-justify mt-2 whitespace-pre-line bg-slate-50/50 p-4 border border-slate-100 rounded-lg">
            {activeCase.description}
          </p>
        </section>

        {/* Section 2 files table representation */}
        <section className="mb-6">
          <div className="text-[10px] font-bold tracking-wider text-slate-800 border-b border-slate-100 pb-1 mb-3 uppercase">
            2. Provas Tecnológicas Preservadas ({associatedFiles.length} item/itens)
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            {/* Desktop View Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-4 py-3 w-[40%]">Arquivo original</th>
                    <th className="px-4 py-3">Tipo / Formato</th>
                    <th className="px-4 py-3">Tamanho</th>
                    <th className="px-4 py-3 w-[35%]">Assinatura Digital (SHA-256)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px] text-slate-700">
                  {associatedFiles.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-400 italic">
                        Nenhum arquivo de prova foi anexado a este laudo de preservação até o presente momento.
                      </td>
                    </tr>
                  ) : (
                    associatedFiles.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-800 max-w-[200px] truncate" title={f.name}>{f.name}</div>
                          <div className="text-[9px] text-slate-400 mt-0.5 flex flex-wrap items-center gap-1.5">
                            <span>Ingestão: {f.date} {f.uploadTime ? `às ${f.uploadTime}` : ""}</span>
                            {f.category && (
                              <span className="bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[8px] px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                                {f.category}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 capitalize font-semibold text-slate-600">
                          {f.type.split("/").pop()}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800">
                          {f.size}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-between gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg p-2 text-slate-800 transition-all cursor-pointer select-all max-w-full"
                               title="Clique para copiar o Hash SHA-256"
                               onClick={() => {
                                 navigator.clipboard.writeText(f.hash);
                                 alert("Hash SHA-256 copiado para a área de transferência:\n" + f.hash);
                               }}>
                            <code className="text-[10px] font-mono font-bold break-all leading-tight select-all">
                              {f.hash}
                            </code>
                            <span className="text-slate-400 hover:text-slate-700 shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style={{ flexShrink: 0 }}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View Document Cards */}
            <div className="md:hidden divide-y divide-slate-100 p-3 space-y-3 font-sans">
              {associatedFiles.length === 0 ? (
                <div className="py-6 text-center text-slate-400 italic text-xs">
                  Nenhum arquivo de prova foi anexado a este laudo de preservação.
                </div>
              ) : (
                associatedFiles.map((f) => (
                  <div key={f.id} className="pt-3 first:pt-0 space-y-2">
                    <div>
                      <div className="font-bold text-slate-900 text-xs break-all" title={f.name}>
                        {f.name}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5 flex flex-wrap items-center gap-1.5">
                        <span>Ingestão: {f.date} {f.uploadTime ? `às ${f.uploadTime}` : ""}</span>
                        {f.category && (
                          <span className="bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[7.5px] px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                            {f.category}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-[11px] text-slate-600 bg-slate-50/50 p-2 rounded border border-slate-100">
                      <span>Formato: <strong className="uppercase font-semibold text-slate-800">{f.type.split("/").pop()}</strong></span>
                      <span>Tamanho: <strong className="font-semibold text-slate-800">{f.size}</strong></span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Assinatura SHA-256</span>
                      <div 
                        title="Clique de cópia rápida"
                        onClick={() => {
                          navigator.clipboard.writeText(f.hash);
                          alert("Hash SHA-256 copiado para a área de transferência:\n" + f.hash);
                        }}
                        className="flex items-center justify-between gap-1.5 font-mono text-[9.5px] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-2 cursor-pointer transition-all active:scale-[0.98] select-all w-full"
                      >
                        <span className="font-bold break-all leading-normal text-emerald-800 select-all">
                          {f.hash}
                        </span>
                        <span className="text-slate-400 shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style={{ flexShrink: 0 }}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Section 3 Chronological Events timeline (Espinha Dorsal Atlas) */}
        <section className="mb-6">
          <div className="text-[10px] font-bold tracking-wider text-slate-800 border-b border-slate-100 pb-1 mb-3 uppercase flex justify-between items-center">
            <span>3. Histórico de Eventos Registrados (Espinha Dorsal Atlas)</span>
            <span className="text-[8px] opacity-40 font-mono">Chronology tracker ledger</span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white text-xs">
            {activeCase.events && activeCase.events.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-4 py-2.5 w-[25%]">Data e Hora</th>
                      <th className="px-4 py-2.5 w-[75%]">Evento / Ação Registrada</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px] text-slate-700 font-medium">
                    {activeCase.events.map((ev, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/20">
                        <td className="px-4 py-2 font-mono font-bold text-[#0f172a] whitespace-nowrap">
                          {ev.date} às {ev.time}
                        </td>
                        <td className="px-4 py-2 text-slate-600 font-medium">
                          {ev.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 text-center text-slate-400 italic font-sans text-xs">
                Nenhum evento registrado nesta sessão de preservação.
              </div>
            )}
          </div>
        </section>

        {/* Section 4 integrity declaration with QR Code */}
        <section className="mb-8">
          <div className="text-[10px] font-bold tracking-wider text-slate-800 border-b border-slate-100 pb-1 mb-4 uppercase">
            4. Declaração de Processamento Técnico e Hash SHA-256
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1 text-xs text-slate-600 leading-relaxed text-justify">
              Os arquivos descritos na seção anterior foram processados pela ferramenta local Atlas Evidências na data e no horário registrados. Durante o processamento de cada arquivo, foi calculada a soma de verificação por meio do algoritmo de hash unilateral <strong>SHA-256</strong> (Secure Hash Algorithm 256-bit).
              <br /><br />
              A soma de verificação gerada atua como um identificador numérico de integridade matemática específico para o conteúdo exato de cada arquivo. Toda e qualquer alteração subsequente nos dados listados resultará em uma soma de verificação SHA-256 completamente distinta, viabilizando a auditoria fidedigna por terceiros interessados.
            </div>

            <div className="shrink-0 flex flex-col items-center gap-2 bg-slate-50 border border-slate-200 p-3.5 rounded-xl min-w-[170px] shadow-xs">
              <div className="bg-white flex flex-col items-center">
                {/* Visual SVG QR Code Injection */}
                <div dangerouslySetInnerHTML={{ __html: qrSvgCode }} />
              </div>
              <div className="text-left w-full font-mono text-[8px] text-slate-500 leading-normal border-t border-dashed border-slate-200 pt-2.5">
                <strong className="text-slate-800 uppercase text-[8px] block mb-1 font-bold">✓ QR Código:</strong>
                Laudo: {reportCode}<br />
                Caso: {activeCase.id}<br />
                Emissão: {currentTimestamp}<br />
                Identificador: <span className="font-semibold text-[#b18e4c]">{printDocValidationHash}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 Technical Signature */}
        <section className="mb-10 text-xs">
          <div className="text-[10px] font-bold tracking-wider text-slate-800 border-b border-slate-100 pb-1 mb-4 uppercase">
            5. Detalhes de Registro e Assinatura Técnica
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start pt-2">
            <div className="flex flex-col items-center text-center">
              <div className="w-[80%] h-[1px] bg-slate-300 mb-2 mt-6"></div>
              <span className="font-bold text-slate-800 text-xs">{investigatorName}</span>
              <span className="text-[10px] text-slate-400">{oabCode}</span>
              <span className="text-[10px] text-slate-400 font-semibold">{officeName}</span>

              {/* Internal Metadata Block */}
              <div className="mt-4 w-full border border-slate-200 bg-slate-50 p-2.5 rounded-lg text-left font-mono text-[8px] text-[#475569] leading-normal">
                <strong className="text-slate-500 uppercase font-bold text-[8px] block mb-1">🔏 Processamento de Tempo:</strong>
                Geração: Horário Local do Cliente<br />
                Sincronia: Relógio do Sistema Operacional<br />
                Método: JavaScript Date API<br />
                Status: Registro Factual Concluído
              </div>
            </div>

            <div className="flex justify-center">
              <div className="border border-dashed border-slate-400 bg-slate-50 p-4 rounded-xl flex flex-col items-center justify-center text-center w-full">
                <div className="text-slate-600 font-bold flex items-center gap-1.5 mb-1.5 text-xs uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4" />
                  <span>Cálculo de Integridade Matemática</span>
                </div>
                <p className="text-[8.5px] font-mono text-slate-700 leading-relaxed uppercase pb-1">
                  STATUS: CÁLCULO DE HASH CONCLUÍDO<br />
                  ALGORITMO: SHA-256 CRYPTO-HASH<br />
                  MÉTODO: Local Web Crypto API<br />
                  SAÍDA: 64 Caracteres Hexadecimais<br />
                  ESCOPO: Registro Factual Individual
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Printable Footer */}
        <section className="border-t border-slate-100 pt-4 flex justify-between items-center text-[9px] text-slate-400 font-medium">
          <span className="font-bold text-slate-500">Atlas Evidências</span>
          <span>Relatório factual gerado pelo usuário por meio do navegador local • Página 1 de 1</span>
        </section>
      </div>
    </div>
  );
}
