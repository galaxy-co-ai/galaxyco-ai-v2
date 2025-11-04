'use client';

import { motion } from 'framer-motion';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

export function StreamingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-4 px-6 py-6"
    >
      <Avatar
        src="/ai-avatar.png"
        alt="AI Assistant"
        fallback="AI"
        className="size-10 shrink-0 bg-primary/10 text-primary font-bold"
      />

      <Card className="p-4 rounded-2xl bg-card border-border/50">
        <div className="flex items-center gap-2">
          {/* Animated dots */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="size-2 rounded-full bg-primary"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-2">Thinking...</span>
        </div>
      </Card>
    </motion.div>
  );
}
