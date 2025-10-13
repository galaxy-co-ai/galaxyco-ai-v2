import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Rocket, Satellite, Globe, Zap, Users, Star } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  return (
    <main>
      {/* Hero Section */}
      <section className="section-lg">
        <div className="container">
          <div className="text-center">
            {/* Hero Badge */}
            <div
              className="badge badge-primary"
              style={{
                fontSize: "var(--text-sm)",
                marginBottom: "var(--space-6)",
              }}
            >
              🚀 Platform 2.0 Now Live
            </div>

            {/* Hero Headline */}
            <h1
              className="text-5xl font-bold mb-6"
              style={{
                color: "var(--text-primary)",
                lineHeight: "var(--leading-tight)",
                maxWidth: "800px",
                margin: "0 auto var(--space-6)",
              }}
            >
              Make Multi-Agent AI
              <br />
              <span style={{ color: "var(--primary-500)" }}>
                Useful in Minutes
              </span>
            </h1>

            {/* Hero Description */}
            <p
              className="text-xl text-secondary mb-8"
              style={{
                maxWidth: "600px",
                margin: "0 auto var(--space-8)",
                lineHeight: "var(--leading-relaxed)",
              }}
            >
              Personalized AI agent Packs that deliver measurable outcomes from
              Day 1. Built for ambitious operators who need AI that actually
              works.
            </p>

            {/* CTA Buttons */}
            <div className="flex justify-center gap-4 mb-12">
              {userId ? (
                <Link href="/dashboard">
                  <Button size="lg">
                    <Rocket size={20} className="mr-2" />
                    Go to Dashboard →
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-up">
                    <Button size="lg">
                      <Zap size={20} className="mr-2" />
                      Start Building
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button variant="secondary" size="lg">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Status Card */}
            <Card className="animate-fade-in p-8">
              <div className="text-center">
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  ✅ Platform Status
                </h3>
                <div className="grid grid-auto-fit gap-4">
                  <div className="text-center">
                    <div className="badge badge-success mb-2">Live</div>
                    <div className="text-sm text-secondary">Next.js App</div>
                  </div>
                  <div className="text-center">
                    <div className="badge badge-success mb-2">Active</div>
                    <div className="text-sm text-secondary">Authentication</div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`badge mb-2 ${userId ? "badge-success" : "badge-warning"}`}
                    >
                      {userId ? "Authenticated" : "Ready"}
                    </div>
                    <div className="text-sm text-secondary">User Status</div>
                  </div>
                  <div className="text-center">
                    <div className="badge badge-primary mb-2">v2.0</div>
                    <div className="text-sm text-secondary">Environment</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="section"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="container">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Space-Grade AI Platform
            </h2>
            <p className="text-lg text-secondary">
              Enterprise-ready tools for ambitious teams
            </p>
          </div>

          <div className="grid grid-3 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div
                style={{
                  color: "var(--primary-500)",
                  marginBottom: "var(--space-4)",
                }}
              >
                <Rocket size={48} style={{ margin: "0 auto" }} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Mission Control</h3>
              <p className="text-secondary text-sm">
                Monitor and manage your AI agents in real-time with
                comprehensive dashboards.
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div
                style={{
                  color: "var(--primary-500)",
                  marginBottom: "var(--space-4)",
                }}
              >
                <Globe size={48} style={{ margin: "0 auto" }} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Agent Marketplace</h3>
              <p className="text-secondary text-sm">
                Discover and deploy proven agent templates with one-click
                installation.
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div
                style={{
                  color: "var(--primary-500)",
                  marginBottom: "var(--space-4)",
                }}
              >
                <Satellite size={48} style={{ margin: "0 auto" }} />
              </div>
              <h3 className="text-lg font-semibold mb-3">Knowledge Hub</h3>
              <p className="text-secondary text-sm">
                Connect your data sources and create intelligent, context-aware
                agents.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="section">
        <div className="container">
          <div className="text-center">
            <h3
              className="text-2xl font-semibold mb-8"
              style={{ color: "var(--text-primary)" }}
            >
              Trusted by Ambitious Teams
            </h3>
            <div className="flex items-center justify-center gap-8 opacity-60">
              <div className="text-lg font-medium">Enterprise Ready</div>
              <div className="text-lg font-medium">SOC 2 Compliant</div>
              <div className="text-lg font-medium">99.9% Uptime</div>
              <div className="text-lg font-medium">24/7 Support</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
