
// // ---set up basique
// let font; 
// let msg = "HELLO"; 
// let fontPath; let size = 200;
// let geom;
// let points = [];
// let size = 200;
// let extrude = 5;
// function setup() {
// async function setup() {
//   // ajout text to 3d
//   font = await loadFont("Fonts/SpaceMono-Bold.ttf");
//   textSize(size);
//   geom = font.textToModel(msg, 0, 0, { extrude });
//   geom.clearColors();
//   geom.normalize();
//
//     fontPath = font.getPath("msg", 0, 0, size);
//
//   background(220);
//   orbitControl();
//   rotateY(-0.2);
//   rotateX(0.15);
//   fill("red");
//   noStroke();
//   model(geom);
//   describe(`3D extruded ${msg} in Space Mono, with depth ${extrude}. Drag to rotate.`);
//       );

//     } else if (command == "Q") {
//       quadraticVertex (points[i].x1, points[i].y1,
//         points[i].x, points[i].y
//       );

//     } else if (command == "Z"){
//       endShape (CLOSE);
//     }
//   }
//   }

// vertext en rotation
// let font;
// let points = []; let msg = "hello!";
// let size = 300;
// let r = 15; let angle = 0; let t = 0;

// function preload() {
//   font = loadFont("Fonts/SpaceMono-Bold.ttf");
// }
  // font = await loadFont("Fonts/SpaceMono-Bold.ttf");
  // textSize(size);
  // geom = font.textToModel(msg, 0, 0, { extrude });
  // geom.clearColors();
  // geom.normalize();
//     simplifyThreshold: 0.0
//   });
//   angleMode(DEGREES);
// }

// function draw() {
//   background(255, 93, 100);
//   stroke(255);
//   let x = r*cos(angle);
//   let y = r*sin(angle);
//   translate(20, 300);
//   for (let i=0; i<points.length; i++) {
//     line(points[i].x, points[i].y, points[i].x + x, points[i].y + y);
//   }
  
//   fill(255, 100);
//   textSize(size);
// let fontSize = 200;
// let extrude = 5;
//   text(msg, x, y);
  
//   let increment = 2*sin(t);
//   t++;
//   angle += increment;
  
// }



// let font;
// let geom;
// async function setup() {
//   createCanvas(200, 200, WEBGL);
//   font = await loadFont("Fonts/SpaceMono-Bold.ttf");

//   // Alternative fonts:
//   // Anton: 'https://fonts.gstatic.com/s/anton/v25/1Ptgg87LROyAm0K08i4gS7lu.ttf'
//   // Montserrat: 'https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-Y3tcoqK5.ttf'
//   // Source Serif: 'https://fonts.gstatic.com/s/sourceserif4/v8/vEFy2_tTDB4M7-auWDN0ahZJW3IX2ih5nk3AucvUHf6OAVIJmeUDygwjihdqrhxXD-wGvjU.ttf'

//   // Using Source Serif for this example:
//   // font = await loadFont('https://fonts.gstatic.com/s/sourceserif4/v8/vEFy2_tTDB4M7-auWDN0ahZJW3IX2ih5nk3AucvUHf6OAVIJmeUDygwjihdqrhxXD-wGvjU.ttf');

//   geom = font.textToModel("Hello", 50, 0, { sampleFactor: 2, extrude: 5 });
//   geom.clearColors();
//   geom.normalize();
// }

// function draw() {
//   background(255);
//   orbitControl();
//   fill("red");
//   strokeWeight(4);
//   scale(min(width, height) / 300);
//   model(geom);
//   describe('3D red extruded "Hello" in Source Serif on white, rotatable via mouse.');
// }


//----set up upload font 
//    let loadedFont = null;
//     let currentLetter = "A";
//     let currentSize = 300;

// ajout text to 3d
// let geom;







//     // --- Gestion de l'upload ---
//     document.getElementById('fontUpload').addEventListener('change', (e) => {
//       const file = e.target.files[0];
//       if (!file) return;

//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const buffer = event.target.result;
//         try {
//           loadedFont = opentype.parse(buffer);
//           console.log("Police chargée :", loadedFont.names.fontFamily.en);
//         } catch (err) {
//           console.error("Erreur de parsing :", err);
//           alert("Impossible de parser cette police. Format supporté : .ttf, .otf");
//         }
//       };
//       reader.readAsArrayBuffer(file);
//     });

//     document.getElementById('letterInput').addEventListener('input', (e) => {
//       currentLetter = e.target.value || "A";
//     });

//     document.getElementById('sizeSlider').addEventListener('input', (e) => {
//       currentSize = parseInt(e.target.value);
//     });

//   function setup() {
//       createCanvas(windowWidth, windowHeight);
//     }

//     function draw() {
//   background(26, 26, 46);
//   if (!loadedFont) {
//     fill(255);
//     textAlign(CENTER, CENTER);
//     textSize(20);
//     text("Uploadez une police (.ttf ou .otf) pour commencer", width / 2, height / 2);
//     return;
//   }

//   const glyph = loadedFont.charToGlyph(currentLetter);
//   const path = glyph.getPath(0, 0, currentSize);

//   const bbox = path.getBoundingBox();
//   const glyphW = bbox.x2 - bbox.x1;
//   const glyphH = bbox.y2 - bbox.y1;
//   const offsetX = (width - glyphW) / 2 - bbox.x1;
//   const offsetY = (height - glyphH) / 2 - bbox.y1;

//   // Utiliser le contexte Canvas2D natif pour un rendu vectoriel correct
//   const ctx = drawingContext;
//   ctx.save();
//   ctx.translate(offsetX, offsetY);

