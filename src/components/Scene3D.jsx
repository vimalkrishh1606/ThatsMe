import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* Slowly rotating wireframe core — the focal object behind the hero. */
function Core() {
  const outer = useRef()
  const inner = useRef()

  useFrame((state, delta) => {
    if (outer.current) {
      outer.current.rotation.y += delta * 0.09
      outer.current.rotation.x += delta * 0.035
    }
    if (inner.current) {
      inner.current.rotation.y -= delta * 0.16
      inner.current.rotation.z += delta * 0.05
      const t = state.clock.elapsedTime
      const s = 1 + Math.sin(t * 0.8) * 0.04
      inner.current.scale.setScalar(s)
    }
  })

  return (
    <group position={[2.1, 0.1, 0]}>
      <mesh ref={outer}>
        <icosahedronGeometry args={[2.5, 1]} />
        <meshBasicMaterial color="#3b6fd4" wireframe transparent opacity={0.24} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[1.55, 0]} />
        <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.42} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.045} />
      </mesh>
    </group>
  )
}

/* Depth-sorted particle field. Gives the parallax its sense of volume. */
function Starfield({ count = 1400 }) {
  const ref = useRef()

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const cyan = new THREE.Color('#38bdf8')
    const violet = new THREE.Color('#a78bfa')
    const white = new THREE.Color('#dce6ff')

    for (let i = 0; i < count; i++) {
      // Distribute in a wide slab so camera parallax reads as depth.
      positions[i * 3] = (Math.random() - 0.5) * 26
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18 - 4

      const r = Math.random()
      const c = r > 0.82 ? cyan : r > 0.66 ? violet : white
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    return { positions, colors }
  }, [count])

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.012
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.22
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* Camera drifts toward the pointer — the whole scene tilts with the mouse. */
function ParallaxRig() {
  const { camera, pointer } = useThree()
  const target = useRef(new THREE.Vector3())

  useFrame(() => {
    target.current.set(pointer.x * 1.15, pointer.y * 0.7, 8)
    camera.position.lerp(target.current, 0.035)
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function Scene3D() {
  // Respect reduced-motion and skip WebGL entirely on very small screens.
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  return (
    <div className="scene-layer">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 62 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={['#05060e', 9, 24]} />
        <Starfield count={reduced ? 500 : 1400} />
        {!reduced && <Core />}
        {!reduced && <ParallaxRig />}
      </Canvas>
    </div>
  )
}
