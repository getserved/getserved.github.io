
(function () {	
	function GLParticleSystem(count, attributes) {
		THREE.Points.call(this);
		var self = this;
		this.count = count;
		this.geometry = new THREE.BufferGeometry();
		Object.keys(attributes).forEach(function(name) {
			self.addAttribute(name, attributes[name]);
		});
	}
	GLParticleSystem.prototype = Object.create(THREE.Points.prototype);
	GLParticleSystem.prototype.constructor = GLParticleSystem;
	GLParticleSystem.prototype.addAttribute = function(name, width) {
		width = width || 1;
		var values = new Float32Array(this.count * width);
		for(var i = 0, l = values.length; i < l; i++) values[i] = 0;
		this.geometry.addAttribute(name, new THREE.BufferAttribute(values, width));
	};
	
	THREE.GLParticleSystem = GLParticleSystem;
})();

(function () {
var maxSpeed = 1;
var maxAge = 1000;
var particleCount = 10000;
var renderer, scene, camera, controls;
var particleSystem;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var camera_pivot = new THREE.Object3D()
var Y_AXIS = new THREE.Vector3( 0, 1, 0 );
var angle = 0;
var radius = 500; 

// Source: https://cdn.rawgit.com/mrdoob/three.js/r75/examples/textures/sprites/spark1.png

var texture2Url = 'data:image/png;base64,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';

var textureUrl = 
'data:image/png;base64,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';
init();
animate();

function initGeometry(geometry) {
	var attributes = geometry.attributes;
	var age = attributes.age.array;
	var customColor = attributes.customColor.array;
	var velocity = attributes.velocity.array;
	var count = age.length;
	var color = new THREE.Color();
	for (var i = 0, i3 = 0, l = count; i < l; i++, i3 += 3) {
		age[i] = Math.random()*maxAge,
		color.setHSL(Math.random(), 1.0, 0.5),
		customColor[i3+0] = color.g;
		customColor[i3+1] = color.g;
		customColor[i3+2] = color.g;
		velocity[i3+0] = (Math.random()*4-2)*maxSpeed;
		velocity[i3+1] = (Math.random()*4-1)*maxSpeed;
		velocity[i3+2] = (Math.random()*4-1)*maxSpeed;
	}
	attributes.age.needsUpdate = true;
	attributes.customColor.needsUpdate = true;
	attributes.velocity.needsUpdate = true;
}
function updateGeometry(geometry) {
	
	var age = geometry.attributes.age.array;
	var i = age.length; while(i--) {
		if(age[i]++ > maxAge) age[i] = 0;
	}
	geometry.attributes.age.needsUpdate = true;
}

function initScene() {
	camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 1, 10000);
	camera.position.z = 800;
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(WIDTH, HEIGHT);
	renderer.setClearColor(0xabcdef, 1);
	document.body.appendChild(renderer.domElement);
	window.addEventListener('resize', onWindowResize, false);
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	scene.add( camera_pivot );
	camera_pivot.add( camera );
}
function initParticleSystem() {
	particleSystem = new THREE.GLParticleSystem(particleCount, {
		age: 1,
		position: 3, // Unused
		customColor: 3,
		velocity: 3
	});
	var vertexShader =  document.getElementById('vertexshader').textContent;
	var fragmentShader = document.getElementById('fragmentshader').textContent;
	particleSystem.material = new THREE.ShaderMaterial({
		uniforms: {
			color: {type: "c", value: new THREE.Color(0xabcdef)},
			texture: {type: "t", value: new THREE.TextureLoader().load(texture2Url)}
		},
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		blending: THREE.AdditiveBlending,
		depthTest: false,
		transparent: true
	});
	scene.add(particleSystem);
	initGeometry(particleSystem.geometry);
}
function init() {
	console.clear();
	initScene();
	initParticleSystem();
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(time) {
	
	requestAnimationFrame(animate);
	updateGeometry(particleSystem.geometry);
	renderer.render(scene, camera);
	
	camera.position.set( 500, 0, 0 );
	camera.lookAt( camera_pivot.position );
	camera_pivot.rotateOnAxis( Y_AXIS, 0.001 );
}

})();