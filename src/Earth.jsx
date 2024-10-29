import React, { useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Html, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Import textures
import earthTextureImg from './assets/8k_earth_daymap.jpg';
import cloudTextureImg from './assets/8k_earth_clouds.jpg';

// Helper to convert lat/lng to 3D coordinates
function latLongToVector3(lat, lng, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return [x, y, z];
}

// Pin component with pop-up dialog
function Pin({ position, label }) {
  const [showDialog, setShowDialog] = useState(false);
  const dialogRef = useRef();

  // Billboard effect to face the camera
  useFrame(({ camera }) => {
    if (dialogRef.current) {
      dialogRef.current.lookAt(camera.position);
    }
  });

  return (
    <group>
      {/* Pin Sphere */}
      <mesh position={position} onClick={() => setShowDialog(!showDialog)}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="red" />
      </mesh>

      {/* Pop-up dialog */}
      {showDialog && (
        <mesh ref={dialogRef} position={[position[0], position[1] + 0.1, position[2]]}>
          <planeGeometry args={[0.3, 0.15]} />
          <meshBasicMaterial color="white" transparent opacity={0.8} />
          <Html position={[0, 0, 0.01]}>
            <div style={dialogBoxStyle}>
              <p style={dialogTextStyle}>{label}</p>
            </div>
          </Html>
        </mesh>
      )}
    </group>
  );
}

// Main Earth component
export default function Earth() {
  const earthRef = useRef();
  const cloudsRef = useRef();

  // Load Earth and cloud textures
  const earthTexture = useLoader(TextureLoader, earthTextureImg);
  const cloudTexture = useLoader(TextureLoader, cloudTextureImg);

  // Rotate the Earth and clouds slowly for a dynamic effect
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    earthRef.current.rotation.y = elapsed * 0.1;  // Earth rotation speed
    cloudsRef.current.rotation.y = elapsed * 0.12; // Clouds slightly faster
  });

  // Define pin positions with lat/lng (example coordinates)
  const locations = [
    { lat: 40.7128, lng: -74.0060, label: "New York City" },
    { lat: 34.0522, lng: -118.2437, label: "Los Angeles" },
    { lat: 51.5074, lng: -0.1278, label: "London" },
    { lat: 35.6895, lng: 139.6917, label: "Tokyo" },
  ];

  return (
    <>
      {/* Background Stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

      {/* Earth Sphere with Pins as Children */}
      <mesh ref={earthRef} rotation={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial map={earthTexture} />

        {/* Pins on Earth */}
        {locations.map((loc, idx) => (
          <Pin 
            key={idx} 
            position={latLongToVector3(loc.lat, loc.lng, 1.02)} 
            label={loc.label} 
          />
        ))}
      </mesh>

      {/* Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.01, 32, 32]} /> {/* Slightly larger than Earth sphere */}
        <meshStandardMaterial map={cloudTexture} transparent opacity={0.4} />
      </mesh>

      {/* Lighting */}
      <directionalLight position={[5, 3, 5]} intensity={1} />
      <ambientLight intensity={0.3} />

      {/* Orbit Controls */}
      <OrbitControls enableDamping={true} dampingFactor={0.05} minDistance={2} maxDistance={6} />
    </>
  );
}

// Styles for the dialog box
const dialogBoxStyle = {
  background: 'rgba(255, 255, 255, 0.85)',
  padding: '5px',
  borderRadius: '4px',
  color: '#333',
  fontSize: '12px',
  fontWeight: 'bold',
  textAlign: 'center',
};

const dialogTextStyle = {
  margin: 0,
};
