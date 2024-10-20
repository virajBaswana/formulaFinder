const utils = require("./index");
const fs = require("node:fs");
const filePath = "./targetSheet.xlsx";

const columnData = utils.readExcelFile(filePath);
const data = utils.cleanDataForProcessing(columnData);
// console.log(columnData);
console.log(data);


function pushArrayForChecking(data) {
  let finalAnswersArr = [];

  for (let i = 0; i < data.length; i++) {
    let answers = [];

    for (j = 2; j < data[i].length; j++) {
      let answer = findFormulaValue(data[i].slice(0, j + 1));

      answers.push(answer);
    }
    finalAnswersArr.push(answers);
  }
  console.log("finalAnswersArr" , finalAnswersArr)
  let resArray = utils.exactMatchWithNot(finalAnswersArr);
  console.log("result array" , resArray)
  let formulas = utils.deriveFormulas(resArray)
  console.log(formulas)
  return formulas
}

function findFormulaValue(arr) {
  let arrContainingPossibleFormulaElements = arr.slice(0, -1);

  let lengthForFindingPermutations =
    arrContainingPossibleFormulaElements.length;

  let possiblePatternsArray = utils.generateTernaryNumbers(
    lengthForFindingPermutations
  );

  console.log("Patterns" , possiblePatternsArray)

  let possibleFormulaResultValuesArr = possiblePatternsArray.map(
    (ternaryString) => {
      const numericStrArray = ternaryString.split("");

      const multipleArr = numericStrArray.map((value, index) => {
        let actualValue = value == "2" ? -1 : parseInt(value);
        return actualValue * arrContainingPossibleFormulaElements[index];
      });

      return multipleArr;
    }
  );

  const sumValues = possibleFormulaResultValuesArr.map((valArr) => {
    const sum = valArr.reduce((a, b) => {
      return a + b;
    });
    return sum;
  });



  const matchPermWithFinalValue = sumValues.indexOf(arr[arr.length - 1]);

//   console.log("Potential Formula", possiblePatternsArray[matchPermWithFinalValue]);

  return possiblePatternsArray[matchPermWithFinalValue];
}

pushArrayForChecking(data);
