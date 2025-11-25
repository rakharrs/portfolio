"use client";
import { Stars, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Suspense } from "react";
import * as THREE from "three";
import Thruster from "./Thruster";

// creating a simple spaceship model with three
function Spaceship() {
    //loading my model
    const gltf = useGLTF("/models/spaceship.glb");
    const scene = gltf.scene;

    return (
        <RigidBody
            type="kinematicPosition"
            position={[0, -2, 0]}
            colliders="hull"
        >
            <primitive object={scene} scale={0.1} position={[0, -2, 0]} rotation={[1, Math.PI, 0]} />
            <Thruster position={[0, -2.4, 0]} scale={0.4} />
        </RigidBody>
    )
}

export function TestSpaceGame() {
    return (
        <>
            <div className="w-full h-screen bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]">
                <Canvas shadows camera={{ position: [0, 0, 10], fov: 60 }} gl={{ alpha: true }}                 // <- allow transparency
                    style={{ background: 'transparent' }} >
                
                <ambientLight intensity={0.7} />
                <directionalLight position={[0, 0, 1]} intensity={1} castShadow />
                <Physics gravity={[0, 0, 0]} debug={false}>
                    <Suspense fallback={null}>
                        <Spaceship />
                    </Suspense>
                </Physics>

                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={2} />
            </Canvas>
        </div >

        </>
    )
}