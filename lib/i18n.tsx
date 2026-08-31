'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Locale = 'en';

export const translations = {
  en: {
    title: 'Smart Document Processor',
    description: 'AI Agent-powered: PDF merge, Word→PDF, Excel→Markdown, image analysis, video parsing',
    dropFiles: 'Drop files or click to upload',
    process: 'Process',
    clear: 'Clear',
    summary: 'Summary',
    processing: 'Processing...',
    processingResults: 'Processing Results',
    processingLog: 'Processing Log',
    fileQueue: 'File Queue',
    dropHere: 'Drop files here or click to browse',
    orDescribeBelow: 'Or describe files below',
    typePlaceholder: 'Type filename (e.g., report.pdf) and press Enter',
    add: 'Add',
    processSampleFiles: 'Process sample files',
    noFilesInQueue: 'No files in queue. Add files to get started.',
    processAll: 'Process All',
    showLess: 'Show Less',
    viewFull: 'View Full',
    noContent: 'No content available.',
    crossFileSummary: 'Cross-File Summary',
    queued: 'Queued',
    done: 'Done',
    error: 'Error',
    toolCalled: 'Tool Called',
    supportedTypes: 'Supports PDF, Word, Excel, Images, CSV, Text',
    video: 'Video',
    word: 'Word',
    excel: 'Excel',
    quotaExhausted: 'AI model quota exhausted. Please try again later or upgrade your plan.',
    startProcessing: '🚀 Processing...',
    analyzingFiles: 'Analyzing files...',
    suggestPrompt: 'I uploaded these files. Please analyze them and suggest processing options.',
    emptyHint: 'Not sure what to do? Try uploading some files to get started',
    importSample: '📊 Import samples',
    taskComplete: '✅ Task completed',
    preparingEnv: 'Preparing environment...',
  },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: typeof translations.en;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: translations.en,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  // English-only locale
  const [locale, setLocale] = useState<Locale>('en');
  const t = translations[locale];
  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
