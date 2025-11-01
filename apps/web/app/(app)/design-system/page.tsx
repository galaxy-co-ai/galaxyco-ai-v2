'use client';

import * as React from 'react';
import { Separator } from '@/components/ui/separator';
import {
  Heading,
  Text,
  Caption,
  Code,
  Link as UILink,
  Checkbox,
  Switch,
  Textarea,
  Tag,
  Spinner,
  ProgressBar,
  Dot,
  StatusIndicator,
  Icon,
  Avatar,
  Logo,
  Image as DSImage,
  Kbd,
  Divider,
} from '@/components/ui';
import { Star, User, Rocket, CheckCircle2 } from 'lucide-react';

export default function Page() {
  const [checked, setChecked] = React.useState(false);
  const [enabled, setEnabled] = React.useState(true);
  const [text, setText] = React.useState('');

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6">
      <Heading level={1} size="3xl">
        Design System Showcase
      </Heading>
      <Text variant="muted">GalaxyCo.ai Atomic Components</Text>

      {/* Typography */}
      <section className="space-y-4">
        <Heading level={2}>Typography</Heading>
        <div className="space-y-2">
          <Heading level={3}>Headings</Heading>
          <div className="space-y-1">
            <Heading level={1}>Heading 1</Heading>
            <Heading level={2}>Heading 2</Heading>
            <Heading level={3}>Heading 3</Heading>
          </div>
          <Heading level={3}>Text, Caption, Code, Link</Heading>
          <Text>
            Body text with <Code variant="inline">inline code</Code> and a{' '}
            <UILink href="/">link</UILink>.
          </Text>
          <Caption variant="subtle" icon={<CheckCircle2 className="h-3.5 w-3.5" />}>
            Small helper caption with icon
          </Caption>
        </div>
      </section>

      <Separator />

      {/* Forms */}
      <section className="space-y-4">
        <Heading level={2}>Forms</Heading>
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2">
            <Checkbox checked={checked} onCheckedChange={(v) => setChecked(!!v)} />
            <Text>Checkbox</Text>
          </label>
          <label className="flex items-center gap-2">
            <Switch checked={enabled} onCheckedChange={setEnabled} />
            <Text>Switch</Text>
          </label>
        </div>
        <Textarea
          placeholder="Enhanced textarea (auto-resize, show count)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoResize
          showCount
          maxLength={120}
          helperText="You can type up to 120 characters"
          id="showcase-textarea"
        />
      </section>

      <Separator />

      {/* Indicators */}
      <section className="space-y-4">
        <Heading level={2}>Indicators</Heading>
        <div className="flex flex-wrap items-center gap-4">
          <Tag icon={<Star className="h-4 w-4" />}>Featured</Tag>
          <Spinner label="Loading" />
          <ProgressBar value={64} showLabel variant="primary" />
          <Dot variant="success" pulse label="Online" />
          <StatusIndicator status="busy" showLabel />
        </div>
      </section>

      <Separator />

      {/* Media */}
      <section className="space-y-4">
        <Heading level={2}>Media</Heading>
        <div className="flex flex-wrap items-center gap-6">
          <Icon icon={Rocket} size="lg" />
          <Avatar alt="Jane" fallback="JA" status="online" />
          <Logo variant="full" />
          <div className="w-24">
            <DSImage
              src="/favicon.ico"
              alt="Sample"
              width={96}
              height={96}
              aspectRatio="square"
              rounded="md"
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Interactive */}
      <section className="space-y-4">
        <Heading level={2}>Interactive</Heading>
        <div className="flex flex-wrap items-center gap-4">
          <Kbd keys={['cmd', 'k']} />
          <Divider text="OR" />
        </div>
      </section>
    </main>
  );
}
