'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useAppStore } from '@/lib/store/useAppStore';

interface SceneProps {
  children?: React.ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
  starCount?: number;
  fallback?: React.ReactNode;
  className?: string;
  enableStars?: boolean;
}

class CanvasErrorBoundary extends React.Component<
  { fallback?: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback?: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('3D Canvas encountered a rendering error, rendering 2D fallback:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-text-secondary">
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mb-3">
              <span className="text-accent text-2xl font-mono">3D</span>
            </div>
            <p className="text-xs">3D hardware acceleration unavailable. 2D presentation active.</p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export function Scene({
  children,
  cameraPosition = [0, 0, 9],
  fov = 45,
  starCount = 800,
  fallback,
  className = '',
  enableStars = true,
}: SceneProps) {
  const { isLowPower, reducedMotion } = useAppStore();
  const [hasWebGL, setHasWebGL] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!mounted) {
    return (
      <div className={`w-full h-full min-h-[300px] flex items-center justify-center ${className}`}>
        <div className="w-8 h-8 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
      </div>
    );
  }

  if (!hasWebGL || reducedMotion) {
    return (
      <div className={`w-full h-full relative overflow-hidden ${className}`}>
        {fallback || (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-text-secondary">
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mb-3">
              <span className="text-accent text-2xl font-mono">3D</span>
            </div>
            <p className="text-xs">WebGL reduced or low-power mode active. 2D presentation rendered.</p>
          </div>
        )}
      </div>
    );
  }

  const effectiveStarCount = isLowPower ? 250 : starCount;

  return (
    <CanvasErrorBoundary fallback={fallback}>
      <div className={`w-full h-full relative ${className}`}>
        <Canvas
          dpr={[1, 1.75]}
          camera={{ fov, position: cameraPosition, near: 0.1, far: 200 }}
          gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }}
          className="w-full h-full"
        >
          <fog attach="fog" args={['#08090C', 12, 40]} />
          <ambientLight intensity={0.4} color="#9EAEBE" />
          <directionalLight intensity={1.1} color="#F0F4F8" position={[5, 6, 5]} />
          <pointLight intensity={1.4} color="#8FB8D6" position={[-6, 2, -4]} />
          <pointLight intensity={0.8} color="#D4A373" position={[4, -3, 3]} />

          {enableStars && (
            <Stars
              radius={50}
              depth={50}
              count={effectiveStarCount}
              factor={3}
              saturation={0.5}
              fade
              speed={0.8}
            />
          )}

          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
}
