import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ShakeCamera({ active }: { active: boolean }) {
  const { camera } = useThree();
  const basePos = useRef<THREE.Vector3 | null>(null);
  const remaining = useRef(0);

  // Store initial camera position once
  useEffect(() => {
    if (!basePos.current) {
      basePos.current = camera.position.clone();
    }
  }, [camera]);

  // When active switches to true, start a new shake
  useEffect(() => {
    if (active) {
      remaining.current = 0.5; // seconds of shake
    }
  }, [active]);

  useFrame((_, delta) => {
    if (!basePos.current) return;

    if (remaining.current > 0) {
      remaining.current -= delta;

      const t = Math.max(remaining.current, 0) / 0.5; // 0 → 1
      const intensity = t * 0.3; // max shake amount

      const offsetX = (Math.random() - 0.5) * intensity;
      const offsetY = (Math.random() - 0.5) * intensity;

      camera.position.set(
        basePos.current.x + offsetX,
        basePos.current.y + offsetY,
        basePos.current.z
      );
    } else {
      // Reset camera to base position when not shaking
      camera.position.copy(basePos.current);
    }
  });

  return null;
}
