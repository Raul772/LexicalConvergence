const loadingScreen = document.querySelector(".loading-screen");
const animationScreen = document.querySelector(".animationContainer");
let results;
let simulation = 0;
google.charts.load('current', { 'packages': ['corechart'] });

async function loadCharts() {

  let results = await backend.simular();

  if (!configParams.animation) {
    loadingScreen.classList.toggle("show-loading");
  }else{
    animationScreen.classList.toggle("show-loading");
  }

  if(!configParams.saveCicleData){
    return false;
  }
  

  let separator = document.createElement('h3');
  separator.innerText = `Simulação ${++simulation}`;
  separator.classList.add("separator");

  let info = document.createElement('p');
  info.innerHTML = `
    Total de Iterações: ${results.totalIterations} <br> 
    Total de Ciclos: ${results.totalIterations / configParams.nIteracao}
  `;


  document.querySelector("[charts-container]").appendChild(separator);
  document.querySelector("[charts-container]").appendChild(info);

  

  for (let i = 0; i < configParams.nMacacos; i++) {
    google.charts.setOnLoadCallback(() => drawChart(i, results.cicleDataTable, configParams));
  }

}

function drawChart(macacoIndex = 0, infoTable, config) {

  var data = new google.visualization.DataTable();


  data.addColumn('number', 'Ciclos');
  for (let i = 0; i < config.nPredadores; i++) {
    data.addColumn('number', `Predador ${i}`);
  }

  let counter = 0;
  // a segunda indicação de posição da matriz de ciclos no código abaixo "[0]" pode ser ignorada, por se tratar de uma matriz, precisa-se indicar a segunda posição, mas a única possível é 0.
  infoTable.forEach(ciclo => {
    ++counter;
    ciclo[macacoIndex][0].unshift(counter);
    data.addRow(ciclo[macacoIndex][0]);
  });

  var options = {
    title: `Macaco ${macacoIndex}`,
    curveType: 'function',
    height: 300,
    width: 750,
    hAxis:{title: "Ciclos"},
    vAxis:{title: "Simbolos"},
    TitleSPosition: "out",
    legend: { position: 'bottom' }
  };

  let chartContainer = document.createElement('div');
  chartContainer.style.padding = "15px 0px";
  chartContainer.style.display = "inline-block";

  var chart = new google.visualization.LineChart(chartContainer);
  document.querySelector("[charts-container]").appendChild(chartContainer);
  chart.draw(data, options);
}

async function updateAnimConfigs() {
  globalThis.configParams = await backend.configs();
  return true;
}

async function loadAnimation() {
  await updateAnimConfigs();

  let canvas, context;

  let background = new Image();
  background.src = "./assets/background.jpg";

  let macacoIcon = new Image();
  macacoIcon.src = "./assets/Macaco.png";

  let predadorIcon = new Image();
  predadorIcon.src = "./assets/Predador.png";

  if (!configParams.animation) {
    return false;
  }

  canvas = document.querySelector("[animationCanvas]");
  canvas.width = configParams.envMaxX * 10;
  canvas.height = configParams.envMaxY * 10;

  context = canvas.getContext("2d");


  window.backend.onFrameUpdate((event, frame) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.font = "12px, serif";

    frame.forEach((linha) => {
      linha.forEach((elemento) => {
        if (elemento) {
          context.drawImage(
            elemento.nome.charAt(0) == "M" ? macacoIcon : predadorIcon,
            elemento.position.x * 10,
            elemento.position.y * 10
          );
        }
      });
    });

    event.sender.send("updatedFrame", true);
  });
}

async function simular() {
  
  if (!configParams.animation) {
    loadingScreen.classList.toggle("show-loading");
  }else{
    animationScreen.classList.toggle("show-loading");
  }
  
  loadAnimation();
  loadCharts();
}