import { useEffect, useRef } from "react";

const vertex = `attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`;
const fragment = `
precision mediump float;
uniform vec2 resolution;
uniform float time;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float cloud(vec2 p){float n=0.,a=.5;for(int i=0;i<4;i++){n+=a*noise(p);p=p*2.03+vec2(9.2,3.7);a*=.5;}return n;}
void main(){
 vec2 uv=gl_FragCoord.xy/resolution;
 vec2 p=vec2(uv.x*resolution.x/resolution.y,uv.y)*3.;
 float n=cloud(p+vec2(time*.035,-time*.012));
 float veil=smoothstep(.32,.8,n)*(1.-smoothstep(.22,.9,uv.y));
 float light=cloud(p*.65+vec2(-time*.018,4.));
 vec3 color=mix(vec3(.28,.36,.32),vec3(.48,.78,.16),smoothstep(.48,.8,light));
 float alpha=veil*.19;
 gl_FragColor=vec4(color*alpha,alpha);
}`;

/** Small, transparent fog pass; the full-resolution artwork stays in the image layer. */
export default function LandscapeAtmosphere() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let gl: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let timeUniform: WebGLUniformLocation | null = null;
    let resolutionUniform: WebGLUniformLocation | null = null;
    let frame = 0, last = 0, elapsed = 0, visible = false;
    const init = () => {
      gl = canvas.getContext("webgl", { alpha:true, premultipliedAlpha:true, antialias:false, depth:false, powerPreference:"low-power" });
      if (!gl) return false;
      const compile = (type: number, source: string) => {
        const shader = gl!.createShader(type);
        if (!shader) return null;
        gl!.shaderSource(shader, source); gl!.compileShader(shader);
        if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) { gl!.deleteShader(shader); return null; }
        return shader;
      };
      const v = compile(gl.VERTEX_SHADER, vertex), f = compile(gl.FRAGMENT_SHADER, fragment);
      if (!v || !f) { if(v) gl.deleteShader(v); if(f) gl.deleteShader(f); return false; }
      program = gl.createProgram();
      if (!program) { gl.deleteShader(v); gl.deleteShader(f); return false; }
      gl.attachShader(program,v); gl.attachShader(program,f); gl.linkProgram(program);
      gl.deleteShader(v); gl.deleteShader(f);
      if (!gl.getProgramParameter(program,gl.LINK_STATUS)) { gl.deleteProgram(program); program=null; return false; }
      gl.useProgram(program);
      buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
      const location=gl.getAttribLocation(program,"position");
      gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location,2,gl.FLOAT,false,0,0);
      timeUniform=gl.getUniformLocation(program,"time"); resolutionUniform=gl.getUniformLocation(program,"resolution");
      return true;
    };
    const resize = () => {
      const rect=canvas.getBoundingClientRect();
      canvas.width=Math.min(480,Math.round(rect.width));
      canvas.height=Math.max(1,Math.round(canvas.width*rect.height/Math.max(1,rect.width)));
    };
    const draw = (now: number) => {
      frame=0;
      if (!visible || document.hidden || reduced.matches || !gl || gl.isContextLost()) return;
      frame=requestAnimationFrame(draw);
      if (now-last<50) return;
      elapsed+=last ? Math.min(now-last,100)*.001 : 0; last=now;
      gl.viewport(0,0,canvas.width,canvas.height);
      gl.uniform2f(resolutionUniform,canvas.width,canvas.height); gl.uniform1f(timeUniform,elapsed);
      gl.drawArrays(gl.TRIANGLES,0,3);
    };
    const sync = () => {
      cancelAnimationFrame(frame); frame=0; last=0;
      canvas.hidden=reduced.matches;
      if (visible && !document.hidden && !reduced.matches) {
        if (!program && !init()) return;
        frame=requestAnimationFrame(draw);
      }
    };
    const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});
    const ro=new ResizeObserver(resize); ro.observe(canvas); io.observe(canvas);
    reduced.addEventListener("change",sync); document.addEventListener("visibilitychange",sync); resize();
    return () => {
      cancelAnimationFrame(frame);io.disconnect();ro.disconnect();
      reduced.removeEventListener("change",sync);document.removeEventListener("visibilitychange",sync);
      if(gl){gl.deleteBuffer(buffer);gl.deleteProgram(program);}
    };
  }, []);
  return <canvas ref={ref} className="landscape-atmosphere" aria-hidden="true" />;
}
