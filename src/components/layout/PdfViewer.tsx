interface PdfViewerProps {
  pdfUrl?: string;
  title?:  string;
}

export default function PdfViewer({ pdfUrl, title }: PdfViewerProps) {
  if (!pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center h-full">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-sm text-gray-400 max-w-xs">
          The source material for this lesson isn't available yet.
        </p>
      </div>
    );
  }

  return (
    <object
      data={pdfUrl}
      type="application/pdf"
      className="w-full h-full rounded-lg"
      title={title ?? 'Lesson source material'}
    >
      {/* Fallback for browsers that can't render a PDF inline (e.g. most mobile browsers) */}
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center h-full">
        <p className="text-sm text-gray-500 max-w-xs">
          Your browser can't preview this PDF here.{' '}
          <a href={pdfUrl} target="_blank" rel="noreferrer" className="text-accent font-semibold underline">
            Open it in a new tab
          </a>
          .
        </p>
      </div>
    </object>
  );
}
