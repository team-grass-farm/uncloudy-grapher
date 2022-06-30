import { mat4 } from 'gl-matrix';

// NOTE Vertex shader program
const vsSource = `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
  `;

const fsSource = `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `;

/**
 * Initialize a shader program, so WebGL knows how to draw our data
 * @param ctx
 * @param vsSource
 * @param fsSource
 * @returns
 */
const initShaderProgram = (
  ctx: WebGLRenderingContext,
  vsSource: string,
  fsSource: string
) => {
  const vertexShader = loadShader(ctx, ctx.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(ctx, ctx.FRAGMENT_SHADER, fsSource);

  // NOTE Create the shader program
  const shaderProgram = ctx.createProgram();
  if (shaderProgram === null || !!!vertexShader || !!!fragmentShader) return;
  ctx.attachShader(shaderProgram, vertexShader);
  ctx.attachShader(shaderProgram, fragmentShader);
  ctx.linkProgram(shaderProgram);

  // NOTE If creating the shader program failed, alert
  if (!ctx.getProgramParameter(shaderProgram, ctx.LINK_STATUS)) {
    alert(
      'Unable to initialize the shader program: ' +
        ctx.getProgramInfoLog(shaderProgram)
    );
    return null;
  }

  return shaderProgram;
};

/**
 * creates a shader of the given type, uploads the source and compiles it.
 * @param ctx
 * @param type
 * @param source
 * @returns
 */
const loadShader = (
  ctx: WebGLRenderingContext,
  type: number,
  source: string
) => {
  const shader = ctx.createShader(type);

  if (shader === null) return;
  // NOTE Send the source to the shader object
  ctx.shaderSource(shader, source);

  // NOTE Compile the shader program
  ctx.compileShader(shader);

  // NOTE See if it compiled successfully

  if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
    alert(
      'An error occurred compiling the shaders: ' + ctx.getShaderInfoLog(shader)
    );
    ctx.deleteShader(shader);
    return null;
  }

  return shader;
};

const initBuffers = (ctx: WebGLRenderingContext) => {
  const positionBuffer = ctx.createBuffer();

  ctx.bindBuffer(ctx.ARRAY_BUFFER, positionBuffer);

  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

  ctx.bufferData(
    ctx.ARRAY_BUFFER,
    new Float32Array(positions),
    ctx.STATIC_DRAW
  );

  return {
    position: positionBuffer,
  };
};

const drawScene = (
  ctx: WebGLRenderingContext,
  programInfo: any,
  buffers: any
) => {
  ctx.clearColor(0.0, 0.0, 0.0, 1.0);
  ctx.clearDepth(1.0);
  ctx.enable(ctx.DEPTH_TEST);
  ctx.depthFunc(ctx.LEQUAL);

  ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);

  const fieldOfView = (45 * Math.PI) / 180;
  const aspect = ctx.canvas.clientWidth / ctx.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  const modelViewMatrix = mat4.mat4.translate(modelViewMatrix);
};

export const renderObject = (
  ctx: WebGLRenderingContext,
  currentRef: HTMLCanvasElement,
  dataChunks: number[][],
  drawingType: 'box' | 'grass'
) => {
  ctx.clearColor(0.0, 0.0, 0.0, 1.0);
  ctx.enable(ctx.DEPTH_TEST);
  ctx.depthFunc(ctx.LEQUAL);

  ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
};
