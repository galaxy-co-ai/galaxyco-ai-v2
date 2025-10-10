"use client";

import { colors, shadows } from "@/lib/constants/design-system";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function MarketplaceHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "AI Agents that Actually Work",
      subtitle: "Pre-built, tested, and ready to deploy in your workflow",
      cta: "Browse All Agents",
      gradient: "linear-gradient(135deg, #4d6fff 0%, #3d5acc 100%)", // Professional blue gradient
      image: "/hero-agents-1.svg",
      stats: [
        { label: "Active Agents", value: "2,500+" },
        { label: "Time Saved", value: "10k hrs/mo" },
        { label: "Success Rate", value: "95%" },
      ],
    },
    {
      title: "Founder Ops Pack",
      subtitle:
        "Everything you need to run your startup. 4 agents working together to save you 12 hrs/week.",
      cta: "Install Pack",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Purple-indigo gradient
      featured: true,
      packId: "founder-ops-pack",
      badge: "STARTER PACK",
    },
    {
      title: "Browser Automation Agent",
      subtitle: "Automate any web task with our most popular agent",
      cta: "Install Now",
      gradient: "linear-gradient(135deg, #4d6fff 0%, #764ba2 100%)", // Blue-purple gradient (more professional)
      image: "/hero-browser.svg",
      featured: true,
      agentSlug: "browser-automation",
    },
    {
      title: "Sales GTM Pack",
      subtitle:
        "Accelerate your sales motion. 4 agents for prospecting, enrichment, and CRM automation.",
      cta: "Install Pack",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Purple-indigo gradient
      featured: true,
      packId: "sales-gtm-pack",
      badge: "POPULAR",
    },
    {
      title: "Build Custom Agents",
      subtitle: "Natural language to production-ready agent in minutes",
      cta: "Start Building",
      gradient: "linear-gradient(135deg, #4d6fff 0%, #17a2b8 100%)", // Blue-teal gradient
      image: "/hero-builder.svg",
      link: "/agents/new",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const slide = heroSlides[currentSlide];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "500px",
        background: slide.gradient,
        overflow: "hidden",
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.1,
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
        }}
      />

      {/* Content Container */}
      <div
        style={{
          position: "relative",
          height: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left Content */}
        <div
          style={{
            flex: 1,
            maxWidth: "600px",
            zIndex: 2,
          }}
        >
          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
              fontWeight: "800",
              color: "white",
              marginBottom: "1.5rem",
              lineHeight: "1.2",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.15)", // Improved text shadow for readability
            }}
          >
            {slide.title}
          </h1>

          <p
            style={{
              fontSize: "clamp(1.125rem, 2vw, 1.375rem)",
              color: "rgba(255, 255, 255, 0.95)",
              marginBottom: "2.5rem",
              lineHeight: "1.5",
              textShadow: "0 1px 4px rgba(0, 0, 0, 0.1)", // Subtle text shadow for better readability
            }}
          >
            {slide.subtitle}
          </p>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Link
              href={slide.link || "/marketplace"}
              style={{
                display: "inline-block",
                padding: "1rem 2rem",
                background: "white",
                color: colors.primary[600],
                borderRadius: "12px",
                fontSize: "1.125rem",
                fontWeight: "600",
                textDecoration: "none",
                boxShadow: shadows.lg,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = shadows.xl;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = shadows.lg;
              }}
            >
              {slide.cta}
            </Link>

            {slide.featured && slide.badge && (
              <span
                style={{
                  padding: "0.5rem 1rem",
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  backdropFilter: "blur(10px)",
                }}
              >
                {slide.badge === "STARTER PACK"
                  ? "🎁"
                  : slide.badge === "POPULAR"
                    ? "🔥"
                    : "✨"}{" "}
                {slide.badge}
              </span>
            )}
            {slide.featured && slide.agentSlug && (
              <span
                style={{
                  padding: "0.5rem 1rem",
                  background: "rgba(255, 255, 255, 0.25)",
                  color: "white",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  backdropFilter: "blur(10px)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Featured
              </span>
            )}
          </div>

          {/* Stats */}
          {slide.stats && (
            <div
              style={{
                display: "flex",
                gap: "3rem",
                marginTop: "3rem",
              }}
            >
              {slide.stats.map((stat, i) => (
                <div key={i}>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      color: "white",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "rgba(255, 255, 255, 0.8)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Visual */}
        <div
          style={{
            position: "relative",
            width: "500px",
            height: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Floating Cards Preview */}
          {/* Straightened Cards - No tilt for professional look */}
          <div
            style={{
              position: "absolute",
              width: "280px",
              height: "160px",
              background: "white",
              borderRadius: "16px",
              boxShadow: shadows.xl,
              padding: "1.5rem",
              transform: "translateY(0)", // Removed rotation
              top: "50px",
              right: "100px",
              border: `1px solid ${colors.border.default}`,
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                color: colors.text.tertiary,
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              AGENT TEMPLATE
            </div>
            <div
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                color: colors.text.primary,
              }}
            >
              Browser Automation
            </div>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "1rem",
                fontSize: "0.875rem",
                color: colors.text.secondary,
              }}
            >
              <span>⭐ 4.9</span>
              <span>🔥 2.5k installs</span>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              width: "280px",
              height: "160px",
              background: "white",
              borderRadius: "16px",
              boxShadow: shadows.xl,
              padding: "1.5rem",
              transform: "translateY(0)", // Removed rotation
              top: "150px",
              right: "50px",
              border: `1px solid ${colors.border.default}`,
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                color: colors.text.tertiary,
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              AGENT TEMPLATE
            </div>
            <div
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                color: colors.text.primary,
              }}
            >
              Knowledge RAG
            </div>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "1rem",
                fontSize: "0.875rem",
                color: colors.text.secondary,
              }}
            >
              <span>⭐ 4.8</span>
              <span>🔥 1.8k installs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "0.75rem",
        }}
      >
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            style={{
              width: index === currentSlide ? "32px" : "12px",
              height: "12px",
              borderRadius: "6px",
              border: "none",
              background:
                index === currentSlide ? "white" : "rgba(255, 255, 255, 0.4)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
