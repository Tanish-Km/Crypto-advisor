'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface JourneyStationProps {
  step: number; // 1: Goal, 2: Amount, 3: Horizon, 4: Risk, 5: Preferences
}

export function JourneyStation({ step }: JourneyStationProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(t * 1.5) * 0.12;
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {step === 1 && (
        // Station 1: Goal - Floating compass orb with gyro ring
        <group>
          <mesh>
            <sphereGeometry args={[1.2, 32, 32]} />
            <meshPhysicalMaterial
              color="#14171E"
              transmission={0.85}
              roughness={0.2}
              thickness={0.6}
              transparent
              opacity={0.8}
            />
          </mesh>
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[1.6, 0.06, 16, 64]} />
            <meshStandardMaterial color="#8FB8D6" metalness={0.9} />
          </mesh>
          <mesh>
            <octahedronGeometry args={[0.6, 0]} />
            <meshStandardMaterial color="#8FB8D6" emissive="#8FB8D6" emissiveIntensity={0.6} />
          </mesh>
        </group>
      )}

      {step === 2 && (
        // Station 2: Amount - Stack of golden coins
        <group position={[0, -0.6, 0]}>
          {[0, 0.3, 0.6, 0.9, 1.2].map((y, i) => (
            <mesh key={i} position={[0, y, 0]} rotation={[0, i * 0.5, 0]}>
              <cylinderGeometry args={[1.2, 1.2, 0.22, 32]} />
              <meshStandardMaterial color="#D4A373" metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
        </group>
      )}

      {step === 3 && (
        // Station 3: Horizon - Hourglass ring structure
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.4, 0.08, 16, 64]} />
            <meshStandardMaterial color="#8B7CFF" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <coneGeometry args={[0.9, 1.2, 32]} />
            <meshPhysicalMaterial color="#14171E" transmission={0.9} transparent opacity={0.7} />
          </mesh>
          <mesh position={[0, -0.7, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.9, 1.2, 32]} />
            <meshPhysicalMaterial color="#14171E" transmission={0.9} transparent opacity={0.7} />
          </mesh>
        </group>
      )}

      {step === 4 && (
        // Station 4: Risk - Dynamic dial arc with needle
        <group>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.2, 1.5, 32, 1, 0, Math.PI]} />
            <meshStandardMaterial color="#FFB84D" side={THREE.DoubleSide} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color="#FF5C7A" emissive="#FF5C7A" emissiveIntensity={0.5} />
          </mesh>
        </group>
      )}

      {step === 5 && (
        // Station 5: Preferences - Cluster of category planets
        <group>
          <mesh position={[-1.0, 0.4, 0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color="#D4A373" metalness={0.9} />
          </mesh>
          <mesh position={[1.1, -0.3, 0]}>
            <sphereGeometry args={[0.45, 16, 16]} />
            <meshStandardMaterial color="#8FB8D6" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial color="#CC79A7" metalness={0.9} />
          </mesh>
          <mesh position={[0, -0.8, 0]}>
            <sphereGeometry args={[0.38, 16, 16]} />
            <meshStandardMaterial color="#68CFA4" metalness={0.3} roughness={0.7} />
          </mesh>
        </group>
      )}
    </group>
  );
}
