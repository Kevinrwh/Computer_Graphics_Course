import define1 from "./1b675294aba5f9ea@583.js";
import define2 from "./9d0fa713ea129540@422.js";
import define3 from "./a7481270343815fd@706.js";
import define4 from "./10023e7d8ddc32bc@90.js";
import define5 from "./e93997d5089d7165@2303.js";

function _1(md){return(
md`# Assignment 8: Lighting Computation II (Diffuse + Specular + Ambient)`
)}

function _fov_Y(Inputs){return(
Inputs.range([20, 75], {
  value: 45,
  label: "Vertical Field of View",
  step: 1
})
)}

function _cameraAngles(columns,Inputs){return(
columns({
  y_angle: Inputs.range([-180, 180], {
    value: 0,
    label: "Camera Y Angle",
    step: 1
  }),
  x_angle: Inputs.range([-89, 89], {
    value: -45,
    label: "Camera X Angle",
    step: 1
  })
})
)}

function _lightParameters(columns,Inputs){return(
columns({
  orientation: Inputs.range([-180, 180], {
    value: 0,
    label: "Light Z-Angle",
    step: 1
  }),
  distanceFactor: Inputs.range([1, 5], {
    value: 0,
    label: "Light Distance",
    step: 0.1
  }),
  lightType: Inputs.radio(["point", "directional"], {
    value: "point",
    label: "Light Type"
  })
})
)}

function _specularProperty(columns,color,Inputs,md){return(
columns({
  specularColor: color({ value: "#b46e6e", description: "Specular Color" }),
  K_s: Inputs.range([0, 1], {
    value: 0.5,
    step: 0.1,
    label: md`K_s`
  }),
  shininess: Inputs.range([0, 100], {
    value: 5,
    step: 1,
    label: md`Shininess`
  })
})
)}

function _materialProperty(columns,color,Inputs,md){return(
columns({
  materialColor: color({ value: "#c7c7c7", description: "Material Color" }),
  // diffuseReflectance: Inputs.range([0, 1], {
  //   value: 0.5,
  //   step: 0.1,
  //   label: md`Diffuse Reflectance`
  // }),
  ambientLightIntensityPercentage: Inputs.range([0,100], {
    value:5,
    step:1,
    label: md `Ambient Light Intensity Percent`
  })
})
)}

