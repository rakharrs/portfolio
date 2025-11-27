import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef } from "react";

type Vec3 = [number, number, number];
interface MeteorProps {
    id: string;
    position: Vec3;
    scale: number;
    speed: number;
    pause: boolean;
    gameOver: boolean;
    onHit: () => void;
    onDespawn: (id: string) => void;
}

export default function Meteor({ id, position, scale, speed, pause, gameOver, onHit, onDespawn }: MeteorProps) {
    const rigidBody = useRef<RapierRigidBody>(null);

    useFrame((state, delta) => {
        if (!rigidBody.current || pause) return;
        // Check if off-screen (despawn)
        // Since camera is at 0,0,10 and zooming, let's assume -15 is well below screen
        const currentPos = rigidBody.current.translation();
        if (currentPos.y < -15) {
            onDespawn(id);
        }

    });

    return (
        <RigidBody
            ref={rigidBody}
            position={position}
            // KinematicVelocity allows us to set constant speed, 
            type="dynamic"
            linearVelocity={[0, pause || gameOver ? 0 : -speed, 0]}
            colliders="hull"
            // Important: Detect collision with the spaceship
            onCollisionEnter={({ other }) => {
                if (other.rigidBodyObject?.name === "spaceship") {
                    onHit();
                }
            }}
        >
            <Float speed={0} rotationIntensity={0} floatIntensity={0}>
                <mesh scale={scale}>
                    <dodecahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color="#555" flatShading={false} />
                </mesh>
            </Float>
        </RigidBody >
    );
}
