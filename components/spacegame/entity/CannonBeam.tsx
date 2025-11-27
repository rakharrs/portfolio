import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef } from "react";

type BeamProps = {
    position: [number, number, number];
    id: number;
    onRemove: (id: number) => void;
};

export default function Beam({ position, id, onRemove }: BeamProps) {
    const rb = useRef<RapierRigidBody>(null);

    useFrame((state, delta) => {
        if (!rb.current) return;

        const speed = 20;
        const t = rb.current.translation();
        const newY = t.y + speed * delta;

        rb.current.setNextKinematicTranslation({
            x: t.x,
            y: newY,
            z: t.z,
        });

        if (newY > 10) {
            onRemove(id);
        }
    });

    return (
        <RigidBody
            ref={rb}
            type="kinematicPosition"
            colliders="hull"
            name="beam"
            position={position}
            onCollisionEnter={({ other }) => {
                if (other.rigidBodyObject?.name === "meteor") {
                    onRemove(id); // beam disappears when hitting a meteor
                }
            }}
        >
            <mesh rotation={[0, 0, 0]}>
                <capsuleGeometry args={[0.08, 0.6, 4, 8]} />
                <meshStandardMaterial
                    color="#00ffcc"
                    emissive="#00ffcc"
                    emissiveIntensity={2}
                    toneMapped={false}
                />
            </mesh>
        </RigidBody>
    );
}