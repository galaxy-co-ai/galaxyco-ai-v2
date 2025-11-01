'use client';

import { colors, radius } from '@/lib/constants/design-system';
import { MARKETPLACE_CATEGORIES } from '@/lib/constants/marketplace-categories';
import { usePathname, useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';

interface MarketplaceCategoriesProps {
  activeCategory?: string;
}

export default function MarketplaceCategories({ activeCategory }: MarketplaceCategoriesProps) {
  const router = useRouter();
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  // Check scroll position to show/hide fade indicators
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftFade(scrollLeft > 0);
    setShowRightFade(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleCategoryClick = (slug: string | null) => {
    if (slug === null) {
      router.push('/marketplace');
    } else {
      router.push(`/marketplace/${slug}`);
    }
  };

  const isActive = (slug: string | null) => {
    if (slug === null) {
      return pathname === '/marketplace' || !activeCategory;
    }
    return activeCategory === slug;
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Left Fade Indicator */}
      {showLeftFade && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '60px',
            background:
              'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}

      {/* Right Fade Indicator */}
      {showRightFade && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '60px',
            background:
              'linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}

      {/* Categories Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        style={{
          display: 'flex',
          gap: '0.75rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
        className="hide-scrollbar"
      >
        {/* All Category */}
        <button
          onClick={() => handleCategoryClick(null)}
          style={{
            padding: '0.5rem 1.25rem', // ~38px height
            background: isActive(null) ? colors.primary[500] : colors.background.primary,
            color: isActive(null) ? 'white' : colors.text.primary,
            border: `1px solid ${isActive(null) ? 'transparent' : colors.border.default}`,
            borderRadius: radius.lg,
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
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

        {/* Enterprise Categories */}
        {MARKETPLACE_CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.slug)}
            style={{
              padding: '0.5rem 1.25rem',
              background: isActive(category.slug) ? colors.primary[500] : colors.background.primary,
              color: isActive(category.slug) ? 'white' : colors.text.primary,
              border: `1px solid ${isActive(category.slug) ? 'transparent' : colors.border.default}`,
              borderRadius: radius.lg,
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
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
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
