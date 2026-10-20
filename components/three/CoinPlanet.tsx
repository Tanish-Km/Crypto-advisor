'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Coin } from '@/types';
import { getCategoryColor } from './materials';

interface CoinPlanetProps {
  coin: Coin;
  position: [number, number, number];
  isMatched?: boolean;
  matchPercent?: number;
  onClick?: (coin: Coin) => void;
  showLabel?: boolean;
}

export function CoinPlanet({
  coin,
  position,
  isMatched = false,
  matchPercent,
  onClick,
  showLabel = true,
}: CoinPlanetProps) {
  const meshRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const satelliteRef = useRef<THREE.Group>(null);

  const [hovered, setHovered] = useState(false);

  // Compute radius based on market cap: 0.3 + log10(marketCap/1e9) * 0.25, clamped 0.3 - 1.4
  const capInBillions = Math.max(0.1, coin.marketCap / 1e9);
  const baseRadius = Math.max(0.3, Math.min(1.4, 0.3 + Math.log10(capInBillions) * 0.22));

  const color = getCategoryColor(coin.category);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.15;
    }
    if (satelliteRef.current) {
      satelliteRef.current.rotation.y += delta * 0.8;
    }
  });

  const scale = hovered ? 1.18 : 1.0;

  return (
    <group
      position={position}
      scale={[scale, scale, scale]}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(coin);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Central Rotating Planet Body */}
      <group ref={meshRef}>
        <mesh>
          <sphereGeometry args={[baseRadius, 32, 32]} />
          <meshStandardMaterial
            color={color}
            metalness={coin.category === 'stablecoin' ? 0.2 : 0.85}
            roughness={coin.category === 'stablecoin' ? 0.7 : 0.25}
          />
        </mesh>

        {/* Store of value: Thin equatorial ring */}
        {coin.category === 'store_of_value' && (
          <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
            <ringGeometry args={[baseRadius * 1.3, baseRadius * 1.5, 32]} />
            <meshStandardMaterial
              color={color}
              side={THREE.DoubleSide}
              metalness={0.9}
              roughness={0.15}
            />
          </mesh>
        )}

        {/* Smart contract platform: Faceted / Lattice overlay */}
        {coin.category === 'smart_contract' && (
          <mesh>
            <icosahedronGeometry args={[baseRadius * 1.05, 1]} />
            <meshStandardMaterial
              color="#ffffff"
              wireframe
              transparent
              opacity={0.35}
            />
          </mesh>
        )}

        {/* DeFi: Small orbiting satellites */}
        {coin.category === 'defi' && (
          <group ref={satelliteRef}>
            <mesh position={[baseRadius * 1.5, 0, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#CC79A7" metalness={0.9} />
            </mesh>
            <mesh position={[-baseRadius * 1.5, 0.2, 0]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color="#8B7CFF" metalness={0.9} />
            </mesh>
          </group>
        )}

        {/* Matched glow halo */}
        {isMatched && (
          <mesh>
            <sphereGeometry args={[baseRadius * 1.25, 24, 24]} />
            <meshBasicMaterial
              color="#8FB8D6"
              transparent
              opacity={hovered ? 0.45 : 0.25}
              wireframe={false}
              side={THREE.BackSide}
            />
          </mesh>
        )}
      </group>

      {/* DOM Label via drei <Html> */}
      {(showLabel || hovered || isMatched) && (
        <Html
          position={[0, baseRadius + 0.35, 0]}
          center
          distanceFactor={10}
          className="pointer-events-none select-none"
        >
          <div
            className={`flex flex-col items-center px-2 py-1 rounded-md glass-surface text-center whitespace-nowrap transition-all duration-200 ${
              isMatched ? 'border-accent shadow-[0_0_12px_rgba(143,184,214,0.35)]' : 'border-border-subtle'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-xs text-text-primary">
                {coin.symbol}
              </span>
              {matchPercent !== undefined && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-pill bg-accent/20 text-accent font-semibold">
                  {matchPercent}%
                </span>
              )}
            </div>
            {hovered && (
              <span className="text-[10px] text-text-secondary mt-0.5 font-mono">
                ${coin.price >= 1 ? coin.price.toLocaleString() : coin.price.toFixed(4)}
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
