import * as Blockly from 'blockly/core'
import { javascriptGenerator, Order } from 'blockly/javascript';

const addTextBlock = {
  "type": "addText",
  "tooltip": "Añade Texto",
  "helpUrl": "",
  "message0": "Añadir texto %1",
  "args0": [
    {
      "type": "input_value",
      "name": "TEXT",
      "check": "String"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 60
}

const clearTextBlock = {
  "type": "clearText",
  "tooltip": "ZOZOZ",
  "helpUrl": "",
  "message0": "Limpiar texto",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 60
}

Blockly.defineBlocksWithJsonArray([addTextBlock, clearTextBlock])

javascriptGenerator.forBlock['clearText'] = function() {
  const code = 'clearText();\n';
  return code;
}

javascriptGenerator.forBlock['addText'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', Order.ATOMIC);

  const code = `addText(${text ? text : '""'});\n`;
  return code;
}