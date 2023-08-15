const resultsEL = document.querySelector(".results");
var beforeOperator = 0; //{numbers: [a,b], operator: y}
var afterOperator = 0; //{numbers: [a,b], operator: y}
var gOperator;
var hasOperator = false;
var afterCheck = false;
var isSpecialOperator = false;
var selectedBtn; //btnEL
const operatorMapping = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  X: (a, b) => a * b,
  "/": (a, b) => a / b,
  "%": (a) => a / 100,
};

//function that adds the pressed div to results
function addToResults(string, divName) {
  //adds number to the correct var
  if (isNumber(string)) {
    removeBtnCss(divName);
    //if there is a special operator
    if (addSpecialNum(string)) return;

    //adding number to results and correct var
    addToResultsandVar(string);
    return;
  }

  //if it's an operator
  if (preventSameClick(divName)) {
    return;
  }
  if (preventDiffClick(divName)) {
    return;
  }
  //change color to selected
  if (string !== "%") {
    addBtnCss(divName);
  }
  //calculates special if needed
  if (hasOperator) {
    calcSpecial("after");
  } else {
    calcSpecial("before");
  }

  //if it's a special character (X or /) do the function and return
  if (specialChar(string)) return;

  //if there is an operator
  if (hasOperator) {
    if (string === "%") {
      calcInput("%");
      afterCheck = true;
      return;
    }
    calcInput("normalOperator", string);
    //if there is no operator
  } else {
    if (string === "%") {
      calcInput("%");
      afterCheck = true;
      return;
    }
    gOperator = string;
    hasOperator = true;
  }
}

//function that adds number to results and correct var
function addToResultsandVar(string) {
  if (addSpecialNum()) return;
  if (hasOperator) {
    resetVar("after");
    afterOperator = +(afterOperator.toString() + string.toString());
    resultsEL.innerHTML = afterOperator;
  } else {
    resetVar("before");
    if (beforeOperator !== 0) {
      beforeOperator = +(beforeOperator.toString() + string.toString());
    } else {
      beforeOperator = string;
    }
    resultsEL.innerHTML = beforeOperator;
  }
}

//function that resets correct var if needed
function resetVar(varName) {
  if (resultsEL.innerHTML && afterCheck) {
    resultsEL.innerHTML = "";
    afterCheck = false;
    switch (varName) {
      case "before":
        beforeOperator = 0;
        break;

      case "after":
        afterOperator = 0;
        break;
    }
  }
}

//fuunction that adds css to selected btn
function addBtnCss(divName) {
  btnEL = document.querySelector(`.${divName}`);
  btnEL.classList.add("purple-btn-invert");
  selectedBtn = btnEL;
}

//function that removes css from previus selcted btn
function removeBtnCss(divName) {
  if (selectedBtn && selectedBtn !== document.querySelector(`.${divName}`)) {
    selectedBtn.classList.remove("purple-btn-invert");
  }
}

//function that prevents clicking on the same operator and return true if it did
function preventSameClick(divName) {
  if (selectedBtn && selectedBtn === document.querySelector(`.${divName}`)) {
    if (hasOperator) {
      if (typeof afterOperator === "object") {
        if (!afterOperator.numbers[1]) {
          return true;
        }
      } else {
        if (!afterOperator) {
          return true;
        }
      }
    } else {
      if (typeof beforeOperator === "object") {
        if (!beforeOperator.numbers[1]) {
          return true;
        }
      } else {
        if (!beforeOperator) {
          return true;
        }
      }
    }
  }
}

//function that prevents clicking on different operator and return true if it did
function preventDiffClick(divName) {
  if (selectedBtn && selectedBtn !== document.querySelector(`.${divName}`)) {
    if (hasOperator) {
      if (typeof afterOperator === "object") {
        if (!afterOperator.numbers[1]) {
          return true;
        }
      } else {
        if (!afterOperator) {
          return true;
        }
      }
    } else {
      if (typeof beforeOperator === "object") {
        if (!beforeOperator.numbers[1]) {
          return true;
        }
      } else {
        if (!beforeOperator) {
          return true;
        }
      }
    }
  }
}

