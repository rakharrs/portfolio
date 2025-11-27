import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type BeamProps = {
    position: [number, number, number];
    direction: [number, number, number];
    id: number;
    onRemove: (id: number) => void;
};

export default function Beam({ position, direction, id, onRemove }: BeamProps) {
    const rb = useRef<RapierRigidBody>(null);

        const beamQuat = useMemo(() => {
        const up = new THREE.Vector3(0, 1, 0); // your capsule is aligned with +Y
        const dir = new THREE.Vector3(
            direction[0],
            direction[1],
            direction[2]
        ).normalize();

        const q = new THREE.Quaternion();
        q.setFromUnitVectors(up, dir); // rotate "up" to "dir"
        return q;
    }, [direction]);

    useFrame((state, delta) => {
        if (!rb.current) return;

        const speed = 40;

        const t = rb.current.translation();

        // Move along the given direction
        rb.current.setNextKinematicTranslation({
            x: t.x + direction[0] * speed * delta,
            y: t.y + direction[1] * speed * delta,
            z: 0,
        });

        // Still despawn when far enough - y check, works as long as direrction y > 10
        if (t.y > 10) {
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
                    onRemove(id); // beam disappears on hit
                }
            }}
        >
            <mesh quaternion={beamQuat}>
                <capsuleGeometry args={[0.08, 0.4, 4, 8]} />
                <meshStandardMaterial
                    color="red"
                    emissive="red"
                    emissiveIntensity={2}
                    toneMapped={false}
                />
            </mesh>
        </RigidBody>
    );
}
