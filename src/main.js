//Importar blockly
import * as Blockly from 'blockly/core'
import { javascriptGenerator } from 'blockly/javascript';
//Importar español
import * as es from 'blockly/msg/es';

//Importar bloques custom
import './blocks'

//importar bloques de blockly
import 'blockly/blocks';

import { toolbox } from './toolbox'
import './style.css'
import executeWorker from  './code-executer?worker'

//Cambiar lenguaje al español
Blockly.setLocale(es)

console.log('AAA')

// Creamos una clase a partir del toolbox category para añadir estilos personalizados
class CustomCategory extends Blockly.ToolboxCategory {
  /**
   * Constructor for a custom category.
   * @override
   */
  addColourBorder_(colour) {
    this.rowDiv_.style.backgroundColor = colour;
  }
  constructor(categoryDef, toolbox, opt_parent) {
    super(categoryDef, toolbox, opt_parent);
  }

  setSelected(isSelected) {
    // We do not store the label span on the category, so use getElementsByClassName.
    var labelDom = this.rowDiv_.getElementsByClassName('blocklyToolboxCategoryLabel')[0];
    if (isSelected) {
      // Change the background color of the div to white.
      this.rowDiv_.style.backgroundColor = 'white';
      // Set the colour of the text to the colour of the category.
      labelDom.style.color = this.colour_;
    } else {
      // Set the background back to the original colour.
      this.rowDiv_.style.backgroundColor = this.colour_;
      // Set the text back to white.
      labelDom.style.color = 'white';
    }
    // This is used for accessibility purposes.
    Blockly.utils.aria.setState(/** @type {!Element} */(this.htmlDiv_),
      Blockly.utils.aria.State.SELECTED, isSelected);
  }
}

//Regristamos CustomCategory
Blockly.registry.register(
  Blockly.registry.Type.TOOLBOX_ITEM,
  Blockly.ToolboxCategory.registrationName,
  CustomCategory, true
);

//Recuperamos el blocklyDiv del html
const blocklyDiv = document.getElementById('blocklyDiv')

// y inyectamos el espacio de trabajo de blockly
let workspace = Blockly.inject(blocklyDiv, {
  toolbox: toolbox,
  media: 'https://unpkg.com/blockly/media/',
  theme: Blockly.Themes.Zelos,
  /*  plugins: {
      flyoutsVerticalToolbox: 'ContinuousFlyout',
      metricsManager: 'ContinuousMetrics',
      toolbox: 'ContinuousToolbox',
    },
    // ... your other options here ...*/
});

function saveWorkspace(workspace, filename) {
  const state = Blockly.serialization.workspaces.save(workspace);
  const jsonText = JSON.stringify(state)

  const blob = new Blob([jsonText], { type: 'application/json' });

  // 4. Crear un enlace de descarga y simular un clic
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename + '.json';

  document.body.appendChild(a);
  a.click();

  // 5. Limpiar
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);

}

function loadWorkspace(workspace, text) {
  if (!workspace) { // <-- ¡Esta comprobación es importante!
    console.error("No Blockly workspace instance found to load into.");
    return;
  }
  const jsonObjet = JSON.parse(text)
  Blockly.serialization.workspaces.load(jsonObjet, workspace)
}

const outElement = document.getElementById('out')

function addText(text) {
  outElement.textContent += text + '\n'
}

function clearText() {
  outElement.textContent = ''
}

function promptText(promptMessage) {
  return new Promise((resolve) => {
    // 1. Display the prompt message
    outElement.textContent += promptMessage + ' '; // Use promptMessage here, not 'text'

    // 2. Create the input element
    const inElement = document.createElement('input');
    inElement.type = 'text';
    inElement.placeholder = 'Escribe tu respuesta y presiona Enter...'; // Give user a hint
    inElement.style.display = 'block'; // Ensure it's visible, maybe add some styling later
    inElement.style.marginTop = '10px'; // Just for basic spacing

    // 3. Append the input element to the output area
    outElement.appendChild(inElement);

    // 4. Set focus to the input field so the user can type immediately
    inElement.focus();

    // 5. Add event listener for 'Enter' key
    inElement.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent potential form submission or other default behavior

        const inputValue = inElement.value; // Get the value before removing

        // 6. Remove the input element
        outElement.removeChild(inElement);

        // 7. Resolve the Promise with the input value
        // This makes the function return the value and allows the 'await' call to continue
        addText(inputValue)
        resolve(inputValue);
      }
    });
  });
}

