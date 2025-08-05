import React, { useEffect, useRef } from 'react';
// @ts-ignore
import * as THREE from 'three';
// @ts-ignore
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
// @ts-ignore
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function Combined3DPreview({ files }: { files: File[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    useEffect(() => {
        if (!containerRef.current || files.length === 0) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x473a6d);

        const camera = new THREE.PerspectiveCamera(
            10,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 120);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.zoomToCursor = true;
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.target.set(0, 0, 0);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
        hemiLight.position.set(0, 200, 0);
        scene.add(hemiLight);

        const dirLight1 = new THREE.DirectionalLight(0xffffff, 1);
        dirLight1.position.set(100, 100, 100);
        scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.7);
        dirLight2.position.set(-100, -100, -100);
        scene.add(dirLight2);

        const stlLoader = new STLLoader();
        const plyLoader = new PLYLoader();

        const supportedFiles = files.filter(f => /\.(stl|ply)$/i.test(f.name));
        if (supportedFiles.length === 0) return;

        const loaderPromises = supportedFiles.map(file => {
            const reader = new FileReader();

            return new Promise<THREE.Mesh>((resolve, reject) => {
                reader.onload = () => {
                    if (!reader.result) {
                        reject(new Error('FileReader result is null for: ' + file.name));
                        return;
                    }

                    try {
                        const ext = (file.name.toLowerCase().split('.').pop() || '').trim();
                        if (!ext) {
                            reject(new Error('Cannot determine file extension for: ' + file.name));
                            return;
                        }

                        let geometry: THREE.BufferGeometry;
                        let material: THREE.Material;

                        if (ext === 'stl') {
                            geometry = stlLoader.parse(reader.result as ArrayBuffer);
                            geometry.computeBoundingBox();
                            material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
                        } else if (ext === 'ply') {
                            geometry = plyLoader.parse(reader.result as ArrayBuffer);
                            geometry.computeVertexNormals();
                            geometry.computeBoundingBox();

                            const hasColor = geometry.attributes.color !== undefined;
                            material = hasColor
                                ? new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.2, metalness: 0.1 })
                                : new THREE.MeshStandardMaterial({ color: 0xcccccc });
                        } else {
                            reject(new Error('Unsupported file format: ' + file.name));
                            return;
                        }

                        const mesh = new THREE.Mesh(geometry, material);
                        resolve(mesh);
                    } catch (err) {
                        reject(err);
                    }
                };

                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
            });
        });

        Promise.all(loaderPromises)
            .then(meshes => {
                const group = new THREE.Group();
                meshes.forEach((mesh: any) => group.add(mesh));
                scene.add(group);

                const box = new THREE.Box3().setFromObject(group);
                const center = new THREE.Vector3();
                box.getCenter(center);
                const size = new THREE.Vector3();
                box.getSize(size);

                group.position.sub(center);

                const maxDim = Math.max(size.x, size.y, size.z);
                const fov = camera.fov * (Math.PI / 180);
                const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
                camera.position.set(0, 0, cameraZ * 1.5);
                camera.lookAt(0, 0, 0);
                controls.target.set(0, 0, 0);
                controls.update();
            })
            .catch(err => console.error('Error loading 3D files:', err));

        let mounted = true;
        const animate = () => {
            if (!mounted) return;
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            mounted = false;
            if (rendererRef.current) {
                rendererRef.current.dispose();
                rendererRef.current.forceContextLoss();
                rendererRef.current.domElement.remove();
                rendererRef.current = null;
            }
        };
    }, [files]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                minHeight: '400px',
                border: '1px solid #ccc',
                borderRadius: 8,
            }}
        />
    );
}