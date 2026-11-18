
let font;
let geom;
let contours;
let bigPointContours;
let geometryBounds;
let canvasElement;
let pointM = null;
let extrusionLimit = 200;
let msg = "A";
let fontSize = 200;
let extrude = 50;
let backgroundColor = "#dcdcdc";
let lineColor = "#ff0000";
let bigPointColor = "#ff0000";
let startingPointColor = "#ff0000";
let fontLoadRequest = 0;
const rotation = { x: 8.6, y: -11.5, z: 0 };
const pointSimplifyThreshold = 0.4;

async function setup() {
  font = await loadFont("Fonts/SpaceMono-Bold.ttf");
  canvasElement = createCanvas(windowWidth, windowHeight, WEBGL).elt;
  textSize(fontSize);
  const characters = getFontCharacters(font);
  if (!characters.length) {
    throw new Error("The selected font does not contain any supported characters.");
  }
  if (!characters.includes(msg)) msg = characters[0];
  rebuildGlyph();

  canvasElement.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    const bounds = canvasElement.getBoundingClientRect();
    pointM = {
      x: (event.clientX - bounds.left) * width / bounds.width - width / 2,
      y: (event.clientY - bounds.top) * height / bounds.height - height / 2
    };
    const previousGeometry = geom;
    rebuildGlyph();
    if (previousGeometry) freeGeometry(previousGeometry);
  });

  renderGlyphButtons(characters);
  setupFontPicker();
  updateFontStatus(`Using ${getFontFamily(font)}`);

  for (const axis of ["x", "y", "z"]) {
    const slider = document.getElementById(`rotation-${axis}`);
    const value = document.getElementById(`rotation-${axis}-value`);
    slider.addEventListener("input", () => {
      rotation[axis] = Number(slider.value);
      value.value = `${rotation[axis].toFixed(1)}\u00B0`;
    });
  }

  document.getElementById("background-color").addEventListener("input", (event) => {
    backgroundColor = event.target.value;
  });
  document.getElementById("line-color").addEventListener("input", (event) => {
    lineColor = event.target.value;
  });
  document.getElementById("big-point-color").addEventListener("input", (event) => {
    bigPointColor = event.target.value;
  });
  document.getElementById("starting-point-color").addEventListener("input", (event) => {
    startingPointColor = event.target.value;
  });

  document.getElementById("export-svg").addEventListener("click", exportSvg);
  document.getElementById("export-png").addEventListener("click", () => saveCanvas(exportBaseName(), "png"));
  document.getElementById("export-stl").addEventListener("click", () => geom.saveStl(`${exportBaseName()}.stl`));
  document.getElementById("export-obj").addEventListener("click", () => geom.saveObj(`${exportBaseName()}.obj`));
}

function draw() {
  background(backgroundColor);
  push();
  rotateY(radians(rotation.y));
  rotateX(radians(rotation.x));
  rotateZ(radians(rotation.z));
  noFill();
  stroke(lineColor);
  strokeWeight(1.5);
  for (const contour of contours) {
    beginShape();
    for (const point of contour) {
      vertex(point.x, point.y, geometryBounds.maxZ);
    }
    endShape(CLOSE);
  }
  if (pointM) {
    beginShape(LINES);
    for (const contour of bigPointContours) {
      for (const contourPoint of contour) {
        vertex(pointM.x, pointM.y, geometryBounds.minZ);
        vertex(contourPoint.x, contourPoint.y, geometryBounds.maxZ);
      }
    }
    endShape();

    stroke(bigPointColor);
    strokeWeight(8);
    for (const contour of bigPointContours) {
      for (const contourPoint of contour) {
        point(contourPoint.x, contourPoint.y, geometryBounds.maxZ);
      }
    }

    stroke(startingPointColor);
    strokeWeight(5);
    point(pointM.x, pointM.y, geometryBounds.minZ);
  }
  pop();

  describe(`Wireframe outline of ${msg} in ${getFontFamily(font)}, depth ${extrude.toFixed(1)}. Right-click to set the extrusion origin.`);
}

function getFontCharacters(loadedFont) {
  const fontData = loadedFont?.data?._data;
  if (!(fontData instanceof Uint8Array)) return [];
  const buffer = fontData.buffer.slice(
    fontData.byteOffset,
    fontData.byteOffset + fontData.byteLength
  );
  const glyphSet = opentype.parse(buffer).glyphs;
  if (!glyphSet || !Number.isInteger(glyphSet.length) || typeof glyphSet.get !== "function") {
    return [];
  }

  const characters = new Set();
  for (let index = 0; index < glyphSet.length; index += 1) {
    const glyph = glyphSet.get(index);
    const codePoints = glyph?.unicodes?.length ? glyph.unicodes : [glyph?.unicode];
    for (const codePoint of codePoints) {
      if (!Number.isInteger(codePoint) || codePoint < 0x20 || (codePoint >= 0x7f && codePoint <= 0x9f)) continue;
      characters.add(String.fromCodePoint(codePoint));
    }
  }
  return [...characters];
}

function renderGlyphButtons(characters) {
  const glyphButtons = document.getElementById("glyph-buttons");
  glyphButtons.replaceChildren();
  for (const glyph of characters) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "glyph-picker__button";
    button.textContent = glyph;
    button.setAttribute("aria-label", `Show ${glyph}`);
    button.setAttribute("aria-pressed", String(glyph === msg));
    button.addEventListener("click", () => selectGlyph(glyph, button));
    glyphButtons.appendChild(button);
  }
}

