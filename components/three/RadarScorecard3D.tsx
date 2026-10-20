'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { CoinScores } from '@/types';

interface RadarScorecard3DProps {
  scores: CoinScores;
  coinSymbol?: string;
}

export function RadarScorecard3D({ scores, coinSymbol = '' }: RadarScorecard3DProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  const axes = [
    { label: 'Liquidity', val: scores.liquidity },
    { label: 'Stability', val: scores.stability },
    { label: 'Size', val: scores.size },
    { label: 'Track Record', val: scores.trackRecord },
    { label: 'Category Fit', val: scores.categoryFit },
  ];

  const maxRadius = 1.8;

  const { points, lineGeometry } = useMemo(() => {
    const pts: [number, number, number][] = [];
    const linePts: THREE.Vector3[] = [];

    axes.forEach((axis, i) => {
      const angle = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
      const r = (axis.val / 100) * maxRadius;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      pts.push([x, 0, z]);
      linePts.push(new THREE.Vector3(x, 0, z));
    });

    // Close the loop
    linePts.push(linePts[0]);
    const geo = new THREE.BufferGeometry().setFromPoints(linePts);

    return { points: pts, lineGeometry: geo };
  }, [scores]);

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* Grid rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[maxRadius * 0.33 - 0.01, maxRadius * 0.33, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[maxRadius * 0.66 - 0.01, maxRadius * 0.66, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[maxRadius - 0.01, maxRadius, 32]} />
        <meshBasicMaterial color="#8FB8D6" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* Axis Lines radiating from center */}
      {axes.map((_, i) => {
        const angle = (i / axes.length) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * maxRadius;
        const z = Math.sin(angle) * maxRadius;
        const geo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(x, 0, z),
        ]);
        return (
          <primitive
            key={i}
            object={new THREE.Line(geo, new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.15 }))}
          />
        );
      })}

      {/* Polygon Perimeter Line */}
      <primitive
        object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: '#8FB8D6', linewidth: 2 }))}
      />

      {/* Glowing Vertex Spheres and Labels */}
      {points.map((pt, i) => (
        <group key={i} position={pt}>
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#8FB8D6" />
          </mesh>
          <Html position={[0, 0.25, 0]} center distanceFactor={8} className="pointer-events-none select-none">
            <div className="px-1.5 py-0.5 rounded glass-surface text-[10px] font-mono whitespace-nowrap text-text-primary border border-accent/30">
              <span className="text-text-secondary">{axes[i].label}: </span>
              <span className="text-accent font-bold">{axes[i].val}</span>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
