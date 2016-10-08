var Colors =
{
    darkBrown: (35, 25, 15),
    brown: (165, 42, 42),
    red: (247, 44, 37),
    yellow: (249, 199, 100),
    blue: (169, 229, 187),
    white: (253, 250, 212),
    pink: (186, 85, 211),
};

// ThreeJS setup variables
 var scene, camera, fieldOfView, aspectRation, nearPlane, farPlane, 
     renderer, container;

// Screen and mouse 
var HEIGHT, WIDTH,
    mousePos = { x: 0, y: 0 };
    
// Initialize threejs, screen and mouse events
function createScene()
{
    // Get height and width of screen to set up aspect ration of camera
    // and size of renderer
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    // Create the scene
    scene = new THREE.Scene();
    // camera
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
        );
    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
    // set position of camera
    camera.position.x = 0;
    camera.position.y = 200;
    camera.position.z = 100;
    // create the renderer
    renderer = new THREE.WebGLRenderer({
    // allow transparency to show background
    alpha: true,
    // use anti-aliasing... not optimal for performance
    // but we are keeping a low poly count
    antialias: true
    });
    // Define the size of the renderer
    renderer.setSize(WIDTH, HEIGHT);
    // Enable shadow rendering
    renderer.shadowMap.enabled = true;
    // Add DOM element of the renderer to the element
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);
    // if User resizes screen
    window.addEventListener('resize', handleWindowResize, false);
}

// Handle screen events
function handleWindowResize()
{
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

// Let there be lights
var ambientLight, hemisphereLight, shadowLight;

function createLights()
{
// hemisphere light is gradient colored, sky - ground - intensity
hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x2310f, .9);

// directional light
shadowLight = new THREE.DirectionalLight(0xffffff, .9);

// set direction of light
shadowLight.position.set(150, 350, 350);

// allow shadow casting
shadowLight.castShadow = true;

// define the visible area of projected shadow
shadowLight.shadow.camera.left = -400;
shadowLight.shadow.camera.right = 400;
shadowLight.shadow.camera.top = 400;
shadowLight.shadow.camera.bottom = -400;
shadowLight.shadow.camera.near = 1;
shadowLight.shadow.camera.far = 1000;

// define resolution of the shadow, higher = more performance cost
shadowLight.shadow.mapSize.width = 2048;
shadowLight.shadow.mapSize.height = 2048;

// add lights to scene to activate them
scene.add(hemisphereLight);
scene.add(shadowLight);
}

// Let there be a vehicle
// note: we can upload external 3D models
var Rocket = function()
{
    this.mesh = new THREE.Object3D();
    this.mehs.name = "rocket";
    // create fuselage
    var geomFuselage = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
    var matFuselage = new THREE.MeshPhongMaterial({color: Colors.red, shading: THREE.FlatShading});
    var fuselage = new THREE.Mesh(geomFuselage, matFuselage);
    fuselage.castShadow = true;
    fuselage.receiveShadow = true;
    this.mesh.add(fuselage);

    // create Boosters
    var geomBoosters = new THREE.BoxGeometry(20, 55, 55, 1, 1, 1);
    var matBoosters = new THREE.MeshPhongMaterial({color: Colors.white, shading: THREE.FlatShading});
    var boosters = new THREE.Mesh(geomBoosters, matBoosters);
    boosters.position.x = -40;
    boosters.castShadow = true;
    boosters.receiveShadow = true;
    this.mesh.add(boosters);

    // create tail fins
    var geomTailFin = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
    var matTailFin = new THREE.MeshPhongMaterial({color: Colors.red, shading: THREE.FlatShading});
    var tailFinTop = new THREE.Mesh(geomTailFin, matTailFin);
    var tailFinBot = new THREE.Mesh(geomTailFin, matTailFin);
    tailFinTop.position.set(-40, 40, 0);
    tailfinTop.castShadow = true;
    tailFinTop.receiveShadow = true;

    tailFinBot.position.set(-40, -40, 0);
    tailfinBot.castShadow = true;
    tailFinBot.receiveShadow = true;
    this.mesh.add(tailFinTop);
    this.mesh.add(tailFinTop);

    // side tail fins (turns out we can pass the mesh through the fuselage no problem)
    // could do this for top and bottom tail fins as well
    var geomTailFinSides = new THREE.BoxGeometry(15, 5, 110, 1, 1, 1);
    var matTailFinSides = new THREE.MeshPhonMaterial({color: Colors.red, shading: THREE.FlatShading});
    var tailFinSides = new THREE.Mesh(geomTailFinSides, matTailFin);
    tailfinSides.position.set(-40, 0, 0);
    

    // antennae base thing idk
    var geomAntennae = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
    var matAntenae = new THREE.MeshPhongMaterial({color: Colors.brown, shading: THREE.FlatShading});
    this.antennae = new THREE.Mesh(geomAntennae, matAntennae);
    this.antennae.castShadow = true;
    this.antennae.receiveShadow = true;

    // antennae, probably replace with something more like a payload
    var geomTip = new THREE.BoxGeometry(50, 2, 2, 1, 1, 1);
    var matTip = new THREE.MeshPhongMaterial({color: Colors.darkBrown, shading: THREE.FlatShading});

    var comArray = new THREE.mesh(geomTip, geomMat);
    comArray.position.set(8, 0, 0);
    comArray.castShadow = true;
    comArray.receiveShadow = true;
    this.antennae.add(comArray);
    this.antennae.position.set(50, 0, 0);
    this.mesh.add(this.comArray);
};

