'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import {
  ROLES,
  PAIN_POINTS,
  TOOLS,
  COMMON_INDUSTRIES,
  STARTER_PACKS,
  deriveStarterPack,
  Role,
  StarterPackId,
  OnboardingProfile,
} from '@/lib/constants/onboarding';
import { colors, typography, spacing, radius } from '@/lib/constants/design-system';

interface OnboardingWizardProps {
  onComplete: (profile: OnboardingProfile) => void;
  isLoading?: boolean;
}

export function OnboardingWizard({ onComplete, isLoading = false }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | null>(null);
  const [industry, setIndustry] = useState('');
  const [painPointsFreeText, setPainPointsFreeText] = useState('');
  const [painPointsTags, setPainPointsTags] = useState<string[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [sensitiveData, setSensitiveData] = useState<boolean | null>(null);

  const totalSteps = 6;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    if (!role || !industry || sensitiveData === null) return;

    const recommendedPack = deriveStarterPack(role, painPointsTags, selectedTools);

    const profile: OnboardingProfile = {
      persona: { role, industry },
      painPoints: { freeText: painPointsFreeText, tags: painPointsTags },
      tools: { selected: selectedTools },
      sensitivity: { flag: sensitiveData },
      starterPack: { recommendedId: recommendedPack },
      timestamp: new Date().toISOString(),
    };

    onComplete(profile);
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) ? array.filter((i) => i !== item) : [...array, item];
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return true; // Welcome screen
      case 2:
        return role !== null && industry.trim() !== '';
      case 3:
        return painPointsFreeText.trim() !== '' || painPointsTags.length > 0;
      case 4:
        return true; // Tools are optional
      case 5:
        return sensitiveData !== null;
      case 6:
        return true; // Summary
      default:
        return false;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[700]} 100%)`,
        padding: spacing['2xl'],
        fontFamily: typography.fontFamily.sans,
      }}
    >
      <Card
        style={{
          maxWidth: '700px',
          width: '100%',
          position: 'relative',
        }}
      >
        {/* Progress Bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: colors.neutral[100],
            borderRadius: `${radius.lg} ${radius.lg} 0 0`,
          }}
        >
          <div
            style={{
              height: '100%',
              background: colors.primary[500],
              width: `${(step / totalSteps) * 100}%`,
              transition: 'width 320ms ease',
              borderRadius: `${radius.lg} ${radius.lg} 0 0`,
            }}
          />
        </div>

        {/* Step Content */}
        <div style={{ marginTop: spacing.lg }}>
          {step === 1 && <Step1Welcome />}
          {step === 2 && (
            <Step2RoleIndustry
              role={role}
              setRole={setRole}
              industry={industry}
              setIndustry={setIndustry}
            />
          )}
          {step === 3 && (
            <Step3PainPoints
              freeText={painPointsFreeText}
              setFreeText={setPainPointsFreeText}
              tags={painPointsTags}
              setTags={setPainPointsTags}
            />
          )}
          {step === 4 && (
            <Step4Tools selectedTools={selectedTools} setSelectedTools={setSelectedTools} />
          )}
          {step === 5 && (
            <Step5Sensitivity sensitiveData={sensitiveData} setSensitiveData={setSensitiveData} />
          )}
          {step === 6 && (
            <Step6Summary
              role={role!}
              industry={industry}
              painPoints={painPointsTags}
              tools={selectedTools}
              sensitiveData={sensitiveData!}
              recommendedPack={deriveStarterPack(role!, painPointsTags, selectedTools)}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div
          style={{
            marginTop: spacing['2xl'],
            display: 'flex',
            gap: spacing.lg,
            justifyContent: 'space-between',
          }}
        >
          {step > 1 && (
            <Button variant="ghost" onClick={handleBack}>
              ← Back
            </Button>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: spacing.lg }}>
            {step < totalSteps && (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={step === 1 ? 'w-full' : ''}
              >
                {step === 1 ? 'Get Started' : 'Continue →'}
              </Button>
            )}
            {step === totalSteps && (
              <Button onClick={handleComplete} disabled={isLoading}>
                {isLoading ? 'Creating workspace...' : 'Create My Workspace'}
              </Button>
            )}
          </div>
        </div>

        {/* Step Indicator */}
        <div
          style={{
            marginTop: spacing.xl,
            textAlign: 'center',
            fontSize: typography.fontSize.sm,
            color: colors.neutral[500],
          }}
        >
          Step {step} of {totalSteps}
        </div>
      </Card>
    </div>
  );
}

// Step 1: Welcome
function Step1Welcome() {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: spacing.lg }}>🚀</div>
      <h1
        style={{
          fontSize: typography.fontSize['3xl'],
          fontWeight: typography.fontWeight.bold,
          marginBottom: spacing.md,
        }}
      >
        Welcome to GalaxyCo.ai
      </h1>
      <p
        style={{
          fontSize: typography.fontSize.lg,
          color: colors.neutral[600],
          marginBottom: spacing.xl,
        }}
      >
        Your AI-powered team of agents
      </p>
      <p
        style={{
          fontSize: typography.fontSize.base,
          color: colors.neutral[500],
        }}
      >
        Answer a few quick questions so we can create your personalized dashboard
      </p>
    </div>
  );
}

// Step 2: Role & Industry
function Step2RoleIndustry({
  role,
  setRole,
  industry,
  setIndustry,
}: {
  role: Role | null;
  setRole: (role: Role) => void;
  industry: string;
  setIndustry: (industry: string) => void;
}) {
  return (
    <div>
      <h2
        style={{
          fontSize: typography.fontSize['2xl'],
          fontWeight: typography.fontWeight.semibold,
          marginBottom: spacing.lg,
        }}
      >
        Tell us about yourself
      </h2>

      <label
        style={{
          display: 'block',
          marginBottom: spacing.sm,
          fontWeight: typography.fontWeight.medium,
        }}
      >
        Your role
      </label>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: spacing.md,
          marginBottom: spacing.xl,
        }}
      >
        {ROLES.map((r) => (
          <div
            key={r.value}
            onClick={() => setRole(r.value)}
            style={{
              padding: spacing.lg,
              border: `2px solid ${role === r.value ? colors.primary[500] : colors.neutral[200]}`,
              borderRadius: radius.md,
              textAlign: 'center',
              cursor: 'pointer',
              background: role === r.value ? colors.primary[50] : colors.neutral[0],
              transition: 'all 150ms',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: spacing.sm }}>{r.icon}</div>
            <div
              style={{
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
              }}
            >
              {r.label}
            </div>
          </div>
        ))}
      </div>

      <label
        style={{
          display: 'block',
          marginBottom: spacing.sm,
          fontWeight: typography.fontWeight.medium,
        }}
      >
        Industry
      </label>
      <select
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
        style={{
          width: '100%',
          padding: spacing.md,
          fontSize: typography.fontSize.base,
          border: `2px solid ${colors.neutral[200]}`,
          borderRadius: radius.md,
          fontFamily: typography.fontFamily.sans,
        }}
      >
        <option value="">Select your industry</option>
        {COMMON_INDUSTRIES.map((ind) => (
          <option key={ind} value={ind}>
            {ind}
          </option>
        ))}
      </select>
    </div>
  );
}

// Step 3: Pain Points
function Step3PainPoints({
  freeText,
  setFreeText,
  tags,
  setTags,
}: {
  freeText: string;
  setFreeText: (text: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
}) {
  return (
    <div>
      <h2
        style={{
          fontSize: typography.fontSize['2xl'],
          fontWeight: typography.fontWeight.semibold,
          marginBottom: spacing.lg,
        }}
      >
        What slows you down the most?
      </h2>

      <label
        style={{
          display: 'block',
          marginBottom: spacing.sm,
          fontWeight: typography.fontWeight.medium,
        }}
      >
        Describe in your own words (optional)
      </label>
      <textarea
        value={freeText}
        onChange={(e) => setFreeText(e.target.value)}
        placeholder="e.g., Spending too much time on manual data entry and follow-ups..."
        maxLength={280}
        style={{
          width: '100%',
          minHeight: '80px',
          padding: spacing.md,
          fontSize: typography.fontSize.base,
          border: `2px solid ${colors.neutral[200]}`,
          borderRadius: radius.md,
          fontFamily: typography.fontFamily.sans,
          marginBottom: spacing.xl,
        }}
      />

      <label
        style={{
          display: 'block',
          marginBottom: spacing.sm,
          fontWeight: typography.fontWeight.medium,
        }}
      >
        Or select from common pain points
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.md }}>
        {PAIN_POINTS.map((pain) => (
          <div
            key={pain.value}
            onClick={() =>
              setTags(
                tags.includes(pain.value)
                  ? tags.filter((t) => t !== pain.value)
                  : [...tags, pain.value],
              )
            }
            style={{
              padding: `${spacing.sm} ${spacing.lg}`,
              border: `2px solid ${tags.includes(pain.value) ? colors.primary[500] : colors.neutral[200]}`,
              borderRadius: radius.full,
              cursor: 'pointer',
              background: tags.includes(pain.value) ? colors.primary[50] : colors.neutral[0],
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              transition: 'all 150ms',
            }}
          >
            <span>{pain.icon}</span>
            <span>{pain.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Step 4: Tools
function Step4Tools({
  selectedTools,
  setSelectedTools,
}: {
  selectedTools: string[];
  setSelectedTools: (tools: string[]) => void;
}) {
  return (
    <div>
      <h2
        style={{
          fontSize: typography.fontSize['2xl'],
          fontWeight: typography.fontWeight.semibold,
          marginBottom: spacing.lg,
        }}
      >
        Which tools do you use?
      </h2>
      <p
        style={{
          fontSize: typography.fontSize.sm,
          color: colors.neutral[500],
          marginBottom: spacing.xl,
        }}
      >
        We&apos;ll help you connect them later. No auth required now.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: spacing.md,
        }}
      >
        {TOOLS.map((tool) => (
          <div
            key={tool.value}
            onClick={() =>
              setSelectedTools(
                selectedTools.includes(tool.value)
                  ? selectedTools.filter((t) => t !== tool.value)
                  : [...selectedTools, tool.value],
              )
            }
            style={{
              padding: spacing.lg,
              border: `2px solid ${selectedTools.includes(tool.value) ? colors.primary[500] : colors.neutral[200]}`,
              borderRadius: radius.md,
              textAlign: 'center',
              cursor: 'pointer',
              background: selectedTools.includes(tool.value)
                ? colors.primary[50]
                : colors.neutral[0],
              transition: 'all 150ms',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: spacing.sm }}>{tool.icon}</div>
            <div
              style={{
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
              }}
            >
              {tool.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Step 5: Sensitivity
function Step5Sensitivity({
  sensitiveData,
  setSensitiveData,
}: {
  sensitiveData: boolean | null;
  setSensitiveData: (flag: boolean) => void;
}) {
  return (
    <div>
      <h2
        style={{
          fontSize: typography.fontSize['2xl'],
          fontWeight: typography.fontWeight.semibold,
          marginBottom: spacing.lg,
        }}
      >
        Do you handle sensitive or regulated data?
      </h2>
      <p
        style={{
          fontSize: typography.fontSize.sm,
          color: colors.neutral[500],
          marginBottom: spacing.xl,
        }}
      >
        This helps us configure appropriate security and compliance defaults
      </p>

      <div style={{ display: 'flex', gap: spacing.lg }}>
        <div
          onClick={() => setSensitiveData(true)}
          style={{
            flex: 1,
            padding: spacing['2xl'],
            border: `2px solid ${sensitiveData === true ? colors.primary[500] : colors.neutral[200]}`,
            borderRadius: radius.lg,
            textAlign: 'center',
            cursor: 'pointer',
            background: sensitiveData === true ? colors.primary[50] : colors.neutral[0],
            transition: 'all 150ms',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>🔒</div>
          <div
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
            }}
          >
            Yes
          </div>
          <p
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.neutral[500],
              marginTop: spacing.sm,
            }}
          >
            We&apos;ll enable stricter logging and redaction
          </p>
        </div>

        <div
          onClick={() => setSensitiveData(false)}
          style={{
            flex: 1,
            padding: spacing['2xl'],
            border: `2px solid ${sensitiveData === false ? colors.primary[500] : colors.neutral[200]}`,
            borderRadius: radius.lg,
            textAlign: 'center',
            cursor: 'pointer',
            background: sensitiveData === false ? colors.primary[50] : colors.neutral[0],
            transition: 'all 150ms',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>🌐</div>
          <div
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
            }}
          >
            No
          </div>
          <p
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.neutral[500],
              marginTop: spacing.sm,
            }}
          >
            Standard security settings
          </p>
        </div>
      </div>
    </div>
  );
}

// Step 6: Summary
function Step6Summary({
  role,
  industry,
  recommendedPack,
}: {
  role: Role;
  industry: string;
  painPoints: string[];
  tools: string[];
  sensitiveData: boolean;
  recommendedPack: StarterPackId;
}) {
  const pack = STARTER_PACKS[recommendedPack];

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: spacing['2xl'] }}>
        <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>✨</div>
        <h2
          style={{
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold,
            marginBottom: spacing.md,
          }}
        >
          Your workspace is ready
        </h2>
        <p
          style={{
            fontSize: typography.fontSize.base,
            color: colors.neutral[600],
          }}
        >
          Based on your answers, we recommend the <strong>{pack.name}</strong>
        </p>
      </div>

      <Card
        style={{
          background: colors.primary[50],
          border: `2px solid ${colors.primary[200]}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.lg,
            marginBottom: spacing.lg,
          }}
        >
          <div style={{ fontSize: '3rem' }}>{pack.icon}</div>
          <div>
            <h3
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.semibold,
                marginBottom: spacing.xs,
              }}
            >
              {pack.name}
            </h3>
            <p
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.neutral[600],
              }}
            >
              {pack.description}
            </p>
          </div>
        </div>

        <div style={{ marginTop: spacing.xl }}>
          <p
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing.md,
            }}
          >
            Included agents:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {pack.agents.map((agent) => (
              <li
                key={agent.id}
                style={{
                  marginBottom: spacing.md,
                  display: 'flex',
                  gap: spacing.sm,
                }}
              >
                <span>✓</span>
                <div>
                  <div style={{ fontWeight: typography.fontWeight.medium }}>{agent.name}</div>
                  <div
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.neutral[600],
                    }}
                  >
                    {agent.description}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <div
        style={{
          marginTop: spacing.lg,
          fontSize: typography.fontSize.sm,
          color: colors.neutral[500],
          textAlign: 'center',
        }}
      >
        You can customize or add more agents anytime from your dashboard
      </div>
    </div>
  );
}
