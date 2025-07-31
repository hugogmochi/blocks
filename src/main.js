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

//Cambiar lenguaje al español
Blockly.setLocale(es)

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

const runButton = document.getElementById('runbutton')

runButton.addEventListener('click', (e) => {
  clearText(); // Limpiar la salida antes de ejecutar
  const code = javascriptGenerator.workspaceToCode(workspace);

  try {
    // Ejecuta el código
    // eslint-disable-next-line no-eval
    eval(code);
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
  // then there's no extension to remove, so return the original filename.
  // Also handles cases like "file_without_extension"
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
window.onbeforeunload = function() {
    // Si hay cambios sin guardar, devuelve una cadena de texto.
    // El texto exacto de esta cadena no será mostrado por la mayoría de los navegadores modernos,
    // pero el hecho de que devuelvas algo activará la alerta genérica del navegador.
        return "¿Estás seguro de que quieres salir? Perderas datos sin guardar.";

};

// registerContinuousToolbox()
