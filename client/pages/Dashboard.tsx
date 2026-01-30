import { Link } from "react-router-dom";
import {
  FileText,
  Upload,
  Plus,
  Settings,
  LogOut,
  Zap,
  BarChart3,
  Headphones,
  Clock,
  Trash2,
  Download,
} from "lucide-react";
import { useState } from "react";

interface PDFItem {
  id: string;
  name: string;
  uploadedAt: string;
  hasAudio: boolean;
}

export default function Dashboard() {
  const [pdfs, setPdfs] = useState<PDFItem[]>([
    {
      id: "1",
      name: "Biology Lecture Notes - Chapter 5",
      uploadedAt: "2 days ago",
      hasAudio: true,
    },
    {
      id: "2",
      name: "Mathematics - Calculus Fundamentals",
      uploadedAt: "1 week ago",
      hasAudio: false,
    },
    {
      id: "3",
      name: "Physics - Quantum Mechanics",
      uploadedAt: "2 weeks ago",
      hasAudio: true,
    },
  ]);

  const [activeTab, setActiveTab] = useState<
    "uploads" | "subscription" | "settings"
  >("uploads");

  // Get user data (placeholder)
  const userSubscriptionStatus = "active";
  const trialDaysLeft = 30;
  const totalUploads = pdfs.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>
            <span className="text-lg font-bold text-foreground">MindSpero</span>
          </Link>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-muted rounded-lg transition">
              <Settings className="w-5 h-5 text-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition">
              <LogOut className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="hidden md:flex md:flex-col w-64 bg-muted/30 border-r border-border">
          <nav className="flex-1 p-6 space-y-2">
            <button
              onClick={() => setActiveTab("uploads")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                activeTab === "uploads"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">My Uploads</span>
            </button>

            <button
              onClick={() => setActiveTab("subscription")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                activeTab === "subscription"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Zap className="w-5 h-5" />
              <span className="font-medium">Subscription</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                activeTab === "settings"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </nav>

          <div className="p-6 border-t border-border space-y-3">
            <div className="bg-primary/10 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Pro Trial Active
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {trialDaysLeft} days left
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {activeTab === "uploads" && (
            <div className="p-6 md:p-8 space-y-8">
              {/* Upload Section */}
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-foreground">
                  My Uploads
                </h1>
                <p className="text-muted-foreground">
                  Upload your PDF notes and get instant summaries
                </p>
              </div>

              {/* Upload Card */}
              <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center space-y-4 hover:border-primary hover:bg-primary/5 transition">
                <div className="flex justify-center">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-foreground font-medium mb-1">
                    Drag and drop your PDF here
                  </p>
                  <p className="text-muted-foreground text-sm">
                    or click to browse your files
                  </p>
                </div>
                <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-medium inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Choose File
                </button>
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-background border border-border rounded-lg p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Uploads
                    </span>
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">
                    {totalUploads}
                  </p>
                </div>

                <div className="bg-background border border-border rounded-lg p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Summaries Made
                    </span>
                    <Zap className="w-5 h-5 text-secondary" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">5</p>
                </div>

                <div className="bg-background border border-border rounded-lg p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Audio Available
                    </span>
                    <Headphones className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">2</p>
                </div>
              </div>

              {/* Recent Uploads */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">
                  Recent Uploads
                </h2>
                <div className="space-y-2">
                  {pdfs.map((pdf) => (
                    <div
                      key={pdf.id}
                      className="flex items-center justify-between p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground font-medium truncate">
                            {pdf.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {pdf.uploadedAt}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {pdf.hasAudio && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                            <Headphones className="w-3 h-3" />
                            Audio
                          </span>
                        )}

                        <div className="flex gap-1">
                          <button className="p-2 hover:bg-muted rounded-lg transition">
                            <Download className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button className="p-2 hover:bg-muted rounded-lg transition">
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "subscription" && (
            <div className="p-6 md:p-8 space-y-8">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  Subscription
                </h1>
                <p className="text-muted-foreground">
                  Manage your subscription and billing
                </p>
              </div>

              {/* Current Plan */}
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-8 space-y-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Current Plan</p>
                  <h2 className="text-3xl font-bold text-foreground">
                    Pro Trial
                  </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-foreground font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Trial Days Left
                    </p>
                    <p className="text-foreground font-bold text-2xl">
                      {trialDaysLeft}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Renews</p>
                    <p className="text-foreground font-medium">
                      In {trialDaysLeft} days
                    </p>
                  </div>
                </div>

                <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-medium">
                  View Billing
                </button>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">
                  What's Included
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Unlimited PDF uploads",
                    "AI-powered summaries",
                    "Audio explanations",
                    "Download summaries",
                    "Priority support",
                    "1 month bonus with purchase",
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-4 bg-background border border-border rounded-lg"
                    >
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment History */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">
                  Payment History
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
                    <div>
                      <p className="text-foreground font-medium">
                        Trial started
                      </p>
                      <p className="text-sm text-muted-foreground">Free</p>
                    </div>
                    <p className="text-foreground font-medium">GHS 0.00</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="p-6 md:p-8 space-y-8">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground">
                  Manage your account preferences
                </p>
              </div>

              {/* Account Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground">Account</h3>
                <div className="bg-background border border-border rounded-lg p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value="student@example.com"
                      disabled
                      className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value="John Doe"
                      disabled
                      className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-destructive">
                  Danger Zone
                </h3>
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6 space-y-4">
                  <p className="text-foreground">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                  <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition font-medium">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
