'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Transform, Vec3, Color, Polyline } from 'ogl';

interface RibbonsProps {
  color?: string;
  opacity?: number;
}

const Ribbons = ({
  color = '#5E52FF',
  opacity = 0.1,
}: RibbonsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Inițializare ---
    const renderer = new Renderer({ dpr: 2, alpha: true });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const scene = new Transform();

    // --- Shader-e ---
    const vertex = `
        precision highp float;
        attribute vec3 position, next, prev;
        attribute vec2 uv;
        attribute float side;
        uniform vec2 uResolution;
        uniform float uThickness;
        varying vec2 vUv;
        void main() {
            vUv = uv;
            vec2 aspect = vec2(uResolution.x / uResolution.y, 1.);
            vec2 nextScreen = next.xy * aspect;
            vec2 prevScreen = prev.xy * aspect;
            vec2 tangent = normalize(nextScreen - prevScreen);
            vec2 normal = vec2(-tangent.y, tangent.x) / aspect;
            float pixelWidth = 1. / uResolution.y;
            normal *= pixelWidth * uThickness;
            vec4 current = vec4(position, 1);
            current.xy -= normal * side;
            gl_Position = current;
        }
    `;
    const fragment = `
        precision highp float;
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec2 vUv;
        void main() {
            gl_FragColor.rgb = uColor;
            gl_FragColor.a = uOpacity * (1. - vUv.y);
        }
    `;

    // --- Creare Polyline ---
    const points: Vec3[] = [];
    for (let i = 0; i < 20; i++) points.push(new Vec3());

    const polyline = new Polyline(gl, {
        points,
        vertex,
        fragment,
        uniforms: {
            uColor: { value: new Color(color) },
            uThickness: { value: 30 },
            uOpacity: { value: opacity },
        },
    });
    polyline.mesh.setParent(scene);

    // --- Logică ---
    const mouse = new Vec3();
    const handleResize = () => renderer.setSize(container.clientWidth, container.clientHeight);
    const handleMouseMove = (e: MouseEvent) => {
        mouse.set((e.clientX / renderer.width) * 2 - 1, (e.clientY / renderer.height) * -2 + 1, 0);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    handleResize(); // Setează dimensiunea inițială
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let frameId: number;
    const update = () => {
      frameId = requestAnimationFrame(update);
      
      // Mutăm ultimul punct la început și îl actualizăm
      points.unshift(points.pop() as Vec3);
      points[0].copy(mouse);
      
      polyline.updateGeometry();
      renderer.render({ scene });
    };
    update();

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
      if (container && container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
    };
  }, [color, opacity]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" />;
};

export default Ribbons;