/**
 * Workspace Selector Component
 * Dropdown to switch between user's accessible workspaces
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useWorkspace, type Workspace } from '@/hooks/useWorkspace';
import { colors, spacing, typography, radius, shadows } from '@/lib/constants/design-system';

interface WorkspaceSelectProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const WorkspaceSelect: React.FC<WorkspaceSelectProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const { workspaceId, workspace, setWorkspaceId, isLoading } = useWorkspace();
  const [availableWorkspaces, setAvailableWorkspaces] = useState<Workspace[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(false);

  // Size variants
  const sizes = {
    sm: {
      padding: `${spacing.xs} ${spacing.sm}`,
      fontSize: typography.sizes.sm,
      height: '32px',
    },
    md: {
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: typography.sizes.base,
      height: '40px',
    },
    lg: {
      padding: `${spacing.md} ${spacing.lg}`,
      fontSize: typography.sizes.lg,
      height: '48px',
    },
  };

  /**
   * Fetch available workspaces on mount
   */
  useEffect(() => {
    async function fetchWorkspaces() {
      if (isLoadingWorkspaces) return;
      
      try {
        setIsLoadingWorkspaces(true);
        const response = await fetch('/api/workspace/list');
        
        if (!response.ok) {
          throw new Error('Failed to fetch workspaces');
        }
        
        const data = await response.json();
        setAvailableWorkspaces(data.workspaces || []);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      } finally {
        setIsLoadingWorkspaces(false);
      }
    }

    fetchWorkspaces();
  }, [workspaceId]); // Refresh when workspace changes

  /**
   * Handle workspace selection
   */
  const handleWorkspaceSelect = async (selectedWorkspace: Workspace) => {
    if (selectedWorkspace.id === workspaceId) {
      setIsDropdownOpen(false);
      return;
    }

    try {
      await setWorkspaceId(selectedWorkspace.id);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Error switching workspace:', error);
    }
  };

  /**
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;
      if (!target.closest('[data-workspace-select]')) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  if (isLoading || !workspace) {
    return (
      <div
        className={className}
        style={{
          ...sizes[size],
          backgroundColor: colors.background.secondary,
          border: `1px solid ${colors.border.default}`,
          borderRadius: radius.md,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.sm,
          color: colors.text.tertiary,
          cursor: 'not-allowed',
        }}
      >
        <div
          style={{
            width: '16px',
            height: '16px',
            backgroundColor: colors.background.tertiary,
            borderRadius: radius.full,
            animation: 'pulse 2s infinite',
          }}
        />
        Loading...
      </div>
    );
  }

  return (
    <div
      data-workspace-select
      className={className}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {/* Current Workspace Button */}
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        disabled={isLoadingWorkspaces}
        style={{
          ...sizes[size],
          width: '100%',
          backgroundColor: colors.background.secondary,
          border: `1px solid ${colors.border.default}`,
          borderRadius: radius.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.sm,
          cursor: isLoadingWorkspaces ? 'not-allowed' : 'pointer',
          transition: 'all 200ms',
          opacity: isLoadingWorkspaces ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isLoadingWorkspaces) {
            e.currentTarget.style.backgroundColor = colors.background.tertiary;
            e.currentTarget.style.borderColor = colors.border.focus;
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.background.secondary;
          e.currentTarget.style.borderColor = colors.border.default;
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flex: 1 }}>
          {/* Workspace Icon/Avatar */}
          <div
            style={{
              width: size === 'sm' ? '20px' : size === 'md' ? '24px' : '28px',
              height: size === 'sm' ? '20px' : size === 'md' ? '24px' : '28px',
              backgroundColor: colors.primary,
              borderRadius: radius.md,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: size === 'sm' ? '10px' : size === 'md' ? '12px' : '14px',
              fontWeight: typography.weights.bold,
              color: colors.background.primary,
            }}
          >
            {workspace.name.charAt(0).toUpperCase()}
          </div>
          
          {/* Workspace Name */}
          <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: sizes[size].fontSize,
                fontWeight: typography.weights.medium,
                color: colors.text.primary,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {workspace.name}
            </div>
            {size !== 'sm' && (
              <div
                style={{
                  fontSize: typography.sizes.xs,
                  color: colors.text.tertiary,
                  textTransform: 'capitalize',
                }}
              >
                {workspace.plan} • {workspace.role}
              </div>
            )}
          </div>
        </div>

        {/* Dropdown Arrow */}
        <div
          style={{
            fontSize: size === 'sm' ? '12px' : '14px',
            color: colors.text.tertiary,
            transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms',
          }}
        >
          ▼
        </div>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: spacing.xs,
            backgroundColor: colors.background.primary,
            border: `1px solid ${colors.border.default}`,
            borderRadius: radius.md,
            boxShadow: shadows.lg,
            zIndex: 50,
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {availableWorkspaces.length === 0 ? (
            <div
              style={{
                padding: spacing.md,
                fontSize: typography.sizes.sm,
                color: colors.text.tertiary,
                textAlign: 'center',
              }}
            >
              {isLoadingWorkspaces ? 'Loading workspaces...' : 'No workspaces found'}
            </div>
          ) : (
            availableWorkspaces.map((ws) => (
              <button
                key={ws.id}
                type="button"
                onClick={() => handleWorkspaceSelect(ws)}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  backgroundColor: 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  cursor: 'pointer',
                  transition: 'all 200ms',
                  borderRadius: 0,
                  fontSize: typography.sizes.sm,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.background.secondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {/* Workspace Icon */}
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: ws.id === workspaceId ? colors.primary : colors.background.tertiary,
                    borderRadius: radius.md,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: typography.weights.bold,
                    color: ws.id === workspaceId ? colors.background.primary : colors.text.secondary,
                  }}
                >
                  {ws.name.charAt(0).toUpperCase()}
                </div>
                
                {/* Workspace Info */}
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div
                    style={{
                      fontSize: typography.sizes.sm,
                      fontWeight: ws.id === workspaceId ? typography.weights.semibold : typography.weights.medium,
                      color: colors.text.primary,
                    }}
                  >
                    {ws.name}
                  </div>
                  <div
                    style={{
                      fontSize: typography.sizes.xs,
                      color: colors.text.tertiary,
                      textTransform: 'capitalize',
                    }}
                  >
                    {ws.plan} • {ws.role}
                  </div>
                </div>

                {/* Current Indicator */}
                {ws.id === workspaceId && (
                  <div
                    style={{
                      fontSize: '12px',
                      color: colors.primary,
                    }}
                  >
                    ✓
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};