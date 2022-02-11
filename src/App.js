import * as THREE from 'three'
import Img from './Comp/Images/Img2.bmp'
import Img3 from './Comp/Images/Texture.jpg'
import CedarTexture from './Comp/Images/Img3.jpg'
import Debris from './Comp/Images/Debris.jpg'
import { ShaderMaterial } from 'three'
import *  as Physijs from 'physijs'
// import Worker from "worker-loader!./Worker";
import Sky from './Comp/Images/SkyTexture.PNG'
var Appended = false
var Incre = 1
import { Worker } from "worker-loader";

Physijs.scripts.worker = 'worker.js'
Physijs.scripts.ammo = 'ammo.js'
var PositionArray = [
    function (IncrementBy) {
        for (let i = 5; i < PositionArray.length; i++) {
            PositionArray[i].position.y += IncrementBy
        }
    }, function (DecrementBy) {
        for (let i = 5; i < PositionArray.length; i++) {
            PositionArray[i].position.y -= DecrementBy
        }
    }, function (IncrementBy) {
        for (let i = 5; i < PositionArray.length; i++) {
            PositionArray[i].position.x += IncrementBy
        }
    }, function (DecrementBy) {
        for (let i = 5; i < PositionArray.length; i++) {
            PositionArray[i].position.x -= DecrementBy
        }
    }
]

const Main = () => {


    const scene = new Physijs.Scene();

    // {
    //     scene.background = new THREE.TextureLoader().load(Sky);
    // }

    function CreateObj(Mesh, push) {
        scene.add(Mesh)
        if (push === true) {
            PositionArray.push(Mesh)
        }
    }
    // scene.setGravity(new THREE.Vector3(0, -10, 0))
    var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01)
    camera.position.z = 10;
    camera.zoom = 10
    camera.fov = 2 * Math.atan((window.innerHeight / 2) / 100) * (180 / Math.PI)
    camera.position.y = 0

    var time = 0
    var Character = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10)
    var geometry = new THREE.PlaneGeometry(1000, 1000, 20.0, 20.0)
    var sea = new THREE.PlaneBufferGeometry(1000, 1000, 150, 150)
    var geometry4 = new THREE.BoxGeometry(1, 1, 5, 10, 10, 10, 10)
    var Body = new THREE.BoxBufferGeometry(2, 2, 20, 10, 10, 10)
    var v2 = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
            time: { value: 10 },
            Smtexture: { value: new THREE.TextureLoader().load(Img3) },
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


    var material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
            time: { value: 100 },
            Smtexture: { value: new THREE.TextureLoader().load(Img) },
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

    var SeaMaterial = new ShaderMaterial({
        uniforms: {
            time: { value: 100 },
            textur: { value: new THREE.TextureLoader().load(CedarTexture) }
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
    var DebrisT = new ShaderMaterial({
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
    var mesh = new Physijs.BoxMesh(geometry, material);
    var mesh3 = new THREE.Mesh(sea, SeaMaterial)
    var Mesh = new THREE.Mesh(Body, v2)
    var StoneDebris = new THREE.Mesh(sea, DebrisT)
    var Box = new THREE.Mesh(Character, v2)
    Mesh.position.y -= 5
    mesh3.position.z += 5
    StoneDebris.position.z += 5
    var Color = new THREE.Color(255, 255, 255)
    scene.fog = new THREE.Fog(Color, 0.1, 0.5)
    Box.position.z += 5
    Box.position.y += 5.0
    CreateObj(Mesh, true)
    CreateObj(mesh, true);
    CreateObj(mesh3, true)
    CreateObj(StoneDebris, true)
    CreateObj(Box, true)
    // scene.fog = new THREE.Fog('red', 1000, 5000)
    time += 0.05
    var renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (Appended === false) {

        document.body.appendChild(renderer.domElement);

        // window.onload = () => {
        // var canvas = document.querySelector('canvas')
        // var C = canvas.getContext('2d')
        // C.fillRect(50, 50, 50, 50)
        // }
        Appended = true
        /*
        FOR DEVELOPMENT PURPOSES ONLY
        =============================
        var controls = new OrbitControls(camera, renderer.domElement)
        controls.enableZoom = true
        controls.enableRotate = true
        */
    }
    function animation() {
        // Rendering ThreeJS
        /*
        FOR DEVELOPMENT PURPOSES ONLY
        =============================
        console.log(mesh.position.y)
        console.log(camera.rotation.y + " " + camera.rotation.x)
            
        console.table(['MESH', '========', 'X: ' + mesh.position.x + ' Y: ' + mesh.position.y + ' Z: '+ mesh.position.z, 'CAMERA', '==========', 'X: ' + camera.position.x + ' Y: ' + camera.position.y + ' Z: '+ camera.position.z])
        */
        // SeaMaterial.uniforms.time.value++
        scene.simulate()
        renderer.render(scene, camera);
    }
    setInterval(() => {
        animation()
    }, 120);
    window.addEventListener(
        'resize',
        () => {
            renderer.setSize(window.innerWidth, window.innerHeight - 50);
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
        }
    )

    camera.rotation.y = -0.003076733845460768
    camera.rotation.x = 1.2432621643567174
    var PassAble = true
    window.addEventListener('keypress', (e) => {
        var key = e.key
        /* FOR DEVELOPMENT PURPOSES: 
         console.log(e)
         */
        switch (key) {
            case 'w':
                const direction = new THREE.Vector3;
                let speed = 1.0;

                function eventOrLoopOrSomething() {
                    camera.getWorldDirection(direction);

                    camera.position.addScaledVector(direction, speed);

                }

                eventOrLoopOrSomething()

                break;

            default:
                console.log('UnIdentified Control')
                break;
        }
    }
    )
    window.addEventListener('mouseover', () => {

    })
    window.addEventListener('mousemove', (Obj) => {
        if (Obj.clientY <= 250 && camera.rotation.x < 360) {
            camera.rotation.x = 0.01 * Obj.clientY
        }
        camera.rotation.y = 0.01 * Obj.clientX
    })
}

export default Main