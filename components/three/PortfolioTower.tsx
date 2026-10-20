'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { AllocationItem, Coin } from '@/types';
import { getCategoryColor } from './materials';

interface PortfolioTowerProps {
  allocation: AllocationItem[];
  coins: Coin[];
  onSelectCoin?: (coinId: string) => void;
  interactive?: boolean;
}

export function PortfolioTower({
  allocation,
  coins,
  onSelectCoin,
  interactive = true,
}: PortfolioTowerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const coinMap = new Map<string, Coin>();
  for (const c of coins) {
    coinMap.set(c.id, c);
  }

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  // Total tower height target: ~4 units
  const totalScaleHeight = 4.0;
  const radius = 0.9;

  let currentY = -totalScaleHeight / 2;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Base platform */}
      <mesh position={[0, -totalScaleHeight / 2 - 0.2, 0]}>
        <cylinderGeometry args={[radius * 1.5, radius * 1.6, 0.25, 32]} />
        <meshStandardMaterial color="#14171E" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Decorative platform glow ring */}
      <mesh position={[0, -totalScaleHeight / 2 - 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 1.45, radius * 1.55, 32]} />
        <meshBasicMaterial color="#8FB8D6" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Stacked allocation segments */}
      {allocation.map((item, index) => {
        const coin = coinMap.get(item.coinId);
        const segmentHeight = Math.max(0.2, (item.percent / 100) * totalScaleHeight);
        const yPos = currentY + segmentHeight / 2;
        currentY += segmentHeight;

        const isHovered = hoveredIndex === index;
        const color = coin ? getCategoryColor(coin.category) : '#8FB8D6';

        // Hover offset pulls segment out slightly
        const pullOffset = isHovered && interactive ? 0.35 : 0;

        return (
          <group
            key={item.coinId}
            position={[pullOffset, yPos, 0]}
            onPointerOver={(e) => {
              e.stopPropagation();
              if (interactive) setHoveredIndex(index);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              if (interactive) setHoveredIndex(null);
              document.body.style.cursor = 'auto';
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectCoin?.(item.coinId);
            }}
          >
            {/* Cylinder Segment */}
            <mesh>
              <cylinderGeometry args={[radius, radius, segmentHeight - 0.04, 32]} />
              <meshStandardMaterial
                color={color}
                metalness={0.8}
                roughness={0.25}
                emissive={isHovered ? color : '#000000'}
                emissiveIntensity={isHovered ? 0.35 : 0}
              />
            </mesh>

            {/* Segment Edge Bevel */}
            <mesh position={[0, segmentHeight / 2 - 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[radius * 0.92, radius, 32]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>

            {/* DOM Label on hover or if sizable */}
            <Html
              position={[radius + 0.3, 0, 0]}
              distanceFactor={8}
              className="pointer-events-none select-none"
            >
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md glass-surface text-xs whitespace-nowrap transition-transform duration-200 ${
                  isHovered ? 'scale-110 border-accent shadow-[0_0_15px_rgba(143,184,214,0.35)]' : ''
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="font-mono font-bold text-text-primary">
                  {coin?.symbol || item.coinId.toUpperCase()}
                </span>
                <span className="font-mono text-accent font-semibold">{item.percent}%</span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
