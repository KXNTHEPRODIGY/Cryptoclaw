'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

function FloatingShape({ position, scale, rotationSpeed = 0.5, color = "#0098EA" }: { position: [number, number, number], scale: number, rotationSpeed?: number, color?: string }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * rotationSpeed;
            meshRef.current.rotation.y += delta * rotationSpeed * 0.8;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            <mesh ref={meshRef} position={position} scale={scale}>
                <icosahedronGeometry args={[1, 0]} />
                <meshBasicMaterial color={color} wireframe={true} transparent opacity={0.25} />
            </mesh>
        </Float>
    );
}

export default function HolographicBackground() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <Stars radius={50} depth={50} count={4000} factor={3} saturation={0.5} fade speed={0.5} />
                {/* TON Blue shapes */}
                <FloatingShape position={[-6, 3, -3]} scale={1.8} rotationSpeed={0.2} color="#0098EA" />
                <FloatingShape position={[7, -2, -6]} scale={2.2} rotationSpeed={0.15} color="#0098EA" />

                {/* Cyan shapes */}
                <FloatingShape position={[-5, -4, -8]} scale={1.2} rotationSpeed={0.3} color="#00FFFF" />
                <FloatingShape position={[5, 6, -12]} scale={3.0} rotationSpeed={0.1} color="#00FFFF" />
            </Canvas>
        </div>
    );
}