function _7(gl,canvasWidth,renderCamera,renderScene,litSceneProgramInfo,getViewMatrix,radius,deg2rad,cameraAngles,getProjectionMatrix,fov_Y,near,far)
{
  gl.viewport(0, 0, canvasWidth, gl.canvas.height);
  gl.scissor(0, 0, canvasWidth, gl.canvas.height);
  gl.clearColor(0, 0.25, 0.25, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  renderCamera();
  gl.viewport(canvasWidth, 0, canvasWidth, gl.canvas.height);
  gl.scissor(canvasWidth, 0, canvasWidth, gl.canvas.height);
  gl.clearColor(0.25, 0.25, 0.25, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  renderScene(
    litSceneProgramInfo,
    getViewMatrix(
      radius,
      deg2rad(cameraAngles.x_angle),
      deg2rad(cameraAngles.y_angle)
    ),
    getProjectionMatrix(fov_Y, near, far)
  );
  return gl.canvas;
}


function _modelObj(Inputs,boyObj,raymanObj,teapotObj,windmillObj,houseObj){return(
Inputs.select(
  new Map([
    ["boy", boyObj],
    ["rayman", raymanObj],
    ["teapot", teapotObj],
    ["windmill", windmillObj],
    ["house", houseObj]
  ]),
  { value: teapotObj, label: "Choose Model" }
)
)}

function _9(md){return(
md`### Variables and Functions`
)}

function _near(){return(
0.1
)}

function _far(){return(
2.5
)}

function _12(specularProperty){return(
specularProperty.specularColor
)}

function _renderScene(gl,m4,hex2rgb,materialProperty,specularProperty,lightParameters,lightPosition,lightDirection,twgl,sceneBufferInfoArray){return(
(sceneProgramInfo, viewMatrix, projectionMatrix) => {
  gl.useProgram(sceneProgramInfo.program);
  
  const lookAt = m4.inverse(viewMatrix);
  const eyePosition = [lookAt[12],lookAt[13],lookAt[14]];
  
  const uniforms = {
    // Add required uniform variables (name and value)
    
    modelMatrix:m4.identity(),
    materialColor: hex2rgb(materialProperty.materialColor),
    specularColor: hex2rgb(specularProperty.specularColor),
    K_s: specularProperty.K_s,
    shininess: specularProperty.shininess,
    light:
      lightParameters.lightType == "point"
        ? [...lightPosition, 1]
        : [...lightDirection, 0],
    eyePosition,
    viewMatrix,
    projectionMatrix
  };
  
  twgl.setUniforms(sceneProgramInfo, uniforms);
  
  sceneBufferInfoArray.forEach((bufferInfo) => {
    twgl.setBuffersAndAttributes(gl, sceneProgramInfo, bufferInfo);
    twgl.drawBufferInfo(gl, bufferInfo);
  });
}
)}

function _renderCamera(getViewMatrix,getProjectionMatrix,renderScene,unlitSceneProgramInfo,m4,gl,lightProgramInfo,twgl,lightBufferInfo,lightPosition,lightRayBufferInfo,cameraProgramInfo,getCameraTransformationMatrix,boxBufferInfo,fov_Y,near,far){return(
() => {
  const viewMatrix = getViewMatrix(8.5, 0, 0);
  const projectionMatrix = getProjectionMatrix(25, 0.1, 25);

  renderScene(unlitSceneProgramInfo, viewMatrix, projectionMatrix);

  const uniforms = {
    n2c: 1,
    modelMatrix: m4.identity(),
    viewMatrix,
    projectionMatrix
  };

  // Light
  gl.useProgram(lightProgramInfo.program);
  twgl.setBuffersAndAttributes(gl, lightProgramInfo, lightBufferInfo);
  uniforms.modelMatrix = m4.translation(lightPosition);
  twgl.setUniforms(lightProgramInfo, uniforms);
  twgl.drawBufferInfo(gl, lightBufferInfo, gl.TRIANGLES);

  // main Light direction
  twgl.setBuffersAndAttributes(gl, lightProgramInfo, lightRayBufferInfo);
  uniforms.modelMatrix = m4.identity();
  twgl.setUniforms(lightProgramInfo, uniforms);
  twgl.drawBufferInfo(gl, lightRayBufferInfo, gl.LINES);

  // Camera
  gl.useProgram(cameraProgramInfo.program);
  // Camera Body
  let modelMatrix = getCameraTransformationMatrix(true);
  twgl.setBuffersAndAttributes(gl, cameraProgramInfo, boxBufferInfo);
  uniforms.modelMatrix = m4.multiply(modelMatrix, m4.translation([0, 0, 1]));
  (uniforms.color = [1, 1, 1]), twgl.setUniforms(cameraProgramInfo, uniforms);
  twgl.drawBufferInfo(gl, boxBufferInfo, gl.LINES);
  // Camera eye piece
  uniforms.modelMatrix = m4.multiply(
    m4.multiply(modelMatrix, m4.translation([0, 0, -0.5])),
    m4.scaling([0.5, 0.5, 0.5])
  );
  twgl.setUniforms(cameraProgramInfo, uniforms);
  twgl.drawBufferInfo(gl, boxBufferInfo, gl.LINES);

  // Camera Frustum
  modelMatrix = getCameraTransformationMatrix(false);

  uniforms.modelMatrix = m4.multiply(
    modelMatrix,
    m4.inverse(getProjectionMatrix(fov_Y, near, far))
  );
  uniforms.color = [0.5, 0.5, 0.5];
  twgl.setUniforms(cameraProgramInfo, uniforms);
  twgl.drawBufferInfo(gl, boxBufferInfo, gl.LINES);
}
)}

function _gl(DOM,width)
{
  const myCanvas = DOM.canvas(width, 400);

  const gl = myCanvas.getContext("webgl2");
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.3, 0.4, 0.5, 1);
  gl.enable(gl.SCISSOR_TEST);
  gl.lineWidth(2);
  return gl;
}


function _canvasWidth(gl){return(
gl.canvas.width / 2
)}

function _canvasHeight(gl){return(
gl.canvas.height
)}

function _aspect(canvasWidth,canvasHeight){return(
canvasWidth / canvasHeight
)}

function _cameraLookAt(modelDim){return(
modelDim.center
)}

function _radius(){return(
1
)}

function _getViewMatrix(m4,v3,cameraLookAt,modelDim){return(
(r, x_angle, y_angle) => {
  const gazeDirection = m4.transformDirection(
    m4.multiply(m4.rotationY(y_angle), m4.rotationX(x_angle)),
    [0, 0, 1]
  );
  const eye = v3.add(cameraLookAt, v3.mulScalar(gazeDirection, r*modelDim.dia));
  const cameraMatrix = m4.lookAt(eye, cameraLookAt, [0, 1, 0]);
  return m4.inverse(cameraMatrix);
}
)}

function _getCameraTransformationMatrix(modelDim,m4,deg2rad,cameraAngles,v3,cameraLookAt,radius){return(
(scale) => {
  const s = modelDim.dia / 8;
  const rotationTransformation = m4.multiply(
    m4.rotationY(deg2rad(cameraAngles.y_angle)),
    m4.rotationX(deg2rad(cameraAngles.x_angle))
  );
  const translationVector = v3.add(
    cameraLookAt,
    v3.mulScalar(
      m4.transformDirection(rotationTransformation, [0, 0, 1]),
      radius * modelDim.dia
    )
  );

  return m4.multiply(
    m4.multiply(m4.translation(translationVector), rotationTransformation),
    scale ? m4.scaling([s, s, s]) : m4.identity()
  );
}
)}

function _getProjectionMatrix(m4,deg2rad,aspect,modelDim){return(
(fov, near, far) => {
  //const aspect = gl.canvas.width / gl.canvas.height;
  return m4.perspective(
    deg2rad(fov),
    aspect,
    near * modelDim.dia,
    far * modelDim.dia
  );
}
)}

function _lightPosition(lightParameters,modelDim,v3,lightDirection)
{
  const D = (lightParameters.distanceFactor * modelDim.dia) / 2;
  return v3.add(modelDim.center, v3.mulScalar(lightDirection, D));
}


function _lightRayBufferInfo(twgl,gl,lightPosition,modelDim)
{
  return twgl.createBufferInfoFromArrays(gl, {
    position: [...lightPosition, ...modelDim.center]
  });
}


function _26(md){return(
md`### Buffers`
)}

function _sceneBufferInfoArray(modelObj,twgl,gl)
{
  const vertexAttributes = modelObj.map((d) => ({
    position: { numComponents: 3, data: d.sc.positions },
    normal: { numComponents: 3, data: d.sc.normals }
  }));
  return vertexAttributes.map((vertexAttributes) =>
    twgl.createBufferInfoFromArrays(gl, vertexAttributes)
  );
}


function _modelDim(computeModelExtent,modelObj){return(
computeModelExtent(modelObj)
)}

function _lightBufferInfo(twgl,modelDim,gl)
{
  const sphereVertices = twgl.primitives.createSphereVertices(
    modelDim.dia * 0.05,
    5,
    5
  );
  return twgl.createBufferInfoFromArrays(gl, sphereVertices);
}


function _boxBufferInfo(twgl,gl)
{
  const boxAttributes = {
    position: [
      -1,
      -1,
      -1,

      1,
      -1,
      -1,

      1,
      1,
      -1,

      -1,
      1,
      -1,

      -1,
      -1,
      1,

      1,
      -1,
      1,

      1,
      1,
      1,

      -1,
      1,
      1
    ],
    indices: [
      0,
      1,
      1,
      2,
      2,
      3,
      3,
      0,
      4,
      5,
      5,
      6,
      6,
      7,
      7,
      4,
      0,
      4,
      1,
      5,
      2,
      6,
      3,
      7
    ]
  };
  return twgl.createBufferInfoFromArrays(gl, boxAttributes);
}


function _lightDirection(m4,deg2rad,lightParameters){return(
m4.transformDirection(
  m4.rotationZ(deg2rad(lightParameters.orientation)),
  [0, 1, 0]
)
)}

function _32(md){return(
md`### Shaders and ProgramInfo`
)}

function _errorBlock(html,width){return(
html`<textarea style="height : 20px; width : ${width}px; font-size: 0.8em; display: block"></textarea>`
)}

function _unlitSceneProgramInfo(twgl,gl)
{
  const vs = `#version 300 es
    precision mediump float;
    in vec3 position;
    in vec3 normal;
  
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    out vec3 fragNormal;
    void main () {
      vec4 newPosition = modelMatrix*vec4(position,1);
      gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(position,1);
      mat4 normalMatrix = transpose(inverse(modelMatrix));
      fragNormal = normalize((normalMatrix*vec4(normal,0)).xyz);
      gl_PointSize = 2.;
    }`;
  const fs = `#version 300 es
    precision mediump float;
    out vec4 outColor;
    in vec3 fragNormal;
    uniform vec4 light;
    uniform int n2c;
    void main () {
      vec3 N = normalize(fragNormal);
      vec3 color = (n2c==0)?abs(N):(N+1.)/2.;
      outColor = vec4(color, 1);
    }`;
  return twgl.createProgramInfo(gl, [vs, fs]);
}


function _litSceneProgramInfo(errorBlock,twgl,gl)
{
  const vs = `#version 300 es
    precision mediump float;
    in vec3 position;
    in vec3 normal;
  
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    out vec3 fragNormal;
    out vec3 fragPosition;

    void main () {
      vec4 newPosition = modelMatrix*vec4(position,1);

      fragPosition = newPosition.xyz;

      gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(position,1);
      mat4 normalMatrix = transpose(inverse(modelMatrix));
      fragNormal = normalize((normalMatrix*vec4(normal,0)).xyz);
    }`;
  const fs = `#version 300 es
    precision mediump float;

    out vec4 outColor;

    in vec3 fragNormal;
    in vec3 fragPosition;

    uniform vec4 light;
    uniform vec3 eyePosition;

    uniform vec3 materialColor;

    uniform float K_s, shininess;
    uniform vec3 specularColor;
    
    void main () {
      vec3 N = normalize(fragNormal);

      vec3 L;
      
      if(light.w == 1.) L = normalize(light.xyz - fragPosition);
      else L = normalize(light.xyz);

      vec3 diffuse = materialColor*clamp(dot(N,L), 0.,1.); // compute diffuse color
      
      vec3 V = normalize(eyePosition - fragPosition);
      vec3 H = normalize(L + V);
      vec3 specular = specularColor*pow(clamp(dot(H,N),0.,1.), shininess); // compute specular color

      vec3 color = (1. - K_s)*diffuse + K_s*specular;

      outColor = vec4(color, 1);
    }`;
  errorBlock.style.height = "20px";
  errorBlock.innerHTML = "Program Shader compilation successful";
  return twgl.createProgramInfo(gl, [vs, fs], (message) => {
    errorBlock.style.height = "400px";
    errorBlock.innerHTML = "Scene Program Shader compilation error\n" + message;
  });
}


function _lightProgramInfo(twgl,gl)
{
  const vs = `#version 300 es
    precision mediump float;

    in vec3 position;

    uniform mat4 viewMatrix; // Constants that must be set before the render call.
    uniform mat4 projectionMatrix;
    uniform mat4 modelMatrix;

    void main () {
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1);
    }`,
    fs = `#version 300 es
    precision mediump float;
    out vec4 outColor;
    void main () {
      outColor = vec4(0.75,0.75,0.5,1);
    }`;
  return twgl.createProgramInfo(gl, [vs, fs]);
}


function _cameraProgramInfo(twgl,gl)
{
  const vs = `#version 300 es
    precision highp float;
    in vec3 position;
  
    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    void main () {
      gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(position,1);
    }`,
    fs = `#version 300 es
    precision highp float;
    out vec4 outColor;
    uniform vec3 color;
    void main () {
      outColor = vec4(color,1);
    }`;
  return twgl.createProgramInfo(gl, [vs, fs]);
}


function _39(md){return(
md`### External Libraries and Imports`
)}

function _deg2rad(){return(
(deg) => (Math.PI * deg) / 180
)}

function _m4(twgl){return(
twgl.m4
)}

function _v3(twgl){return(
twgl.v3
)}

function _twgl(require){return(
require("twgl.js")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof fov_Y")).define("viewof fov_Y", ["Inputs"], _fov_Y);
  main.variable(observer("fov_Y")).define("fov_Y", ["Generators", "viewof fov_Y"], (G, _) => G.input(_));
  main.variable(observer("viewof cameraAngles")).define("viewof cameraAngles", ["columns","Inputs"], _cameraAngles);
  main.variable(observer("cameraAngles")).define("cameraAngles", ["Generators", "viewof cameraAngles"], (G, _) => G.input(_));
  main.variable(observer("viewof lightParameters")).define("viewof lightParameters", ["columns","Inputs"], _lightParameters);
  main.variable(observer("lightParameters")).define("lightParameters", ["Generators", "viewof lightParameters"], (G, _) => G.input(_));
  main.variable(observer("viewof specularProperty")).define("viewof specularProperty", ["columns","color","Inputs","md"], _specularProperty);
  main.variable(observer("specularProperty")).define("specularProperty", ["Generators", "viewof specularProperty"], (G, _) => G.input(_));
  main.variable(observer("viewof materialProperty")).define("viewof materialProperty", ["columns","color","Inputs","md"], _materialProperty);
  main.variable(observer("materialProperty")).define("materialProperty", ["Generators", "viewof materialProperty"], (G, _) => G.input(_));
  main.variable(observer()).define(["gl","canvasWidth","renderCamera","renderScene","litSceneProgramInfo","getViewMatrix","radius","deg2rad","cameraAngles","getProjectionMatrix","fov_Y","near","far"], _7);
  main.variable(observer("viewof modelObj")).define("viewof modelObj", ["Inputs","boyObj","raymanObj","teapotObj","windmillObj","houseObj"], _modelObj);
  main.variable(observer("modelObj")).define("modelObj", ["Generators", "viewof modelObj"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("near")).define("near", _near);
  main.variable(observer("far")).define("far", _far);
  main.variable(observer()).define(["specularProperty"], _12);
  main.variable(observer("renderScene")).define("renderScene", ["gl","m4","hex2rgb","materialProperty","specularProperty","lightParameters","lightPosition","lightDirection","twgl","sceneBufferInfoArray"], _renderScene);
  main.variable(observer("renderCamera")).define("renderCamera", ["getViewMatrix","getProjectionMatrix","renderScene","unlitSceneProgramInfo","m4","gl","lightProgramInfo","twgl","lightBufferInfo","lightPosition","lightRayBufferInfo","cameraProgramInfo","getCameraTransformationMatrix","boxBufferInfo","fov_Y","near","far"], _renderCamera);
  main.variable(observer("gl")).define("gl", ["DOM","width"], _gl);
  main.variable(observer("canvasWidth")).define("canvasWidth", ["gl"], _canvasWidth);
  main.variable(observer("canvasHeight")).define("canvasHeight", ["gl"], _canvasHeight);
  main.variable(observer("aspect")).define("aspect", ["canvasWidth","canvasHeight"], _aspect);
  main.variable(observer("cameraLookAt")).define("cameraLookAt", ["modelDim"], _cameraLookAt);
  main.variable(observer("radius")).define("radius", _radius);
  main.variable(observer("getViewMatrix")).define("getViewMatrix", ["m4","v3","cameraLookAt","modelDim"], _getViewMatrix);
  main.variable(observer("getCameraTransformationMatrix")).define("getCameraTransformationMatrix", ["modelDim","m4","deg2rad","cameraAngles","v3","cameraLookAt","radius"], _getCameraTransformationMatrix);
  main.variable(observer("getProjectionMatrix")).define("getProjectionMatrix", ["m4","deg2rad","aspect","modelDim"], _getProjectionMatrix);
  main.variable(observer("lightPosition")).define("lightPosition", ["lightParameters","modelDim","v3","lightDirection"], _lightPosition);
  main.variable(observer("lightRayBufferInfo")).define("lightRayBufferInfo", ["twgl","gl","lightPosition","modelDim"], _lightRayBufferInfo);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer("sceneBufferInfoArray")).define("sceneBufferInfoArray", ["modelObj","twgl","gl"], _sceneBufferInfoArray);
  main.variable(observer("modelDim")).define("modelDim", ["computeModelExtent","modelObj"], _modelDim);
  main.variable(observer("lightBufferInfo")).define("lightBufferInfo", ["twgl","modelDim","gl"], _lightBufferInfo);
  main.variable(observer("boxBufferInfo")).define("boxBufferInfo", ["twgl","gl"], _boxBufferInfo);
  main.variable(observer("lightDirection")).define("lightDirection", ["m4","deg2rad","lightParameters"], _lightDirection);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer("errorBlock")).define("errorBlock", ["html","width"], _errorBlock);
  main.variable(observer("unlitSceneProgramInfo")).define("unlitSceneProgramInfo", ["twgl","gl"], _unlitSceneProgramInfo);
  main.variable(observer("litSceneProgramInfo")).define("litSceneProgramInfo", ["errorBlock","twgl","gl"], _litSceneProgramInfo);
  main.variable(observer("lightProgramInfo")).define("lightProgramInfo", ["twgl","gl"], _lightProgramInfo);
  main.variable(observer("cameraProgramInfo")).define("cameraProgramInfo", ["twgl","gl"], _cameraProgramInfo);
  main.variable(observer()).define(["md"], _39);
  main.variable(observer("deg2rad")).define("deg2rad", _deg2rad);
  main.variable(observer("m4")).define("m4", ["twgl"], _m4);
  main.variable(observer("v3")).define("v3", ["twgl"], _v3);
  const child1 = runtime.module(define1);
  main.import("hex2rgb", child1);
  const child2 = runtime.module(define2);
  main.import("computeModelExtent", child2);
  main.import("loadModelFromURL", child2);
  const child3 = runtime.module(define3);
  main.import("raymanObj", child3);
  main.import("teapotObj", child3);
  main.import("boyObj", child3);
  main.import("windmillObj", child3);
  main.import("houseObj", child3);
  const child4 = runtime.module(define4);
  main.import("columns", child4);
  const child5 = runtime.module(define5);
  main.import("color", child5);
  main.variable(observer("twgl")).define("twgl", ["require"], _twgl);
  return main;
}
