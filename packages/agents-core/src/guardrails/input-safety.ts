/**
 * Input Safety Guardrail
 *
 * Prevents prompt injection attacks, jailbreaks, and malicious instructions.
 * Uses pattern matching and heuristics to detect suspicious input.
 */

import type { Guardrail, GuardrailResult } from "../types";

export interface InputSafetyConfig {
  enabled?: boolean;
  mode?: "strict" | "moderate" | "permissive";
  customPatterns?: RegExp[];
}

/**
 * Known prompt injection patterns
 */
const INJECTION_PATTERNS = [
  // System prompt override attempts
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts?|directions)/i,
  /ignore\s+all\s+instructions/i,
  /disregard\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts?|directions)/i,
  /forget\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts?)/i,

  // Role confusion
  /you\s+are\s+(now\s+)?(a|an)\s+\w+/i,
  /act\s+as\s+(a|an)\s+\w+/i,
  /pretend\s+(you\s+are|to\s+be)/i,

  // System commands
  /system\s*:\s*/i,
  /<\|im_start\|>/i,
  /<\|im_end\|>/i,
  /\[SYSTEM\]/i,
  /\[INST\]/i,

  // Jailbreak attempts
  /DAN\s+mode/i,
  /developer\s+mode/i,
  /admin\s+mode/i,
  /sudo\s+mode/i,
];

/**
 * Create input safety guardrail
 */
export function createInputSafetyGuardrail(
  config: InputSafetyConfig = {},
): Guardrail {
  const { enabled = true, mode = "moderate", customPatterns = [] } = config;

  return {
    name: "input-safety",
    description: "Prevents prompt injection and malicious instructions",
    type: "input",
    enabled,

    async check(input: any): Promise<GuardrailResult> {
      // If disabled, pass everything
      if (!enabled) {
        return { passed: true };
      }

      // Convert input to string for checking
      const text = typeof input === "string" ? input : JSON.stringify(input);

      // Check against injection patterns
      const allPatterns = [...INJECTION_PATTERNS, ...customPatterns];

      for (const pattern of allPatterns) {
        if (pattern.test(text)) {
          return {
            passed: false,
            action: "block",
            reason: "Input contains potential prompt injection pattern",
            metadata: {
              pattern: pattern.source,
              mode,
            },
          };
        }
      }

      // In strict mode, also check for excessive special characters
      if (mode === "strict") {
        const specialCharRatio =
          (text.match(/[<>{}[\]|\\]/g) || []).length / text.length;
        if (specialCharRatio > 0.1) {
          return {
            passed: false,
            action: "block",
            reason: "Input contains suspicious special character patterns",
            metadata: { specialCharRatio, mode },
          };
        }
      }

      return { passed: true };
    },
  };
}
