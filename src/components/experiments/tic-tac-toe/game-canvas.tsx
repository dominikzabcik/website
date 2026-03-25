'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import {
    ContactShadows,
    Environment,
    OrbitControls,
    RoundedBox,
} from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

const markMaterialX = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#7dd3fc'),
    emissive: new THREE.Color('#0c4a6e'),
    emissiveIntensity: 0.35,
    metalness: 0.45,
    roughness: 0.28,
    envMapIntensity: 1.1,
});

const markMaterialO = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#fde047'),
    emissive: new THREE.Color('#713f12'),
    emissiveIntensity: 0.22,
    metalness: 0.55,
    roughness: 0.22,
    envMapIntensity: 1.15,
});

function cellPosition(index: number): [number, number, number] {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const x = (col - 1) * 1.08;
    const z = (1 - row) * 1.08;
    return [x, 0, z];
}

/** 3D “X” — two crossed bars. */
function MarkX() {
    return (
        <group position={[0, 0.2, 0]}>
            <mesh
                rotation={[0, Math.PI / 4, 0]}
                castShadow
                material={markMaterialX}
            >
                <boxGeometry args={[0.58, 0.09, 0.09]} />
            </mesh>
            <mesh
                rotation={[0, -Math.PI / 4, 0]}
                castShadow
                material={markMaterialX}
            >
                <boxGeometry args={[0.58, 0.09, 0.09]} />
            </mesh>
        </group>
    );
}

/** 3D “O” — torus ring with a slow spin. */
function MarkO() {
    const ref = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!ref.current) {
            return;
        }
        ref.current.rotation.z = state.clock.elapsedTime * 0.12;
    });

    return (
        <mesh
            ref={ref}
            position={[0, 0.2, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
            material={markMaterialO}
        >
            <torusGeometry args={[0.24, 0.055, 24, 48]} />
        </mesh>
    );
}

function CellMark({
    value,
    onPointerDown,
}: {
    value: number;
    onPointerDown: (e: ThreeEvent<PointerEvent>) => void;
}) {
    if (value === 0) {
        return null;
    }
    return (
        <group onPointerDown={onPointerDown}>
            {value === 1 ? <MarkX /> : <MarkO />}
        </group>
    );
}

function BoardCell({
    index,
    value,
    interactive,
    onPick,
}: {
    index: number;
    value: number;
    interactive: boolean;
    onPick: (i: number) => void;
}) {
    const [x, , z] = useMemo(() => cellPosition(index), [index]);

    const handlePointer = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        if (!interactive) {
            return;
        }
        onPick(index);
    };

    const handleEnter = () => {
        if (interactive) {
            document.body.style.cursor = 'pointer';
        }
    };
    const handleLeave = () => {
        document.body.style.cursor = 'auto';
    };

    return (
        <group position={[x, 0, z]}>
            <group
                onPointerDown={handlePointer}
                onPointerOver={handleEnter}
                onPointerOut={handleLeave}
            >
                <RoundedBox
                    args={[0.98, 0.24, 0.98]}
                    radius={0.06}
                    smoothness={5}
                    castShadow
                    receiveShadow
                >
                    <meshStandardMaterial
                        color={interactive ? '#2a2a2e' : '#1c1c1f'}
                        metalness={0.42}
                        roughness={0.38}
                        envMapIntensity={0.85}
                    />
                </RoundedBox>
                <CellMark value={value} onPointerDown={handlePointer} />
            </group>
        </group>
    );
}

function Scene(props: {
    board: number[];
    interactive: boolean;
    onCellClick: (index: number) => void;
}) {
    const { board, interactive, onCellClick } = props;

    return (
        <>
            <color attach="background" args={['#030712']} />
            <fog attach="fog" args={['#030712', 10, 26]} />

            <ambientLight intensity={0.28} color="#94a3b8" />
            <directionalLight
                position={[5.5, 11, 6]}
                intensity={1.35}
                color="#fefce8"
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadowBias={-0.0002}
            />
            <directionalLight
                position={[-4, 5, -3]}
                intensity={0.35}
                color="#6366f1"
            />
            <pointLight
                position={[0, 3.5, 0]}
                intensity={0.25}
                color="#38bdf8"
                distance={12}
                decay={2}
            />

            <Suspense fallback={null}>
                <Environment preset="studio" />
            </Suspense>

            <group position={[0, -0.32, 0]}>
                {board.map((cell, i) => (
                    <BoardCell
                        key={i}
                        index={i}
                        value={cell}
                        interactive={interactive}
                        onPick={onCellClick}
                    />
                ))}
            </group>

            <ContactShadows
                position={[0, -0.44, 0]}
                opacity={0.55}
                scale={12}
                blur={2.4}
                far={5}
                color="#000000"
            />

            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.46, 0]}
                receiveShadow
            >
                <planeGeometry args={[9, 9]} />
                <meshStandardMaterial
                    color="#0c0c0f"
                    metalness={0.15}
                    roughness={0.92}
                    envMapIntensity={0.25}
                />
            </mesh>

            <OrbitControls
                enablePan={false}
                minDistance={6.2}
                maxDistance={15}
                minPolarAngle={0.52}
                maxPolarAngle={Math.PI / 2.02}
                target={[0, 0.2, 0]}
            />
        </>
    );
}

export function GameCanvas(props: {
    board: number[];
    interactive: boolean;
    onCellClick: (index: number) => void;
}) {
    const { board, interactive, onCellClick } = props;

    return (
        <div className="h-[min(70vh,560px)] w-full rounded-2xl bg-[#030712] ring-1 ring-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
            <Suspense
                fallback={
                    <div className="flex h-[min(70vh,560px)] w-full items-center justify-center text-sm text-neutral-500">
                        Loading scene…
                    </div>
                }
            >
                <Canvas
                    shadows
                    dpr={[1, 2]}
                    camera={{ position: [0, 6.8, 8.2], fov: 40 }}
                    gl={{
                        antialias: true,
                        toneMapping: THREE.ACESFilmicToneMapping,
                        toneMappingExposure: 1.05,
                        outputColorSpace: THREE.SRGBColorSpace,
                    }}
                >
                    <Scene
                        board={board}
                        interactive={interactive}
                        onCellClick={onCellClick}
                    />
                </Canvas>
            </Suspense>
        </div>
    );
}
