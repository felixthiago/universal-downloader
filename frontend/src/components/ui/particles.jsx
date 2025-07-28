"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as THREE from "three"

function Particles() {
  const ref = useRef(null)

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(6000 * 3)

    for (let i = 0; i < 6000; i++) {
      // Create more realistic galaxy spiral pattern
      const radius = Math.pow(Math.random(), 0.5) * 25
      const angle = Math.random() * Math.PI * 4 + radius * 0.3
      const height = (Math.random() - 0.5) * (3 - radius * 0.1)

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = height
      positions[i * 3 + 2] = Math.sin(angle) * radius
    }

    return positions
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.03
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05
    }
  })

  return (
    <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#0cb7f2"
        size={0.04}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

function GalaxyCore() {
  const ref = useRef(null)

  const corePosition = useMemo(() => {
    const positions = new Float32Array(1000 * 3)

    for (let i = 0; i < 1000; i++) {
      const radius = Math.random() * 3
      const angle = Math.random() * Math.PI * 2
      const height = (Math.random() - 0.5) * 0.5

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = height
      positions[i * 3 + 2] = Math.sin(angle) * radius
    }

    return positions
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <Points ref={ref} positions={corePosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#0cb7f2"
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

export default function ParticleSystem() {
  return (
    <div className="fixed inset-0 w-screen h-screen -z-10" style={{ minHeight: "100vh", minWidth: "100vw" }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{
          width: "100vw",
          height: "100vh",
          background: "#000000",
        }}
        gl={{ antialias: true, alpha: false }}
      >
        <Particles />
        <GalaxyCore />
      </Canvas>
    </div>
  )
}
