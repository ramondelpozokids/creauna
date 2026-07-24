/**
 * Bicicleta futurista procedural — silueta LEGIBLE (ruedas, cuadro, sillín, manillar).
 * Geometría inventada CREAUNA. Sin assets externos.
 */
import * as THREE from 'three';

export function createBike(options = {}) {
  // Titanio claro por defecto: se lee sobre fondo negro
  const color = new THREE.Color(options.color || '#c5ccd6');
  const accent = new THREE.Color(options.accent || '#3aa0ff');
  const group = new THREE.Group();
  group.name = 'vx-bike';

  const frameMat = new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.95,
    roughness: 0.18,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: accent,
    metalness: 0.35,
    roughness: 0.15,
    emissive: accent,
    emissiveIntensity: 1.35,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: '#2a313c',
    metalness: 0.7,
    roughness: 0.32,
  });
  const tireMat = new THREE.MeshStandardMaterial({
    color: '#0d1016',
    metalness: 0.05,
    roughness: 0.88,
  });
  const rimMat = new THREE.MeshStandardMaterial({
    color: '#f4f7fb',
    metalness: 0.98,
    roughness: 0.12,
  });

  const parts = {
    frame: new THREE.Group(),
    wheels: new THREE.Group(),
    motor: new THREE.Group(),
    battery: new THREE.Group(),
    cockpit: new THREE.Group(),
    sensors: new THREE.Group(),
  };

  // --- Geometría tipo diamante legible (vista lateral, avance +X) ---
  // Ejes: delantera (-1.2), trasera (+1.15), BB (0.05)
  const R = 0.58; // radio rueda
  const front = new THREE.Vector3(-1.2, 0, 0);
  const rear = new THREE.Vector3(1.15, 0, 0);
  const bb = new THREE.Vector3(0.08, 0, 0);
  const head = new THREE.Vector3(-0.72, 0.78, 0);
  const seat = new THREE.Vector3(0.42, 0.92, 0);
  const saddlePos = new THREE.Vector3(0.48, 1.12, 0);

  // Tubos gruesos para leer la silueta
  const T = 0.055;
  parts.frame.add(makeTube(front.clone().setY(0.02), head, T * 0.85, frameMat)); // horquilla/steerer visual
  parts.frame.add(makeTube(head, seat, T, frameMat)); // top tube
  parts.frame.add(makeTube(head, bb, T * 1.15, frameMat)); // down tube (grueso = batería)
  parts.frame.add(makeTube(seat, bb, T, frameMat)); // seat tube
  parts.frame.add(makeTube(bb, rear.clone().setY(0.02), T * 0.9, frameMat)); // chainstay
  parts.frame.add(makeTube(seat, rear.clone().setY(0.02), T * 0.75, frameMat)); // seatstay

  // Horquilla delantera (dos patas)
  parts.frame.add(makeTube(head, new THREE.Vector3(front.x, 0.05, 0.09), 0.04, frameMat));
  parts.frame.add(makeTube(head, new THREE.Vector3(front.x, 0.05, -0.09), 0.04, frameMat));

  // Plataforma aero en down-tube (aspecto e-bike)
  const aero = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 0.14, 0.12),
    frameMat
  );
  aero.position.set(-0.28, 0.38, 0);
  aero.rotation.z = -0.72;
  parts.frame.add(aero);

  // Ruedas completas y claras
  const wheelF = makeWheel(R, tireMat, rimMat, accentMat, darkMat);
  wheelF.position.copy(front);
  const wheelR = makeWheel(R, tireMat, rimMat, accentMat, darkMat);
  wheelR.position.copy(rear);
  parts.wheels.add(wheelF, wheelR);

  // Motor buje trasero (visible, brillante)
  const motorBody = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.14, 32), accentMat);
  motorBody.rotation.z = Math.PI / 2;
  motorBody.position.copy(rear);
  parts.motor.add(motorBody);
  const motorCapL = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.04, 24), darkMat);
  motorCapL.rotation.z = Math.PI / 2;
  motorCapL.position.set(rear.x, 0, 0.1);
  const motorCapR = motorCapL.clone();
  motorCapR.position.z = -0.1;
  parts.motor.add(motorCapL, motorCapR);
  const motorHalo = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.018, 12, 48), accentMat);
  motorHalo.rotation.y = Math.PI / 2;
  motorHalo.position.copy(rear);
  parts.motor.add(motorHalo);

  // Batería integrada con franja LED
  const bat = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.11, 0.09), darkMat);
  bat.position.set(-0.28, 0.4, 0);
  bat.rotation.z = -0.72;
  parts.battery.add(bat);
  const batLed = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.025, 0.04), accentMat);
  batLed.position.set(-0.28, 0.46, 0.02);
  batLed.rotation.z = -0.72;
  parts.battery.add(batLed);

  // Pedalier + bielas + pedales (clave para leer “bici”)
  const crank = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.06, 24), darkMat);
  crank.rotation.z = Math.PI / 2;
  crank.position.copy(bb);
  parts.cockpit.add(crank);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.018, 10, 40), accentMat);
  ring.rotation.y = Math.PI / 2;
  ring.position.copy(bb);
  parts.cockpit.add(ring);
  const arm1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.28, 0.03), darkMat);
  arm1.position.set(bb.x, 0.12, 0.06);
  const arm2 = arm1.clone();
  arm2.position.set(bb.x, -0.12, -0.06);
  parts.cockpit.add(arm1, arm2);
  const ped1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.08), rimMat);
  ped1.position.set(bb.x, 0.24, 0.1);
  const ped2 = ped1.clone();
  ped2.position.set(bb.x, -0.24, -0.1);
  parts.cockpit.add(ped1, ped2);

  // Sillín
  const seatPost = makeTube(seat, saddlePos, 0.032, frameMat);
  parts.cockpit.add(seatPost);
  const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.05, 0.12), darkMat);
  saddle.position.copy(saddlePos);
  const saddleNose = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.04, 0.07), darkMat);
  saddleNose.position.set(saddlePos.x - 0.14, saddlePos.y, 0);
  parts.cockpit.add(saddle, saddleNose);

  // Manillar + potencia + grips
  const stem = makeTube(head, new THREE.Vector3(-0.88, 0.98, 0), 0.028, frameMat);
  parts.cockpit.add(stem);
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.72, 14), darkMat);
  bar.rotation.x = Math.PI / 2;
  bar.position.set(-0.92, 1.0, 0);
  parts.cockpit.add(bar);
  const gripL = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.026, 0.12, 12), accentMat);
  gripL.rotation.x = Math.PI / 2;
  gripL.position.set(-0.92, 1.0, 0.3);
  const gripR = gripL.clone();
  gripR.position.z = -0.3;
  parts.cockpit.add(gripL, gripR);

  // Faro delantero + nodos sensores
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), accentMat);
  lamp.position.set(-0.95, 0.72, 0);
  parts.sensors.add(lamp);
  const lampCone = new THREE.Mesh(
    new THREE.ConeGeometry(0.04, 0.08, 12),
    new THREE.MeshStandardMaterial({
      color: accent,
      emissive: accent,
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0.7,
    })
  );
  lampCone.rotation.z = Math.PI / 2;
  lampCone.position.set(-1.05, 0.72, 0);
  parts.sensors.add(lampCone);

  [
    [front.x, 0.12, 0.14],
    [rear.x, 0.12, -0.14],
    [seat.x, seat.y, 0.08],
    [0.2, 0.35, 0.1],
  ].forEach((n) => {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 12), accentMat);
    s.position.set(...n);
    parts.sensors.add(s);
  });

  Object.values(parts).forEach((p) => group.add(p));

  // Eleva el grupo para que el eje de rueda quede a y=0 y la bici “flote” centrada
  group.position.y = R;

  group.userData.parts = parts;
  group.userData.frameMat = frameMat;
  group.userData.accentMat = accentMat;
  group.userData.wheels = [wheelF, wheelR];
  group.userData.cranks = [arm1, arm2, ped1, ped2, ring];
  group.rotation.y = Math.PI * 0.22; // tres cuartos — se lee de inmediato como bici
  group.rotation.x = 0.08;
  return group;
}