function setupFontPicker() {
  const input = document.getElementById("font-upload");
  const dropzone = document.getElementById("font-dropzone");
  input.addEventListener("change", () => {
    const [file] = input.files;
    input.value = "";
    if (file) loadUploadedFont(file);
  });

  dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropzone.classList.add("font-picker--dragover");
  });
  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("font-picker--dragover");
  });
  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropzone.classList.remove("font-picker--dragover");
    const [file] = event.dataTransfer.files;
    if (file) loadUploadedFont(file);
  });
}

async function loadUploadedFont(file) {
  const request = ++fontLoadRequest;
  if (!/\.(ttf|otf)$/i.test(file.name)) {
    updateFontStatus("Choose a .ttf or .otf font file.");
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  updateFontStatus(`Loading ${file.name}...`);
  try {
    const loadedFont = await loadFont(objectUrl);
    if (request !== fontLoadRequest) return;

    const characters = getFontCharacters(loadedFont);
    if (!characters.length) {
      throw new Error("This font does not contain supported Unicode characters.");
    }

    const nextGlyph = characters.includes(msg) ? msg : characters[0];
    const previousState = {
      font,
      msg,
      geom,
      contours,
      bigPointContours,
      geometryBounds,
      extrusionLimit,
      extrude,
      pointM: pointM && { ...pointM }
    };
    font = loadedFont;
    msg = nextGlyph;
    try {
      rebuildGlyph();
    } catch (error) {
      if (geom && geom !== previousState.geom) freeGeometry(geom);
      font = previousState.font;
      msg = previousState.msg;
      geom = previousState.geom;
      contours = previousState.contours;
      bigPointContours = previousState.bigPointContours;
      geometryBounds = previousState.geometryBounds;
      extrusionLimit = previousState.extrusionLimit;
      extrude = previousState.extrude;
      pointM = previousState.pointM;
      throw error;
    }

    freeGeometry(previousState.geom);
    renderGlyphButtons(characters);
    updateFontStatus(`Using ${getFontFamily(font)} (${file.name})`);
  } catch (error) {
    if (request === fontLoadRequest) {
      const reason = error instanceof Error ? error.message : String(error);
      updateFontStatus(`Could not load ${file.name}: ${reason}`);
    }
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function getFontFamily(loadedFont) {
  const metadata = loadedFont?.metadata?.() || {};
  return metadata.fontFamily?.en || metadata.family || loadedFont?.name || "Custom font";
}

function updateFontStatus(message) {
  document.getElementById("font-status").textContent = message;
}

function selectGlyph(glyph, selectedButton) {
  msg = glyph;
  const previousGeometry = geom;
  rebuildGlyph();
  if (previousGeometry) freeGeometry(previousGeometry);

  document.querySelectorAll(".glyph-picker__button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button === selectedButton));
  });
}

function rebuildGlyph() {
  const sourceContours = font.textToContours(msg, 0, 0);
  const pointContours = font.textToContours(msg, 0, 0, {
    simplifyThreshold: pointSimplifyThreshold
  });
  const sourcePoints = sourceContours.flat();
  const sourceBounds = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity
  };
  for (const point of sourcePoints) {
    sourceBounds.minX = Math.min(sourceBounds.minX, point.x);
    sourceBounds.maxX = Math.max(sourceBounds.maxX, point.x);
    sourceBounds.minY = Math.min(sourceBounds.minY, point.y);
    sourceBounds.maxY = Math.max(sourceBounds.maxY, point.y);
  }

  extrusionLimit = Math.min(
    fontSize,
    Math.max(sourceBounds.maxX - sourceBounds.minX, sourceBounds.maxY - sourceBounds.minY)
  );
  extrude = Math.min(extrude, extrusionLimit);
  geom = font.textToModel(msg, 0, 0, { extrude });
  geom.clearColors();
  geom.normalize();

  geometryBounds = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity,
    minZ: Infinity,
    maxZ: -Infinity
  };
  for (const point of geom.vertices) {
    geometryBounds.minX = Math.min(geometryBounds.minX, point.x);
    geometryBounds.maxX = Math.max(geometryBounds.maxX, point.x);
    geometryBounds.minY = Math.min(geometryBounds.minY, point.y);
    geometryBounds.maxY = Math.max(geometryBounds.maxY, point.y);
    geometryBounds.minZ = Math.min(geometryBounds.minZ, point.z);
    geometryBounds.maxZ = Math.max(geometryBounds.maxZ, point.z);
  }

  if (pointM) {
    pointM.z = map(pointM.y, -height / 2, height / 2, -fontSize / 2, fontSize / 2);
    const zOffset = pointM.z - geometryBounds.minZ;
    for (const point of geom.vertices) {
      point.z += zOffset;
    }
    geometryBounds.minZ = pointM.z;
    geometryBounds.maxZ += zOffset;
  }

  contours = sourceContours.map((contour) => contour.map((point) => ({
    x: map(point.x, sourceBounds.minX, sourceBounds.maxX, geometryBounds.minX, geometryBounds.maxX),
    y: map(point.y, sourceBounds.minY, sourceBounds.maxY, geometryBounds.minY, geometryBounds.maxY)
  })));
  bigPointContours = pointContours.map((contour) => contour.map((point) => ({
    x: map(point.x, sourceBounds.minX, sourceBounds.maxX, geometryBounds.minX, geometryBounds.maxX),
    y: map(point.y, sourceBounds.minY, sourceBounds.maxY, geometryBounds.minY, geometryBounds.maxY)
  })));
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
