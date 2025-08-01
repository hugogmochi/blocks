
console.log = function (...args) {
  const message = args.map(arg => String(arg)).join(' ');
  self.postMessage({ type: 'log', payload: {message} });
};

console.error = function (...args) {
  const message = args.map(arg => String(arg)).join(' ');
  self.postMessage({ type: 'loerror', payload: {message} });
};

function addText(text) {
  self.postMessage({ type: 'addText', payload: { text } });
}

function clearText() {
  self.postMessage({ type: 'clearText' });
}

async function promptText(promptMessage) {
  return new Promise((resolve) => {
    const requestId = Math.random().toString(36).substr(2, 9);

    const responseHandler = (event) => {
      if (event.data.requestId === requestId) {
        resolve(event.data.result);
    }
  };
    self.addEventListener('message', responseHandler);

    self.postMessage({ type: 'promptText', requestId, payload: { promptMessage } });
  });
}


self.onmessage = async (event) => {
  const data = event.data;

  // Aquí manejamos las respuestas a nuestras solicitudes (si el worker es el que espera)
  if (data.type === 'response' && data.requestId) {
    return;
  }

  if (data.type === 'execute') {
    const { code, requestId } = data;
    console.log(code)
    try {
      // El código de Blockly ahora puede llamar a las funciones proxy
      const func = new Function(`addText`, `clearText`, `promptText`, `return 
      (async () => {
        try {
          ${code}
        } catch (error) {
          console.error('Error en el código generado:', error);
          addText('Error en el código generado: ' + error.message);
        }
      })()`);

     await func(addText, clearText, promptText);
     console.log(complete)

    } catch (error) {
      console.error(error)
    }
  }
}

console.log('Worquin\'')