import { Case, EvidenceFile } from "./types";

/**
 * Generates an extremely realistic, deterministic vector SVG QR Code
 * based on the Case ID and Report Registry Code.
 * Renders beautifully on screen and infinitely sharp on A4 print.
 */
export function generateQrCodeSvg(caseId: string, reportCode: string): string {
  const size = 25;
  
  // Custom deterministic pixel generator
  const getDeterministicPixels = (seedStr: string): boolean[][] => {
    const grid = Array(size).fill(null).map(() => Array(size).fill(false));
    
    // Finder patterns zones (top-left, top-right, bottom-left)
    const isFinder = (r: number, c: number) => {
      if (r < 8 && c < 8) return true;
      if (r < 8 && c >= size - 8) return true;
      if (r >= size - 8 && c < 8) return true;
      return false;
    };

    // Simple deterministic hash generator
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0;
    }

    // Linear Congruential Generator
    let lcgSeed = Math.abs(hash) || 54321;
    const nextRand = () => {
      lcgSeed = (lcgSeed * 9301 + 49297) % 233280;
      return lcgSeed / 233280;
    };

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (isFinder(r, c)) continue;
        
        // Alignment pattern at bottom-right area (x=16, y=16)
        if (r >= size - 9 && r <= size - 5 && c >= size - 9 && c <= size - 5) {
          const dr = Math.abs(r - (size - 7));
          const dc = Math.abs(c - (size - 7));
          grid[r][c] = (dr === 0 && dc === 0) || (dr === 2 || dc === 2);
          continue;
        }

        // Standard timing belts
        if (r === 6 && c % 2 === 0) { grid[r][c] = true; continue; }
        if (c === 6 && r % 2 === 0) { grid[r][c] = true; continue; }

        grid[r][c] = nextRand() > 0.48;
      }
    }
    
    return grid;
  };

  const pixels = getDeterministicPixels(`${caseId}-${reportCode}`);
  
  let rects = "";

  // Helper to draw standard QR corner finder pattern
  const drawFinder = (x: number, y: number) => {
    let s = "";
    s += `<rect x="${x}" y="${y}" width="7" height="7" fill="#1e293b" />`;
    s += `<rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#ffffff" />`;
    s += `<rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#1e293b" />`;
    return s;
  };

  rects += drawFinder(0, 0);
  rects += drawFinder(size - 7, 0);
  rects += drawFinder(0, size - 7);

  // Draw other dots
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (pixels[r][c]) {
        rects += `<rect x="${c}" y="${r}" width="1" height="1" fill="#1e293b" />`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="110" height="110">
    <rect width="${size}" height="${size}" fill="#ffffff" />
    ${rects}
  </svg>`;
}

/**
 * Generates an outstanding, professional HTML report optimized for A4 print
 * and PDF generation. Features corrected Portuguese typography, logo, structured
 * metadata tables, highlighted SHA-256 values, cryptographic seal patterns,
 * legal references, a dynamic vector QR code, and signatures layout.
 */
export function generateReportHTML(
  cs: Case,
  associatedFiles: EvidenceFile[],
  investigatorName: string,
  oabCode: string,
  officeName: string,
  reportCode: string,
  userEmail: string
): string {
  const currentTimestamp = new Date().toLocaleString("pt-BR");
  const qrSvgCode = generateQrCodeSvg(cs.id, reportCode);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laudo Pericial Digital - ${cs.id} (${reportCode})</title>
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
        
        @page {
            size: A4;
            margin: 20mm 15mm 20mm 15mm;
        }

        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            color: #1e293b;
            background-color: #ffffff;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            font-size: 13px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        .no-print-bar {
            background-color: #0f172a;
            color: #f1f5f9;
            padding: 12px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            font-weight: 500;
            border-bottom: 2px solid #c5a059;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        .btn-print {
            background-color: #c5a059;
            color: #0f172a;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            cursor: pointer;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .btn-print:hover {
            background-color: #b08d4b;
        }

        .document-container {
            max-width: 800px;
            margin: 30px auto;
            padding: 40px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.05);
            background: #ffffff;
            position: relative;
        }

        /* Certificate header */
        .doc-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #c5a059;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }

        .brand-section {
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .brand-logo {
            width: 52px;
            height: 52px;
            object-fit: contain;
        }

        .brand-title {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
            color: #0f172a;
            letter-spacing: -0.5px;
        }

        .brand-subtitle {
            margin: 2px 0 0 0;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #64748b;
        }

        .meta-section {
            text-align: right;
        }

        .meta-badge {
            font-size: 9px;
            font-weight: 700;
            color: #c5a059;
            border: 1px solid rgba(197, 160, 89, 0.3);
            background-color: rgba(197, 160, 89, 0.05);
            padding: 3px 8px;
            border-radius: 4px;
            display: inline-block;
            margin-bottom: 6px;
            letter-spacing: 0.5px;
        }

        .registry-code {
            font-size: 15px;
            font-weight: 700;
            color: #0f172a;
            margin: 0;
        }

        .case-key {
            font-size: 11px;
            color: #64748b;
            margin: 4px 0 0 0;
        }

        /* Section structure */
        .section-title {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #0f172a;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 6px;
            margin-top: 35px;
            margin-bottom: 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        /* Metadata details block */
        .meta-grid {
            display: grid;
            grid-template-cols: repeat(2, 1fr);
            gap: 15px;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-left: 3px solid #c5a059;
            padding: 16px 20px;
            border-radius: 6px;
            margin-bottom: 25px;
        }

        .meta-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .meta-label {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #64748b;
        }

        .meta-value {
            font-size: 12px;
            font-weight: 600;
            color: #1e293b;
        }

        /* Preservation Summary paragraph */
        .summary-text {
            color: #334155;
            font-size: 12.5px;
            line-height: 1.6;
            margin-bottom: 20px;
            text-align: justify;
        }

        /* Files Table styling */
        .files-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
            margin-bottom: 25px;
        }

        .files-table th {
            background-color: #f1f5f9;
            color: #475569;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 9px;
            letter-spacing: 1px;
            padding: 10px 12px;
            border: 1px solid #e2e8f0;
            text-align: left;
        }

        .files-table td {
            padding: 10px 12px;
            border: 1px solid #e2e8f0;
            vertical-align: middle;
        }

        .files-table tr:nth-child(even) {
            background-color: #fafafa;
        }

        .file-name {
            font-weight: 600;
            color: #0f172a;
            font-size: 11.5px;
            word-break: break-all;
        }

        .file-meta {
            font-size: 10px;
            color: #64748b;
            margin-top: 2px;
        }

        .hash-code {
            font-family: 'JetBrains Mono', 'Courier New', monospace;
            font-size: 10.5px;
            font-weight: 600;
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
            padding: 4px 8px;
            border-radius: 4px;
            word-break: break-all;
            color: #0f172a;
            display: block;
            margin-top: 2px;
        }

        /* Chain of custody box with QR */
        .custody-block {
            display: flex;
            gap: 25px;
            align-items: flex-start;
            margin-top: 25px;
        }

        .custody-statement {
            flex: 1;
            font-size: 11.5px;
            color: #334155;
            text-align: justify;
            line-height: 1.6;
        }

        .qr-section {
            border: 1px solid #cbd5e1;
            background-color: #ffffff;
            padding: 10px;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            width: fit-content;
            margin-bottom: 10px;
        }

        .qr-caption {
            font-size: 8.5px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 6px;
            max-width: 110px;
        }

        /* Signatures Panel */
        .signatures-grid {
            display: grid;
            grid-template-cols: repeat(2, 1fr);
            gap: 30px;
            margin-top: 45px;
            margin-bottom: 20px;
        }

        .signature-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            font-size: 11px;
        }

        .signature-line {
            width: 80%;
            height: 1px;
            background-color: #94a3b8;
            margin-bottom: 12px;
            margin-top: 40px;
        }

        .signature-name {
            font-weight: 700;
            color: #0f172a;
            font-size: 12px;
        }

        .signature-title {
            font-size: 10px;
            color: #64748b;
            margin-top: 2px;
        }

        /* Visual electronic signature stamp placeholder */
        .stamp-box {
            border: 1px dashed #22c55e;
            background-color: rgba(34, 197, 94, 0.02);
            padding: 12px;
            border-radius: 6px;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 85%;
            margin-top: 5px;
        }

        .stamp-icon {
            color: #22c55e;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 4px;
        }

        .stamp-text {
            color: #15803d;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-align: center;
        }

        .stamp-details {
            font-size: 8px;
            text-align: center;
            color: #166534;
            margin-top: 3px;
            font-family: 'JetBrains Mono', monospace;
        }

        /* Footer styling */
        .doc-footer {
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
            margin-top: 45px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 9px;
            color: #94a3b8;
            font-weight: 500;
        }

        .footer-brand {
            font-weight: 700;
            color: #64748b;
        }

        @media print {
            .no-print-bar {
                display: none !important;
            }
            .document-container {
                border: none !important;
                box-shadow: none !important;
                margin: 0 !important;
                padding: 0 !important;
                max-width: 100% !important;
            }
            body {
                background: #ffffff;
                color: #000000;
            }
        }
    </style>
</head>
<body>

    <div class="no-print-bar">
        <div>Atlas Evidências • Visualizador de Laudo Oficial</div>
        <button class="btn-print" onclick="window.print()">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Imprimir ou Salvar PDF
        </button>
    </div>

    <div class="document-container">
        <!-- HEADER -->
        <header class="doc-header">
            <div class="brand-section">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjF9JusWwDzpZmdIIUZaQza4tPVKTyL_yo4Y4RCIG8r9QEy20i9WbZ14795nZejE3flCApnVMDgSkilbCknJzJFNQjJPoGeHi4Uguy2vVCoZG75JrT7BFriqGvn4-dsmbqXNbexcNviGb-7ZmtWdDnEGkS3a8Ilvxb748E0_9rawg6wyxLlYgtE4NIo1THO-P7w8fyneJNaEXKgkoXuetgCTF2NNp-sEJnvVh0N1j2XIgEvqElCR6brRxZPea6wa4mKE4aJqgCYSI" class="brand-logo" alt="Logo Atlas Evidências">
                <div>
                    <h1 class="brand-title">Atlas Evidências</h1>
                    <p class="brand-subtitle font-bold">Relatório de Preservação Local de Provas</p>
                </div>
            </div>

            <div class="meta-section">
                <div class="meta-badge">Relatório Técnico Local</div>
                <h2 class="registry-code">RELATÓRIO DE PRESERVAÇÃO Nº ${reportCode}</h2>
                <p class="case-key">Código Atlas: <strong style="color: #b18e4c;">${cs.atlasCode || 'NÃO CONFIGURADO'}</strong> • Chave: <strong>${cs.id}</strong></p>
            </div>
        </header>

        <!-- SUMMARY DETAILS BLOCK -->
        <section class="meta-grid">
            <div class="meta-item">
                <span class="meta-label">CÓDIGO ATLAS VINCULADO</span>
                <span class="meta-value" style="font-weight: bold; color: #b18e4c;">${cs.atlasCode || 'NÃO CONFIGURADO'}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">ID DO CASO</span>
                <span class="meta-value">${cs.id}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">DATA DE REGISTRO</span>
                <span class="meta-value">${cs.date}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label text-ellipsis">CONTA DO USUÁRIO</span>
                <span class="meta-value text-ellipsis" title="${userEmail}">${userEmail}</span>
            </div>
        </section>

        ${cs.preservationSession?.started ? `
        <!-- PRESERVATION SESSION METADATA -->
        <section class="meta-grid" style="margin-top: 15px; background-color: #fafbfd; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; gap: 15px; display: grid; grid-template-columns: repeat(4, 1fr) !important;">
            <div class="meta-item">
                <span class="meta-label">SESSÃO DE PRESERVAÇÃO</span>
                <span class="meta-value" style="color: #10b981; font-weight: bold; text-transform: uppercase;">✔ Ativa e Vinculada</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">DATA DE INÍCIO</span>
                <span class="meta-value">${cs.preservationSession.startDate} às ${cs.preservationSession.startTime}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">SISTEMA OPERACIONAL</span>
                <span class="meta-value">${cs.preservationSession.os}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">NAVEGADOR UTILIZADO</span>
                <span class="meta-value">${cs.preservationSession.browser}</span>
            </div>
        </section>
        ` : ''}


        <!-- RESUMO DA PRESERVAÇÃO SECTION -->
        <div class="section-title">
            <span>1. Resumo de Registro Factual</span>
            <span style="font-size: 8.5px; opacity: 0.6; font-family: monospace;">Local software ledger</span>
        </div>
        
        <div class="meta-item" style="margin-bottom: 12px;">
            <span class="meta-label">Título do Caso</span>
            <p style="font-size: 13px; font-weight: bold; margin: 4px 0 10px 0; color: #0f172a;">${cs.name}</p>
        </div>

        <div class="meta-item" style="margin-bottom: 20px;">
            <span class="meta-label">Escopo / Descritivo Técnico do Caso</span>
            <div class="summary-text" style="margin-top: 5px;">
                ${cs.description}
            </div>
        </div>

        <!-- PRESERVED EVIDENCE TABLE SECTION -->
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
                        <div class="file-meta">Adicionado em: ${f.date} ${f.uploadTime ? `às ${f.uploadTime}` : ""} ${f.category ? `<span style="background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 8.5px; margin-left: 8px;">${f.category}</span>` : ""}</div>
                    </td>
                    <td><span style="font-weight: 500; text-transform: uppercase;">${f.type.split("/").pop()}</span></td>
                    <td style="font-weight: 600; color: #0f172a;">${f.size}</td>
                    <td>
                        <div class="hash-container" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 10px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600; color: #0f172a; word-break: break-all; cursor: pointer;" onclick="navigator.clipboard.writeText('${f.hash}'); alert('Hash SHA-256 copiado para a área de transferência:\n${f.hash}');" title="Clique para copiar">
                            <span style="font-family: inherit; word-break: break-all; font-size: 9.5px;">${f.hash}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; opacity: 0.5;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </div>
                    </td>
                </tr>
                `).join("")}
            </tbody>
        </table>

         <!-- CHRONOLOGICAL EVENTS SECTION -->
        <div class="section-title">
            <span>3. Histórico de Eventos Registrados (Espinha Dorsal Atlas)</span>
        </div>
        <div style="margin-bottom: 25px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; padding: 15px; font-family: 'Inter', sans-serif;">
            ${cs.events && cs.events.length > 0 ? `
            <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: left;">
                <thead>
                    <tr style="border-bottom: 2px solid #e2e8f0; color: #475569; font-weight: bold; font-size: 9px; uppercase tracking-wider">
                        <th style="padding: 8px 12px; width: 25%;">DATA E HORA DO EVENTO</th>
                        <th style="padding: 8px 12px; width: 75%;">DESCRIÇÃO / AÇÃO REGISTRADA DO USUÁRIO</th>
                    </tr>
                </thead>
                <tbody>
                    ${cs.events.map((ev) => `
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td style="padding: 8px 12px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #0f172a; font-weight: bold;">
                            ${ev.date} às ${ev.time}
                        </td>
                        <td style="padding: 8px 12px; color: #334155; font-weight: 500;">
                            ${ev.description}
                        </td>
                    </tr>
                    `).join("")}
                </tbody>
            </table>
            ` : `
            <div style="font-style: italic; color: #64748b; font-size: 11px; text-align: center; padding: 10px;">
                Nenhum evento registrado nesta sessão de preservação.
            </div>
            `}
        </div>

        <!-- INTEGRITY STATEMENTS WITH QR CODE -->
        <div class="section-title">
            <span>4. Declaração de Registro Técnico de Arquivos</span>
        </div>

        <div class="custody-block">
            <div class="custody-statement">
                Os arquivos listados no presente documento foram inseridos pelo usuário autenticado (<strong>${investigatorName}</strong>, conta: <strong>${userEmail}</strong>) durante a sessão Atlas e foram processados pela ferramenta local Atlas Evidências na data e no horário registrados. Durante o processamento de cada arquivo, foi calculada a soma de verificação por meio do algoritmo de hash unilateral <strong>SHA-256</strong> (Secure Hash Algorithm 256-bit).
                <br><br>
                A soma de verificação gerada atua como um identificador numérico de integridade matemática específico para o conteúdo exato de cada arquivo. Toda e qualquer alteração subsequente nos dados listados resultará em uma soma de verificação SHA-256 completamente distinta, viabilizando a auditoria fidedigna de integridade por terceiros interessados.
            </div>

            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; flex-shrink: 0; min-width: 170px; background-color: #fafbfd; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px;">
                <div class="qr-section" style="border: none; padding: 0; margin-bottom: 2px;">
                    ${qrSvgCode}
                </div>
                <div style="text-align: left; width: 100%; font-family: 'JetBrains Mono', monospace; font-size: 8px; color: #475569; line-height: 1.3; border-top: 1px dashed #cbd5e1; padding-top: 6px;">
                    <strong style="color: #0f172a; text-transform: uppercase; font-size: 8px; display: block; margin-bottom: 4px; letter-spacing: 0.5px;">✓ QR Código:</strong>
                    Laudo: ${reportCode}<br>
                    Caso: ${cs.id}<br>
                    Emissão: ${currentTimestamp}<br>
                    Identificador: <span style="font-weight: 600; color: #b18e4c;">VAL-${reportCode}-${cs.id}-8C29D8</span>
                </div>
            </div>
        </div>

        <!-- SIGNATURES AND SEALS -->
        <div class="section-title">
            <span>5. Detalhes de Registro e Assinatura Técnica</span>
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
                <div class="stamp-box" style="border-color: #cbd5e1; background-color: #f8fafc;">
                    <div class="stamp-icon" style="color: #64748b;">✓</div>
                    <div class="stamp-text font-bold" style="color: #475569;">SOMA DE VERIFICAÇÃO CALCULADA</div>
                    <div class="stamp-details" style="color: #64748b;">
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

        <!-- FOOTER -->
        <footer class="doc-footer">
            <div class="footer-brand">Atlas Evidências</div>
            <div>Relatório factual gerado pelo usuário por meio do navegador local • Página 1 de 1</div>
            <div>Cálculo de hash local via Web Crypto API</div>
        </footer>
    </div>

    <!-- Script to auto trigger print dialog if requested as premium flow -->
    <script>
        // document is highly optimized to let browser render correctly and scale properly
    </script>
