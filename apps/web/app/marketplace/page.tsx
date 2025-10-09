import { Suspense } from 'react';
import MarketplaceHero from '@/components/marketplace/MarketplaceHero';
import MarketplaceFeatured from '@/components/marketplace/MarketplaceFeatured';
import MarketplaceCategories from '@/components/marketplace/MarketplaceCategories';
import MarketplaceGrid from '@/components/marketplace/MarketplaceGrid';
import { colors } from '@/lib/constants/design-system';

export default function MarketplacePage() {
  return (
    <div style={{ minHeight: '100vh', background: colors.background.primary }}>
      {/* OpenSea-style Large Hero Section */}
      <MarketplaceHero />
      
      {/* Featured Agents Carousel */}
      <section style={{ padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '700',
            marginBottom: '2rem',
            color: colors.text.primary 
          }}>
            🔥 Featured Agents
          </h2>
          <Suspense fallback={<div>Loading featured...</div>}>
            <MarketplaceFeatured />
          </Suspense>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '0 1.5rem 2rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            fontWeight: '600',
            marginBottom: '1.5rem',
            color: colors.text.primary 
          }}>
            Browse by Category
          </h2>
          <MarketplaceCategories />
        </div>
      </section>

      {/* Main Grid */}
      <section style={{ padding: '0 1.5rem 4rem', background: colors.background.secondary }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '2rem',
            paddingTop: '3rem'
          }}>
            <h2 style={{ 
              fontSize: '1.75rem', 
              fontWeight: '600',
              color: colors.text.primary 
            }}>
              All Agent Templates
            </h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <select style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: `1px solid ${colors.border.default}`,
                background: colors.background.primary,
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}>
                <option>Most Popular</option>
                <option>Trending</option>
                <option>Newest First</option>
                <option>Best Rated</option>
              </select>
              <button style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: `1px solid ${colors.border.default}`,
                background: colors.background.primary,
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}>
                Filters
              </button>
            </div>
          </div>
          
          <Suspense fallback={<div>Loading templates...</div>}>
            <MarketplaceGrid />
          </Suspense>
        </div>
      </section>
    </div>
  );
}