let classifier;
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/7gjTJre4-/'; 
let video;
let label = "Cargando scanner...";
let confidence = 0.0;
let osc; 

function preload() {
  // Cargamos el modelo de imágenes
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(640, 540); // Espacio extra para el panel de control
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Sonido tipo "dibujo animado" (onda cuadrada)
  osc = new p5.Oscillator('square'); 
  osc.amp(0);
  osc.start();

  classifyVideo();
}

function draw() {
  background(40, 0, 80); // Fondo morado oscuro vibrante

  // 1. Video con efecto espejo
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 10, 10, width - 20, 480); 
  
  // 2. Efecto visual cuando detecta CARTOON (Class 1)
  if (label === "Cartoon" && confidence > 0.85) {
    noFill();
    stroke(255, 200, 0); // Amarillo Cartoon
    strokeWeight(12);
    rect(10, 10, width - 20, 480, 25); // Bordes muy redondeados
    
    // Burbujas o círculos decorativos aleatorios
    fill(255, 200, 0, 100);
    noStroke();
    ellipse(random(width), random(height-60), random(10, 30));
  }
  pop();

  // 3. Panel Inferior Interactivo
  drawCartoonUI();

  // 4. Sonido de éxito (95%+)
  if (label === "Cartoon" && confidence > 0.95) {
    osc.freq(523.25); // Nota DO
    osc.amp(0.2, 0.1); 
  } else {
    osc.amp(0, 0.1);
  }
}

function drawCartoonUI() {
  // Barra de "Energía Cartoon"
  let barWidth = map(confidence, 0, 1, 0, width - 40);
  
  // Fondo de la barra
  fill(60, 20, 100);
  rect(20, height - 35, width - 40, 20, 10);
  
  // Color de la barra: Amarillo brillante
  fill(255, 230, 0);
  rect(20, height - 35, barWidth, 20, 10);

  // Textos con estilo
  textAlign(LEFT);
  fill(255);
  textSize(24);
  textStyle(BOLD);
  
  // Traducimos Class 1 a nombre divertido
  let msg = (label === "Cartoon") ? "💥 ¡CARTOON DETECTADO! 💥" : "🔍 BUSCANDO DIBUJOS...";
  text(msg, 20, height - 50);

  textAlign(RIGHT);
  // Mostramos el porcentaje de confianza
  text(floor(confidence * 100) + "% TOON", width - 20, height - 50);
}

function classifyVideo() {
  classifier.classify(video, gotResult);
}

function gotResult(error, results) {
  if (error) {
    // Si sale el error de dimensiones, evitamos que se congele
    classifyVideo();
    return;
  }
  if (results && results.length > 0) {
    label = results[0].label; // Actualiza Class 1 o Class 2
    confidence = results[0].confidence; // Actualiza el nivel de confianza
  }
  classifyVideo();
}
