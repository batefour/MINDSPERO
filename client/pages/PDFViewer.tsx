import { Link, useParams } from "react-router-dom";
import { Download, Share2, Copy, ChevronLeft } from "lucide-react";

export default function PDFViewer() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-primary hover:text-primary/80 transition">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition">
              <Copy className="w-5 h-5 text-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition">
              <Share2 className="w-5 h-5 text-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition">
              <Download className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row gap-6 max-w-7xl mx-auto w-full px-4 py-8">
        {/* PDF Display */}
        <div className="flex-1 bg-muted border border-border rounded-lg p-8 flex items-center justify-center min-h-96">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              PDF Viewer: {id || "No document selected"}
            </p>
            <p className="text-sm text-muted-foreground">
              PDF rendering component would be integrated here
            </p>
          </div>
        </div>

        {/* Summary Panel */}
        <div className="w-full md:w-96 space-y-6">
          <div className="bg-background border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Document Summary</h2>
            <p className="text-muted-foreground">
              This is where the AI-generated summary of the PDF will be displayed. Students can read key points, definitions, and main concepts extracted from their notes.
            </p>
            <button className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-medium">
              Download Summary
            </button>
          </div>

          <div className="bg-background border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Audio Explanation</h2>
            <p className="text-muted-foreground text-sm">
              Unlock audio explanations with Pro subscription
            </p>
            <Link
              to="/pricing"
              className="w-full py-2.5 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition font-medium text-center"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
