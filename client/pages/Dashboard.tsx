import { Link } from "react-router-dom";
import {
  FileText,
  Upload,
  Plus,
  Settings,
  LogOut,
  Zap,
  Headphones,
  Trash2,
  Download,
  Brain,
  Clock,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface PDFItem {
  id: string;
  name: string;
  uploadedAt: string;
  hasAudio: boolean;
  size: string;
}

export default function Dashboard() {
  const [pdfs, setPdfs] = useState<PDFItem[]>([
    {
      id: "1",
      name: "Biology Lecture Notes - Chapter 5",
      uploadedAt: "2 days ago",
      hasAudio: true,
      size: "2.4 MB",
    },
    {
      id: "2",
      name: "Mathematics - Calculus Fundamentals",
      uploadedAt: "1 week ago",
      hasAudio: false,
      size: "1.8 MB",
    },
    {
      id: "3",
      name: "Physics - Quantum Mechanics",
      uploadedAt: "2 weeks ago",
      hasAudio: true,
      size: "3.2 MB",
    },
  ]);

  const [activeTab, setActiveTab] = useState<"uploads" | "subscription" | "settings">(
    "uploads"
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userSubscriptionStatus = "active";
  const trialDaysLeft = 18;
  const totalUploads = pdfs.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/mindspero-logo.svg" alt="MindSpero" className="w-10 h-10 group-hover:scale-110 transition-transform" />
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">MindSpero</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <button className="p-2.5 hover:bg-muted rounded-lg transition group">
              <Settings className="w-5 h-5 text-foreground group-hover:text-primary transition" />
            </button>
            <button className="p-2.5 hover:bg-muted rounded-lg transition group text-destructive">
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className={`${
          mobileMenuOpen ? 'absolute' : 'hidden md:flex'
        } md:relative w-full md:w-64 bg-background/50 backdrop-blur-sm border-r border-border/50 flex-col z-40 md:z-0`}>
          <nav className="flex-1 p-6 space-y-2">
            <button
              onClick={() => {
                setActiveTab("uploads");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "uploads"
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30"
                  : "text-foreground hover:bg-muted/80"
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="font-bold">My Uploads</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("subscription");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "subscription"
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30"
                  : "text-foreground hover:bg-muted/80"
              }`}
            >
              <Zap className="w-5 h-5" />
              <span className="font-bold">Subscription</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("settings");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === "settings"
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30"
                  : "text-foreground hover:bg-muted/80"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-bold">Settings</span>
            </button>
          </nav>

          <div className="p-6 border-t border-border/50 space-y-4">
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-5 space-y-3 border border-primary/20">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium">Pro Trial Active</p>
                  <p className="text-lg font-bold text-foreground">{trialDaysLeft} days</p>
                </div>
              </div>
              <div className="w-full h-2 bg-background/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary w-3/5"></div>
              </div>
              <p className="text-xs text-muted-foreground">Trial ends in {trialDaysLeft} days</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {activeTab === "uploads" && (
            <div className="p-6 md:p-8 space-y-8">
              {/* Header */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  My Uploads
                </h1>
                <p className="text-lg text-muted-foreground">
                  Upload PDFs to get instant summaries and audio explanations
                </p>
              </div>

              {/* Upload Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative border-2 border-dashed border-primary/50 rounded-3xl p-12 text-center space-y-6 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group/upload">
                  <div className="flex justify-center">
                    <div className="p-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl group-hover/upload:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground mb-2">
                      Upload a PDF
                    </p>
                    <p className="text-muted-foreground">
                      Drag and drop your file or click to browse
                    </p>
                  </div>
                  <button className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all font-bold inline-flex items-center gap-2 group/btn">
                    <Plus className="w-5 h-5" />
                    Choose File
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: FileText, label: "Total Uploads", value: totalUploads, color: "primary" },
                  { icon: Brain, label: "Summaries Made", value: 5, color: "secondary" },
                  { icon: Headphones, label: "Audio Available", value: 2, color: "accent" },
                ].map((stat, i) => (
                  <div key={i} className="group bg-background border border-border/50 hover:border-primary/50 rounded-2xl p-6 space-y-4 transition-all hover:shadow-lg hover:shadow-primary/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
                        {stat.label}
                      </span>
                      <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform ${
                        stat.color === 'primary' ? 'bg-primary/20 text-primary' :
                        stat.color === 'secondary' ? 'bg-secondary/20 text-secondary' :
                        'bg-accent/20 text-accent'
                      }`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                    </div>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Recent Uploads */}
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-foreground">Recent Uploads</h2>
                <div className="space-y-3">
                  {pdfs.map((pdf) => (
                    <div
                      key={pdf.id}
                      className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-background border border-border/50 hover:border-primary/50 rounded-2xl transition-all hover:shadow-lg hover:shadow-primary/5"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground font-bold truncate group-hover:text-primary transition">
                            {pdf.name}
                          </p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {pdf.uploadedAt}
                            </span>
                            <span>{pdf.size}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        {pdf.hasAudio && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary text-xs font-bold rounded-full border border-primary/30">
                            <Headphones className="w-3 h-3" />
                            Audio
                          </span>
                        )}

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-muted rounded-lg transition group/btn">
                            <Download className="w-4 h-4 text-muted-foreground group-hover/btn:text-primary transition" />
                          </button>
                          <button className="p-2 hover:bg-muted rounded-lg transition group/btn">
                            <Trash2 className="w-4 h-4 text-muted-foreground group-hover/btn:text-destructive transition" />
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
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Subscription
                </h1>
                <p className="text-lg text-muted-foreground">Manage your plan and billing</p>
              </div>

              {/* Current Plan */}
              <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-primary/30 rounded-3xl p-8 md:p-12 space-y-8">
                <div className="space-y-3">
                  <div className="inline-block">
                    <span className="px-3 py-1.5 bg-primary/20 text-primary text-xs font-bold rounded-full">
                      Current Plan
                    </span>
                  </div>
                  <h2 className="text-4xl font-black text-foreground flex items-center gap-3">
                    <span className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl">
                      <Zap className="w-6 h-6 text-white" />
                    </span>
                    Pro Trial
                  </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { label: "Status", value: "Active", icon: CheckCircle },
                    { label: "Trial Days Left", value: trialDaysLeft.toString(), highlight: true },
                    { label: "Renews In", value: `${trialDaysLeft} days` },
                  ].map((item, i) => (
                    <div key={i} className="space-y-2 p-4 rounded-xl bg-background/50 border border-border/50">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{item.label}</p>
                      <p className={`text-2xl font-bold ${item.highlight ? 'text-primary' : 'text-foreground'}`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 flex-wrap">
                  <button className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all font-bold">
                    Upgrade to Pro
                  </button>
                  <button className="px-6 py-3 border-2 border-border rounded-xl text-foreground hover:bg-muted transition-all font-bold">
                    View Billing
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-foreground">What's Included</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: FileText, text: "Unlimited PDF uploads" },
                    { icon: Brain, text: "AI-powered summaries" },
                    { icon: Headphones, text: "Audio explanations" },
                    { icon: Download, text: "Download summaries" },
                    { icon: Zap, text: "Priority support" },
                    { icon: Clock, text: "30 days bonus per purchase" },
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-5 bg-background border border-border/50 rounded-2xl hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group"
                    >
                      <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-bold text-foreground">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment History */}
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-foreground">Payment History</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-5 bg-background border border-border/50 rounded-2xl">
                    <div>
                      <p className="font-bold text-foreground">Pro Trial Started</p>
                      <p className="text-sm text-muted-foreground">Free access to all features</p>
                    </div>
                    <p className="text-2xl font-black text-primary">GHC 0.00</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="p-6 md:p-8 space-y-8">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Settings
                </h1>
                <p className="text-lg text-muted-foreground">Manage your account and preferences</p>
              </div>

              {/* Account Settings */}
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-foreground">Account</h3>
                <div className="bg-background border border-border/50 rounded-2xl p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-foreground uppercase tracking-wide">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value="student@example.com"
                      disabled
                      className="w-full px-4 py-3 border border-border rounded-xl bg-muted text-foreground focus:outline-none focus:border-primary transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-foreground uppercase tracking-wide">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value="John Doe"
                      disabled
                      className="w-full px-4 py-3 border border-border rounded-xl bg-muted text-foreground focus:outline-none focus:border-primary transition"
                    />
                  </div>
                  <button className="px-6 py-3 border-2 border-border rounded-xl text-foreground hover:bg-muted transition-all font-bold">
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-foreground">Preferences</h3>
                <div className="bg-background border border-border/50 rounded-2xl p-8 space-y-4">
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-bold text-foreground">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Get updates about your uploads</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-6 h-6 rounded cursor-pointer" />
                  </div>
                  <div className="border-t border-border/50"></div>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-bold text-foreground">Marketing Emails</p>
                      <p className="text-sm text-muted-foreground">Hear about new features</p>
                    </div>
                    <input type="checkbox" className="w-6 h-6 rounded cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-destructive">Danger Zone</h3>
                <div className="bg-destructive/10 border-2 border-destructive/30 rounded-2xl p-8 space-y-4">
                  <p className="text-foreground font-bold">
                    Deleting your account is permanent and cannot be undone.
                  </p>
                  <button className="px-6 py-3 bg-destructive text-white rounded-xl hover:shadow-lg hover:shadow-destructive/30 transition-all font-bold">
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
