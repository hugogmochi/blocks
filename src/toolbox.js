//Definimos la caja de herramientas
export const toolbox = {
  "kind": "categoryToolbox",
  "contents": [
    {
      "kind": "category",
      "name": "Lógica",
      "colour": "200",
      "contents": [
        { "kind": "block", "type": "controls_if" },
        { "kind": "block", "type": "logic_compare" },
        { "kind": "block", "type": "logic_operation" },
        { "kind": "block", "type": "logic_negate" },
        { "kind": "block", "type": "logic_boolean" },
        { "kind": "block", "type": "logic_null" },
        { "kind": "block", "type": "logic_ternary" }
      ]
    },
    {
      "kind": "category",
      "name": "Bucles",
      "colour": "124",
      "contents": [
        {
          "kind": "block",
          "type": "controls_repeat_ext",
          "inputs": {
            "TIMES": {
              "shadow": {
                "type": "math_number",
                "fields": { "NUM": 10 }
              }
            }
          }
        },
        { "kind": "block", "type": "controls_whileUntil" },
        {
          "kind": "block",
          "type": "controls_for",
          "fields": { "VAR": "i" },
          "inputs": {
            "FROM": {
              "shadow": {
                "type": "math_number",
                "fields": { "NUM": 1 }
              }
            },
            "TO": {
              "shadow": {
                "type": "math_number",
                "fields": { "NUM": 10 }
              }
            },
            "BY": {
              "shadow": {
                "type": "math_number",
                "fields": { "NUM": 1 }
              }
            }
          }
        },
        { "kind": "block", "type": "controls_forEach" },
        { "kind": "block", "type": "controls_flow_statements" }
      ]
    },
    {
      "kind": "category",
      "name": "Matemáticas",
      "colour": "243",
      "contents": [
        {
          "kind": "block",
          "type": "math_number",
          "fields": { "NUM": 123 }
        },
        {
          "kind": "block",
          "type": "math_arithmetic",
          "inputs": {
            "A": {
              "shadow": {
                "type": "math_number",
                "fields": { "NUM": 1 }
              }
            },
            "B": {
              "shadow": {
                "type": "math_number",
                "fields": { "NUM": 1 }
              }
            }
          }
        },
        { "kind": "block", "type": "math_single" },
        { "kind": "block", "type": "math_trig" },
        { "kind": "block", "type": "math_constant" },
        { "kind": "block", "type": "math_number_property" },
        { "kind": "block", "type": "math_round" },
        { "kind": "block", "type": "math_on_list" },
        { "kind": "block", "type": "math_modulo" },
        {
          "kind": "block",
          "type": "math_constrain",
          "inputs": {
            "VALUE": {
              "shadow": {
                "type": "math_number",
                "fields": { "NUM": 50 }
              }
            },
            "LOW": {
              "shadow": {
                "type": "math_number",
                "fields": { "NUM": 1 }
              }
            },
            "HIGH": {
              "shadow": {
                "type": "math_number",
                "fields": { "NUM": 100 }
              }
            }
          }
        },
        {
          "kind": "block",
          "type": "math_random_int",
          "inputs": {
            "FROM": {
              "shadow": {
                "type": "math_number",
                "fields": { "NUM": 1 }
              }
            },
            "TO": {
              "shadow": {
                "type": "math_number",
                "fields": { "NUM": 100 }
              }
            }
          }
        },
        { "kind": "block", "type": "math_random_float" },
        { "kind": "block", "type": "math_atan2" }
      ]
    },
    {
      "kind": "category",
      "name": "Texto",
      "colour": "63",
      "contents": [
        { "kind": "block", "type": "text" },
        { "kind": "block", "type": "text_join" },
        { "kind": "block", "type": "addText" },
        { "kind": "block", "type": "clearText" },
        {
          "kind": "block",
          "type": "text_append",
          "fields": { "VAR": "item" }
        },
        { "kind": "block", "type": "text_length" },
        { "kind": "block", "type": "text_isEmpty" },
        { "kind": "block", "type": "text_indexOf" },
        { "kind": "block", "type": "text_charAt" },
        { "kind": "block", "type": "text_getSubstring" },
        { "kind": "block", "type": "text_changeCase" },
        { "kind": "block", "type": "text_trim" },
        { "kind": "block", "type": "text_print" },
        {
          "kind": "block",
          "type": "text_prompt_ext",
          "inputs": {
            "TEXT": {
              "shadow": {
                "type": "text",
                "fields": { "TEXT": "abc" }
              }
            }
          }
        }
      ]
    },
    {
      "kind": "category",
      "name": "Listas",
      "colour": "20",
      "contents": [
        { "kind": "block", "type": "lists_create_with" },
        { "kind": "block", "type": "lists_create_with" },
        {
          "kind": "block",
          "type": "lists_repeat",
          "inputs": {
            "NUM": {
              "shadow": {
                "type": "math_number",
                "fields": { "NUM": 5 }
              }
            }
          }
        },
        { "kind": "block", "type": "lists_length" },
        { "kind": "block", "type": "lists_isEmpty" },
        { "kind": "block", "type": "lists_indexOf" },
        { "kind": "block", "type": "lists_getIndex" },
        { "kind": "block", "type": "lists_setIndex" },
        { "kind": "block", "type": "lists_getSublist" },
        { "kind": "block", "type": "lists_sort" },
        { "kind": "block", "type": "lists_split" },
        { "kind": "block", "type": "lists_reverse" }
      ]
    },
    {
      "kind": "category",
      "name": "Variables",
      "colour": "34",
      "custom": "VARIABLE"
    },
    {
      "kind": "category",
      "name": "Funciones",
      "colour": "60",
      "custom": "PROCEDURE"
    }
  ]
}