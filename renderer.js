const main = document.querySelector('main');
const information = document.createElement('p');
information.innerText =`This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}) and Electron (v${versions.electron()})`;

main.appendChild(information);