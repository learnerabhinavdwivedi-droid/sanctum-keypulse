import React, { useState } from 'react';
import { KeyRecord, ValidationResult } from '../hooks/useKeyManager';
import { ArrowUpDown, KeyRound, MoreVertical, Link as LinkIcon, Trash2, ShieldCheck } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

interface KeyVaultTableProps {
  keys: KeyRecord[];
  onRevoke: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateSingleKey: () => void;
  // New optional props for validation
  validationResults?: Record<string, ValidationResult>;
  isValidating?: Record<string, boolean>;
  onValidate?: (id: string) => void;
}

// ── Validation badge ─────────────────────────────────────────────────────────
function ValidationBadge({ id, result, validating }: {
  id: string;
  result?: ValidationResult;
  validating?: boolean;
}) {
  if (validating) {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-black bg-[#FFD200] text-black animate-pulse">
        ⏳ Checking
      </span>
    );
  }
  if (!result) {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-black bg-white text-gray-500">
        ○ Unchecked
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-black ${result.valid ? 'bg-[#00CD74] text-black' : 'bg-[#FF4B91] text-white'}`}>
      {result.valid ? '✅ Valid' : '❌ Invalid'}
    </span>
  );
}

// ── Validation panel ─────────────────────────────────────────────────────────
function ValidationPanel({ result }: { result: ValidationResult }) {
  const hasUsage = Object.keys(result.usage).length > 0;
  const hasAccount = Object.keys(result.accountInfo).length > 0;

  return (
    <tr>
      <td colSpan={5} style={{ padding: 0, borderBottom: '4px solid black' }}>
        <div style={{
          background: result.valid ? '#f0fff4' : '#fff0f0',
          borderTop: `2px solid ${result.valid ? '#00CD74' : '#FF4B91'}`,
          padding: '16px 24px',
          fontFamily: 'monospace',
          fontSize: 12,
        }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#000' }}>
              {result.valid ? '✅' : '❌'} {result.label}
            </span>
            <span style={{ color: '#555', fontSize: 11 }}>
              {result.provider}
            </span>
            <span style={{
              background: '#000', color: '#fff',
              padding: '2px 8px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
            }}>
              {result.latencyMs}ms
            </span>
            <span style={{ color: '#888', fontSize: 10 }}>
              Checked: {new Date(result.checkedAt).toLocaleTimeString()}
            </span>
          </div>

          {/* Error message */}
          {result.error && (
            <div style={{
              background: '#fee2e2', border: '1px solid #fca5a5',
              borderRadius: 4, padding: '8px 12px', marginBottom: 12,
              color: '#991b1b', fontSize: 12,
            }}>
              ⚠ {result.error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {/* Scopes */}
            {result.scopes.length > 0 && (
              <div>
                <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 10, color: '#555', marginBottom: 6 }}>
                  Scopes
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {result.scopes.map((s, i) => (
                    <span key={i} style={{
                      background: '#000', color: '#fff',
                      padding: '2px 6px', fontSize: 10, fontWeight: 600,
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Usage / Quota */}
            {hasUsage && (
              <div>
                <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 10, color: '#555', marginBottom: 6 }}>
                  Usage / Quota
                </div>
                {result.usage.rateLimitRemaining !== undefined && (
                  <div style={{ fontSize: 11 }}>
                    <span style={{ color: '#555' }}>Rate Limit Remaining: </span>
                    <span style={{ fontWeight: 700, color: (result.usage.rateLimitRemaining ?? 0) < 100 ? '#dc2626' : '#16a34a' }}>
                      {result.usage.rateLimitRemaining} / {result.usage.quotaLimit}
                    </span>
                  </div>
                )}
                {result.usage.rateLimitReset && (
                  <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
                    Resets: {new Date(result.usage.rateLimitReset).toLocaleTimeString()}
                  </div>
                )}
                {result.usage.planName && (
                  <div style={{ fontSize: 11, marginTop: 2 }}>
                    <span style={{ color: '#555' }}>Plan: </span>
                    <span style={{ fontWeight: 700 }}>{result.usage.planName}</span>
                  </div>
                )}
              </div>
            )}

            {/* Account info */}
            {hasAccount && (
              <div>
                <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 10, color: '#555', marginBottom: 6 }}>
                  Account Info
                </div>
                {Object.entries(result.accountInfo)
                  .filter(([, v]) => v !== undefined && v !== null && v !== '')
                  .slice(0, 5)
                  .map(([k, v]) => (
                    <div key={k} style={{ fontSize: 11 }}>
                      <span style={{ color: '#555' }}>{k}: </span>
                      <span style={{ fontWeight: 700 }}>{String(v)}</span>
                    </div>
                  ))}
              </div>
            )}

            {/* Risks */}
            {result.risks.length > 0 && (
              <div>
                <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 10, color: '#dc2626', marginBottom: 6 }}>
                  ⚠ Risk Flags
                </div>
                {result.risks.map((r, i) => (
                  <div key={i} style={{
                    background: '#fee2e2', border: '1px solid #fca5a5',
                    borderRadius: 4, padding: '4px 8px', marginBottom: 4,
                    fontSize: 11, color: '#991b1b',
                  }}>
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

export const KeyVaultTable: React.FC<KeyVaultTableProps> = ({
  keys,
  onRevoke,
  onDelete,
  onCreateSingleKey,
  validationResults = {},
  isValidating = {},
  onValidate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Confirm dialog state
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'revoke';
    keyId: string;
    keyLabel: string;
  } | null>(null);

  // Expanded validation panel
  const [expandedValidation, setExpandedValidation] = useState<string | null>(null);

  // Filter keys
  const filteredKeys = keys.filter(k =>
    k.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.mask.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredKeys.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentKeys = filteredKeys.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  // Confirm dialog handlers
  const requestRevoke = (id: string, label: string) => {
    setConfirmAction({ type: 'revoke', keyId: id, keyLabel: label });
  };

  const requestDelete = (id: string, label: string) => {
    setConfirmAction({ type: 'delete', keyId: id, keyLabel: label });
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'delete') {
      onDelete(confirmAction.keyId);
    } else {
      onRevoke(confirmAction.keyId);
    }
    setConfirmAction(null);
  };

  const handleCancelConfirm = () => setConfirmAction(null);

  return (
    <>
      {/* Human-in-the-loop Confirm Dialog */}
      <ConfirmDialog
        open={confirmAction !== null}
        title={confirmAction?.type === 'delete' ? 'Permanently Delete Key' : 'Revoke Key Access'}
        message={
          confirmAction?.type === 'delete'
            ? `This will permanently remove "${confirmAction?.keyLabel}" from the vault. This action cannot be undone.`
            : `This will revoke all access for "${confirmAction?.keyLabel}". The key will be marked as Revoked and can no longer be used.`
        }
        confirmLabel={confirmAction?.type === 'delete' ? 'Delete Forever' : 'Revoke Access'}
        cancelLabel="Cancel — Keep Key"
        danger={true}
        onConfirm={handleConfirm}
        onCancel={handleCancelConfirm}
      />

      <section className="bg-white border-4 border-black rounded-xl flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden h-full">
        {/* Top Header & Search */}
        <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between border-b-4 border-black bg-[#FFD200] gap-4">
          <h2 className="text-2xl font-black text-black uppercase tracking-widest whitespace-nowrap mr-4">Key Vault</h2>

          <div className="flex-1 w-full max-w-md mx-0 md:mx-4">
            <input
              type="text"
              placeholder="SEARCH VAULT..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset page on search
              }}
              className="w-full bg-white border-4 border-black text-black placeholder-gray-500 rounded-none px-4 py-3 font-black uppercase tracking-widest focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 text-sm font-black text-black uppercase tracking-widest bg-white hover:bg-gray-200 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              <ArrowUpDown className="w-5 h-5" />
              Sort
            </button>
            <button
              onClick={onCreateSingleKey}
              className="flex-1 md:flex-none px-6 py-3 text-sm font-black text-white uppercase tracking-widest bg-[#FF4B91] hover:bg-[#D43F7A] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              Create Key
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar min-h-0 bg-white">
          <table className="w-full text-left relative border-collapse">
            <thead className="bg-black text-white sticky top-0 z-10">
              <tr>
                <th className="px-6 py-5 font-black uppercase tracking-widest text-xs border-b-4 border-black border-r-4">Label</th>
                <th className="px-6 py-5 font-black uppercase tracking-widest text-xs border-b-4 border-black border-r-4">Key Info</th>
                <th className="px-6 py-5 font-black uppercase tracking-widest text-xs border-b-4 border-black border-r-4">Provider / Portal</th>
                <th className="px-6 py-5 font-black uppercase tracking-widest text-xs border-b-4 border-black border-r-4">Status & Scopes</th>
                <th className="px-4 py-5 font-black uppercase tracking-widest text-xs border-b-4 border-black text-center">Act</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-black">
              {currentKeys.length > 0 ? currentKeys.map((row) => (
                <React.Fragment key={row.id}>
                  <tr className="hover:bg-[#00E5FF]/10 transition-colors group">
                    <td className="px-6 py-5 text-black font-black uppercase tracking-wide border-r-4 border-black">
                      <div className="flex items-center justify-between gap-4">
                        <span>{row.label}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(row.label)}
                          className="p-1.5 border-2 border-black bg-white hover:bg-[#FFD200] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex-shrink-0"
                          title="Copy Env Name"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-5 border-r-4 border-black bg-gray-50">
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-mono text-black font-bold tracking-widest text-sm bg-white px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          {row.mask}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (row.rawKey && row.rawKey !== 'ERROR_DECRYPTING') {
                                navigator.clipboard.writeText(row.rawKey);
                              } else {
                                alert('Cannot copy key: ' + row.rawKey);
                              }
                            }}
                            className="p-1.5 border-2 border-black bg-white hover:bg-[#00CD74] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex-shrink-0"
                            title="Copy Raw Key"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                          </button>
                          <KeyRound className="w-5 h-5 text-black flex-shrink-0" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-black font-bold uppercase tracking-wider border-r-4 border-black">
                      <div className="flex flex-col gap-2">
                        <span>{row.provider}</span>
                        {row.directPortalUrl && (
                          <a href={row.directPortalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] bg-black text-white px-2 py-1 max-w-max border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors">
                            <LinkIcon className="w-3 h-3" />
                            PORTAL
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 border-r-4 border-black">
                      <div className="flex flex-col items-start gap-2">
                        <span className={`inline-block px-3 py-1 border-2 border-black text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${row.status === 'Revoked' ? 'bg-[#FF4B91] text-white' : 'bg-[#00CD74] text-black'}`}>
                          {row.status}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {row.accessProfile && row.accessProfile.map((scope, idx) => (
                            <span key={idx} className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-black bg-white ${row.status === 'Revoked' ? 'line-through text-gray-400 border-gray-400' : 'text-black'}`}>
                              {scope}
                            </span>
                          ))}
                        </div>
                        {/* Validation badge */}
                        <ValidationBadge
                          id={row.id}
                          result={validationResults[row.id]}
                          validating={isValidating[row.id]}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-5 text-center">
                      <div className="flex items-center justify-center gap-2 flex-col">
                        {/* Validate button */}
                        {onValidate && (
                          <button
                            onClick={() => {
                              onValidate(row.id);
                              setExpandedValidation(row.id);
                            }}
                            disabled={isValidating[row.id]}
                            className="p-1 border-2 border-transparent hover:border-black bg-transparent hover:bg-[#00E5FF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Validate Key Against Provider"
                          >
                            <ShieldCheck className="w-5 h-5" />
                          </button>
                        )}
                        {/* Toggle validation panel */}
                        {validationResults[row.id] && (
                          <button
                            onClick={() => setExpandedValidation(expandedValidation === row.id ? null : row.id)}
                            className="text-[8px] font-black uppercase tracking-wider text-gray-500 hover:text-black transition-colors"
                            title="Toggle Validation Panel"
                          >
                            {expandedValidation === row.id ? '▲ Hide' : '▼ Details'}
                          </button>
                        )}
                        <button
                          onClick={() => requestRevoke(row.id, row.label)}
                          disabled={row.status === 'Revoked'}
                          className="p-1 border-2 border-transparent hover:border-black bg-transparent hover:bg-[#FF4B91] hover:text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-[#FF4B91] disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Revoke Key"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => requestDelete(row.id, row.label)}
                          className="p-1 border-2 border-transparent hover:border-black bg-transparent hover:bg-black hover:text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-gray-500"
                          title="Delete Key Permanently"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Validation detail panel */}
                  {expandedValidation === row.id && validationResults[row.id] && (
                    <ValidationPanel result={validationResults[row.id]} />
                  )}
                </React.Fragment>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-black font-black uppercase tracking-widest text-lg bg-gray-50">
                    No keys found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t-4 border-black bg-[#00E5FF] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentPage(1)} className="px-3 py-1.5 border-2 border-black bg-white font-black hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">|&lt;</button>
            <button onClick={handlePrev} className="px-3 py-1.5 border-2 border-black bg-white font-black hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">&lt;</button>
            <span className="font-black text-black uppercase tracking-widest px-4 py-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button onClick={handleNext} className="px-3 py-1.5 border-2 border-black bg-white font-black hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">&gt;</button>
            <button onClick={() => setCurrentPage(totalPages || 1)} className="px-3 py-1.5 border-2 border-black bg-white font-black hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">&gt;|</button>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-black text-[#FF4B91]">{filteredKeys.length}</span>
            <span className="font-black uppercase tracking-widest text-sm text-black">Total Keys</span>
          </div>
        </div>
      </section>
    </>
  );
};
