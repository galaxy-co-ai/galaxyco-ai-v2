'use client';

import { colors, radius } from '@/lib/constants/design-system';

export default function MarketplaceCategories() {
  const categories = [
    { name: 'All', icon: '🌟', count: 47 },
    { name: 'Automation', icon: '🤖', count: 12 },
    { name: 'Sales & GTM', icon: '📈', count: 8 },
    { name: 'Knowledge', icon: '📚', count: 6 },
    { name: 'Productivity', icon: '⚡', count: 9 },
    { name: 'Code & Data', icon: '💻', count: 7 },
    { name: 'Security', icon: '🔒', count: 5 }
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      overflowX: 'auto',
      paddingBottom: '0.5rem'
    }}>
      {categories.map((category) => (
        <button
          key={category.name}
          style={{
            padding: '0.75rem 1.5rem',
            background: category.name === 'All' ? colors.primary[500] : colors.background.primary,
            color: category.name === 'All' ? 'white' : colors.text.primary,
            border: `1px solid ${category.name === 'All' ? 'transparent' : colors.border.default}`,
            borderRadius: radius.lg,
            fontSize: '0.9375rem',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s'
          }}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
          <span style={{
            fontSize: '0.75rem',
            opacity: 0.7
          }}>
            ({category.count})
          </span>
        </button>
      ))}
    </div>
  );
}