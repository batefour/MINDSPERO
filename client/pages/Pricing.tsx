import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-50 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/mindspero-logo.svg" alt="MindSpero" className="w-10 h-10 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">MindSpero</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-foreground hover:text-primary transition font-medium">
              Login
            </Link>
            <Link to="/register" className="px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all font-bold text-sm">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-block">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold flex items-center gap-2 w-fit mx-auto">
              <Sparkles className="w-4 h-4" /> Transparent Pricing
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-foreground">
            Plans for Every Learner
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free with unlimited summaries. Upgrade anytime for personalized audio tutoring.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex items-center gap-2 bg-muted p-1.5 rounded-xl border border-border">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2.5 rounded-lg font-bold transition ${
                billingPeriod === "monthly"
                  ? "bg-white text-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-6 py-2.5 rounded-lg font-bold transition flex items-center gap-2 ${
                billingPeriod === "yearly"
                  ? "bg-white text-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              {billingPeriod === "yearly" && (
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-bold">
                  Save 20%
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-background rounded-2xl p-8 border border-border/50 hover:border-primary/50 transition-all space-y-6 h-full">
              <div>
                <h3 className="text-2xl font-black text-foreground">Free</h3>
                <p className="text-muted-foreground font-medium">Perfect to start</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-black text-foreground">0</p>
                  <span className="text-muted-foreground font-medium">Forever</span>
                </div>
              </div>
              <Link to="/register" className="w-full py-3 border-2 border-border rounded-xl text-foreground hover:bg-muted hover:border-primary transition-all font-bold">
                Get Started
              </Link>
              <div className="space-y-3 border-t border-border/50 pt-6">
                {[
                  "Unlimited PDF uploads",
                  "AI-powered summaries",
                  "Download documents",
                  "No credit card required",
                ].map((feature, i) => (
                  <div key={i} className="flex gap-3 items-center text-foreground">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
                <div className="flex gap-3 items-center text-muted-foreground opacity-50">
                  <div className="w-5 h-5" />
                  <span className="font-medium">Audio explanations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Plan - Featured */}
          <div className="group relative md:scale-105 md:-my-4">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary to-secondary rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-background rounded-2xl p-8 border-2 border-gradient-to-r from-primary to-secondary space-y-6 h-full flex flex-col">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                Most Popular
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground">Pro</h3>
                <p className="text-muted-foreground font-medium">For dedicated learners</p>
              </div>
              <div className="space-y-2">
                {billingPeriod === "monthly" ? (
                  <div className="flex items-baseline gap-2">
                    <p className="text-5xl font-black text-primary">GHC 30</p>
                    <span className="text-muted-foreground font-medium">/month</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <p className="text-5xl font-black text-primary">GHC 288</p>
                      <span className="text-muted-foreground font-medium">/year</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="line-through mr-2">GHC 360</span>
                      <span className="text-green-500 font-bold">20% off</span>
                    </p>
                  </div>
                )}
                <p className="text-sm text-primary font-bold pt-2">+ 30 days free trial</p>
              </div>
              <Link
                to="/register"
                className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all font-bold flex items-center justify-center gap-2 group/btn"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
              <div className="space-y-3 border-t border-border/50 pt-6 flex-1">
                {[
                  "Everything in Free",
                  "Audio explanations",
                  "Download summaries",
                  "Priority support",
                  "Advanced features",
                ].map((feature, i) => (
                  <div key={i} className="flex gap-3 items-center text-foreground">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Plan */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-background rounded-2xl p-8 border border-border/50 hover:border-secondary/50 transition-all space-y-6 h-full">
              <div>
                <h3 className="text-2xl font-black text-foreground">Team</h3>
                <p className="text-muted-foreground font-medium">For schools & orgs</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Custom pricing</p>
                <p className="text-3xl font-black text-foreground">Let's talk</p>
              </div>
              <a
                href="mailto:team@mindspero.com"
                className="w-full py-3 border-2 border-border rounded-xl text-foreground hover:bg-muted hover:border-secondary transition-all font-bold text-center"
              >
                Contact Sales
              </a>
              <div className="space-y-3 border-t border-border/50 pt-6">
                {[
                  "Everything in Pro",
                  "Unlimited users",
                  "Admin dashboard",
                  "SSO integration",
                  "Dedicated support",
                ].map((feature, i) => (
                  <div key={i} className="flex gap-3 items-center text-foreground">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-32 space-y-8">
          <h2 className="text-4xl font-black text-foreground text-center">
            Common Questions
          </h2>
          <div className="grid gap-4">
            {[
              {
                q: "Is the free plan really forever?",
                a: "Yes! Unlimited PDF uploads and summaries, forever. Audio explanations require a subscription.",
              },
              {
                q: "What happens after my trial?",
                a: "Your trial lasts 30 days. After that, you can subscribe to continue with audio features, or keep using free summaries.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Absolutely. No lock-in period, cancel instantly from your account settings.",
              },
              {
                q: "Do you offer refunds?",
                a: "Yes, 30-day money-back guarantee if you're not satisfied.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-background border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-colors">
                <div className="flex gap-3">
                  <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-2">{item.q}</h3>
                    <p className="text-muted-foreground">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-primary via-secondary to-primary rounded-3xl p-12 md:p-20 text-center space-y-8 relative overflow-hidden group">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-white blur-xl"></div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Ready to Level Up Your Learning?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Get 30 days free. No credit card. Full access to audio explanations.
            </p>
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 bg-white text-primary rounded-xl hover:shadow-2xl hover:shadow-primary/50 transition-all font-bold text-lg group/btn"
            >
              Start Your Free Trial
              <ArrowRight className="w-6 h-6 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
