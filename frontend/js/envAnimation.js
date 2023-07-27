let configParams;

async function updateAnimConfigs() {
  configParams = await backend.configs();
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

loadAnimation();


