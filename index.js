const XLSX = require("xlsx");

function readExcelFile(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  const columnData = {};

  sheetData[0].forEach((row, rowIndex) => {
    columnData[rowIndex] = sheetData.map((row) => row[rowIndex]);
  });

  return columnData;
}

function cleanDataForProcessing(data) {
  let dataArray = [];
  for (let [k, v] of Object.entries(data)) {
    let vals = v.slice(2).map((val, index) => {
      if (typeof val === "string") {
        const cleanedStringStage1 = val.replace(/,/g, "");
        const cleanedStringStage2 = cleanedStringStage1.replace(/\(/g, "-");
        const cleanedStringStage3 = cleanedStringStage2.replace(/\(/g, "");
        // console.log(cleanedString)
        const number = parseFloat(cleanedStringStage3);
        // console.log(Number(number))
        return Number(number);
      } else if (typeof val === "number") {
        return val;
      } else {
        return 0;
      }
    });

    dataArray.push(vals);
  }
  return dataArray;
}

function generatePermutations(length) {
  const values = [-1, 0, 1];
  const result = [];

  function permute(currentPermutation) {
    if (currentPermutation.length === length) {
      result.push([...currentPermutation]);
      return;
    }

    for (let value of values) {
      currentPermutation.push(value);
      permute(currentPermutation);
      currentPermutation.pop();
    }
  }

  permute([]);

  return result;
}

function incrementTernaryString(ternaryStr) {
  let carry = 1;
  let result = "";

  for (let i = ternaryStr.length - 1; i >= 0; i--) {
    let digit = parseInt(ternaryStr[i], 10);
    digit += carry;

    if (digit === 3) {
      digit = 0;
      carry = 1;
    } else {
      carry = 0;
    }

    result = digit.toString() + result;
  }

  if (carry === 1) {
    result = "1" + result;
  }

  return result;
}

function generateTernaryNumbers(n) {
  let ternaryStr = "0".repeat(n);
  const resultArray = [];

  const totalNumbers = Math.pow(3, n);

  for (let i = 0; i < totalNumbers; i++) {
    resultArray.push(ternaryStr);
    ternaryStr = incrementTernaryString(ternaryStr);
  }

  return resultArray;
}

function exactMatchWithNot(arrays) {
  if (arrays.length === 0) return [];

  const length = arrays[0].length;

  const allSameLength = arrays.every((arr) => arr.length === length);
  if (!allSameLength) throw new Error("All arrays must have the same length");

  const result = [];

  for (let i = 0; i < length; i++) {
    const firstValue = arrays[0][i];

    const allMatch = arrays.every((arr) => arr[i] === firstValue);

    if (allMatch && firstValue != undefined && parseInt(firstValue)) {
      if (firstValue) result.push(firstValue);
    } else {
      result.push("not");
    }
  }
  console.log("RESULT", result);

  return result;
}

function deriveFormulas(result) {
  let offset = 4;
  let formulaArray = []
  for (let i = 0; i < result.length; i++) {
    if (result[i] !== "not") {
      let ops = result[i].split("");

      let formula = `Row ${offset + i + 1} = `;
      ops.map((op, index) => {
        op === "1"
          ? (formula += `+ Row${2 + index + 1}`)
          : op === "2"
          ? (formula += `- Row${2 + index + 1}`)
          : "";
      });
      console.log("formula" , formula);
      formulaArray.push(formula)
    }
  }
  return formulaArray
}

module.exports = {
  readExcelFile,
  cleanDataForProcessing,
  generatePermutations,
  generateTernaryNumbers,
  exactMatchWithNot,
  deriveFormulas,
};
