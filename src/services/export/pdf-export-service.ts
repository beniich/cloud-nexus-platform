// src/services/export/pdf-export-service.ts

/**
 * Service d'export de rapports PDF
 * Utilise jsPDF pour la génération côté client
 */

// Note: En production, installer jsPDF via npm
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

export interface PDFExportConfig {
    title: string;
    subtitle?: string;
    author?: string;
    includeCharts?: boolean;
    includeTables?: boolean;
    includeMetadata?: boolean;
    theme?: 'light' | 'dark' | 'professional';
}

export interface ABTestReport {
    test: {
        id: string;
        name: string;
        status: string;
        createdAt: string;
        completedAt?: string;
    };
    variants: Array<{
        name: string;
        impressions: number;
        successRate: number;
        avgRating: number;
    }>;
    winner?: {
        name: string;
        improvement: number;
        confidence: number;
    };
    statistical: {
        pValue: number;
        zScore: number;
        significanceLevel: number;
    };
}

export interface FineTuningReport {
    job: {
        id: string;
        name: string;
        baseModel: string;
        status: string;
        startedAt: string;
        completedAt?: string;
    };
    dataset: {
        name: string;
        size: number;
        examples: number;
    };
    training: {
        epochs: number;
        trainingLoss: number[];
        validationLoss: number[];
    };
    results?: {
        fineTunedModel: string;
        accuracy: number;
        improvement: number;
        cost: number;
    };
}

export class PDFExportService {
    /**
     * Génère un PDF pour un test A/B
     */
    async exportABTestReport(
        report: ABTestReport,
        config: PDFExportConfig
    ): Promise<Blob> {
        // Simulation : en production, utiliser jsPDF
        const content = this.generateABTestHTML(report, config);
        return this.htmlToPDF(content, config);
    }

    /**
     * Génère un PDF pour un job de fine-tuning
     */
    async exportFineTuningReport(
        report: FineTuningReport,
        config: PDFExportConfig
    ): Promise<Blob> {
        const content = this.generateFineTuningHTML(report, config);
        return this.htmlToPDF(content, config);
    }

    /**
     * Génère un rapport complet incluant tous les tests et jobs
     */
    async exportFullReport(data: {
        abTests: ABTestReport[];
        fineTuningJobs: FineTuningReport[];
        period: { start: string; end: string };
    }, config: PDFExportConfig): Promise<Blob> {
        const content = this.generateFullReportHTML(data, config);
        return this.htmlToPDF(content, config);
    }

