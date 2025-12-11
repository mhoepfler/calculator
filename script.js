const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let currentValue = "0";
let previousValue = null;
let currentOperator = null;
let overwrite = false; // nach "=" nächster Zahlendruck überschreibt

function updateDisplay() {
    display.value = currentValue;
}

function handleNumber(digit) {
    if (overwrite || currentValue === "0") {
        currentValue = digit;
        overwrite = false;
    } else {
        currentValue += digit;
    }
    updateDisplay();
}

function handleDot() {
    if (overwrite) {
        currentValue = "0.";
        overwrite = false;
    } else if (!currentValue.includes(".")) {
        currentValue += ".";
    }
    updateDisplay();
}

function applyOperator(operator) {
    if (previousValue === null) {
        previousValue = currentValue;
    } else if (!overwrite) {
        previousValue = calculate(previousValue, currentValue, currentOperator);
    }
    currentOperator = operator;
    overwrite = true;
    currentValue = previousValue.toString();
    updateDisplay();
}

function calculate(aStr, bStr, operator) {
    const a = parseFloat(aStr);
    const b = parseFloat(bStr);

    if (isNaN(a) || isNaN(b)) return "0";

    switch (operator) {
        case "plus":     return a + b;
        case "minus":    return a - b;
        case "multiply": return a * b;
        case "divide":   return b === 0 ? "Fehler" : a / b;
        default:         return b;
    }
}

function clearAll() {
    currentValue = "0";
    previousValue = null;
    currentOperator = null;
    overwrite = false;
    updateDisplay();
}

function changeSign() {
    if (currentValue === "0") return;
    if (currentValue.startsWith("-")) {
        currentValue = currentValue.slice(1);
    } else {
        currentValue = "-" + currentValue;
    }
    updateDisplay();
}

function percent() {
    const value = parseFloat(currentValue);
    if (isNaN(value)) return;
    currentValue = (value / 100).toString();
    updateDisplay();
}

function equals() {
    if (currentOperator === null || previousValue === null) return;
    const result = calculate(previousValue, currentValue, currentOperator);
    currentValue = result.toString();
    previousValue = null;
    currentOperator = null;
    overwrite = true;
    updateDisplay();
}

// Event Delegation: ein Listener für alle Buttons
buttons.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;

    const number = target.getAttribute("data-number");
    const operator = target.getAttribute("data-operator");
    const action = target.getAttribute("data-action");

    if (number !== null) {
        handleNumber(number);
    } else if (operator !== null) {
        applyOperator(operator);
    } else if (action !== null) {
        switch (action) {
            case "clear":
                clearAll();
                break;
            case "sign":
                changeSign();
                break;
            case "percent":
                percent();
                break;
            case "dot":
                handleDot();
                break;
            case "equals":
                equals();
                break;
        }
    }
});

updateDisplay();
