export default function Marker({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.02, 16, 16]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );
}