//   ctx.beginPath();
//   for (let cmd of path.commands) {
//     switch (cmd.type) {
//       case 'M':
//         ctx.moveTo(cmd.x, cmd.y);
//         break;
//       case 'L':
//         ctx.lineTo(cmd.x, cmd.y);
//         break;
//       case 'C':
//         ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
//         break;
//       case 'Q':
//         ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
//         break;
//       case 'Z':
//         ctx.closePath();
//         break;
//     }
//   }

//   ctx.strokeStyle = 'rgb(0, 220, 255)';
//   ctx.lineWidth = 1.5;
//   ctx.stroke();

//   ctx.restore();

//   fill(150);
//   noStroke();
//   textAlign(LEFT, TOP);
//   textSize(12);
//   text(loadedFont.names.fontFamily.en || "Police inconnue", 10, 10);
// } --------

    // function draw() {
    //   background(26, 26, 46);

    //   if (!loadedFont) {
    //     fill(255);
    //     textAlign(CENTER, CENTER);
    //     textSize(20);
    //     text("Uploadez une police (.ttf ou .otf) pour commencer", width / 2, height / 2);
    //     return;
    //   }
    // }
    //  // Dessiner le path en vecteur
    //   push();
    //   translate(offsetX, offsetY);

    //   noFill();
    //   stroke(0, 220, 255);
    //   strokeWeight(1.5);

    //   // Parcourir les commandes du path (M, L, C, Q, Z)
    //   beginShape();
    //   for (let cmd of path.commands) {
    //     switch (cmd.type) {
    //       case 'M':
    //         vertex(cmd.x, cmd.y);
    //         break;
    //       case 'L':
    //         vertex(cmd.x, cmd.y);
    //         break;
    //       case 'C':
    //         bezierVertex(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
    //         break;
    //       case 'Q':
    //         // p5 n'a pas de quadraticCurveTo natif → conversion en cubic
    //         const cx = cmd.x1, cy = cmd.y1;
    //         const px = cmd.x, py = cmd.y;
    //         // on approxime avec un bezier cubique
    //         bezierVertex(cx, cy, cx, cy, px, py);
    //         break;
    //       case 'Z':
    //         endShape(CLOSE);
    //         beginShape();
    //         break;
    //     }
    //   }
    //   endShape(CLOSE);

    //   pop();

    //   // Afficher le nom de la police
    //   fill(150);
    //   noStroke();
    //   textAlign(LEFT, TOP);
    //   textSize(12);
    //   text(loadedFont.names.fontFamily.en || "Police inconnue", 10, 10);







let font;
let geom;
let msg = "HELLO";
let fontSize = 200;
let extrude = 50;

async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  font = await loadFont("Fonts/SpaceMono-Bold.ttf");
  textSize(fontSize);
  geom = font.textToModel(msg, 0, 0, { extrude });
  geom.clearColors();
  geom.normalize();

  const glyphButtons = document.getElementById("glyph-buttons");
  for (const glyph of "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+!?=") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "glyph-picker__button";
    button.textContent = glyph;
    button.setAttribute("aria-label", `Show ${glyph}`);
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => selectGlyph(glyph, button));
    glyphButtons.appendChild(button);
  }

  document.getElementById("export-svg").addEventListener("click", exportSvg);
  document.getElementById("export-png").addEventListener("click", () => saveCanvas(exportBaseName(), "png"));
  document.getElementById("export-stl").addEventListener("click", () => geom.saveStl(`${exportBaseName()}.stl`));
  document.getElementById("export-obj").addEventListener("click", () => geom.saveObj(`${exportBaseName()}.obj`));
}

function draw() {
  background(220);
  orbitControl();
  rotateY(-0.2);
  rotateX(0.15);
  fill("red");
  noStroke();
  model(geom);
  describe(`3D extruded ${msg} in Space Mono, depth ${extrude}. Drag to rotate.`);
}

function selectGlyph(glyph, selectedButton) {
  msg = glyph;
  const previousGeometry = geom;
  geom = font.textToModel(msg, 0, 0, { extrude });
  geom.clearColors();
  geom.normalize();
  if (previousGeometry) freeGeometry(previousGeometry);

  document.querySelectorAll(".glyph-picker__button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button === selectedButton));
  });
}

function exportSvg() {
  const commands = font.textToPaths(msg, 0, 0);
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const [, ...coordinates] of commands) {
    for (let i = 0; i < coordinates.length; i += 2) {
      minX = Math.min(minX, coordinates[i]);
      minY = Math.min(minY, coordinates[i + 1]);
      maxX = Math.max(maxX, coordinates[i]);
      maxY = Math.max(maxY, coordinates[i + 1]);
    }
  }

  if (!Number.isFinite(minX)) return;

  const padding = 2;
  const pathData = commands
    .map(([command, ...coordinates]) => `${command}${coordinates.length ? ` ${coordinates.join(" ")}` : ""}`)
    .join(" ");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}"><path d="${pathData}" fill="#ed1c24"/></svg>`;
  downloadBlob(`${exportBaseName()}.svg`, new Blob([svg], { type: "image/svg+xml" }));
}

function exportBaseName() {
  return /^[a-z0-9]+$/i.test(msg)
    ? msg.toLowerCase()
    : `glyph-${msg.codePointAt(0).toString(16)}`;
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// function drawText(){
//   let value = textInput.value
//   fill(handleTextColor());
//   textAlign(CENTER, CENTER);
//   textSize(handleFontSizeSlider());
//   text(value, width / 2, height / 2);
// }
// function handleTextInput(){
//   // handleFontSizeSlider();
//    //.value acceder a n'importe quel input et lire l'attribut de html
//   let textValue = textInput.value
//   textAlign(CENTER,CENTER);
//   text(textValue, width/2, height/2);
// }
