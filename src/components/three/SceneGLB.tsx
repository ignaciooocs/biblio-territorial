import { Suspense } from 'react'
import { useGLTF, Center } from '@react-three/drei'

const modelUrl = '/models/office/scene.gltf'

function Model() {
  const { scene } = useGLTF(modelUrl)
  return (
    <Center disableY>
      <primitive object={scene} />
    </Center>
  )
}

useGLTF.preload(modelUrl)

export default function SceneGLB() {
  return (
    <Suspense fallback={null}>
      <Model />
    </Suspense>
  )
}
