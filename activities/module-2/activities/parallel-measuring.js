sparks.jsonSection = {
  "title": "Measuring a Parallel Circuit",
  "show_multimeter": "true",
  "circuit": [
      {
        "type": "resistor",
        "UID": "r1",
        "connections": "a15,a9",
        "label": "R1"
      },
      {
        "type": "resistor",
        "UID": "r2",
        "connections": "c15,c9",
        "label": "R2"
      },
      {
        "type": "resistor",
        "UID": "r3",
        "connections": "e15,e9",
        "label": "R3"
      },
      {
        "type": "wire",
        "connections": "left_positive16,b15"
      },
      {
        "type": "wire",
        "connections": "left_negative5,b9"
      }
   ],
  "questions": [
    {
      "prompt": "What is the measured resistance of",
      "subquestions": [
        {
          "prompt": "R<sub>1</sub>:",
          "shortPrompt": "Resistance of R1",
          "correct_answer": "[${r1.resistance}]",
          "correct_units": "ohms"
        },
        {
          "prompt": "R<sub>2</sub>:",
          "shortPrompt": "Resistance of R2",
          "correct_answer": "[${r2.resistance}]",
          "correct_units": "ohms"
        },
        {
          "prompt": "R<sub>3</sub>:",
          "shortPrompt": "Resistance of R3",
          "correct_answer": "[${r3.resistance}]",
          "correct_units": "ohms"
        }
      ]
    },
    {
      "prompt": "What is the total measured resistance across all the resistors? ",
      "shortPrompt": "Total resistance",
      "correct_answer": "[1 / ((1 / ${r1.resistance}) + (1 / ${r2.resistance}) + (1 / ${r3.resistance}))]",
      "correct_units": "ohms"
    },
    {
      "prompt": "Given that the battery is producing 9 Volts, what is the voltage drop across",
      "subquestions": [
        {
          "prompt": "R<sub>1</sub>:",
          "shortPrompt": "Voltage across R1",
          "correct_answer": "[ 9 ]",
          "correct_units": "V"
        },
        {
          "prompt": "R<sub>2</sub>:",
          "shortPrompt": "Voltage across R2",
          "correct_answer": "[ 9 ]",
          "correct_units": "V"
        },
        {
          "prompt": "R<sub>3</sub>:",
          "shortPrompt": "Voltage across R3",
          "correct_answer": "[ 9 ]",
          "correct_units": "V"
        }
       ]
    },
    {
      "prompt": "What is the current through",
      "subquestions": [
        {
          "prompt": "R<sub>1</sub>:",
          "shortPrompt": "Current through R1",
          "correct_answer": "[ 9 / ${r1.resistance}]",
          "correct_units": "A"
        },
        {
          "prompt": "R<sub>2</sub>:",
          "shortPrompt": "Current through R2",
          "correct_answer": "[ 9 / ${r2.resistance}]",
          "correct_units": "A"
        },
        {
          "prompt": "R<sub>3</sub>:",
          "shortPrompt": "Current through R3",
          "correct_answer": "[ 9 / ${r3.resistance}]",
          "correct_units": "A"
        }
      ]
    },
    {
      "prompt": "What is the total current through all the resistors?",
      "shortPrompt": "Total current",
       "correct_answer": "[ ( 9 / ${r1.resistance}) + ( 9 / ${r2.resistance}) + ( 9 / ${r3.resistance})]",
       "correct_units": "A"
     }
  ]
};