    /**
     * Génère le HTML pour un test A/B
     */
    private generateABTestHTML(report: ABTestReport, config: PDFExportConfig): string {
        return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      margin: 40px;
      color: #333;
    }
    h1 {
      color: #2563EB;
      border-bottom: 3px solid #2563EB;
      padding-bottom: 10px;
      margin-bottom: 30px;
    }
    h2 {
      color: #1E40AF;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .subtitle {
      color: #666;
      font-size: 14px;
    }
    .metadata {
      background: #F3F4F6;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .metadata-item {
      display: inline-block;
      margin-right: 30px;
      margin-bottom: 10px;
    }
    .metadata-label {
      font-weight: bold;
      color: #666;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th {
      background: #2563EB;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #E5E7EB;
    }
    tr:hover {
      background: #F9FAFB;
    }
    .winner {
      background: #FEF3C7;
      font-weight: bold;
    }
    .metric {
      display: inline-block;
      background: #EFF6FF;
      padding: 8px 16px;
      border-radius: 6px;
      margin: 5px;
    }
    .metric-label {
      color: #666;
      font-size: 12px;
    }
    .metric-value {
      color: #2563EB;
      font-size: 20px;
      font-weight: bold;
    }
    .conclusion {
      background: #F0FDF4;
      border-left: 4px solid #10B981;
      padding: 20px;
      margin-top: 30px;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      color: #999;
      font-size: 12px;
      border-top: 1px solid #E5E7EB;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${config.title}</h1>
    ${config.subtitle ? `<p class="subtitle">${config.subtitle}</p>` : ''}
  </div>

  <div class="metadata">
    <div class="metadata-item">
      <span class="metadata-label">Test Name:</span> ${report.test.name}
    </div>
    <div class="metadata-item">
      <span class="metadata-label">Status:</span> ${report.test.status}
    </div>
    <div class="metadata-item">
      <span class="metadata-label">Created:</span> ${new Date(report.test.createdAt).toLocaleDateString()}
    </div>
    ${report.test.completedAt ? `
    <div class="metadata-item">
      <span class="metadata-label">Completed:</span> ${new Date(report.test.completedAt).toLocaleDateString()}
    </div>
    ` : ''}
  </div>

  <h2>Variants Performance</h2>
  <table>
    <thead>
      <tr>
        <th>Variant</th>
        <th>Impressions</th>
        <th>Success Rate</th>
        <th>Avg Rating</th>
      </tr>
    </thead>
    <tbody>
      ${report.variants.map(v => `
        <tr ${report.winner?.name === v.name ? 'class="winner"' : ''}>
          <td>${v.name} ${report.winner?.name === v.name ? '🏆' : ''}</td>
          <td>${v.impressions.toLocaleString()}</td>
          <td>${(v.successRate * 100).toFixed(2)}%</td>
          <td>${v.avgRating.toFixed(2)}/5.0</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  ${report.winner ? `
  <h2>Results</h2>
  <div>
    <div class="metric">
      <div class="metric-label">Improvement</div>
      <div class="metric-value">+${report.winner.improvement.toFixed(1)}%</div>
    </div>
    <div class="metric">
      <div class="metric-label">Confidence</div>
      <div class="metric-value">${report.winner.confidence.toFixed(1)}%</div>
    </div>
    <div class="metric">
      <div class="metric-label">P-Value</div>
      <div class="metric-value">${report.statistical.pValue.toFixed(4)}</div>
    </div>
  </div>

  <div class="conclusion">
    <strong>Conclusion:</strong> 
    ${report.winner.name} is the winning variant with a ${report.winner.improvement.toFixed(1)}% improvement 
    and ${report.winner.confidence.toFixed(1)}% statistical confidence.
    ${report.winner.confidence > 95 ? 'This result is statistically significant and recommended for implementation.' :
                    'Consider running the test longer for higher confidence.'}
  </div>
  ` : ''}

  <div class="footer">
    Generated on ${new Date().toLocaleString()} | 
    ${config.author ? `Author: ${config.author}` : ''}
  </div>
</body>
</html>
    `;
    }

    /**
     * Génère le HTML pour un job de fine-tuning
     */
    private generateFineTuningHTML(report: FineTuningReport, config: PDFExportConfig): string {
        return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      margin: 40px;
      color: #333;
    }
    h1 {
      color: #8B5CF6;
      border-bottom: 3px solid #8B5CF6;
      padding-bottom: 10px;
      margin-bottom: 30px;
    }
    h2 {
      color: #7C3AED;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .metadata {
      background: #F3F4F6;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .metadata-item {
      display: inline-block;
      margin-right: 30px;
      margin-bottom: 10px;
    }
    .metadata-label {
      font-weight: bold;
      color: #666;
    }
    .chart-container {
      background: white;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .metric {
      display: inline-block;
      background: #F5F3FF;
      padding: 8px 16px;
      border-radius: 6px;
      margin: 5px;
    }
    .metric-label {
      color: #666;
      font-size: 12px;
    }
    .metric-value {
      color: #8B5CF6;
      font-size: 20px;
      font-weight: bold;
    }
    .success {
      background: #F0FDF4;
      border-left: 4px solid #10B981;
      padding: 20px;
      margin-top: 30px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th {
      background: #8B5CF6;
      color: white;
      padding: 12px;
      text-align: left;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #E5E7EB;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      color: #999;
      font-size: 12px;
      border-top: 1px solid #E5E7EB;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${config.title}</h1>
    ${config.subtitle ? `<p class="subtitle">${config.subtitle}</p>` : ''}
  </div>

  <div class="metadata">
    <div class="metadata-item">
      <span class="metadata-label">Job Name:</span> ${report.job.name}
    </div>
    <div class="metadata-item">
      <span class="metadata-label">Base Model:</span> ${report.job.baseModel}
    </div>
    <div class="metadata-item">
      <span class="metadata-label">Status:</span> ${report.job.status}
    </div>
    <div class="metadata-item">
      <span class="metadata-label">Started:</span> ${new Date(report.job.startedAt).toLocaleDateString()}
    </div>
  </div>

  <h2>Dataset Information</h2>
  <table>
    <tr>
      <td><strong>Name:</strong></td>
      <td>${report.dataset.name}</td>
    </tr>
    <tr>
      <td><strong>Total Examples:</strong></td>
      <td>${report.dataset.examples.toLocaleString()}</td>
    </tr>
    <tr>
      <td><strong>Size:</strong></td>
      <td>${(report.dataset.size / 1024).toFixed(2)} KB</td>
    </tr>
  </table>

  <h2>Training Configuration</h2>
  <table>
    <tr>
      <td><strong>Epochs:</strong></td>
      <td>${report.training.epochs}</td>
    </tr>
    <tr>
      <td><strong>Final Training Loss:</strong></td>
      <td>${report.training.trainingLoss[report.training.trainingLoss.length - 1].toFixed(4)}</td>
    </tr>
    <tr>
      <td><strong>Final Validation Loss:</strong></td>
      <td>${report.training.validationLoss[report.training.validationLoss.length - 1].toFixed(4)}</td>
    </tr>
  </table>

  ${report.results ? `
  <h2>Results</h2>
  <div>
    <div class="metric">
      <div class="metric-label">Accuracy</div>
      <div class="metric-value">${(report.results.accuracy * 100).toFixed(1)}%</div>
    </div>
    <div class="metric">
      <div class="metric-label">Improvement</div>
      <div class="metric-value">+${report.results.improvement.toFixed(1)}%</div>
    </div>
    <div class="metric">
      <div class="metric-label">Cost</div>
      <div class="metric-value">$${report.results.cost.toFixed(2)}</div>
    </div>
  </div>

  <div class="success">
    <strong>Success!</strong> Training completed successfully. 
    Fine-tuned model <code>${report.results.fineTunedModel}</code> 
    achieved ${(report.results.accuracy * 100).toFixed(1)}% accuracy with 
    ${report.results.improvement.toFixed(1)}% improvement over the base model.
  </div>
  ` : ''}

  <div class="footer">
    Generated on ${new Date().toLocaleString()} | 
    ${config.author ? `Author: ${config.author}` : ''}
  </div>
</body>
</html>
    `;
    }

    /**
     * Génère le HTML pour un rapport complet
     */
    private generateFullReportHTML(data: any, config: PDFExportConfig): string {
        return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      margin: 40px;
      color: #333;
    }
    h1 {
      color: #1F2937;
      text-align: center;
      margin-bottom: 10px;
    }
    .cover {
      text-align: center;
      padding: 100px 0;
    }
    .cover-title {
      font-size: 32px;
      font-weight: bold;
      color: #1F2937;
      margin-bottom: 20px;
    }
    .cover-subtitle {
      font-size: 18px;
      color: #666;
      margin-bottom: 40px;
    }
    .summary-card {
      background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
      color: white;
      padding: 30px;
      border-radius: 12px;
      margin: 30px 0;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 20px;
    }
    .summary-item {
      text-align: center;
    }
    .summary-value {
      font-size: 36px;
      font-weight: bold;
    }
    .summary-label {
      font-size: 14px;
      opacity: 0.9;
      margin-top: 5px;
    }
    h2 {
      color: #2563EB;
      border-bottom: 2px solid #2563EB;
      padding-bottom: 10px;
      margin-top: 40px;
    }
    .section {
      margin-bottom: 40px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th {
      background: #F3F4F6;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #1F2937;
      border-bottom: 2px solid #E5E7EB;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #E5E7EB;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      color: #999;
      font-size: 12px;
      border-top: 1px solid #E5E7EB;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="cover">
    <div class="cover-title">${config.title}</div>
    <div class="cover-subtitle">
      Period: ${new Date(data.period.start).toLocaleDateString()} - ${new Date(data.period.end).toLocaleDateString()}
    </div>
  </div>

  <div class="summary-card">
    <h2 style="color: white; border: none; margin-top: 0;">Executive Summary</h2>
    <div class="summary-grid">
      <div class="summary-item">
        <div class="summary-value">${data.abTests.length}</div>
        <div class="summary-label">A/B Tests</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${data.fineTuningJobs.length}</div>
        <div class="summary-label">Training Jobs</div>
      </div>
      <div class="summary-item">
        <div class="summary-value">${data.abTests.filter((t: any) => t.test.status === 'completed').length}</div>
        <div class="summary-label">Completed Tests</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>A/B Testing Results</h2>
    <table>
      <thead>
        <tr>
          <th>Test Name</th>
          <th>Status</th>
          <th>Winner</th>
          <th>Improvement</th>
          <th>Confidence</th>
        </tr>
      </thead>
      <tbody>
        ${data.abTests.map((test: ABTestReport) => `
          <tr>
            <td>${test.test.name}</td>
            <td>${test.test.status}</td>
            <td>${test.winner?.name || '-'}</td>
            <td>${test.winner ? `+${test.winner.improvement.toFixed(1)}%` : '-'}</td>
            <td>${test.winner ? `${test.winner.confidence.toFixed(1)}%` : '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Fine-tuning Jobs</h2>
    <table>
      <thead>
        <tr>
          <th>Job Name</th>
          <th>Base Model</th>
          <th>Status</th>
          <th>Accuracy</th>
          <th>Improvement</th>
        </tr>
      </thead>
      <tbody>
        ${data.fineTuningJobs.map((job: FineTuningReport) => `
          <tr>
            <td>${job.job.name}</td>
            <td>${job.job.baseModel}</td>
            <td>${job.job.status}</td>
            <td>${job.results ? `${(job.results.accuracy * 100).toFixed(1)}%` : '-'}</td>
            <td>${job.results ? `+${job.results.improvement.toFixed(1)}%` : '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="footer">
    Generated on ${new Date().toLocaleString()} | 
    ${config.author ? `Author: ${config.author}` : 'AI Optimization Hub'}
  </div>
</body>
</html>
    `;
    }

    /**
     * Convertit HTML en PDF (simulation)
     * En production, utiliser jsPDF ou html2pdf
     */
    private async htmlToPDF(html: string, config: PDFExportConfig): Promise<Blob> {
        // Simulation : créer un blob HTML
        // En production, utiliser jsPDF :
        /*
        const doc = new jsPDF();
        await doc.html(html, {
          callback: function (doc) {
            doc.save(`${config.title}.pdf`);
          },
          x: 10,
          y: 10
        });
        */

        // Pour la démo, retourner le HTML comme blob
        return new Blob([html], { type: 'text/html' });
    }

    /**
     * Télécharge le PDF
     */
    downloadPDF(blob: Blob, filename: string): void {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Export CSV pour données tabulaires
     */
    exportToCSV(data: any[], filename: string): void {
        if (data.length === 0) return;

        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row =>
                headers.map(h => {
                    const value = row[h];
                    return typeof value === 'string' && value.includes(',')
                        ? `"${value}"`
                        : value;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

export default PDFExportService;