const worker = new executeWorker();
let requestMap = new Map();

worker.onmessage = async (event) => {
  const { type, requestId, payload } = event.data;

  switch (type) {
    case 'addText':
      addText(payload.text);
      break;
    case 'clearText':
      clearText();
      break;
    case 'promptText':
      try {
        const userInput = await promptText(payload.promptMessage);
        worker.postMessage({ type: 'response', requestId, result: userInput });
      } catch (error) {
        console.error(error)
      }
      break;
    case 'log':
      console.log(payload.message)
    case 'loerror':
      console.error(payload.message)
  }

  if (requestMap.has(requestId)) {
    const { resolve, reject } = requestMap.get(requestId);
    if (data.type === 'result') {
      resolve(data.result);
    } else {
      reject(new Error(data.message));
    }
    requestMap.delete(requestId);
  }
};


const runButton = document.getElementById('runbutton')

function executeCodeInWorker(code) {
  return new Promise((resolve, reject) => {
    const requestId = Math.random().toString(36).substring(2, 9);

    const handleMessage = (event) => {
      if (event.data.requestId === requestId) {
        worker.removeEventListener('message', handleMessage);
        if (event.data.type === 'result') {
          resolve(event.data.result);
        } else if (event.data.type === 'error') {
          reject(new Error(event.data.message));
        } else {
          resolve()
        }
      }
    };
    worker.addEventListener('message', handleMessage);

    worker.postMessage({ type: 'execute', code, requestId });
  });
}

runButton.addEventListener('click', async (e) => {
  clearText(); // Limpiar la salida antes de ejecutar
  const code = javascriptGenerator.workspaceToCode(workspace);

  console.log(code)

  try {
    executeCodeInWorker(code)

  } catch (e) {
    console.error('Error al ejecutar el código:', e);
    addText('Error de ejecución: ' + e.message);
  }
})

const saveButton = document.getElementById('savebutton')
const projectName = document.getElementById('projectname')

saveButton.addEventListener('click', (e) => {
  saveWorkspace(workspace, projectName.value)
})

const loadButton = document.getElementById('loadprojectbutton')
const loadFileSelcetor = document.getElementById('projectfile')

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (event) => reject(event.target.error);
    reader.readAsText(file);
  });
}

function removeFileExtension(filename) {
  // Find the last occurrence of '.'
  const lastDotIndex = filename.lastIndexOf('.');

  // If there's no dot, or the dot is the first character (e.g., ".bashrc"),
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return filename;
  }

  // Return the substring from the beginning up to the last dot
  return filename.slice(0, lastDotIndex);
}

loadButton.addEventListener('click', (e) => {
  if (confirm('Va ha perder todos los datos no guardados si quiere cargar. Continuar?')) {
    loadFileSelcetor.click()
  }
})

loadFileSelcetor.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) {
    addText('No se seleccionó ningún archivo.');
    return;
  }

  addText(`Intentando cargar el archivo: ${file.name}`);

  try {
    const fileContent = await readFileAsText(file);
    loadWorkspace(workspace, fileContent);
    projectName.value = removeFileExtension(file.name)
  } catch (e) {
    console.error(e);
    alert('Error al leer o parsear el archivo: ' + e.message);
  } finally {
    // Clear the input value so the same file can be loaded again
    event.target.value = '';
    clearText
  }
})

function clearBlocklyWorkspaceAndAlert(workspace) {
  if (!workspace) {
    console.error("No Blockly workspace instance found to clear.");
    alert("Error: No workspace available to clear.");
    return;
  }

  if (confirm('Seguro que quiere limpiar el espacio de trabajo. Va a perder los datos no guardados')) {
    workspace.clear();
  }
}

const clearButton = document.getElementById('clearprojectbutton')

clearButton.addEventListener('click', (e) => {
  clearBlocklyWorkspaceAndAlert(workspace)
})


// --- Lógica principal para la alerta al cerrar/recargar ---
window.onbeforeunload = function () {
  // Si hay cambios sin guardar, devuelve una cadena de texto.
  // El texto exacto de esta cadena no será mostrado por la mayoría de los navegadores modernos,
  // pero el hecho de que devuelvas algo activará la alerta genérica del navegador.
  return "¿Estás seguro de que quieres salir? Perderas datos sin guardar.";

};

// registerContinuousToolbox()
