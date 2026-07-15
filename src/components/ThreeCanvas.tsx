"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// 3D Gear Component
function ProceduralGear({ color = "#D4AF37", ...props }) {
  const meshRef = useRef<THREE.Group>(null);
  const teethCount = 12;
  const radius = 1.2;

  useFrame((state) => {
    if (meshRef.current) {
      // Base rotation + mouse lag rotation
      meshRef.current.rotation.z += 0.005;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        state.pointer.y * 0.4,
        0.05
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        state.pointer.x * 0.4,
        0.05
      );
    }
  });

  return (
    <group ref={meshRef} {...props}>
      {/* Central Hub */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 0.9, 0.3, 32]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.15} />
      </mesh>
      
      {/* Center Hole */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.32, 16]} />
        <meshStandardMaterial color="#2E2B2A" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Gear Teeth */}
      {Array.from({ length: teethCount }).map((_, i) => {
        const angle = (i / teethCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <mesh
            key={i}
            position={[x, y, 0]}
            rotation={[0, 0, angle]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.4, 0.35, 0.28]} />
            <meshStandardMaterial color={color} metalness={0.9} roughness={0.15} />
          </mesh>
        );
      })}
    </group>
  );
}

// 3D Spark Plug Component
function ProceduralSparkPlug({ color = "#8C6239", ...props }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.007;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        0.2 + state.pointer.y * 0.3,
        0.05
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        state.pointer.x * 0.3,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef} {...props}>
      {/* Brass Terminal Nut (Top) */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.25, 8]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* White Ceramic Insulator Ribs */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.7, 16]} />
        <meshStandardMaterial color="#FAF9F6" metalness={0.1} roughness={0.3} />
      </mesh>
      {/* Insulator Ribs (Toruses) */}
      {[0.7, 0.9, 1.1].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.05, 8, 24]} />
          <meshStandardMaterial color="#FAF9F6" metalness={0.1} roughness={0.3} />
        </mesh>
      ))}

      {/* Hex Steel Shell (Hexagonal middle nut) */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.4, 6]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.95} roughness={0.08} />
      </mesh>

      {/* Threaded Shell */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.7, 16]} />
        <meshStandardMaterial color="#4A4543" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Thread ribs */}
      {[-0.05, -0.2, -0.35, -0.5].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.26, 0.03, 8, 24]} />
          <meshStandardMaterial color="#3A3533" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Ground Electrode tip */}
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 8]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

// 3D Piston Component
function ProceduralPiston({ color = "#C0C0C0", ...props }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= 0.004;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        state.pointer.y * 0.3,
        0.05
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        state.pointer.x * 0.3,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef} {...props}>
      {/* Piston Crown/Body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.65, 0.65, 0.9, 32]} />
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.08} />
      </mesh>

      {/* Piston Ring Grooves (dark lines) */}
      {[0.25, 0.05, -0.15].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.66, 0.02, 6, 32]} />
          <meshStandardMaterial color="#2E2B2A" metalness={0.3} roughness={0.9} />
        </mesh>
      ))}

      {/* Wrist Pin (transverse steel rod) */}
      <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 1.1, 16]} />
        <meshStandardMaterial color="#EBE5D8" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Connecting Rod (connecting arm) */}
      <mesh position={[0, -0.9, 0]}>
        <boxGeometry args={[0.18, 1.0, 0.15]} />
        <meshStandardMaterial color="#8C6239" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Connect Rod Pin Ring */}
      <mesh position={[0, -1.4, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.25, 16]} />
        <meshStandardMaterial color="#8C6239" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

export default function ThreeCanvas() {
  return (
    <div className="w-full h-[400px] lg:h-[600px] cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        gl={{ antialias: true, powerPreference: "low-power" }}
        dpr={[1, 1.5]}
        shadows
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
        <pointLight position={[-5, -5, -5]} intensity={0.5} />
        <spotLight
          position={[0, 10, 0]}
          intensity={1}
          angle={0.3}
          penumbra={1}
          castShadow
        />

        {/* Floating 3D Spark Plug (Left) */}
        <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
          <ProceduralSparkPlug position={[-2.4, 0.8, 0]} scale={1.1} />
        </Float>

        {/* Floating 3D Gear (Center Front) */}
        <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.2}>
          <ProceduralGear position={[0, -0.6, 1]} scale={1.3} />
        </Float>

        {/* Floating 3D Piston (Right) */}
        <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1.8}>
          <ProceduralPiston position={[2.4, 0.6, -0.5]} scale={1.2} />
        </Float>
      </Canvas>
    </div>
  );
}
