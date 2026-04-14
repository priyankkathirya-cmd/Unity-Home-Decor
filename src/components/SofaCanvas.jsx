import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';

function SofaModel({ size, color, fabric }) {
  // Determine materials based on fabric
  let roughness = 0.8;
  let metalness = 0.1;
  
  if (fabric === 'Leather') {
    roughness = 0.4;
    metalness = 0.3;
  } else if (fabric === 'Velvet') {
    roughness = 0.9;
    metalness = 0.1;
  } else {
    // Linen or Cotton Blend
    roughness = 1.0;
    metalness = 0.0;
  }

  // Adjust geometry based on size
  let seats = 3;
  let hasLChaise = false;
  if (size === '1-Seater') seats = 1;
  if (size === '2-Seater') seats = 2;
  if (size === '3-Seater') seats = 3;
  if (size === 'L-Shape (Sectional)') { seats = 3; hasLChaise = true; }

  const seatWidth = 1.8;
  const baseWidth = (seats * seatWidth) + 0.6; // account for margins
  
  return (
    <group position={[0, -0.8, 0]}>
      {/* Base */}
      <mesh position={[0, 0.4, hasLChaise ? 0.4 : 0]}>
        <boxGeometry args={[baseWidth, 0.6, hasLChaise ? 3.0 : 2.2]} />
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
      </mesh>
      
      {/* Backrest */}
      <mesh position={[0, 1.4, -0.8]}>
        <boxGeometry args={[baseWidth, 1.4, 0.6]} />
        <meshStandardMaterial color={color} roughness={roughness + 0.1} metalness={metalness} />
      </mesh>
      
      {/* Left Armrest */}
      <mesh position={[-(baseWidth/2 - 0.3), 1.1, hasLChaise ? 0.4 : 0.1]}>
        <boxGeometry args={[0.6, 1.0, hasLChaise ? 3.2 : 2.4]} />
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
      </mesh>
      
      {/* Right Armrest */}
      <mesh position={[(baseWidth/2 - 0.3), 1.1, hasLChaise ? 0.4 : 0.1]}>
        <boxGeometry args={[0.6, 1.0, hasLChaise ? 3.2 : 2.4]} />
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
      </mesh>
      
      {/* Dynamic Seats */}
      {Array.from({ length: seats }).map((_, i) => {
        const xOffset = (i - (seats-1)/2) * seatWidth;
        const isChaise = hasLChaise && i === seats - 1; 
        
        return (
          <group key={i}>
            {/* Seat Cushion */}
            <mesh position={[xOffset, 0.8, isChaise ? 0.75 : 0.15]}>
              <boxGeometry args={[1.7, 0.3, isChaise ? 2.9 : 1.7]} />
              <meshStandardMaterial color={color} roughness={roughness + 0.05} metalness={metalness} />
            </mesh>
            
            {/* Back Cushion */}
            <mesh position={[xOffset, 1.5, -0.4]}>
              <boxGeometry args={[1.7, 1.0, 0.3]} />
              <meshStandardMaterial color={color} roughness={roughness + 0.05} metalness={metalness} />
            </mesh>
          </group>
        )
      })}

      {/* Feet */}
      {[-(baseWidth/2 - 0.2), (baseWidth/2 - 0.2)].map((x, i) => (
        [-0.9, 0.9].map((z, j) => (
          <mesh position={[x, 0.05, z]} key={`foot-${i}-${j}`}>
            <cylinderGeometry args={[0.08, 0.05, 0.3, 16]} />
            <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
          </mesh>
        ))
      ))}
      
      {/* Chaise Foot if L-Shape */}
      {hasLChaise && (
        <mesh position={[(seats-1)/2 * seatWidth, 0.05, 1.7]}>
          <cylinderGeometry args={[0.08, 0.05, 0.3, 16]} />
          <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
        </mesh>
      )}
    </group>
  );
}

export default function SofaCanvas({ size = '3-Seater', color = '#555', fabric = 'Velvet', interactive = true }) {
  return (
    <Canvas dpr={[1, typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 1.5]} camera={{ position: [5, 3, 7], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <SofaModel size={size} color={color} fabric={fabric} />
      
      <ContactShadows position={[0, -0.85, 0]} opacity={0.4} scale={15} blur={2} far={4} color="#000000" resolution={128} frames={1} />
      <Environment preset="city" resolution={256} />
      
      <OrbitControls 
        enableZoom={interactive} 
        enablePan={false} 
        minPolarAngle={Math.PI / 6} 
        maxPolarAngle={Math.PI / 2}
        autoRotate={typeof window !== 'undefined' && window.innerWidth < 768 ? false : interactive}
        autoRotateSpeed={0.3}
      />
    </Canvas>
  );
}
