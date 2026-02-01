import { Link } from "react-router-dom";
import { ArrowRight, FileText, Zap, Headphones, CheckCircle, Sparkles, BookOpen, Brain } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-50 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/mindspero-logo.svg" alt="MindSpero" className="w-10 h-10 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">MindSpero</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-foreground hover:text-primary transition font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all font-bold text-sm"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold flex items-center gap-2 w-fit">
                  <Sparkles className="w-4 h-4" /> AI-Powered Learning
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-foreground leading-tight">
                Study Smarter, <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">Not Harder</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                Upload your lecture notes. Get instant summaries. Listen to personalized audio explanations. Transform your study routine in minutes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-2xl hover:shadow-primary/40 transition-all font-bold text-base group"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-border text-foreground rounded-xl hover:bg-muted hover:border-primary transition-all font-bold"
              >
                See Plans
              </Link>
            </div>

            <div className="flex gap-8 pt-4">
              <div className="space-y-1">
                <div className="text-3xl font-black text-primary">100%</div>
                <p className="text-sm text-muted-foreground">Free to Start</p>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-secondary">∞</div>
                <p className="text-sm text-muted-foreground">Summaries</p>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-accent">10M+</div>
                <p className="text-sm text-muted-foreground">Pages Analyzed</p>
              </div>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="relative h-64 sm:h-80 md:h-96 min-h-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent rounded-3xl border border-border/50 backdrop-blur-xl flex items-center justify-center overflow-hidden group">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-10 right-10 w-32 h-32 bg-primary rounded-full opacity-20 blur-3xl animate-pulse"></div>
              </div>
              <div className="relative z-10 text-center space-y-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto">
                  <FileText className="w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 text-white" />
                </div>
                <div>
                  <p className="text-foreground font-bold text-lg">Drop your PDFs here</p>
                  <p className="text-muted-foreground text-sm">Instant summaries powered by AI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
            Three Steps to Success
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our three-step process is designed for maximum learning efficiency
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-background rounded-2xl p-8 border border-border/50 hover:border-primary/50 transition-all space-y-6 h-full">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Upload</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Drag and drop any PDF from your classes, textbooks, or study materials. Supports files of any size.
                </p>
              </div>
              <div className="text-sm font-bold text-primary">30 seconds</div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-background rounded-2xl p-8 border border-border/50 hover:border-secondary/50 transition-all space-y-6 h-full">
              <div className="w-14 h-14 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Summarize</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our AI instantly creates clear, concise summaries. Free forever. Perfect for quick review and concept mastery.
                </p>
              </div>
              <div className="text-sm font-bold text-secondary">Instant</div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-background rounded-2xl p-8 border border-border/50 hover:border-accent/50 transition-all space-y-6 h-full">
              <div className="w-14 h-14 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Headphones className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Listen</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upgrade to unlock AI audio tutoring. Hear personalized explanations anytime, anywhere. Learn on your terms.
                </p>
              </div>
              <div className="text-sm font-bold text-accent">Optional Premium</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
                Why Students Choose MindSpero
              </h2>
              <p className="text-lg text-muted-foreground">Everything you need to ace your exams</p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Brain, text: "AI-Powered Summaries", desc: "Get smarter summaries, not shorter ones" },
                { icon: Headphones, text: "Audio Tutoring", desc: "Listen to personalized explanations" },
                { icon: CheckCircle, text: "No Setup Required", desc: "Start learning in 30 seconds" },
                { icon: Zap, text: "Always Free for PDFs", desc: "Summarize unlimited documents" },
                { icon: BookOpen, text: "Works Everywhere", desc: "Desktop, tablet, or mobile" },
                { icon: Sparkles, text: "AI That Gets Better", desc: "Learns from your preferences" },
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{feature.text}</p>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl opacity-50"></div>
            <div className="relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl border border-border/50 backdrop-blur-xl p-12 space-y-8">
              <div className="space-y-4">
                <div className="text-5xl font-black text-primary">4.9★</div>
                <p className="text-muted-foreground">Based on 2,500+ reviews</p>
              </div>
              <div className="space-y-6 pt-8 border-t border-border">
                <div className="space-y-2">
                  <p className="text-sm font-bold text-foreground">Average Time Saved</p>
                  <p className="text-3xl font-black text-secondary">3 hours/week</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-foreground">Students Using</p>
                  <p className="text-3xl font-black text-accent">50,000+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="bg-gradient-to-r from-primary via-secondary to-primary rounded-3xl p-12 md:p-20 text-center space-y-8 relative overflow-hidden group">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-white blur-xl"></div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Your Smarter Study Journey Starts Now
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Join thousands of students already transforming their learning. Free forever. Premium features optional.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-10 py-4 bg-white text-primary rounded-xl hover:shadow-2xl hover:shadow-primary/50 transition-all font-bold text-lg group/btn"
            >
              Start Your Free Account
              <ArrowRight className="w-6 h-6 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
            <p className="text-white/75 text-sm">No credit card required • Takes 30 seconds to get started</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-3 group w-fit">
                <img src="/mindspero-logo.svg" alt="MindSpero" className="w-10 h-10" />
                <span className="font-bold text-lg text-foreground group-hover:text-primary transition">MindSpero</span>
              </Link>
              <p className="text-muted-foreground text-sm">AI-powered learning platform for modern students</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-foreground">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-muted-foreground hover:text-primary transition">Features</Link></li>
                <li><Link to="/pricing" className="text-muted-foreground hover:text-primary transition">Pricing</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-foreground">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition">Contact</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition">Privacy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2026 MindSpero. All rights reserved. Built with ❤️ for students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
