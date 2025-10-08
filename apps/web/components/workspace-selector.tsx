'use client';

import { useWorkspace } from '@/contexts/workspace-context';
import { useState } from 'react';

export default function WorkspaceSelector() {
  const { workspaces, currentWorkspace, switchWorkspace, isLoading } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading || !currentWorkspace) {
    return (
      <div
        style={{
          padding: '0.5rem 1rem',
          background: '#f0f0f0',
          borderRadius: '8px',
          fontSize: '0.875rem',
        }}
      >
        Loading...
      </div>
    );
  }

  if (workspaces.length <= 1) {
    // Don't show selector if user only has one workspace
    return (
      <div
        style={{
          padding: '0.5rem 1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '8px',
          fontSize: '0.875rem',
          fontWeight: '600',
        }}
      >
        🏢 {currentWorkspace.name}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '0.5rem 1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '0.875rem',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
      >
        🏢 {currentWorkspace.name}
        <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>▼</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
            }}
          />

          {/* Dropdown menu */}
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 0.5rem)',
              left: 0,
              minWidth: '250px',
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              zIndex: 20,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '0.75rem 1rem',
                borderBottom: '1px solid #e0e0e0',
                fontSize: '0.75rem',
                color: '#666',
                fontWeight: '600',
                textTransform: 'uppercase',
              }}
            >
              Switch Workspace
            </div>

            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => {
                  switchWorkspace(workspace.id);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background:
                    workspace.id === currentWorkspace.id ? '#f8f9fa' : 'white',
                  border: 'none',
                  borderBottom: '1px solid #f0f0f0',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = '#f8f9fa')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    workspace.id === currentWorkspace.id ? '#f8f9fa' : 'white')
                }
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                  }}
                >
                  {workspace.id === currentWorkspace.id && (
                    <span style={{ color: '#667eea' }}>✓</span>
                  )}
                  {workspace.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>
                  Role: {workspace.role.toUpperCase()}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
