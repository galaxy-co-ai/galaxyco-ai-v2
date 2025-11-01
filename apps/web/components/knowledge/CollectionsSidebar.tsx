'use client';

import { useState, useEffect } from 'react';
import { logger } from '@/lib/utils/logger';
import { COLORS, SPACING } from '@/lib/design-system';
import CreateCollectionModal from './CreateCollectionModal';

interface Collection {
  id: string;
  name: string;
  description?: string | null;
  color: string;
  itemCount: number;
  createdAt: string;
}

interface CollectionsSidebarProps {
  workspaceId: string;
  selectedCollectionId: string | null;
  onSelectCollection: (collectionId: string | null) => void;
  totalItemsCount: number;
}

export default function CollectionsSidebar({
  workspaceId,
  selectedCollectionId,
  onSelectCollection,
  totalItemsCount,
}: CollectionsSidebarProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  // Fetch collections
  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/knowledge/collections?workspaceId=${workspaceId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }

      const data = await response.json();
      setCollections(data.collections || []);
    } catch (error) {
      logger.error('Error fetching collections', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  // Handle delete collection
  const handleDelete = async (collectionId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this collection? Items will not be deleted, just ungrouped.',
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/knowledge/collections/${collectionId}?workspaceId=${workspaceId}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error('Failed to delete collection');
      }

      // If deleted collection was selected, clear selection
      if (selectedCollectionId === collectionId) {
        onSelectCollection(null);
      }

      fetchCollections();
    } catch (error: any) {
      logger.error('Error deleting collection', error);
      alert('Failed to delete collection: ' + error.message);
    }
  };

  return (
    <>
      <div
        style={{
          width: '260px',
          height: '100%',
          backgroundColor: COLORS.background.primary,
          borderRight: `1px solid ${COLORS.border.primary}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: SPACING.lg,
            borderBottom: `1px solid ${COLORS.border.primary}`,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: '600',
              color: COLORS.text.primary,
              marginBottom: SPACING.md,
            }}
          >
            Collections
          </h3>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              width: '100%',
              padding: `${SPACING.sm} ${SPACING.md}`,
              fontSize: '13px',
              fontWeight: '500',
              backgroundColor: COLORS.accent.primary,
              color: '#fff',
              border: 'none',
              borderRadius: SPACING.radius.md,
              cursor: 'pointer',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            + New Collection
          </button>
        </div>

        {/* Collections List */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: SPACING.sm,
          }}
        >
          {/* All Items */}
          <CollectionItem
            label="All Items"
            icon="📚"
            count={totalItemsCount}
            isSelected={selectedCollectionId === null}
            onClick={() => onSelectCollection(null)}
          />

          {/* Collections */}
          {isLoading ? (
            <div
              style={{
                padding: SPACING.lg,
                textAlign: 'center',
                fontSize: '13px',
                color: COLORS.text.secondary,
              }}
            >
              Loading...
            </div>
          ) : collections.length === 0 ? (
            <div
              style={{
                padding: SPACING.lg,
                textAlign: 'center',
                fontSize: '13px',
                color: COLORS.text.secondary,
              }}
            >
              No collections yet. Create one to get started!
            </div>
          ) : (
            collections.map((collection) => (
              <CollectionItem
                key={collection.id}
                label={collection.name}
                color={collection.color}
                count={collection.itemCount}
                isSelected={selectedCollectionId === collection.id}
                onClick={() => onSelectCollection(collection.id)}
                onEdit={() => setEditingCollection(collection)}
                onDelete={() => handleDelete(collection.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingCollection) && (
        <CreateCollectionModal
          workspaceId={workspaceId}
          onClose={() => {
            setShowCreateModal(false);
            setEditingCollection(null);
          }}
          onCreate={() => {
            fetchCollections();
          }}
          editCollection={editingCollection}
        />
      )}
    </>
  );
}

function CollectionItem({
  label,
  icon,
  color,
  count,
  isSelected,
  onClick,
  onEdit,
  onDelete,
}: {
  label: string;
  icon?: string;
  color?: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      style={{
        position: 'relative',
        marginBottom: SPACING.xs,
      }}
    >
      <button
        onClick={onClick}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: SPACING.sm,
          padding: `${SPACING.sm} ${SPACING.md}`,
          fontSize: '13px',
          fontWeight: '500',
          backgroundColor: isSelected ? `${COLORS.accent.primary}15` : 'transparent',
          color: isSelected ? COLORS.accent.primary : COLORS.text.primary,
          border: 'none',
          borderRadius: SPACING.radius.md,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          textAlign: 'left',
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = COLORS.background.secondary;
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        {/* Icon or Color Dot */}
        {icon ? (
          <span style={{ fontSize: '16px' }}>{icon}</span>
        ) : (
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: color,
              flexShrink: 0,
            }}
          />
        )}

        {/* Label */}
        <span
          style={{
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>

        {/* Count */}
        <span
          style={{
            fontSize: '11px',
            color: COLORS.text.secondary,
            flexShrink: 0,
          }}
        >
          {count}
        </span>
      </button>

      {/* Action Buttons */}
      {showActions && onEdit && onDelete && (
        <div
          style={{
            position: 'absolute',
            right: SPACING.sm,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            gap: SPACING.xs,
            backgroundColor: isSelected ? `${COLORS.accent.primary}15` : COLORS.background.primary,
            paddingLeft: SPACING.xs,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            style={{
              padding: SPACING.xs,
              fontSize: '14px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: COLORS.text.secondary,
            }}
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            style={{
              padding: SPACING.xs,
              fontSize: '14px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: COLORS.text.secondary,
            }}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}
