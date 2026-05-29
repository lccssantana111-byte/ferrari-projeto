'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei'
import CarModel from './CarModel'

interface CarViewer3DProps {
  modelUrl: string
  color?: string
}

function Loader() {
  return (
    <Html center>
      <div className="text-white/30 text-sm animate-pulse">Carregando modelo...</div>
    </Html>
  )
}

export default function CarViewer3D({ modelUrl, color }: CarViewer3DProps) {
  return (
    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-graphite">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [3, 1.5, 4], fov: 40 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, 3, -5]} intensity={0.3} />

        <Suspense fallback={<Loader />}>
          <CarModel url={modelUrl} color={color} autoRotate />
          <Environment preset="studio" />
          <ContactShadows position={[0, -0.8, 0]} opacity={0.4} scale={10} blur={2} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          minDistance={2}
          maxDistance={8}
        />
      </Canvas>
    </div>
  )
}
