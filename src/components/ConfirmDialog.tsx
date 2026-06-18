// src/components/ConfirmDialog.tsx
// Human-in-the-loop confirm dialog for destructive actions.
// Shown before delete/revoke of any API key.

'use client';

import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open, title, message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = true,
  onConfirm, onCancel,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) confirmRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div style={{
        background: '#0f1117',
        border: `1px solid ${danger ? '#dc2626' : '#374151'}`,
        borderRadius: 12,
        padding: '32px',
        maxWidth: 420,
        width: '90%',
        boxShadow: danger ? '0 0 40px rgba(220,38,38,0.25)' : '0 0 40px rgba(0,0,0,0.5)',
      }}>
        <h2 id="confirm-title" style={{
          margin: '0 0 12px',
          fontSize: 18,
          fontWeight: 700,
          color: danger ? '#ef4444' : '#f9fafb',
          fontFamily: 'monospace',
        }}>
          {danger ? '⚠ ' : ''}{title}
        </h2>
        <p style={{ margin: '0 0 28px', color: '#9ca3af', fontSize: 14, lineHeight: 1.6 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 20px', borderRadius: 6, border: '1px solid #374151',
              background: 'transparent', color: '#9ca3af', cursor: 'pointer', fontSize: 14,
            }}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            style={{
              padding: '8px 20px', borderRadius: 6, border: 'none',
              background: danger ? '#dc2626' : '#2563eb',
              color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
