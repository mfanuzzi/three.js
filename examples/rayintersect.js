
/*function rayCollide(collisionObject, collidableMeshList) {
var collisionObjectGeo = new THREE.Geometry().fromBufferGeometry(collisionObject.geometry);
console.log(collisionObject);
console.log(collisionObjectGeo);

var originPoint = collisionObject.geometry.attributes.position.clone();
var collisionResults = [];
var hasCollision = false;

for (var vertexIndex = 0; vertexIndex < collisionObjectGeo.vertices.length; vertexIndex++) {
var localVertex = collisionObjectGeo.vertices[vertexIndex].clone();
var globalVertex = localVertex.applyMatrix4(collisionObject.matrix);
var directionVector = globalVertex.sub(collisionObject.position);

var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
collisionResults = ray.intersectObjects(collidableMeshList);

if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
hasCollision = true;
}
}

if (hasCollision === true) {
console.log(collisionResults);
}
}*/

// Gets points of collisionObject that are below y
function getPointsBelowY(collisionObject, y) {
	// It looks like (indexed?) BufferGeometry objects have point positions as attributes, so let's find out:
	// collisionObject.geometry.attributes.position
  console.log(collisionObject.geometry.attributes.position.count);

	// How much of a margin do we want?
  play = 2;

	// I guess this is neccesary to get the current data
  collisionObject.updateMatrix();

  var vecsBelow = [];
  var vec = new THREE.Vector3();
  var attribute = collisionObject.geometry.attributes.position; // we want the position data
  for (var i = 0; i < collisionObject.geometry.attributes.position.count; i++) {
		vec.fromBufferAttribute(attribute, i); // extract the x,y,z coordinates
		vec.applyMatrix4(collisionObject.matrix); // apply the mesh's matrix transform
		if (Math.abs(y - vec.y) < play) vecsBelow.push(vec.clone());
  }

  console.log(vecsBelow);

	// Reduce the resolution
  vecsBelow.forEach(function (v) {
	v.x = Math.round(v.x * 100) / 100;
	v.y = (Math.round(v.y * 100) / 100);
	v.z = Math.round(v.z * 100) / 100;
  });

	// Now sort it
  vecsBelow.sort((a, b) => b.x - a.x);
  vecsBelow.sort((a, b) => b.z - a.z);

	// Remove duplicates
  vecsBelow = vecsBelow.filter((thing, index, self) =>
	index === self.findIndex((t) => (
	  t.x === thing.x && t.z === thing.z
	))
  );

	// Sort into quadrants
  for (var i = 0; i < vecsBelow.length; i++) {
		vecsBelow[i].rad = Math.atan2(vecsBelow[i].z, vecsBelow[i].x);
  }

  vecsBelow.sort((a, b) => a.rad - b.rad);

  console.log(vecsBelow);

 // var cmeshGeometry = new THREE.ConvexBufferGeometry(vecsBelow);
 // var cmeshMaterial = new THREE.MeshLambertMaterial({
	//color: 0x00ffff,
	//opacity: 0.5,
	//transparent: true
 // });
 // var cmesh = new THREE.Mesh(cmeshGeometry, cmeshMaterial);
 // cmesh.renderOrder = 1;
 // scene.add(cmesh);


  var pointsMaterial = new THREE.PointsMaterial({
	color: 0x0080ff,
	size: 1,
	alphaTest: 0.5
  });
  var pointsGeometry = new THREE.BufferGeometry().setFromPoints(vecsBelow);
  var points = new THREE.Points(pointsGeometry, pointsMaterial);
  scene.add(points);

	// Dirty thing: turn the vecsBelow into a typed array
  var t = new Float32Array(vecsBelow.length * 3);
  for (var i = 0; i < t.length; i+=3) {
	t[i] = vecsBelow[i / 3].x;
	t[i+1] = vecsBelow[i / 3].y;
	//t[i + 1] = y;
	t[i+2] = vecsBelow[i / 3].z;
  }
	// Even dirtier, build in an extrusion
 // var t = new Float32Array(vecsBelow.length * 6);
 // for (var i = 0; i < (t.length / 2); i += 3) {
	//t[i * 2 + 0] = vecsBelow[i / 3].x;
	////t[i * 2 + 1] = y - 1;
	//t[i*2 + 1] = vecsBelow[i / 3].y;
	////t[i*2 + 1] = y + (Math.abs(y - vecsBelow[i / 3].y) * 1);
	//t[i*2 + 2] = vecsBelow[i / 3].z;

	//t[i * 2 + 3] = vecsBelow[i / 3].x;
	////t[i * 2 + 4] = y + 1;
	//t[i * 2 + 4] = vecsBelow[i / 3].y - 1;
	////t[i * 2 + 4] = y - (Math.abs(y - vecsBelow[i / 3].y) * 1);
	//t[i*2 + 5] = vecsBelow[i / 3].z;
 // }


  console.log(t);

  var pointsMaterial = new THREE.PointsMaterial({size: 1,color: 0x00ff00});

  var rgeometry = new THREE.BufferGeometry();
  rgeometry.addAttribute('position', new THREE.BufferAttribute(t, 3));
  THREE.BufferGeometryUtils.mergeVertices(rgeometry);
  var rmaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  var rmesh = new THREE.Mesh(rgeometry, rmaterial);

  //console.log(rgeometry);
 // var points = new THREE.Points(vecsBelow, pointsMaterial);
  scene.add(rmesh);

  /*for (var i = 1; i < collisionObject.geometry.attributes.position.count; i += 3) {
		var thisY = collisionObject.geometry.attributes.position[i];
	  if (thisY < y) {
		console.log(i);

		}
	}*/
  return vecsBelow;
}
