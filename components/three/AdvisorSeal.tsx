'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AdvisorSealProps {
  onHover?: (hovered: boolean) => void;
}

export function AdvisorSeal({ onHover }: AdvisorSealProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
      const speed = hovered ? 1.8 : 0.4;
      meshRef.current.rotation.y += delta * speed;
    }
  });

  return (
    <group
      ref={meshRef}
      onPointerOver={() => {
        setHovered(true);
        onHover?.(true);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover?.(false);
      }}
    >
      {/* Outer Coin Medal Rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.18, 32]} />
        <meshStandardMaterial
          color="#D4A373"
          emissive="#4a3512"
          metalness={1.0}
          roughness={0.2}
        />
      </mesh>

      {/* Raised Seal Ring */}
      <mesh position={[0, 0, 0.1]} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.85, 1.05, 32]} />
        <meshStandardMaterial
          color="#D4A373"
          metalness={1.0}
          roughness={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Internal Star / Shield Emblem */}
      <mesh position={[0, 0, 0.11]}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color="#E5B888"
          metalness={1.0}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}
