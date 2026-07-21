import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture, Float } from '@react-three/drei'
import * as THREE from 'three'
import { useScroll } from '@react-three/drei'

/** Pink train-window flight — scroll drives camera. One image only. */
export function TrainScene() {
  const scroll = useScroll()
  const group = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()

  const texture = useTexture('/train-window.png')
  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
  }, [texture])

  // Cover-style plane for the image aspect
  const aspect = 2752 / 1536
  const h = Math.max(viewport.height * 1.15, viewport.width / aspect)
  const w = h * aspect

  useFrame((state) => {
    const t = scroll.offset // 0 → 1
    const e = 1 - Math.pow(1 - t, 2.2) // ease-out

    if (group.current) {
      // fly: pull in, slight dolly + roll, then settle
      group.current.position.z = THREE.MathUtils.lerp(0.2, -1.8, e)
      group.current.position.y = THREE.MathUtils.lerp(0, 0.15, Math.sin(e * Math.PI))
      group.current.rotation.z = THREE.MathUtils.lerp(0, -0.04, e)
      group.current.rotation.x = THREE.MathUtils.lerp(0.02, -0.06, e)
    }

    if (mesh.current) {
      // subtle parallax + train bob
      const bob = Math.sin(state.clock.elapsedTime * 0.9) * 0.012
      mesh.current.position.x = THREE.MathUtils.lerp(0, 0.25, e) + Math.sin(state.clock.elapsedTime * 0.35) * 0.02
      mesh.current.position.y = bob
      const s = THREE.MathUtils.lerp(1.08, 1.22, e)
      mesh.current.scale.setScalar(s)
    }

    // soft pink fog intensity with scroll
    state.scene.fog = state.scene.fog ?? new THREE.FogExp2('#1a0812', 0.04)
    if (state.scene.fog instanceof THREE.FogExp2) {
      state.scene.fog.density = THREE.MathUtils.lerp(0.02, 0.055, e)
    }
  })

  return (
    <group ref={group}>
      <Float speed={0.6} rotationIntensity={0.05} floatIntensity={0.15}>
        <mesh ref={mesh}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial
            map={texture}
            toneMapped={false}
            transparent
          />
        </mesh>
      </Float>

      {/* pink wash plane in front for brand tint */}
      <mesh position={[0, 0, 0.15]}>
        <planeGeometry args={[w * 1.2, h * 1.2]} />
        <meshBasicMaterial
          color="#ff4d9a"
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
