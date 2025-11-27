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

export default function Meteor({
    id,
    position,
    scale,
    speed,
    pause,
    gameOver,
    onHit,
    onDespawn,
}: MeteorProps) {
    const rigidBody = useRef<RapierRigidBody>(null);

    useFrame(() => {
        if (!rigidBody.current || pause) return;

        const currentPos = rigidBody.current.translation();

        // Despawn when off-screen (still used for scoring)
        if (currentPos.y < -15) {
            onDespawn(id);
        }
    });

    return (
        <RigidBody
            ref={rigidBody}
            name="meteor"
            position={position}
            type="dynamic"
            linearVelocity={[0, pause || gameOver ? 0 : -speed, 0]}
            enabledTranslations={[true, true, false]}
            colliders="hull"
            onCollisionEnter={({ other }) => {
                const otherName = other.rigidBodyObject?.name;

                // Collision with spaceship => game over / damage
                if (otherName === "spaceship") {
                    onHit();
                }

                // Collision with beam => small push, but no despawn
                if (otherName === "beam" && rigidBody.current) {
                    // Slight upward + sideways impulse
                    rigidBody.current.applyImpulse(
                        {
                            x: (Math.random() - 0.5) * 0.7, // small random horizontal push
                            y: 0.5,                          // small upward kick
                            z: 0,
                        },
                        true
                    );
                }
            }}
        >
            <Float speed={0} rotationIntensity={0} floatIntensity={0}>
                <mesh scale={scale}>
                    <dodecahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color="#555" flatShading={false} />
                </mesh>
            </Float>
        </RigidBody>
    );
}
