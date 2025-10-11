/**
 * Output Validation Guardrail
 * Detects and blocks/redacts secrets, API keys, and PII in agent outputs
 */

import type { Guardrail, GuardrailResult } from "../types";

const SECRET_PATTERNS = [
  {
    name: "JWT Token",
    pattern: /eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
    risk: "high",
  },
  { name: "AWS Key", pattern: /AKIA[0-9A-Z]{16}/g, risk: "high" },
  {
    name: "API Key",
    pattern: /\b(sk_|pk_|api_)?[A-Za-z0-9]{32,}\b/g,
    risk: "high",
  },
  {
    name: "Private Key",
    pattern: /-----BEGIN (RSA|EC|OPENSSH) PRIVATE KEY-----/g,
    risk: "high",
  },
  {
    name: "Email",
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    risk: "medium",
  },
  { name: "Phone", pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, risk: "medium" },
  { name: "SSN", pattern: /\b\d{3}-\d{2}-\d{4}\b/g, risk: "high" },
  {
    name: "Credit Card",
    pattern: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,
    risk: "high",
  },
];

export function createOutputValidationGuardrail(
  config: { mode?: "block" | "redact" } = {},
): Guardrail {
  const { mode = "redact" } = config;

  return {
    name: "output-validation",
    description: "Detects secrets, API keys, and PII in outputs",
    type: "output",
    enabled: true,

    async check(output: any): Promise<GuardrailResult> {
      const text = typeof output === "string" ? output : JSON.stringify(output);
      const detected: Array<{ type: string; risk: string }> = [];
      let redactedText = text;

      for (const { name, pattern, risk } of SECRET_PATTERNS) {
        const matches = text.match(pattern);
        if (matches) {
          detected.push({ type: name, risk });
          if (mode === "redact") {
            redactedText = redactedText.replace(
              pattern,
              `[REDACTED ${name.toUpperCase()}]`,
            );
          }
        }
      }

      if (detected.length > 0) {
        const hasHighRisk = detected.some((d) => d.risk === "high");

        if (mode === "block") {
          return {
            passed: !hasHighRisk,
            action: hasHighRisk ? "block" : "redact",
            reason: `Output contains sensitive information: ${detected.map((d) => d.type).join(", ")}`,
            redactedContent:
              mode === "block" && !hasHighRisk ? redactedText : undefined,
            metadata: { detected },
          };
        }

        return {
          passed: true,
          action: "redact",
          reason: `Output contains: ${detected.map((d) => d.type).join(", ")}`,
          redactedContent: redactedText,
          metadata: { detected },
        };
      }

      return { passed: true };
    },
  };
}
