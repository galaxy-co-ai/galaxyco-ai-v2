'use client';

import { useRouter } from 'next/navigation';
import { colors, radius } from '@/lib/constants/design-system';
import { MARKETPLACE_CATEGORIES } from '@/lib/constants/marketplace-categories';

interface CategoryChipsProps {
  activeCategory?: string;
}

export default function CategoryChips({ activeCategory }: CategoryChipsProps) {
  const router = useRouter();

  const handleCategoryClick = (slug: string | null) => {
    if (slug === null) {
      router.push('/marketplace');
    } else {
      router.push(`/marketplace/${slug}`);
    }
  };

  const isActive = (slug: string | null) => {
    if (slug === null) {
      return !activeCategory;
    }
    return activeCategory === slug;
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.25rem',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE/Edge
      }}
      className="hide-scrollbar"
    >
      {/* All Chip */}
      <button
        onClick={() => handleCategoryClick(null)}
        className="pill-compact" /* Use design token class */
        style={{
          background: isActive(null) ? colors.primary[500] : colors.background.primary,
          color: isActive(null) ? 'white' : colors.text.primary,
          border: `1px solid ${isActive(null) ? 'transparent' : colors.border.default}`,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'all 0.2s',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          if (!isActive(null)) {
            e.currentTarget.style.borderColor = colors.border.focus;
            e.currentTarget.style.background = colors.background.secondary;
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive(null)) {
            e.currentTarget.style.borderColor = colors.border.default;
            e.currentTarget.style.background = colors.background.primary;
          }
        }}
      >
        <span>🌟</span>
        <span>All</span>
      </button>

      {/* Category Chips */}
      {MARKETPLACE_CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.slug)}
          className="pill-compact" /* Use design token class */
          style={{
            background: isActive(category.slug) ? colors.primary[500] : colors.background.primary,
            color: isActive(category.slug) ? 'white' : colors.text.primary,
            border: `1px solid ${isActive(category.slug) ? 'transparent' : colors.border.default}`,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            if (!isActive(category.slug)) {
              e.currentTarget.style.borderColor = colors.border.focus;
              e.currentTarget.style.background = colors.background.secondary;
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive(category.slug)) {
              e.currentTarget.style.borderColor = colors.border.default;
              e.currentTarget.style.background = colors.background.primary;
            }
          }}
          title={category.description}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
