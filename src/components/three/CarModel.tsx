'use client'

import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CarModelProps {
  url: string
  color?: string
  material?: 'metallic' | 'matte' | 'glossy'
  autoRotate?: boolean
}

export default function CarModel({ url, color = '#DC143C', material = 'metallic', autoRotate = true }: CarModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(url)
  const clonedScene = useRef<THREE.Group>(scene.clone())

  useEffect(() => {
    clonedScene.current.traverse((node) => {
      const mesh = node as THREE.Mesh
      if (!mesh.isMesh) return

      const name = mesh.name.toLowerCase()
      if (name.includes('body') || name.includes('paint') || name.includes('car')) {
        const isGlossy = material === 'glossy'
        const isMatte = material === 'matte'

        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          metalness: isMatte ? 0.0 : isGlossy ? 0.1 : 0.7,
          roughness: isMatte ? 0.9 : isGlossy ? 0.05 : 0.2,
        })
        mesh.material = mat
      }
    })
  }, [color, material])

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3
    }
  })

  return <primitive ref={groupRef} object={clonedScene.current} />
}
