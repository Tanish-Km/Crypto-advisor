'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { StressScenarioResult } from '@/types';

interface StressBarsProps {
  result: StressScenarioResult;
}

export function StressBars({ result }: StressBarsProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  const totalItems = result.perCoinContribution.length + 1; // Coins + Portfolio Total
  const spacing = 1.4;
  const startX = -((totalItems - 1) * spacing) / 2;

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Translucent floor line / platform */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[totalItems * 1.8, 3]} />
        <meshBasicMaterial color="#FF5C7A" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Grid Lines on Floor */}
      <gridHelper args={[totalItems * 2, 10, '#8FB8D6', '#14171E']} position={[0, 0, 0]} />

      {/* Per-Coin Bars */}
      {result.perCoinContribution.map((item, index) => {
        const x = startX + index * spacing;
        // Height scaled by drawdown: 100% -> 3.2 units height
        const barHeight = Math.max(0.2, (item.drawdownPercent / 100) * 3.2);

        return (
          <group key={item.coinId} position={[x, barHeight / 2, 0]}>
            {/* 3D Bar */}
            <mesh>
              <boxGeometry args={[0.7, barHeight, 0.7]} />
              <meshStandardMaterial
                color={item.drawdownPercent > 70 ? '#FF5C7A' : '#FFB84D'}
                roughness={0.25}
                metalness={0.8}
              />
            </mesh>

            {/* Top Cap */}
            <mesh position={[0, barHeight / 2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.7, 0.7]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>

            {/* DOM Label */}
            <Html position={[0, barHeight / 2 + 0.35, 0]} center distanceFactor={8}>
              <div className="flex flex-col items-center px-2 py-1 rounded-md glass-surface text-center whitespace-nowrap shadow-z2 border border-danger/40">
                <span className="font-mono font-bold text-xs text-text-primary">{item.symbol}</span>
                <span className="font-mono text-danger text-[11px] font-semibold">
                  -{item.drawdownPercent}%
                </span>
                <span className="text-[10px] text-text-secondary font-mono">
                  -${item.lossAmount.toLocaleString()}
                </span>
              </div>
            </Html>
          </group>
        );
      })}

      {/* Total Portfolio Bar */}
      {(() => {
        const x = startX + result.perCoinContribution.length * spacing;
        const barHeight = Math.max(0.3, (result.portfolioDrawdownPercent / 100) * 3.2);

        return (
          <group position={[x, barHeight / 2, 0]}>
            <mesh>
              <boxGeometry args={[0.9, barHeight, 0.9]} />
              <meshStandardMaterial
                color="#FF5C7A"
                roughness={0.2}
                metalness={0.9}
                emissive="#FF5C7A"
                emissiveIntensity={0.25}
              />
            </mesh>
            <Html position={[0, barHeight / 2 + 0.45, 0]} center distanceFactor={8}>
              <div className="flex flex-col items-center px-3 py-1.5 rounded-md glass-surface text-center whitespace-nowrap shadow-z3 border border-danger">
                <span className="font-mono font-bold text-xs text-text-primary uppercase tracking-wide">
                  Total Loss
                </span>
                <span className="font-mono text-danger text-sm font-bold">
                  -{result.portfolioDrawdownPercent}%
                </span>
                <span className="text-[11px] text-text-primary font-mono font-semibold">
                  -${result.portfolioLossAmount.toLocaleString()}
                </span>
              </div>
            </Html>
          </group>
        );
      })()}
    </group>
  );
}