//function that adds numbers in special char mode and returns true if it did
function addSpecialNum(string) {
  if (isSpecialOperator) {
    if (hasOperator) {
      if (afterOperator.numbers[1]) {
        var value = afterOperator.numbers[1];
        var newValue = +(value.toString() + string.toString());
        afterOperator.numbers[1] = newValue;
      } else {
        afterOperator.numbers.push(string);
      }
      resultsEL.innerHTML = afterOperator.numbers[1];
    } else {
      if (beforeOperator.numbers[1]) {
        var value = beforeOperator.numbers[1];
        var newValue = +(value.toString() + string.toString());
        beforeOperator.numbers[1] = newValue;
      } else {
        beforeOperator.numbers.push(string);
      }
      resultsEL.innerHTML = beforeOperator.numbers[1];
    }
    return true;
  }
}

//function that handels X and / and returns true if it is one of them
function specialChar(string) {
  if (string === "X" || string === "/") {
    //checking what var to handle
    if (hasOperator) {
      createObject("afterOperator", string);
    } else {
      createObject("beforeOperator", string);
    }
    isSpecialOperator = true;
    return true;
  }
}

//fumction that creates objects for spaciel operators calculation
function createObject(varName, string) {
  if (varName === "afterOperator") {
    var value = afterOperator;
    afterOperator = { numbers: [value], operator: string };
  } else {
    var value = beforeOperator;
    beforeOperator = { numbers: [value], operator: string };
  }
}

//function that returns true if a string is a number
function isNumber(string) {
  if (!isNaN(parseInt(string))) {
    return true;
  }
}

//function that calculates according to condition
function calcInput(condition, string) {
  switch (condition) {
    case "=":
      if (isSpecialOperator) {
        if (calcEqualSpecial()) break;
      }
      if (beforeOperator && afterOperator && gOperator) {
        calcEqualNormal();
      }
      break;

    case "normalOperator":
      calcFunc(gOperator, beforeOperator, afterOperator, "beforOperator");
      gOperator = string;
      afterOperator = 0;
      break;

    case "%":
      calcPercent();
      break;

    case "specialCharBefore":
      calcFunc(
        beforeOperator.operator,
        beforeOperator.numbers[0],
        beforeOperator.numbers[1],
        "beforOperator"
      );
      break;

    case "specialCharAfter":
      calcFunc(
        afterOperator.operator,
        afterOperator.numbers[0],
        afterOperator.numbers[1],
        "afterOperator"
      );

      break;
  }
}

//function that calcs percent
function calcPercent() {
  var operation = operatorMapping["%"];
  var a = getA();
  var result = operation(a);
  resultsEL.innerHTML = result;
  setResult(result);
}

//function that sets value of result to correct var
function setResult(result) {
  if (hasOperator) {
    if (typeof afterOperator === "object") {
      afterOperator.numbers[1] = result;
    } else {
      afterOperator = result;
    }
  } else {
    if (typeof beforeOperator === "object") {
      beforeOperator.numbers[1] = result;
    } else {
      beforeOperator = result;
    }
  }
}

//function that returns correect value of 'a'
function getA() {
  if (hasOperator) {
    if (typeof afterOperator === "object") {
      return afterOperator.numbers[1];
    } else {
      return afterOperator;
    }
  } else {
    if (typeof beforeOperator === "object") {
      return beforeOperator.numbers[1];
    } else {
      return beforeOperator;
    }
  }
}

//function that calcs equal sign with special operators
function calcEqualSpecial() {
  if (hasOperator && afterOperator.numbers[1]) {
    calcSpecial("after");
    calcInput("=");
    return true;
  } else if (!hasOperator && beforeOperator.numbers[1]) {
    calcSpecial("before");
    return true;
  }
}

