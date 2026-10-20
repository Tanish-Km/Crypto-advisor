'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PersonaType } from '@/types';

interface PersonaAvatarProps {
  persona: PersonaType;
}

export function PersonaAvatar({ persona }: PersonaAvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const crystalRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.1;
      // Slight smooth look toward pointer
      const pointer = state.pointer;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.4,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointer.y * 0.4,
        0.05
      );
    }

    if (persona === 'balanced_builder') {
      if (ring1Ref.current) ring1Ref.current.rotation.x += delta * 0.8;
      if (ring2Ref.current) ring2Ref.current.rotation.y += delta * 1.1;
      if (ring3Ref.current) ring3Ref.current.rotation.z += delta * 0.6;
    }

    if (persona === 'growth_seeker' && crystalRef.current) {
      crystalRef.current.rotation.y += delta * 1.2;
    }
  });

  if (persona === 'cautious_saver') {
    // Shielded rounded vault-sphere with soft ring (#68CFA4)
    return (
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[1.1, 32, 32]} />
          <meshStandardMaterial color="#68CFA4" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.5, 0.08, 16, 64]} />
          <meshStandardMaterial color="#358B6D" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.35, 16, 16]} />
          <meshBasicMaterial color="#68CFA4" wireframe transparent opacity={0.25} />
        </mesh>
      </group>
    );
  }

  if (persona === 'growth_seeker') {
    // Faceted rocket-crystal with an upward trail (#E5B888, #E06D77)
    return (
      <group ref={groupRef}>
        <mesh ref={crystalRef}>
          <octahedronGeometry args={[1.3, 0]} />
          <meshStandardMaterial color="#E5B888" metalness={0.85} roughness={0.15} />
        </mesh>
        {/* Crystal facets glow wireframe */}
        <mesh>
          <octahedronGeometry args={[1.4, 0]} />
          <meshBasicMaterial color="#E06D77" wireframe transparent opacity={0.35} />
        </mesh>
        {/* Energy tail sparks */}
        <mesh position={[0, -1.6, 0]}>
          <coneGeometry args={[0.5, 1.2, 16]} />
          <meshBasicMaterial color="#E06D77" transparent opacity={0.4} />
        </mesh>
      </group>
    );
  }

  // Balanced Builder: A balanced gyroscope: three nested rings rotating gently (#8FB8D6, #D4A373)
  return (
    <group ref={groupRef}>
      {/* Center Core Sphere */}
      <mesh>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial color="#8FB8D6" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.05, 0.06, 16, 64]} />
        <meshStandardMaterial color="#8FB8D6" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Ring 2 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.35, 0.06, 16, 64]} />
        <meshStandardMaterial color="#D4A373" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Ring 3 */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[1.65, 0.06, 16, 64]} />
        <meshStandardMaterial color="#A3C6E0" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}
