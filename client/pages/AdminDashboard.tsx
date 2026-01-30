import { Link } from "react-router-dom";
import {
  Users,
  TrendingUp,
  CreditCard,
  LogOut,
  Settings,
  BarChart3,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>
            <span className="text-lg font-bold text-foreground">MindSpero</span>
          </Link>
          <div className="text-sm text-muted-foreground">Admin Dashboard</div>
          <button className="p-2 hover:bg-muted rounded-lg transition">
            <LogOut className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Admin Dashboard
        </h1>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: Users,
              label: "Total Users",
              value: "1,234",
              change: "+12%",
            },
            {
              icon: TrendingUp,
              label: "Subscribed Users",
              value: "456",
              change: "+8%",
            },
            {
              icon: CreditCard,
              label: "Total Revenue",
              value: "GHS 187,440",
              change: "+25%",
            },
            {
              icon: BarChart3,
              label: "Monthly Revenue",
              value: "GHS 68,505",
              change: "+15%",
            },
          ].map((metric, i) => {
            const Icon = metric.icon;
            return (
              <div
                key={i}
                className="bg-background border border-border rounded-lg p-6 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {metric.label}
                  </span>
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {metric.value}
                </p>
                <p className="text-sm text-green-600">{metric.change}</p>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Users List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Recent Users</h2>
            <div className="space-y-2">
              {[
                {
                  name: "Alice Johnson",
                  email: "alice@example.com",
                  status: "subscribed",
                },
                {
                  name: "Bob Smith",
                  email: "bob@example.com",
                  status: "trial",
                },
                {
                  name: "Charlie Brown",
                  email: "charlie@example.com",
                  status: "free",
                },
              ].map((user, i) => (
                <div
                  key={i}
                  className="bg-background border border-border rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-foreground font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === "subscribed"
                        ? "bg-primary/10 text-primary"
                        : user.status === "trial"
                          ? "bg-accent/10 text-accent"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {user.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Filter & Settings */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Filters</h2>
            <div className="bg-background border border-border rounded-lg p-4 space-y-4">
              {["All Users", "Subscribed", "Trial", "Free"].map((filter, i) => (
                <button
                  key={i}
                  className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-muted transition text-foreground text-sm"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