//function that calcs equal sign with normal operators
function calcEqualNormal() {
  calcFunc(gOperator, beforeOperator, afterOperator, "beforOperator");
  afterOperator = 0;
  hasOperator = false;
  isSpecialOperator = false;
  afterCheck = true;
}

//function that calcs
function calcFunc(operator, a, b, equalToResult) {
  var operation = operatorMapping[operator];
  var result = operation(a, b);
  if (equalToResult === "afterOperator") {
    afterOperator = result;
  } else {
    resultsEL.innerHTML = result;
    beforeOperator = result;
  }
}

//function that calcs special char
function calcSpecial(varName) {
  if (isSpecialOperator) {
    if (varName === "before") {
      calcInput("specialCharBefore");
    } else {
      calcInput("specialCharAfter");
    }
    isSpecialOperator = false;
  }
}

//function that cleans the results
function cleanResults() {
  resultsEL.innerHTML = 0;
  beforeOperator = 0;
  afterOperator = 0;
  hasOperator = false;
  afterCheck = false;
  isSpecialOperator = false;
}

//function that deletes the last character in results and vars
function deleteLastChar() {
  resultsEL.innerHTML = resultsEL.innerHTML.slice(0, -1);
  if (hasOperator) {
    var string = `${afterOperator}`;
    afterOperator = +string.slice(0, -1);
  } else {
    var string = `${beforeOperator}`;
    beforeOperator = +string.slice(0, -1);
  }
}

//function that changes the arithmetic of results correct var
function changeArithmetic() {
  if (resultsEL.innerHTML[0] === "-") {
    removeDash();
  } else {
    addDash();
  }
}

//function that adds dash to special operator numbers
//returns true if it did
function addDashToSpecial(varName) {
  if (isSpecialOperator) {
    switch (varName) {
      case "before":
        var modifiedString = `-${beforeOperator.numbers[1]}`;
        beforeOperator.numbers[1] = +modifiedString;
        return true;

      case "after":
        var modifiedString = `-${afterOperator.numbers[1]}`;
        afterOperator.numbers[1] = +modifiedString;
        return true;
    }
  }
}

///function that adds dash to normal numbers
function addDashToNormal(varName) {
  switch (varName) {
    case "before":
      var modifiedString = `-${beforeOperator}`;
      beforeOperator = +modifiedString;
      break;

    case "after":
      var modifiedString = `-${afterOperator}`;
      afterOperator = +modifiedString;
      break;
  }
}

//function that adds dash to correct var
function addDashToVar(varName) {
  switch (varName) {
    case "before":
      if (addDashToSpecial("before")) return;
      addDashToNormal("before");
      break;

    case "after":
      if (addDashToSpecial("after")) return;
      addDashToNormal("after");
      break;
  }
}

//function that adds '-'
function addDash() {
  if (hasOperator) {
    addDashToVar("after");
  } else {
    addDashToVar("before");
  }
  resultsEL.innerHTML = "-" + resultsEL.innerHTML;
}

//function that removes '-'
function removeDash() {
  if (hasOperator) {
    if (isSpecialOperator) {
      var string = `${afterOperator.numbers[1]}`;
      afterOperator.numbers[1] = +string.slice(
        1,
        afterOperator.numbers[1].length
      );
      sliceDash();
      return;
    }
    var string = `${afterOperator}`;
    afterOperator = +string.slice(1, afterOperator.length);
  } else {
    if (isSpecialOperator) {
      var string = `${beforeOperator.numbers[1]}`;
      beforeOperator.numbers[1] = +string.slice(
        1,
        beforeOperator.numbers[1].length
      );
      sliceDash();
      return;
    }
    var string = `${beforeOperator}`;
    beforeOperator = +string.slice(1, beforeOperator.length);
  }
  sliceDash();
}

//function that slices dash from innerhtml
function sliceDash() {
  resultsEL.innerHTML = resultsEL.innerHTML.slice(
    1,
    resultsEL.innerHTML.length
  );
}
