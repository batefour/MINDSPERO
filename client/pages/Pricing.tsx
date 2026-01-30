import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>
            <span className="text-lg font-bold text-foreground">MindSpero</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-4 py-2 text-foreground hover:text-primary transition">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works for you. Start free with PDF summaries, upgrade anytime for audio tutoring.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-2 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-3 rounded-md font-semibold text-lg transition ${
                billingPeriod === "monthly"
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-6 py-3 rounded-md font-semibold text-lg transition flex items-center gap-2 ${
                billingPeriod === "yearly"
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              {billingPeriod === "yearly" && (
                <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-background rounded-2xl p-8 border border-border space-y-6">
            <div>
              <h3 className="text-4xl font-bold text-foreground">Free</h3>
              <p className="text-muted-foreground text-lg">Perfect to get started</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground text-base font-semibold">Price</p>
              <p className="text-5xl font-bold text-foreground">GHS 0</p>
              <p className="text-muted-foreground text-base">Forever</p>
            </div>
            <button className="w-full py-3 border border-border rounded-lg text-foreground hover:bg-muted transition font-semibold text-lg">
              Get Started
            </button>
            <div className="space-y-4 border-t border-border pt-6">
              <div className="flex gap-3 items-center text-foreground text-base">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span>PDF uploads</span>
              </div>
              <div className="flex gap-3 items-center text-foreground text-base">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span>AI summaries</span>
              </div>
              <div className="flex gap-3 items-center text-muted-foreground text-base">
                <div className="w-5 h-5" />
                <span>Audio tutoring</span>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-background rounded-2xl p-8 border-2 border-primary space-y-6 relative md:scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-bold">
              Most Popular
            </div>
            <div>
              <h3 className="text-4xl font-bold text-foreground">Pro</h3>
              <p className="text-muted-foreground text-lg">For dedicated learners</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground text-base font-semibold">Price</p>
              {billingPeriod === "monthly" ? (
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-bold text-foreground">GHS 150</p>
                  <span className="text-muted-foreground text-lg">/month</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-bold text-foreground">GHS 1,440</p>
                  <span className="text-muted-foreground text-lg">/year</span>
                </div>
              )}
              <p className="text-base text-primary font-semibold pt-2">+30 days free per purchase</p>
            </div>
            <Link
              to="/register"
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-semibold text-lg flex items-center justify-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="space-y-4 border-t border-border pt-6">
              <div className="flex gap-3 items-center text-foreground text-base">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Everything in Free</span>
              </div>
              <div className="flex gap-3 items-center text-foreground text-base">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Audio explanations</span>
              </div>
              <div className="flex gap-3 items-center text-foreground text-base">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Download summaries</span>
              </div>
              <div className="flex gap-3 items-center text-foreground text-base">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Priority support</span>
              </div>
            </div>
          </div>

          {/* Team Plan */}
          <div className="bg-background rounded-2xl p-8 border border-border space-y-6">
            <div>
              <h3 className="text-4xl font-bold text-foreground">Team</h3>
              <p className="text-muted-foreground text-lg">For schools & organizations</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground text-base font-semibold">Price</p>
              <p className="text-4xl font-bold text-foreground">Custom</p>
              <p className="text-muted-foreground text-base">Contact us for details</p>
            </div>
            <a
              href="mailto:team@academicai.com"
              className="w-full py-3 border border-border rounded-lg text-foreground hover:bg-muted transition font-semibold text-lg text-center"
            >
              Contact Sales
            </a>
            <div className="space-y-4 border-t border-border pt-6">
              <div className="flex gap-3 items-center text-foreground text-base">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Everything in Pro</span>
              </div>
              <div className="flex gap-3 items-center text-foreground text-base">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Bulk users</span>
              </div>
              <div className="flex gap-3 items-center text-foreground text-base">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Admin panel</span>
              </div>
              <div className="flex gap-3 items-center text-foreground text-base">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span>SSO support</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20 space-y-8">
          <h2 className="text-4xl font-bold text-foreground text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I use the free plan forever?",
                a: "Yes! The free plan includes unlimited PDF uploads and summaries. You only need to upgrade to access audio explanations.",
              },
              {
                q: "What happens after my trial ends?",
                a: "After your 30-day free trial ends, you'll need to subscribe to continue accessing audio explanations. You can keep using the free summarization forever.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Absolutely! You can cancel your subscription at any time with no questions asked.",
              },
              {
                q: "Do you offer discounts?",
                a: "Yes! Annual plans come with a discount, and you get an extra month free with any Pro purchase.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-background border border-border rounded-lg p-6">
                <h3 className="font-bold text-foreground mb-2 text-lg">{item.q}</h3>
                <p className="text-muted-foreground text-base">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-12 md:p-16 text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">
            Ready to Unlock Audio Tutoring?
          </h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto text-xl">
            Start with a free 30-day trial. No credit card required.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary-foreground text-primary rounded-lg hover:opacity-90 transition font-bold text-lg"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
