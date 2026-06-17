import { useState, useEffect, useCallback } from 'react';
import { annaBridge } from '../lib/annaBridge';

export interface KeyRecord {
  id: string;
  label: string;
  mask: string;
  rawKey?: string;
  provider: string;
  status: string;
  lastUsed: string;
  accessProfile: string[];
  directPortalUrl?: string;
  quota?: number;
}

export const useKeyManager = () => {
  const [keys, setKeys] = useState<KeyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchKeys = useCallback(async () => {
    try {
      await Promise.resolve();
      setIsLoading(true);
      const storedKeys = await annaBridge.storage.get('vaultKeys');
      if (storedKeys && Array.isArray(storedKeys)) {
        setKeys(storedKeys);
      } else {
        setKeys([]);
      }
    } catch {
      // Error fetching keys from Anna storage
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchKeys();
  }, [fetchKeys]);

  const persistKeys = async (newKeys: KeyRecord[]) => {
    await annaBridge.storage.set('vaultKeys', newKeys);
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

      // Hackathon mock quota logic: random number between 10 and 95
      const mockQuota = Math.floor(Math.random() * 85) + 10;
      
      const newKey: KeyRecord = {
        id: Math.random().toString(36).substring(7),
        label,
        provider,
        mask,
        rawKey,
        status: 'Active',
        lastUsed: new Date().toISOString().split('T')[0],
        accessProfile: accessScopes,
        directPortalUrl: `https://${provider.toLowerCase()}.com/developers/keys`,
        quota: mockQuota
      };

      setKeys(prevKeys => {
        const updatedKeys = [newKey, ...prevKeys];
        persistKeys(updatedKeys);
        return updatedKeys;
      });
    } catch {
      // Error adding key
    } finally {
      setIsLoading(false);
    }
  };

  const deleteKey = async (id: string) => {
    try {
      setIsLoading(true);
      setKeys(prevKeys => {
        const updatedKeys = prevKeys.filter(k => k.id !== id);
        persistKeys(updatedKeys);
        return updatedKeys;
      });
    } catch (e) {
      // Error deleting key
    } finally {
      setIsLoading(false);
    }
  };

  const revokeKey = async (id: string) => {
    try {
      setIsLoading(true);
      setKeys(prevKeys => {
        const updatedKeys = prevKeys.map(k => k.id === id ? { ...k, status: 'Revoked' } : k);
        persistKeys(updatedKeys);
        return updatedKeys;
      });
    } catch (e) {
      // Error revoking key
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
