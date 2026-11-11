
// ---set up basique
let font; 
let msg = "HELLO"; 
let fontPath; let size = 200;
let points = [];

// set up opentype load

function setup() {
  // BASE
  createCanvas(windowWidth, windowHeight);
  // ajout text to 3d
    // createCanvas(200, 200, WEBGL);
      // font = await 
      // loadFont('https://fonts.gstatic.com/s/anton/v25/1Ptgg87LROyAm0K08i4gS7lu.ttf');


  opentype.load("Fonts/SpaceMono-Bold.ttf", function(err, f) {
    if (err) {
      console.log(err);
    } else {
      font = f;
    }
    
    fontPath = font.getPath("msg", 0, 0, size);
  
});
// ajout text to 3d
// geom = font.textToModel("Hello", 50, 0, { sampleFactor: 2 });
//   geom.clearColors();
//   geom.normalize();
}




function draw() {
  background("royalblue");
  noFill();
  stroke ("white");
  strokeWeight (1.5);
  translate(20, 200);

  //ajout text to 3d
  // background(255);
  // orbitControl();
  // fill("white");
  // strokeWeight(4);
  // scale(min(width, height) / 300);
  // model(geom);

  // points pour crée les lines
  if (!fontPath) return;
  points = fontPath.commands;
  print (points);
  // move to, line to, curve to, quad to, close
  for (let i=0; i<points.length; i++) {
    let command = points[i].type;
    if(command == "M"){
      beginShape ();
      vertex (points[i].x, points[i].y
      );

    } else if (command == "L") {
      vertex (points[i].x, points[i].y
      );

    } else if (command == "C") {
      bezierVertex (points[i].x1, points[i].y1, 
        points[i].x2, points[i].y2,
        points[i].x, points[i].y
      );

    } else if (command == "Q") {
      quadraticVertex (points[i].x1, points[i].y1,
        points[i].x, points[i].y
      );

    } else if (command == "Z"){
      endShape (CLOSE);
    }
  }
  }

// // vertext en rotation
// let font;
// let points = []; let msg = "hello!";
// let size = 300;
// let r = 15; let angle = 0; let t = 0;

// function preload() {
//   font = loadFont("Fonts/SpaceMono-Bold.ttf");
// }

// function setup() {
//   createCanvas(800, 400);
//   points = font.textToPoints(msg, 0, 0, size, {
//     sampleFactor: 0.1,
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
//   textFont(font);
//   text(msg, x, y);
  
//   let increment = 2*sin(t);
//   t++;
//   angle += increment;
  
// }



//let font;
// let geom;

// async function setup() {
//   createCanvas(200, 200, WEBGL);

//   // Alternative fonts:
//   // Anton: 'https://fonts.gstatic.com/s/anton/v25/1Ptgg87LROyAm0K08i4gS7lu.ttf'
//   // Montserrat: 'https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-Y3tcoqK5.ttf'
//   // Source Serif: 'https://fonts.gstatic.com/s/sourceserif4/v8/vEFy2_tTDB4M7-auWDN0ahZJW3IX2ih5nk3AucvUHf6OAVIJmeUDygwjihdqrhxXD-wGvjU.ttf'

//   // Using Source Serif for this example:
//   font = await loadFont('https://fonts.gstatic.com/s/sourceserif4/v8/vEFy2_tTDB4M7-auWDN0ahZJW3IX2ih5nk3AucvUHf6OAVIJmeUDygwjihdqrhxXD-wGvjU.ttf');

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


// //----set up upload font 
// //    let loadedFont = null;
// //     let currentLetter = "A";
// //     let currentSize = 300;

// // ajout text to 3d
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







// let font;
// let msg = "HELLO";
// let fontPath;
// let size = 200
// let points = [];

// function setup() {
//   // createCanvas(windowWidth, windowHeight);
//   createCanvas(800, 400);
  

//   opentype.load("FONTS/SpaceMono-Bold.ttf", function(err, f){
//     if (err) {
//       console.log(err);
//     } else {
//       font = f;
//     }

//     fontPath = font.getPath(msg, 0, 0, size);

//   } );
//   // randomBackground();

// }

// function draw() {
// // background("royalblue");
// background(220);
// nofill();
// translate(20, 200);

// points = fontPath.commands;
// for (let i=0; i<points.length; i++) {
//   let command = points[i].type;
//   if (command == "M") {
//    beginShape();
//    vertex(points[i].x, points [i].y);
//   }else if (command == "L") {
//     vertex(points[i].x, points [i].y);
//   } else if (command == "C") {
//     bezierVertex(points[i].x1, points [i].y1, 
//       points[i].x2, points [i].y2, 
//       points[i].x, points [i].y);
//   }else if (command == "Q") {
//    quadraticVertex(points[i].x1, points [i].y1,
//     points[i].x, points [i].y,
//    );
//   }else if (command == "Z") {
//     endShape();
//   }
  
    
// } 

// }

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
