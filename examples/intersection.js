var tolerance = 0.001;

// vars: planeGeom, plane (mesh), objGeom/obj

//pressMe.addEventListener("click", drawIntersectionPoints, false);

var pointsOfIntersection = new THREE.Geometry();

var a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
var planePointA = new THREE.Vector3(), planePointB = new THREE.Vector3(), planePointC = new THREE.Vector3();
var lineAB = new THREE.Line3(), lineBC = new THREE.Line3(), lineCA = new THREE.Line3();

var pointOfIntersection = new THREE.Vector3();

function drawIntersectionPoints(plane, obj, scene) {
	var mathPlane = new THREE.Plane();
	plane.localToWorld(planePointA.copy(plane.geometry.vertices[plane.geometry.faces[0].a]));
	plane.localToWorld(planePointB.copy(plane.geometry.vertices[plane.geometry.faces[0].b]));
	plane.localToWorld(planePointC.copy(plane.geometry.vertices[plane.geometry.faces[0].c]));
	mathPlane.setFromCoplanarPoints(planePointA, planePointB, planePointC);

	obj.geometry.faces.forEach(function (face, idx) {
		obj.localToWorld(a.copy(obj.geometry.vertices[face.a]));
		obj.localToWorld(b.copy(obj.geometry.vertices[face.b]));
		obj.localToWorld(c.copy(obj.geometry.vertices[face.c]));
		lineAB = new THREE.Line3(a, b);
		lineBC = new THREE.Line3(b, c);
		lineCA = new THREE.Line3(c, a);
		setPointOfIntersection(lineAB, mathPlane, idx);
		setPointOfIntersection(lineBC, mathPlane, idx);
		setPointOfIntersection(lineCA, mathPlane, idx);
	});

	var pointsMaterial = new THREE.PointsMaterial({
		size: 1,
		color: 0x00ff00
	});

  var points = new THREE.Points(pointsOfIntersection, pointsMaterial);
	scene.add(points);

	//var pairs = splitPairs(pointsOfIntersection.vertices);

  //var lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  //var line = new THREE.LineSegments(pointsOfIntersection, lineMaterial);
  //scene.add(line);
/*
	var contours = getContours(pointsOfIntersection.vertices, [], true);
	console.log("contours", contours);

	contours.forEach(cntr => {
		let cntrGeom = new THREE.Geometry();
		cntrGeom.vertices = cntr;
		let contour = new THREE.Line(cntrGeom, new THREE.LineBasicMaterial({
			color: Math.random() * 0xffffff //0x777777 + 0x777777
		}));
		scene.add(contour);
	});*/
}

function setPointOfIntersection(line, plane, faceIdx) {
  pointOfIntersection = plane.intersectLine(line);
  if (pointOfIntersection) {
	let p = pointOfIntersection.clone();
	p.faceIndex = faceIdx;
	p.checked = false;
	pointsOfIntersection.vertices.push(p);
  };
}


function getContours(points, contours, firstRun) {
  console.log("firstRun:", firstRun);

  let contour = [];

  // find first line for the contour
  let firstPointIndex = 0;
  let secondPointIndex = 0;
  let firstPoint, secondPoint;
  for (let i = 0; i < points.length; i++) {
		if (points[i].checked == true) continue;
		firstPointIndex = i;
		firstPoint = points[firstPointIndex];
		firstPoint.checked = true;
		secondPointIndex = getPairIndex(firstPoint, firstPointIndex, points);
		secondPoint = points[secondPointIndex];
		secondPoint.checked = true;
		contour.push(firstPoint.clone());
		contour.push(secondPoint.clone());
		break;
  }

  contour = getContour(secondPoint, points, contour);
  contours.push(contour);
  let allChecked = 0;
  points.forEach(p => { allChecked += p.checked == true ? 1 : 0; });
  console.log("allChecked: ", allChecked == points.length);
  if (allChecked != points.length) { return getContours(points, contours, false); }
  return contours;
}

function getContour(currentPoint, points, contour) {
  let p1Index = getNearestPointIndex(currentPoint, points);
  let p1 = points[p1Index];
  p1.checked = true;
  let p2Index = getPairIndex(p1, p1Index, points);
  let p2 = points[p2Index];
  p2.checked = true;
  let isClosed = p2.equals(contour[0], tolerance);
  if (!isClosed) {
	contour.push(p2.clone());
	return getContour(p2, points, contour);
  } else {
	contour.push(contour[0].clone());
	return contour;
  }
}

function getNearestPointIndex(point, points) {
  let index = 0;
  for (let i = 0; i < points.length; i++) {
	let p = points[i];
	if (p.checked == false && p.equals(point, tolerance)) {
	  index = i;
	  break;
	}
  }
  return index;
}

function getPairIndex(point, pointIndex, points) {
  let index = 0;
  for (let i = 0; i < points.length; i++) {
	let p = points[i];
	if (i != pointIndex && p.checked == false && p.faceIndex == point.faceIndex) {
	  index = i;
	  break;
	}
  }
  return index;
}