// Let there be a place for the vehicle
Sky = function()
{
    // create empty container
    this.mesh = new THREE.Object3D();

    // choose a number of clouds to be scattered in teh sky
    this.nClouds = 20;

    // distribute clouds according to uniform angles
    var stepAngle = Math.PI * 2 / this.nClouds;

    // create the clouds
    for(var i = 0; i < this.nClouds; i++)
    {
        var c = new Cloud();
        
        // set the rotation and position of each cloud
        var a = stepAngle * i;
        var h = 750 + Math.random() * 200;

        // convert angle,distance to x,y values
        c.mesh.position.y = Math.sin(a) * h;
        c.mesh.position.x = Math.cos(a) * h;

        // rotate the cloud according to its position
        c.mesh.rotation.z = a + Math.PI / 2;

        // position clouds at random depths within the scene
        c.mesh.position.z = -400 - Math.random() * 400;

        // we also set random scale for each cloud
        // note: all of these randoms, PI's, and divisions could be optimized
        var s = 1 + Math.random() * 2;
        c.mesh.scale.set(s, s, s);

        // do not forget to add the mesh of each cloud in the scene
        this.mesh.add(c.mesh);
    }
}

// Let life come from the sea
Sea = function()
{
    // create geometry
    var geometry = new THREE.CylinderGeometry(600, 600, 800, 40, 10);

    // rotate the geometry on teh x axis
    geometry.applyMatrix(new THREE.Matrix4().makeRotation(-Math.PI/2));

    // create material
    var material = new THREE.MeshPhongMaterial(
    {
        color: Colors.blue,
        transparent:true,
        opacit:.6,
        shading:THREE.FlatShading,
    });

    // create a mesh for the object
    this.mesh = new THREE.Mesh(geometry, material);

    // allow sea to receive shadows
    this.mesh.receiveShadow = true;
}

// Let the sea fill the sky
Cloud = function()
{
    // create empty container to hold the different parts of the cloud
    this.mesh = new THREE.Object3D();

    // create a cube geometry to be duplicated
    var geometry = new THREE.BoxGeometry(20, 20, 20);

    // create a material
    var mat = new THREE.MeshPhongMaterial(
        {
        color:Colors.white,
        });

    // duplicate the geometry a random number of times
    var nBlocs = 3 + Math.floor(Math.random() * 3);
    for(var i = 0; i < nBlocs; i++)
    {
        var m = new THREE.mesh(geometry, material);
        // set position and rotation of each cube randomly
        m.position.x = i*15;
        m.position.y = Math.random() * 10;
        m.position.z = Math.random() * 10;
        m.rotation.z = Math.random() * Math.PI * 2;
        m.rotation.y = Math.random() * Math.PI * 2;

        // set the size of the cube randomly
        var s = .1 + Math.random() * .9;
        m.scale.set(s, s, s);

        // allow each cube to cast and to receive shadows
        m.castShadow = true;
        m.receiveShadow = true;

        // add the cobe to the container
        this.mesh.add(m);
    }
}

// instantiate teh models
var sea;
var rocket;

// call our mesh constructors
function createRocket()
{
    rocket = new Rocket();
    rocket.mesh.scale.set(.25, .25, .25);
    rocket.mesh.position.y = 100;
    scene.add(rocket.mesh);
}

function createSea()
{
    sea = new Sea();

    // push it towards bottom of screen
    sea.mesh.position.y = -600;

    // add mesh to scene
    scene.add(sea.mesh);
}

function createSky()
{
    sky = new Sky();
    sky.mesh.position.y = -600;
    scene.add(sky.mesh);
}

function loop()
{
    // TODO: create rocket thrust effect
     updateRocket();
    // rotate some meshes        
    sea.mesh.rotation.z += .005;
    sky.mesh.rotation.z += 0.1;
   
    // render the scene
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}
function updateRocket()
{
    // normalize rocket position, play with these values
    var targetX = normalize(mousePos.x, -1, 1, -100, 100);
    var targetY = normalize(mousePos.y, -1, 1, 25, 175);
    
    // update rocket's position
    rocket.mesh.position.y = targetY;
    rocket.mesh.position.x = targetX;
    // TODO: thruster animation goes here
}

function normalize(v, vmin, vmax, tmin, tmax)
{
    var nv = Math.max(Math.min(v, vmax), vmin);
    var dv = vmax - vmin;
    var pc = (nv-vmin)/dv;
    var dt = tmax-tmin;
    var tv = tmin + (pc*dt);

    return tv;
}

function init(event)
{
    // add listener
    document.addEventListener('mousemove', handleMouseMove, false);
    createScene();
    createLights();
    // add objects
    createRocket();
    createSea();
    createSky();
    // game loop
    loop();
}

// Handle mouse events
var mousePos = { x: 0, y: 0 };

function handleMouseMove(event)
{
    // normalize mouse input
    var mouseX = -1 + (event.clientX / WIDTH) * 2;
    // inverse for vertical axis
    var mouseY = 1 - (event.clientY / HEIGHT) * 2;
    mousePos = {x: mouseX, y: mouseY};
}

window.addEventListener('load', init, false);