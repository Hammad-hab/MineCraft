/* eslint-disable no-unused-expressions */
import * as THREE from 'three'
import Dirt from './Comp/Images/Img2.bmp'
import Lava from './Comp/Images/Texture.jpg'
import grass from './Comp/Images/Img3.jpg'
import Debris from './Comp/Images/Debris.jpg'
// import Sea from './Comp/Images/CedarTextrue.jpg'
import {ShaderMaterial } from 'three'
import SkyDead from './Comp/Images/SkyTextureDead.PNG'
import Sky from './Comp/Images/SkyTexture.PNG'

// Variables
var MeshArray = []
var Appended = false
var AccelerationRate  = 1;
var LandStickRange = 1000
var Collison;
function CollisonDectector(x1, x2, y1, y2, z1, z2) {
    var DistX = x1 - x2
    var DistZ = z1 - z2
    var DistY = y1 - y2
    return Math.sqrt(Math.pow(DistX, 2) + Math.pow(DistY, 2))
}
var backgroundSet = false

const Main = () => {
    var
        scene, camera, CreateObj, renderer
    
    (function () {

        scene = new THREE.Scene();
        {
            scene.background = new THREE.TextureLoader().load(Sky);
        }
        // scene.setGravity(new THREE.Vector3(0, -10, 0))
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01)
        camera.position.z += 20;
        camera.zoom = 10
        camera.rotation.y = -0.003076733845460768
        camera.rotation.x = 1.2432621643567174
        CreateObj = function Creator(Mesh, push) {
            scene.add(Mesh)
            if (push === true) {
                MeshArray.push(Mesh)
            }
        }
    })()
    
    function SetBackGround() {
        if (backgroundSet === false) {
            setTimeout(() => {
                scene.background = new THREE.TextureLoader().load(SkyDead);
                backgroundSet = true
            }, 2000);
        }
    }
 

    var Base = new THREE.PlaneGeometry(2000, 2000, 10, 10)
    var Grass = new THREE.PlaneBufferGeometry(2000, 2000, 150, 150)
    var CheckMark = new THREE.BoxGeometry(1, 1, 5, 10, 10, 10, 10)
    // Shaders
    var CheckMarkShader = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
            time: { value: 10 },
            Smtexture: { value: new THREE.TextureLoader().load(Lava) },
        },
        vertexShader: ` 
        uniform float time;
        varying float vNoise;
        varying vec2 vUv;
        void main() {
            vec3 newposition = position;
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newposition, 1.0 );
        }`,
        fragmentShader: `
        varying float vNoise;
        uniform sampler2D Smtexture;
        varying vec2 vUv;
        void main(){ 
            // vec3 colorA = vec3(0.,0,0.);
            // vec3 colorB = vec3(0.5,1.3,0.5);
            // vec3 colorC = mix(colorB, colorA, 0 + 0.5);
            vec4 veiw = texture2D(Smtexture, vUv);
            gl_FragColor = veiw;
        }`,
        //wireframe: true,
    })

    var BaseShader = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
            time: { value: 100 },
            Smtexture: { value: new THREE.TextureLoader().load(Dirt) },
            CamPos: {}
        },
        vertexShader: `
        //	Classic Perlin 3D Noise 
        //	by Stefan Gustavson
        //
        // uniform float CamPos;
        uniform float time;
        varying float vNoise;
        varying vec2 vUv;
        uniform float CamPos;
        void main() {
            vec3 newposition = position;
            vUv = uv;
            // CamPos = newposition;
            float dist = distance(vUv, vec2(0.5));
            float VariA = cos(dist*1000. + time);
            float VariB = sin(dist*1000. + time);
            float VariC = tan(dist*1000. + time);
            // float VariD = cosec(dist*1000. + time);
            float Noise = VariA + VariB + VariC;
            newposition.z += Noise;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newposition, 1.0 );
        }`,
        fragmentShader: `
        varying float vNoise;
        uniform sampler2D Smtexture;
        varying vec2 vUv;
        void main(){ 
            // vec3 colorA = vec3(0.,0,0.);
            // vec3 colorB = vec3(0.5,1.3,0.5);
            // vec3 colorC = mix(colorB, colorA, 0 + 0.5);
            vec4 veiw = texture2D(Smtexture, vUv);
            gl_FragColor = veiw;
        }`,
    })

    var GrassShader = new ShaderMaterial({
        uniforms: {
            time: { value: 100 },
            textur: { value: new THREE.TextureLoader().load(Debris) }
        },
        vertexShader: `
        varying vec2 vUv;
        uniform float time;
        void main() {
            vUv = uv;
            vec3 newposition = position;
            float dist = distance(vUv, vec2(0.5));
            float VariA = cos(dist*1000. + time);
            float VariB = sin(dist*1000. + time);
            float VariC = tan(dist*20. + time);
            float Noise = VariA + VariB;
            newposition.z +=  Noise;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newposition, 1.0 );
        }`,
        fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D textur;
        void main() {
            vec4 veiw = texture2D(textur, vUv);
            gl_FragColor = veiw;
        }`
    })
    var DebrisShader = new ShaderMaterial({
        uniforms: {
            time: { value: 100 },
            textur: { value: new THREE.TextureLoader().load(Debris) }
        },
        vertexShader: `
        varying vec2 vUv;
        uniform float time;
        void main() {
            vUv = uv;
            vec3 newposition = position;
            float dist = distance(vUv, vec2(0.5));
            float VariA = cos(dist*1000. + time);
            float VariB = sin(dist*1000. + time);
            float VariC = tan(dist*1000. + time);
            float Noise = VariA + VariB + VariC;
            newposition.z +=  Noise;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newposition, 1.0 );
        }`,
        fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D textur;
        void main() {
            vec4 veiw = texture2D(textur, vUv);
            gl_FragColor = veiw;
        }`
    })
    var SeaShader = new ShaderMaterial({
        uniforms: {
            time: { value: 0.5 },
            textur: { value: new THREE.TextureLoader().load(grass) }
        },
        vertexShader: `
        varying vec2 vUv;
        uniform float time;
        void main() {
            vUv = uv;
            vec3 newposition = position;
            float dist = distance(vUv, vec2(0.5));
            float VariA = 10. * cos(dist*1000. + time);
            // float VariB = sin(dist*1000. + time);
            float VariC = tan(dist + time);
            // float Noise = VariA + VariB + VariC;
            // newposition.z += VariA;
            // newposition.z += VariC;
            newposition.y -= VariA;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newposition, 1.0 );
        }`,
        fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D textur;
        void main() {
            vec4 veiw = texture2D(textur, vUv);
            gl_FragColor = veiw;
        }`,
        // wireframe: true
    })
    var DebrisShader = new ShaderMaterial({
        uniforms: {
            time: { value: 100 },
            textur: { value: new THREE.TextureLoader().load(Lava) }
        },
        vertexShader: `
        varying vec2 vUv;
        uniform float time;
        void main() {
            vUv = uv;
            vec3 newposition = position;
            float dist = distance(vUv, vec2(0.5));
            float VariA = cos(dist*1000. + time);
            float VariB = sin(dist*1000. + time);
            float VariC = tan(dist*1000. + time);
            float Noise = VariA + VariB + VariC;
            newposition.z +=  Noise;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(newposition, 1.0 );
        }`,
        fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D textur;
        void main() {
            vec4 veiw = texture2D(textur, vUv);
            gl_FragColor = veiw;
        }`
    })
    // var BaseMesh = new THREE.Mesh(Base, BaseShader);
    var GrassMesh = new THREE.Mesh(Grass, GrassShader)
    var CheckMarkMesh = new THREE.Mesh(CheckMark, CheckMarkShader)
    var StoneDebrisMesh = new THREE.Mesh(Grass, DebrisShader)
    var SeaMesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 200, 200), SeaShader)
    CheckMarkMesh.position.y -= 5
    GrassMesh.position.z += 5
    GrassMesh.position.y -= 50
    // SeaMesh.position.z -= 50
    StoneDebrisMesh.position.z += 5
    var Color = new THREE.Color(255, 255, 255)
    scene.fog = new THREE.Fog(Color, 0.1, 0.5)
    SeaMesh.position.z += 5
    SeaMesh.position.y += GrassMesh.position.y + 2000

    CreateObj(SeaMesh, true)
    // CreateObj(BaseMesh, true)
    CreateObj(GrassMesh, true);
    CreateObj(CheckMarkMesh, true)
    CreateObj(StoneDebrisMesh, true)

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    var CanvasIsCreated = Appended === false ? _Success() : console.log(false)
    var AllowDeathNotification = false
    function _Success() {
        Appended = true
        document.body.appendChild(renderer.domElement)
       
    }
    
    function MoveForward(SpeedOfMovemnent) {
        const direction = new THREE.Vector3;
        var speed = SpeedOfMovemnent;
        function MoveBy() {
            camera.getWorldDirection(direction);
            camera.position.addScaledVector(direction, speed);

        }

        MoveBy()
    }

    function _AnimationLoop() {
        requestAnimationFrame(_AnimationLoop);
        var Collison = CollisonDectector(camera.position.x, GrassMesh.position.x, camera.position.y, GrassMesh.position.y);
        console.log(camera.rotation.x)
        if (Collison > LandStickRange) {
            // camera.rotation.x = 50
            camera.position.z -= AccelerationRate;
            AccelerationRate ++;
            SetBackGround()
        };
        SeaShader.uniforms.time.value += 0.1;
        renderer.render(scene, camera);
    }

  _AnimationLoop()
    
    function _EnsureControlKey(EventObject) {
        var key = EventObject.key;
        switch (key) {
            case "w":
                (Collison = CollisonDectector(camera.position.x, GrassMesh.position.x, camera.position.z, GrassMesh.position.z)) <= 0 ? MoveForward(1) : ((camera.position.z = GrassMesh.position.z + 20), MoveForward(1));
                break;
            case "x":
                (Collison = CollisonDectector(camera.position.x, GrassMesh.position.x, camera.position.z, GrassMesh.position.z)) <= 0 ? MoveForward(10) : ((camera.position.z = GrassMesh.position.z + 20), MoveForward(10));
                break;
            case "s": 
            /* const CurrentPosition = camera.position.z
              
              if (camera.position.z === CurrentPosition + 5) {
                camera.position.z -= 5
              } else { 
                  camera.position.z += 5; 
              } */
            
            break
            default:
                console.log("Unidentified Control");
        }
            }

    // Event Listener
    window.addEventListener('keypress', (e) => { _EnsureControlKey(e) })
    window.addEventListener('mousemove', (Obj) => {
         
        if (Obj.clientY <= 250 && camera.rotation.x < 360) {
            camera.rotation.x = 0.01 * Obj.clientY
        }
        camera.rotation.y = 0.01 * Obj.clientX
    })

    // setInterval(() => {

    // }, 1);

}

// Executing
export default Main