import { useState, useEffect } from 'react';

export interface KeyRecord {
  id: string;
  label: string;
  keyValue: string;
  provider: string;
  portalUrl: string;
  status: string;
  lastUsed: string;
}

export const useKeyManager = () => {
  const [keys, setKeys] = useState<KeyRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load on mount
  useEffect(() => {
    const loadKeys = async () => {
      try {
        let data = null;
        if (typeof window !== 'undefined' && window.Anna?.storage) {
          data = await window.Anna.storage.get('sanctum_keys');
        } else if (typeof window !== 'undefined') {
          data = JSON.parse(localStorage.getItem('sanctum_keys') || 'null');
        }
        
        if (data && Array.isArray(data) && data.length > 0) {
          setKeys(data);
        } else {
          // Initialize with some mock data if empty for demo purposes
          setKeys(Array.from({ length: 8 }).map((_, i) => ({
            id: i.toString(),
            label: `Google AI Key #${i + 1}`,
            keyValue: `gsk-••••••••••••${Math.random().toString(36).substring(2, 6)}`,
            provider: "Google",
            portalUrl: "https://console.cloud.google.com/",
            status: "Active",
            lastUsed: new Date().toLocaleDateString()
          })));
        }
      } catch (e) {
        console.error("Failed to load keys", e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadKeys();
  }, []);

  // Save when keys change
  useEffect(() => {
    if (!isLoaded) return;
    const saveKeys = async () => {
      try {
        if (typeof window !== 'undefined' && window.Anna?.storage) {
          await window.Anna.storage.set('sanctum_keys', keys);
        } else if (typeof window !== 'undefined') {
          localStorage.setItem('sanctum_keys', JSON.stringify(keys));
        }
      } catch (e) {
        console.error("Failed to save keys", e);
      }
    };
    saveKeys();
  }, [keys, isLoaded]);

  const generateKeys = (count: number, prefix: string, provider: string = "Provider") => {
    const newKeys: KeyRecord[] = Array.from({ length: count }).map(() => ({
      id: Math.random().toString(36).substring(2, 9),
      label: `${provider} Key #${Math.floor(Math.random() * 1000)}`,
      keyValue: `${prefix}${Math.random().toString(36).substring(2, 12)}`,
      provider: provider,
      portalUrl: `https://www.sanctum/ke/${Math.random().toString(36).substring(2, 8)}`,
      status: "Active",
      lastUsed: new Date().toLocaleDateString()
    }));
    setKeys(prev => [...newKeys, ...prev]);
  };

  const createSingleKey = () => {
    const newKey: KeyRecord = {
      id: Math.random().toString(36).substring(2, 9),
      label: `Manual Key #${Math.floor(Math.random() * 1000)}`,
      keyValue: `sk-${Math.random().toString(36).substring(2, 12)}`,
      provider: "Custom",
      portalUrl: `https://www.sanctum/ke/custom`,
      status: "Active",
      lastUsed: new Date().toLocaleDateString()
    };
    setKeys(prev => [newKey, ...prev]);
  };

  const revokeKey = (id: string) => {
    setKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'Revoked' } : k));
  };

  return { keys, generateKeys, createSingleKey, revokeKey };
};
