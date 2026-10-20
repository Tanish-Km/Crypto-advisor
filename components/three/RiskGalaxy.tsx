'use client';

import React, { useRef, useState, useMemo } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Coin, Match } from '@/types';
import { CoinPlanet } from './CoinPlanet';
import * as THREE from 'three';

interface RiskGalaxyProps {
  coins: Coin[];
  matches: Match[];
  userRiskScore: number;
  onSelectCoin: (coin: Coin) => void;
  selectedCategory?: string;
  focusMatchesOnly?: boolean;
}

export function RiskGalaxy({
  coins,
  matches,
  userRiskScore,
  onSelectCoin,
  selectedCategory = 'all',
  focusMatchesOnly = false,
}: RiskGalaxyProps) {
  const matchedIds = useMemo(() => new Set(matches.map((m) => m.coinId)), [matches]);
  const matchPercentMap = useMemo(() => {
    const map = new Map<string, number>();
    matches.forEach((m) => map.set(m.coinId, m.matchPercent));
    return map;
  }, [matches]);

  // Risk ring radius based on user's score (1 to 10 mapped to 2.5 to 6.5 units)
  const userRingRadius = 2.0 + (userRiskScore / 10) * 4.5;

  // Position coins in space based on volatility (distance from center) and angle
  const planetPositions = useMemo(() => {
    return coins.map((coin, index) => {
      // Distance from center represents risk / volatility
      const dist = 1.8 + coin.volatility90d * 6.5;
      const angle = (index / coins.length) * Math.PI * 2 + (coin.volatility90d * 2);
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const y = (Math.sin(index * 1.5) * 0.8);

      return {
        coin,
        pos: [x, y, z] as [number, number, number],
        isMatched: matchedIds.has(coin.id),
        matchPercent: matchPercentMap.get(coin.id),
      };
    });
  }, [coins, matchedIds, matchPercentMap]);

  const filteredPlanets = planetPositions.filter((item) => {
    if (focusMatchesOnly && !item.isMatched) return false;
    if (selectedCategory !== 'all' && item.coin.category !== selectedCategory) return false;
    return true;
  });

  return (
    <>
      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={18}
        maxPolarAngle={Math.PI / 2 + 0.15}
        autoRotate
        autoRotateSpeed={0.4}
      />

      {/* User Home Central Core Marker */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color="#8FB8D6"
          emissive="#8FB8D6"
          emissiveIntensity={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Translucent User Risk Zone Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[userRingRadius - 0.2, userRingRadius + 0.2, 64]} />
        <meshBasicMaterial
          color="#8FB8D6"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer subtle guide rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.52, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.5, 5.52, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>

      {/* Coin Planets positioned in Risk Orbit */}
      {filteredPlanets.map((item) => (
        <CoinPlanet
          key={item.coin.id}
          coin={item.coin}
          position={item.pos}
          isMatched={item.isMatched}
          matchPercent={item.matchPercent}
          onClick={onSelectCoin}
        />
      ))}
    </>
  );
}
