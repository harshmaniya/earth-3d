import React from 'react';
import { Canvas } from '@react-three/fiber';
import Earth from './Earth';

function App() {
  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: 'black' }}>
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
        <Earth />       
      </Canvas>
    </div>
  );
}

export default App;
