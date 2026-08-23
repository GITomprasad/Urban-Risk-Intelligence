import React from 'react';
import { RiskSeverity } from '../../types';

interface HexRiskBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function getRiskSeverity(score: number): RiskSeverity {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

export function getRiskColor(score: number): {
  bg: string;
  border: string;
  text: string;
  glow: string;
  hex: string;
} {
  if (score >= 80) {
    return {
      bg: 'bg-red-950/80',
      border: 'border-red-500',
      text: 'text-red-400',
      glow: 'shadow-[0_0_15px_rgba(211,47,47,0.4)]',
      hex: '#D32F2F'
    };
  }
  if (score >= 60) {
    return {
      bg: 'bg-orange-950/80',
      border: 'border-orange-500',
      text: 'text-orange-400',
      glow: 'shadow-[0_0_12px_rgba(245,124,0,0.35)]',
      hex: '#F57C00'
    };
  }
  if (score >= 40) {
    return {
      bg: 'bg-yellow-950/70',
      border: 'border-yellow-500',
      text: 'text-yellow-400',
      glow: 'shadow-[0_0_10px_rgba(234,179,8,0.25)]',
      hex: '#EAB308'
    };
  }
  return {
    bg: 'bg-emerald-950/70',
    border: 'border-emerald-500',
    text: 'text-emerald-400',
    glow: 'shadow-[0_0_10px_rgba(56,142,60,0.25)]',
    hex: '#388E3C'
  };
}

export const HexRiskBadge: React.FC<HexRiskBadgeProps> = ({ score, showLabel = true, size = 'md' }) => {
  const colors = getRiskColor(score);
  const severity = getRiskSeverity(score);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3.5 py-1.5 font-bold'
  }[size];

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border ${colors.bg} ${colors.border} ${colors.text} ${colors.glow} ${sizeClasses} font-mono font-semibold backdrop-blur-md`}>
      <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.hex }}></span>
      <span>{score}</span>
      {showLabel && (
        <span className="text-[10px] uppercase font-sans tracking-wider opacity-90 border-l border-white/20 pl-1.5">
          {severity}
        </span>
      )}
    </div>
  );
};
