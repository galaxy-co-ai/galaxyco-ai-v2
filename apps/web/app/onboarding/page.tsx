'use client';

import { useState } from 'react';
import { createWorkspace } from '@/lib/actions/workspace-actions';
import { generateSlug } from '@/lib/workspace-utils';

export default function OnboardingPage() {
  const [workspaceName, setWorkspaceName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setWorkspaceName(name);
    setSlug(generateSlug(name));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await createWorkspace(formData);

    if (result && !result.success) {
      setError(result.error || 'Failed to create workspace');
      setIsLoading(false);
    }
    // If successful, the server action will redirect
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '3rem',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            🚀 Welcome to GalaxyCo.ai
          </h1>
          <p style={{ color: '#666', fontSize: '1rem' }}>
            Let's create your first workspace to get started
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="name"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#333',
              }}
            >
              Workspace Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={workspaceName}
              onChange={handleNameChange}
              placeholder="e.g., Acme Inc, My Company"
              required
              maxLength={50}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#667eea')}
              onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
            />
          </div>

          {slug && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#666',
                  fontSize: '0.875rem',
                }}
              >
                Workspace URL
              </label>
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  color: '#666',
                }}
              >
                galaxyco.ai/
                <span style={{ color: '#667eea', fontWeight: '600' }}>{slug}</span>
              </div>
            </div>
          )}

          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                background: '#fee',
                border: '1px solid #fcc',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                color: '#c33',
                fontSize: '0.875rem',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !workspaceName.trim()}
            style={{
              width: '100%',
              padding: '0.875rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: 'white',
              background: isLoading || !workspaceName.trim() ? '#ccc' : '#667eea',
              border: 'none',
              borderRadius: '8px',
              cursor: isLoading || !workspaceName.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isLoading && workspaceName.trim()) {
                e.currentTarget.style.background = '#5568d3';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isLoading || !workspaceName.trim() ? '#ccc' : '#667eea';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {isLoading ? 'Creating Workspace...' : 'Create Workspace →'}
          </button>
        </form>

        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#f8f9fa',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#666',
          }}
        >
          <strong>💡 What's a workspace?</strong>
          <p style={{ margin: '0.5rem 0 0 0' }}>
            A workspace is your team's private environment for building and managing AI agents. You can
            create multiple workspaces for different projects or teams.
          </p>
        </div>
      </div>
    </div>
  );
}
