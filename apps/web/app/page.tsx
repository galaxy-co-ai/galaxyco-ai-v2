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
      <section style={{
        paddingTop: "var(--space-16)",
        paddingBottom: "var(--space-12)"
      }}>
        <div className="container">
          <div className="text-center">
            {/* Hero Badge */}
            <div
              className="badge badge-primary"
              style={{
                fontSize: "var(--text-xs)",
                marginBottom: "var(--space-4)",
              }}
            >
              🚀 Platform 2.0 Now Live
            </div>

            {/* Hero Headline */}
            <h1
              style={{
                color: "var(--text-primary)",
                fontSize: "var(--text-4xl)",
                fontWeight: "var(--font-bold)",
                lineHeight: "var(--leading-tight)",
                maxWidth: "800px",
                margin: "0 auto var(--space-5)",
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
              style={{
                fontSize: "var(--text-base)",
                color: "var(--text-secondary)",
                maxWidth: "600px",
                margin: "0 auto var(--space-6)",
                lineHeight: "var(--leading-relaxed)",
              }}
            >
              Personalized AI agent Packs that deliver measurable outcomes from
              Day 1. Built for ambitious operators who need AI that actually
              works.
            </p>

            {/* CTA Buttons */}
            <div className="flex justify-center gap-4" style={{ marginBottom: "var(--space-8)" }}>
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

            {/* Platform Status - Horizontal KPI Cards */}
            <div className="animate-fade-in">
              <div className="text-center mb-4">
                <h3
                  className="text-base font-medium"
                  style={{ 
                    color: "var(--text-primary)",
                    fontSize: "var(--text-sm)",
                    marginBottom: "var(--space-3)"
                  }}
                >
                  ✅ Platform Status
                </h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="p-3 bg-white border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-gray-600 mb-1">Next.js App</div>
                      <div className="badge badge-success text-xs px-2 py-1">Live</div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </Card>
                
                <Card className="p-3 bg-white border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-gray-600 mb-1">Authentication</div>
                      <div className="badge badge-success text-xs px-2 py-1">Active</div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </Card>
                
                <Card className="p-3 bg-white border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-gray-600 mb-1">User Status</div>
                      <div className={`badge text-xs px-2 py-1 ${userId ? "badge-success" : "badge-warning"}`}>
                        {userId ? "Authenticated" : "Ready"}
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${userId ? "bg-green-500" : "bg-yellow-500"}`}></div>
                  </div>
                </Card>
                
                <Card className="p-3 bg-white border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-gray-600 mb-1">Environment</div>
                      <div className="badge badge-primary text-xs px-2 py-1">v2.0</div>
                    </div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="section"
        style={{ 
          background: "var(--bg-secondary)",
          paddingTop: "var(--space-12)",
          paddingBottom: "var(--space-12)"
        }}
      >
        <div className="container">
          <div className="text-center" style={{ marginBottom: "var(--space-8)" }}>
            <h2
              style={{ 
                color: "var(--text-primary)",
                fontSize: "var(--text-2xl)",
                fontWeight: "var(--font-semibold)",
                marginBottom: "var(--space-2)"
              }}
            >
              Space-Grade AI Platform
            </h2>
            <p style={{ 
              fontSize: "var(--text-sm)",
              color: "var(--text-secondary)"
            }}>
              Enterprise-ready tools for ambitious teams
            </p>
          </div>

          <div className="grid grid-3 gap-4">
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" style={{ padding: "var(--space-5)" }}>
              <div
                style={{
                  color: "var(--primary-500)",
                  marginBottom: "var(--space-3)",
                }}
              >
                <Rocket size={32} style={{ margin: "0 auto" }} />
              </div>
              <h3 style={{ 
                fontSize: "var(--text-base)",
                fontWeight: "var(--font-semibold)",
                marginBottom: "var(--space-2)"
              }}>Mission Control</h3>
              <p style={{ 
                color: "var(--text-secondary)",
                fontSize: "var(--text-xs)",
                lineHeight: "var(--leading-relaxed)"
              }}>
                Monitor and manage your AI agents in real-time with
                comprehensive dashboards.
              </p>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" style={{ padding: "var(--space-5)" }}>
              <div
                style={{
                  color: "var(--primary-500)",
                  marginBottom: "var(--space-3)",
                }}
              >
                <Globe size={32} style={{ margin: "0 auto" }} />
              </div>
              <h3 style={{ 
                fontSize: "var(--text-base)",
                fontWeight: "var(--font-semibold)",
                marginBottom: "var(--space-2)"
              }}>Agent Marketplace</h3>
              <p style={{ 
                color: "var(--text-secondary)",
                fontSize: "var(--text-xs)",
                lineHeight: "var(--leading-relaxed)"
              }}>
                Discover and deploy proven agent templates with one-click
                installation.
              </p>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer" style={{ padding: "var(--space-5)" }}>
              <div
                style={{
                  color: "var(--primary-500)",
                  marginBottom: "var(--space-3)",
                }}
              >
                <Satellite size={32} style={{ margin: "0 auto" }} />
              </div>
              <h3 style={{ 
                fontSize: "var(--text-base)",
                fontWeight: "var(--font-semibold)",
                marginBottom: "var(--space-2)"
              }}>Knowledge Hub</h3>
              <p style={{ 
                color: "var(--text-secondary)",
                fontSize: "var(--text-xs)",
                lineHeight: "var(--leading-relaxed)"
              }}>
                Connect your data sources and create intelligent, context-aware
                agents.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section style={{
        paddingTop: "var(--space-12)",
        paddingBottom: "var(--space-12)"
      }}>
        <div className="container">
          <div className="text-center">
            <h3
              style={{ 
                fontSize: "var(--text-xl)",
                fontWeight: "var(--font-semibold)",
                color: "var(--text-primary)",
                marginBottom: "var(--space-6)"
              }}
            >
              Trusted by Ambitious Teams
            </h3>
            <div className="flex items-center justify-center gap-8 opacity-60">
              <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-medium)" }}>Enterprise Ready</div>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-medium)" }}>SOC 2 Compliant</div>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-medium)" }}>99.9% Uptime</div>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-medium)" }}>24/7 Support</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
