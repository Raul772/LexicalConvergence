const simbolos_field = document.getElementById("simbolos");
const audicao_field = document.getElementById("audicao");
const visao_field = document.getElementById("visao");
const iteracoes_field = document.getElementById("nIteracoes");
const envMaxX_field = document.getElementById("envMaxX");
const envMaxY_field = document.getElementById("envMaxY");
const macacos_field = document.getElementById("nMacacos");
const predadores_field = document.getElementById("nPredadores");
const animation_field = document.getElementById("animation");
const saveCicleData_field = document.getElementById("saveCicleData");

const form = document.querySelector("form");

async function updateFields() {
  window.configParams = await backend.configs();

  simbolos_field.value = configParams.simbolos;
  audicao_field.value = configParams.raioAudicao;
  visao_field.value = configParams.raioVisao;
  iteracoes_field.value = configParams.nIteracao;
  envMaxX_field.value = configParams.envMaxX;
  envMaxY_field.value = configParams.envMaxY;
  macacos_field.value = configParams.nMacacos;
  predadores_field.value = configParams.nPredadores;
  animation_field.checked = configParams.animation ? true : false;
  saveCicleData_field.checked = configParams.saveCicleData ? true : false;
}

updateFields();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let aux = {
    simbolos: Number(simbolos_field.value),
    raioAudicao: Number(audicao_field.value),
    raioVisao: Number(visao_field.value),
    nIteracao: Number(iteracoes_field.value),
    envMaxX: Number(envMaxX_field.value),
    envMaxY: Number(envMaxY_field.value),
    nMacacos: Number(macacos_field.value),
    nPredadores: Number(predadores_field.value),
    saveCicleData: Number(saveCicleData_field.checked),
    animation: Number(animation.checked),
  };

  await backend.updateConfigs(aux);

  await updateFields();
});
