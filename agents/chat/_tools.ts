/**
 * Shared utilities for the document processing agent.
 * (TOOLS array and buildToolExecutors removed — now handled by Claude Agent SDK + MCP servers)
 */

/** Shell-safe single-quote wrapping */
export function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

/** Text file extensions that can be inlined when sandbox is unavailable */
const TEXT_FALLBACK_EXTENSIONS = new Set([
  '.txt', '.md', '.csv', '.json', '.xml', '.html', '.css',
  '.js', '.ts', '.tsx', '.py', '.log', '.yml', '.yaml', '.sql',
]);

/** Check if a file can be safely inlined as UTF-8 text */
export function canInlineFallbackFile(fileName: string, content: Buffer): boolean {
  const lowerName = fileName.toLowerCase();
  const extension = lowerName.includes('.')
    ? lowerName.slice(lowerName.lastIndexOf('.'))
    : '';
  if (!TEXT_FALLBACK_EXTENSIONS.has(extension)) return false;
  if (content.includes(0)) return false;

  const decoded = content.toString('utf8');
  const replacementCount = decoded.match(/\uFFFD/g)?.length ?? 0;
  return replacementCount / Math.max(decoded.length, 1) < 0.01;
}

/** Default suggestions per file type for the fallback suggest_actions */
type ActionItem = { id: string; emoji: string; title: string; description: string };

export function buildDefaultActions(uploadedFiles: Array<{ name: string }>): ActionItem[] {
  const fileTypes = new Set(uploadedFiles.map(f => {
    const ext = f.name.split('.').pop()?.toLowerCase() || '';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'word';
    if (['xls', 'xlsx'].includes(ext)) return 'excel';
    if (ext === 'csv') return 'csv';
    return 'text';
  }));

  if (fileTypes.has('image')) {
    return [
      { id: 'a1', emoji: '🔄', title: 'Format Conversion', description: 'Convert image to PNG, WebP and other formats' },
      { id: 'a2', emoji: '📦', title: 'Compress Image', description: 'Compress image file size and optimize storage' },
      { id: 'a3', emoji: '📐', title: 'Resize', description: 'Resize or crop image dimensions' },
      { id: 'a4', emoji: '💧', title: 'Add Watermark', description: 'Add custom text watermark to image' },
    ];
  }
  if (fileTypes.has('pdf')) {
    return [
      { id: 'a1', emoji: '📝', title: 'Extract Text', description: 'Extract all text content from PDF' },
      { id: 'a2', emoji: '📊', title: 'Extract Table', description: 'Extract table data from PDF' },
      { id: 'a3', emoji: '📋', title: 'Generate Summary', description: 'Summarize core content of PDF document' },
      { id: 'a4', emoji: '🔗', title: 'Merge PDF', description: 'Merge with other PDF files' },
    ];
  }
  if (fileTypes.has('word')) {
    return [
      { id: 'a1', emoji: '📄', title: 'Convert to PDF', description: 'Convert Word document to PDF format' },
      { id: 'a2', emoji: '📝', title: 'Extract Text', description: 'Extract all text from document' },
      { id: 'a3', emoji: '📊', title: 'Extract Table', description: 'Extract table data from document' },
      { id: 'a4', emoji: '📋', title: 'Content Summary', description: 'Generate document content summary' },
    ];
  }
  if (fileTypes.has('csv') || fileTypes.has('excel')) {
    return [
      { id: 'a1', emoji: '📊', title: 'Data Analysis', description: 'Perform statistical analysis and generate summary' },
      { id: 'a2', emoji: '📈', title: 'Generate Chart', description: 'Visualize data as charts' },
      { id: 'a3', emoji: '📄', title: 'Export PDF Report', description: 'Generate formatted PDF data report' },
    ];
  }
  return [
    { id: 'a1', emoji: '📋', title: 'Content Summary', description: 'Extract core content and generate summary' },
    { id: 'a2', emoji: '📄', title: 'Convert to PDF', description: 'Format text content as PDF file' },
    { id: 'a3', emoji: '🔍', title: 'Structure Analysis', description: 'Analyze file structure and key information' },
    { id: 'a4', emoji: '🌐', title: 'Translation', description: 'Translate content to other languages' },
  ];
}
