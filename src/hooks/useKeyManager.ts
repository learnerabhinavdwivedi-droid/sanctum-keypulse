import { useState, useEffect, useCallback } from 'react';

export interface KeyRecord {
  id: string;
  label: string;
  mask: string; // The UI-safe mask replacing keyValue
  provider: string;
  status: string;
  lastUsed: string;
  accessProfile: string[];
}

export const useKeyManager = () => {
  const [keys, setKeys] = useState<KeyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchKeys = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/keys');
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys || []);
      } else if (res.status === 401) {
        // Expected when logged out, do not blast the console
        setKeys([]);
      } else {
        console.error('Failed to fetch keys', await res.text());
      }
    } catch (e) {
      console.error('Error fetching keys', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const addKey = async (label: string, rawKey: string, provider: string = 'Custom', accessScopes: string[] = ['api.read']) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label,
          provider,
          rawKey,
          accessScopes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setKeys(prevKeys => [data.key, ...prevKeys]);
      } else {
        console.error('Failed to add key', await res.text());
      }
    } catch (e) {
      console.error('Error adding key', e);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteKey = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/keys/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setKeys(prevKeys => prevKeys.filter(k => k.id !== id));
      } else {
        console.error('Failed to delete key', await res.text());
      }
    } catch (e) {
      console.error('Error deleting key', e);
    } finally {
      setIsLoading(false);
    }
  };

  const revokeKey = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/keys/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REVOKED' }),
      });
      if (res.ok) {
        const data = await res.json();
        setKeys(prevKeys => prevKeys.map(k => k.id === id ? data.key : k));
      } else {
        console.error('Failed to revoke key', await res.text());
      }
    } catch (e) {
      console.error('Error revoking key', e);
    } finally {
      setIsLoading(false);
    }
  };

  const appendKey = useCallback((newKey: KeyRecord) => {
    setKeys(prevKeys => [newKey, ...prevKeys]);
  }, []);

  // We remove bulk generate as it shouldn't exist in production without explicit endpoints

  return { keys, addKey, appendKey, deleteKey, revokeKey, isLoading, refreshKeys: fetchKeys };
};
