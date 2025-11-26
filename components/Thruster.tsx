"use client";
import { useNormalTexture, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";


const fireFrames = [
  "/models/fire/fire1.png",
  "/models/fire/fire2.png", 
  "/models/fire/fire3.png",
  "/models/fire/fire4.png",
  "/models/fire/fire5.png",
  "/models/fire/fire6.png",
  "/models/fire/fire7.png",
];

useTexture.preload(fireFrames);

export default function Thruster({ position = [0, 0, 0], scale = 1 }) {
  // Load all textures at once
  const textures = useTexture(fireFrames);
  
  textures.forEach((tex) => {
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.LinearFilter;
  });

  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  // Animation Loop
  useFrame((state) => {
    if (!materialRef.current) return;

    // 1. Calculate the current frame index
    const speed = 15;
    const index = Math.floor(state.clock.elapsedTime * speed) % textures.length;
    const currentTexture = textures[index];

    // This code is here to fix the bright color of the thrust
    // We check if it's already set to avoid setting it 60 times a second unnecessarily
    if (currentTexture.colorSpace !== THREE.SRGBColorSpace) {
      currentTexture.colorSpace = THREE.SRGBColorSpace;
      currentTexture.needsUpdate = true;
    }

    // 3. Swap the texture
    materialRef.current.map = currentTexture;
  });

  return (
    <group position={[position[0],position[1],position[2]]}>
      <mesh rotation={[0, 0, Math.PI]} position={[0, 0, 0]}>
        <planeGeometry args={[scale, scale]} />
        <meshBasicMaterial 
          ref={materialRef} 
          map={textures[0]}
          transparent={true} 
        //   opacity={1}
        //   side={THREE.DoubleSide} 
          depthWrite={false}
          toneMapped={false} 
        />
      </mesh>
      

      

    </group>
  );
}