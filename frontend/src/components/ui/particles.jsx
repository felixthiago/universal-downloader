"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as THREE from "three"

const palette = [
  // new THREE.Color("#0cb7f2"), // azul claro
  // new THREE.Color("#1a2aff"), // azul claro 2
  // new THREE.Color("#042163"), // azul escuro
  new THREE.Color("#001442"), // azul mais escuro
  new THREE.Color("#130794"), // azul mais escuro claro
  // new THREE.Color("#330f66"), // azul mais escuro quase roxo
]

function Particles() {
  const ref = useRef(null)

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(6000 * 3)
    const colors = new Float32Array(6000 * 3)

    for (let i = 0; i < 6000; i++) {
      const radius = Math.pow(Math.random(), 0.5) * 25
      const angle = Math.random() * Math.PI * 4 + radius * 0.3
      const height = (Math.random() - 0.5) * (3 - radius * 0.1)

      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = height
      positions[i * 3 + 2] = Math.sin(angle) * radius

      const color =  palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    return { positions, colors }
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.03
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05
    }
  })

  return (
    <Points ref={ref} positions={particlesPosition.positions} colors = {particlesPosition.colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
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
    const colors = new Float32Array(1000 * 3)
    for (let i = 0; i < 1000; i++) {
      const radius = 1 + Math.random() * 2
      const angle = Math.random() * Math.PI * 2
      // const height = (Math.random() - 0.5) * 0.5
      const height = (Math.random() - 0.5) * 1.5
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = height
      positions[i * 3 + 2] = Math.sin(angle) * radius

      const color = new THREE.Color(`hsl(${270 + Math.random() * 30}, 100%, ${40 + Math.random() * 30}%)`)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }


      return positions, colors
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
        blending={THREE.NormalBlending}
        opacity={0.6}
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
