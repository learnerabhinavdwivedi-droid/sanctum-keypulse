import { useState, useEffect, useCallback } from 'react';

export interface KeyRecord {
  id: string;
  label: string;
  mask: string;
  rawKey?: string;
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
      if (typeof window !== 'undefined' && window.Anna) {
        const storedKeys = await window.Anna.storage.get('vaultKeys');
        if (storedKeys && Array.isArray(storedKeys)) {
          setKeys(storedKeys);
        } else {
          setKeys([]);
        }
      } else {
        // Fallback for local development if Anna is not injected
        setKeys([]);
      }
    } catch (e) {
      console.error('Error fetching keys from Anna storage', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const persistKeys = async (newKeys: KeyRecord[]) => {
    if (typeof window !== 'undefined' && window.Anna) {
      await window.Anna.storage.set('vaultKeys', newKeys);
    }
  };

  const addKey = async (label: string, rawKey: string, provider: string = 'Custom', accessScopes: string[] = ['api.read']) => {
    try {
      setIsLoading(true);
      let mask = '••••••••••••';
      if (rawKey.length > 10) {
        mask = `${rawKey.substring(0, 6)}...${rawKey.substring(rawKey.length - 4)}`;
      } else if (rawKey.length > 2) {
        mask = `${rawKey.substring(0, 2)}...${rawKey.substring(rawKey.length - 2)}`;
      }

      const newKey: KeyRecord = {
        id: Math.random().toString(36).substring(7),
        label,
        provider,
        mask,
        rawKey,
        status: 'Active',
        lastUsed: new Date().toISOString().split('T')[0],
        accessProfile: accessScopes
      };

      const updatedKeys = [newKey, ...keys];
      setKeys(updatedKeys);
      await persistKeys(updatedKeys);
    } catch (e) {
      console.error('Error adding key', e);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteKey = async (id: string) => {
    try {
      setIsLoading(true);
      const updatedKeys = keys.filter(k => k.id !== id);
      setKeys(updatedKeys);
      await persistKeys(updatedKeys);
    } catch (e) {
      console.error('Error deleting key', e);
    } finally {
      setIsLoading(false);
    }
  };

  const revokeKey = async (id: string) => {
    try {
      setIsLoading(true);
      const updatedKeys = keys.map(k => k.id === id ? { ...k, status: 'Revoked' } : k);
      setKeys(updatedKeys);
      await persistKeys(updatedKeys);
    } catch (e) {
      console.error('Error revoking key', e);
    } finally {
      setIsLoading(false);
    }
  };

  const appendKey = useCallback(async (newKey: KeyRecord) => {
    setKeys(prevKeys => {
      const updated = [newKey, ...prevKeys];
      persistKeys(updated);
      return updated;
    });
  }, []);

  return { keys, addKey, appendKey, deleteKey, revokeKey, isLoading, refreshKeys: fetchKeys };
};
