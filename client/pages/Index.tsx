import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  Zap,
  Headphones,
  CheckCircle,
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>
            <span className="text-xl font-bold text-foreground">MindSpero</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-foreground hover:text-primary transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="inline-block px-4 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                ✨ Free PDF Summarization
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Your Personal AI Study Companion
              </h1>
              <p className="text-lg text-muted-foreground">
                Upload your lecture notes, get instant summaries, and unlock
                personalized audio explanations. Transform how you study with
                AI-powered insights.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-medium"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition font-medium"
              >
                View Pricing
              </Link>
            </div>

            <div className="flex gap-8 text-sm text-muted-foreground">
              <div>
                <div className="font-bold text-foreground">100%</div>
                Free Summaries
              </div>
              <div>
                <div className="font-bold text-foreground">No CC</div>
                Required to Start
              </div>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="relative h-96 md:h-full min-h-96 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-border flex items-center justify-center">
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute top-10 right-10 w-32 h-32 bg-primary rounded-full opacity-10 blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-32 h-32 bg-secondary rounded-full opacity-10 blur-3xl"></div>
            </div>
            <div className="relative z-10 text-center space-y-4">
              <FileText className="w-24 h-24 text-primary mx-auto opacity-50" />
              <p className="text-muted-foreground">
                Drag and drop your PDF notes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform your study habits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-background rounded-2xl p-8 border border-border hover:border-primary/50 transition space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                1. Upload Notes
              </h3>
              <p className="text-muted-foreground">
                Upload any PDF from your lectures, textbooks, or study
                materials. Our system accepts documents of any size.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-background rounded-2xl p-8 border border-border hover:border-primary/50 transition space-y-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                2. AI Summarization
              </h3>
              <p className="text-muted-foreground">
                Get instant AI-powered summaries of your notes. Completely free.
                Perfect for quick review and understanding key concepts.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-background rounded-2xl p-8 border border-border hover:border-primary/50 transition space-y-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Headphones className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                3. Audio Tutoring
              </h3>
              <p className="text-muted-foreground">
                Subscribe to unlock personalized audio explanations. Listen to
                detailed explanations of your notes anytime, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Why Students Love MindSpero
            </h2>
            <div className="space-y-4">
              {[
                "Free PDF summarization forever",
                "AI-powered audio explanations (subscription)",
                "Download your summaries",
                "Personalized learning experience",
                "Works with any PDF format",
                "Track your progress",
              ].map((feature, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-96 bg-gradient-to-br from-secondary/5 to-accent/5 rounded-2xl border border-border flex items-center justify-center">
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute top-20 right-20 w-40 h-40 bg-secondary rounded-full opacity-10 blur-3xl"></div>
              <div className="absolute bottom-5 left-5 w-48 h-48 bg-accent rounded-full opacity-10 blur-3xl"></div>
            </div>
            <div className="relative z-10 text-center space-y-4">
              <Headphones className="w-24 h-24 text-secondary mx-auto opacity-50" />
              <p className="text-muted-foreground">
                Listen to personalized explanations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-12 md:p-16 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto text-lg">
            Start with free PDF summaries today. Upgrade anytime to unlock
            personalized audio tutoring.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary-foreground text-primary rounded-lg hover:opacity-90 transition font-bold"
          >
            Create Your Free Account
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">
                  M
                </div>
                <span className="font-bold text-foreground">MindSpero</span>
              </div>
              <p className="text-muted-foreground">
                AI-powered learning for modern students
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link to="/" className="hover:text-primary">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-primary">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 MindSpero. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