function makeTube(a, b, radius, material) {
  const start = a.isVector3 ? a : new THREE.Vector3(...a);
  const end = b.isVector3 ? b : new THREE.Vector3(...b);
  const dir = new THREE.Vector3().subVectors(end, start);
  const len = dir.length();
  if (len < 0.001) return new THREE.Mesh(new THREE.SphereGeometry(radius), material);
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const geom = new THREE.CylinderGeometry(radius, radius, len, 14);
  const mesh = new THREE.Mesh(geom, material);
  mesh.position.copy(mid);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  return mesh;
}

function makeWheel(radius, tireMat, rimMat, accentMat, hubMat) {
  const g = new THREE.Group();
  // Neumático grueso
  const tire = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.07, 14, 56), tireMat);
  tire.rotation.y = Math.PI / 2;
  g.add(tire);
  // Llanta brillante
  const rim = new THREE.Mesh(new THREE.TorusGeometry(radius - 0.05, 0.022, 10, 56), rimMat);
  rim.rotation.y = Math.PI / 2;
  g.add(rim);
  // Aro LED interior
  const glow = new THREE.Mesh(new THREE.TorusGeometry(radius - 0.12, 0.012, 8, 48), accentMat);
  glow.rotation.y = Math.PI / 2;
  g.add(glow);
  // Disco / buje
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.03, 28), hubMat);
  disc.rotation.z = Math.PI / 2;
  g.add(disc);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 16), accentMat);
  hub.rotation.z = Math.PI / 2;
  g.add(hub);
  // Radios en el plano de la rueda (YZ)
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, radius - 0.1, 5), rimMat);
    spoke.position.set(0, Math.cos(a) * ((radius - 0.1) / 2), Math.sin(a) * ((radius - 0.1) / 2));
    spoke.rotation.x = a;
    g.add(spoke);
  }
  return g;
}

export function setExplode(bike, t) {
  const parts = bike.userData.parts;
  if (!parts) return;
  const ease = t * t * (3 - 2 * t);
  parts.frame.position.set(0, ease * 0.2, 0);
  parts.wheels.position.set(ease * 0.65, -ease * 0.05, ease * 0.25);
  parts.motor.position.set(ease * 1.0, ease * 0.4, -ease * 0.45);
  parts.battery.position.set(-ease * 0.8, ease * 0.6, ease * 0.4);
  parts.cockpit.position.set(0, ease * 0.95, -ease * 0.2);
  parts.sensors.position.set(ease * 0.25, ease * 0.5, ease * 0.75);
  parts.wheels.rotation.z = ease * 0.35;
  parts.motor.rotation.y = ease * 1.1;
}

export function setBikeColor(bike, hex) {
  if (bike.userData.frameMat) bike.userData.frameMat.color.set(hex);
}

export function setAccent(bike, hex) {
  if (bike.userData.accentMat) {
    bike.userData.accentMat.color.set(hex);
    bike.userData.accentMat.emissive.set(hex);
  }
}

export function spinWheels(bike, dt) {
  const wheels = bike.userData.wheels || [];
  for (const w of wheels) w.rotation.x += dt * 2.2;
  const cranks = bike.userData.cranks || [];
  for (const c of cranks) {
    if (c.isMesh && c.geometry?.type === 'BoxGeometry') c.rotation.z += dt * 2.2;
  }
}
