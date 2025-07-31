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

const promptTextBlock = {
  "type": "promptText",
  "tooltip": "",
  "helpUrl": "",
  "message0": "preguntar: %1",
  "args0": [
    {
      "type": "input_value",
      "name": "QUESTION",
      "check": "String"
    }
  ],
  "output": "String",
  "colour": 60
}
                    

Blockly.defineBlocksWithJsonArray([addTextBlock, clearTextBlock, promptTextBlock])

javascriptGenerator.forBlock['clearText'] = function() {
  const code = 'clearText();\n';
  return code;
}

javascriptGenerator.forBlock['addText'] = function(block, generator) {
  const text = generator.valueToCode(block, 'TEXT', Order.ATOMIC);

  const code = `addText(${text ? text : '""'});\n`;
  return code;
}

javascriptGenerator.forBlock['promptText'] = function(block, generator) {
  const value_question = generator.valueToCode(block, 'QUESTION', Order.ATOMIC);

  if (!value_question){
    block.addIcon(Blockly.icons.WarningIcon('Doesn\'t have prompt'))
  }

  const code = `await promptText(${value_question})`;
  return [code, Order.ATOMIC];
}

// Async functions
javascriptGenerator.forBlock['procedures_defnoreturn'] = function(block, generator) {

  // Tomado del codigo fuente
  // Define a procedure with a return value.
  const funcName = generator.getProcedureName(block.getFieldValue('NAME'));
  let xfix1 = '';
  if (generator.STATEMENT_PREFIX) {
    xfix1 += generator.injectId(generator.STATEMENT_PREFIX, block);
  }
  if (generator.STATEMENT_SUFFIX) {
    xfix1 += generator.injectId(generator.STATEMENT_SUFFIX, block);
  }
  if (xfix1) {
    xfix1 = generator.prefixLines(xfix1, generator.INDENT);
  }
  let loopTrap = '';
  if (generator.INFINITE_LOOP_TRAP) {
    loopTrap = generator.prefixLines(
      generator.injectId(generator.INFINITE_LOOP_TRAP, block),
      generator.INDENT,
    );
  }
  let branch = '';
  if (block.getInput('STACK')) {
    // The 'procedures_defreturn' block might not have a STACK input.
    branch = generator.statementToCode(block, 'STACK');
  }
  let returnValue = '';
  if (block.getInput('RETURN')) {
    // The 'procedures_defnoreturn' block (which shares this code)
    // does not have a RETURN input.
    returnValue = generator.valueToCode(block, 'RETURN', Order.NONE) || '';
  }
  let xfix2 = '';
  if (branch && returnValue) {
    // After executing the function body, revisit this block for the return.
    xfix2 = xfix1;
  }
  if (returnValue) {
    returnValue = generator.INDENT + 'return ' + returnValue + ';\n';
  }
  const args = [];
  const variables = block.getVars();
  for (let i = 0; i < variables.length; i++) {
    args[i] = generator.getVariableName(variables[i]);
  }
  let code =
    'async function ' +
    funcName +
    '(' +
    args.join(', ') +
    ') {\n' +
    xfix1 +
    loopTrap +
    branch +
    xfix2 +
    returnValue +
    '}';
  code = generator.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  // TODO(#7600): find better approach than casting to any to override
  // CodeGenerator declaring .definitions protected.
  (generator).definitions_['%' + funcName] = code;
  return null;
};

javascriptGenerator.forBlock['promptText'] = function(block, generator) {
  const value_question = generator.valueToCode(block, 'QUESTION', Order.ATOMIC);

  if (!value_question){
    block.addIcon(Blockly.icons.WarningIcon('Doesn\'t have prompt'))
  }

  const code = `await promptText(${value_question})`;
  return [code, Order.ATOMIC];
}

javascriptGenerator.forBlock['procedures_callreturn'] = function(block, generator) {
  // Call a procedure with a return value.
  const funcName = generator.getProcedureName(block.getFieldValue('NAME'));
  const args = [];
  const variables = block.getVars();
  for (let i = 0; i < variables.length; i++) {
    args[i] = generator.valueToCode(block, 'ARG' + i, Order.NONE) || 'null';
  }
  const code = 'await ' + funcName + '(' + args.join(', ') + ')';
  return [code, Order.FUNCTION_CALL];
}

// Async functions
javascriptGenerator.forBlock['procedures_defreturn'] = function(block, generator) {

  // Tomado del codigo fuente
  // Define a procedure with a return value.
  const funcName = generator.getProcedureName(block.getFieldValue('NAME'));
  let xfix1 = '';
  if (generator.STATEMENT_PREFIX) {
    xfix1 += generator.injectId(generator.STATEMENT_PREFIX, block);
  }
  if (generator.STATEMENT_SUFFIX) {
    xfix1 += generator.injectId(generator.STATEMENT_SUFFIX, block);
  }
  if (xfix1) {
    xfix1 = generator.prefixLines(xfix1, generator.INDENT);
  }
  let loopTrap = '';
  if (generator.INFINITE_LOOP_TRAP) {
    loopTrap = generator.prefixLines(
      generator.injectId(generator.INFINITE_LOOP_TRAP, block),
      generator.INDENT,
    );
  }
  let branch = '';
  if (block.getInput('STACK')) {
    // The 'procedures_defreturn' block might not have a STACK input.
    branch = generator.statementToCode(block, 'STACK');
  }
  let returnValue = '';
  if (block.getInput('RETURN')) {
    // The 'procedures_defnoreturn' block (which shares this code)
    // does not have a RETURN input.
    returnValue = generator.valueToCode(block, 'RETURN', Order.NONE) || '';
  }
  let xfix2 = '';
  if (branch && returnValue) {
    // After executing the function body, revisit this block for the return.
    xfix2 = xfix1;
  }
  if (returnValue) {
    returnValue = generator.INDENT + 'return ' + returnValue + ';\n';
  }
  const args = [];
  const variables = block.getVars();
  for (let i = 0; i < variables.length; i++) {
    args[i] = generator.getVariableName(variables[i]);
  }
  let code =
    'async function ' +
    funcName +
    '(' +
    args.join(', ') +
    ') {\n' +
    xfix1 +
    loopTrap +
    branch +
    xfix2 +
    returnValue +
    '}';
  code = generator.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  // TODO(#7600): find better approach than casting to any to override
  // CodeGenerator declaring .definitions protected.
  (generator).definitions_['%' + funcName] = code;
  return null;
};