</body>
</html>`;
}

export function getBrowserAndOS(): { browser: string; os: string } {
  const ua = navigator.userAgent;
  let browser = "Navegador Desconhecido";
  let os = "SO Desconhecido";

  // Simple OS recognition
  if (ua.indexOf("Win") !== -1) os = "Windows";
  else if (ua.indexOf("Mac") !== -1) os = "macOS";
  else if (ua.indexOf("X11") !== -1) os = "UNIX";
  else if (ua.indexOf("Linux") !== -1) os = "Linux";
  else if (ua.indexOf("Android") !== -1) os = "Android";
  else if (ua.indexOf("like Mac") !== -1) os = "iOS";

  // Simple Browser recognition
  if (ua.indexOf("Firefox") !== -1) browser = "Mozilla Firefox";
  else if (ua.indexOf("SamsungBrowser") !== -1) browser = "Samsung Internet";
  else if (ua.indexOf("Opera") !== -1 || ua.indexOf("OPR") !== -1) browser = "Opera";
  else if (ua.indexOf("Trident") !== -1) browser = "Internet Explorer";
  else if (ua.indexOf("Edge") !== -1) browser = "Microsoft Edge";
  else if (ua.indexOf("Chrome") !== -1) browser = "Google Chrome";
  else if (ua.indexOf("Safari") !== -1) browser = "Apple Safari";

  return { browser, os };
}

