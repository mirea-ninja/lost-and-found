import * as THREE from 'three'
import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, useGLTF } from '@react-three/drei'
import { type GLTF } from 'three-stdlib'

export type GLTFResult = GLTF & {
  nodes: {
    ['Altair_Studio-Logo']: THREE.Mesh
    Curly: THREE.Mesh
    DNA: THREE.Mesh
    Headphones: THREE.Mesh
    Notebook: THREE.Mesh
    Rocket003: THREE.Mesh
    Roundcube001: THREE.Mesh
    Table: THREE.Mesh
    VR_Headset: THREE.Mesh
    Zeppelin: THREE.Mesh
  }
  materials: {
    M_Logo: THREE.MeshStandardMaterial
    M_Curly: THREE.MeshStandardMaterial
    M_DNA: THREE.MeshStandardMaterial
    M_Headphone: THREE.MeshStandardMaterial
    M_Notebook: THREE.MeshStandardMaterial
    M_Rocket: THREE.MeshStandardMaterial
    M_Roundcube: THREE.MeshStandardMaterial
    M_Table: THREE.MeshStandardMaterial
    M_Headset: THREE.MeshStandardMaterial
    M_Zeppelin: THREE.MeshStandardMaterial
  }
}

function Model(props: JSX.IntrinsicElements['group'] & { url: string }) {
  const group = useRef<THREE.Group>(null)
  const { nodes, materials } = useGLTF(props.url) as GLTFResult
  useFrame((state) => {
    if (group.current) {
      group.current.children.forEach((child, index) => {
        child.position.y += Math.sin(index * 1000 + state.clock.elapsedTime) / 50
        child.rotation.x += (Math.sin(index * 1000 + state.clock.elapsedTime) * Math.PI) / 2000
        child.rotation.y += (Math.cos(index * 1000 + state.clock.elapsedTime) * Math.PI) / 3000
        child.rotation.z += (Math.sin(index * 1000 + state.clock.elapsedTime) * Math.PI) / 4000
      })
    }
  })
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        material={materials.M_Curly}
        geometry={nodes.Curly.geometry}
        position={[0.8, -10.96, 2.16]}
        rotation={[1.76, 0.07, -0.19]}
      />
      <mesh
        material={materials.M_DNA}
        geometry={nodes.DNA.geometry}
        position={[19.9, -12.6, -17.01]}
        rotation={[1.26, 0.91, -1.86]}
      />
      <mesh
        material={materials.M_Headphone}
        geometry={nodes.Headphones.geometry}
        position={[20.22, 1.99, 4.03]}
        rotation={[1.55, 0.32, -0.76]}
      />
      <mesh
        material={materials.M_Notebook}
        geometry={nodes.Notebook.geometry}
        position={[-21.4, -14.96, -13.21]}
        rotation={[1.83, -0.23, 0.91]}
      />
      <mesh
        material={materials.M_Rocket}
        geometry={nodes.Rocket003.geometry}
        position={[17.58, 15.26, -25.21]}
        rotation={[1.14, 0.81, 0.44]}
      />
      <mesh
        material={materials.M_Roundcube}
        geometry={nodes.Roundcube001.geometry}
        position={[-21.17, -4.1, -12.07]}
        rotation={[1.55, 0.05, 0.45]}
        scale={[0.5, 0.5, 0.5]}
      />
      <mesh
        material={materials.M_Table}
        geometry={nodes.Table.geometry}
        position={[0.59, -3.79, -27.84]}
        rotation={[0.98, 0.15, -1.24]}
        scale={[0.5, 0.5, 0.5]}
      />
      <mesh
        material={materials.M_Headset}
        geometry={nodes.VR_Headset.geometry}
        position={[6.92, -15.17, 27.59]}
        rotation={[1.29, 0.08, -0.64]}
        scale={[5, 5, 5]}
      />
      <mesh
        material={materials.M_Zeppelin}
        geometry={nodes.Zeppelin.geometry}
        position={[-23.64, -17.96, 17.51]}
        rotation={[2.72, -0.8, 2.71]}
        scale={[0, 0, 0]}
      />
    </group>
  )
}

function Rig({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = THREE.MathUtils.lerp(
        ref.current.rotation.y,
        (state.mouse.x * Math.PI) / 20,
        0.05,
      )
      ref.current.rotation.x = THREE.MathUtils.lerp(
        ref.current.rotation.x,
        (state.mouse.y * Math.PI) / 20,
        0.05,
      )
    }
  })
  return <group ref={ref}>{children}</group>
}

export default function LandingCanvas() {
  return (
    <Canvas camera={{ position: [0, -10, 65], fov: 50 }} dpr={[1, 2]}>
      <pointLight position={[100, 100, 100]} intensity={0.8} />
      <hemisphereLight
        color='#ffffff'
        groundColor='#b9b9b9'
        position={[-7, 25, 13]}
        intensity={0.85}
      />
      <Suspense fallback={null}>
        <group position={[0, 10, 0]}>
          <Rig>
            <Model url='/compressed.glb' />
          </Rig>
          <ContactShadows
            rotation-x={Math.PI / 2}
            position={[0, -35, 0]}
            opacity={1.5}
            width={100}
            height={100}
            blur={1.25}
            far={25}
          />
        </group>
      </Suspense>
    </Canvas>
  )
}
