import { useState, useCallback, useEffect } from 'react';
import { KeyRecord } from './useKeyManager';

export interface KeyReport {
  id: string;
  label: string;
  provider: string;
  healthScore: number;
  status: 'Optimal' | 'Degraded' | 'Exhausted';
  usagePercentage: number;
  renewalDate: string;
  latencyMs: number;
}

const getDeterministicSeed = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export const useKeyAnalysis = (keys: KeyRecord[]) => {
  const [isScanning, setIsScanning] = useState(false);
  const [reports, setReports] = useState<KeyReport[]>([]);

  const analyzeKeys = useCallback(() => {
    setIsScanning(true);
    
    // Simulate async "deep scan"
    setTimeout(() => {
      const generatedReports = keys.map(key => {
        const seed = getDeterministicSeed(key.label + key.mask);
        
        // healthScore: 0-100
        const healthScore = seed % 101;
        
        // status: "Optimal" (score > 75), "Degraded" (score 40-75), or "Exhausted" (score < 40)
        let status: 'Optimal' | 'Degraded' | 'Exhausted' = 'Exhausted';
        if (healthScore > 75) status = 'Optimal';
        else if (healthScore >= 40) status = 'Degraded';
        
        // usagePercentage: 0-100 (inversely correlated to healthScore)
        // If healthScore is 100, usage is 0. If healthScore is 0, usage is 100.
        const usagePercentage = 100 - healthScore;
        
        // latencyMs: A number between 45ms and 800ms. Range = 755
        const latencyMs = (seed % 756) + 45;
        
        // renewalDate: 1st of the next month
        const now = new Date();
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const renewalDate = nextMonth.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        return {
          id: key.id,
          label: key.label,
          provider: key.provider,
          healthScore,
          status,
          usagePercentage,
          renewalDate,
          latencyMs
        };
      });

      // Sort reports by usage percentage (highest first)
      generatedReports.sort((a, b) => b.usagePercentage - a.usagePercentage);

      setReports(generatedReports);
      setIsScanning(false);
    }, 1500);
  }, [keys]);

  return { analyzeKeys, isScanning, reports };
};
