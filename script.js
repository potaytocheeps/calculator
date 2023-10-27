function add(numberA, numberB)
{
    return numberA + numberB;
}

function subtract(numberA, numberB)
{
    return numberA - numberB;
}

function multiply(numberA, numberB)
{
    return numberA * numberB;
}

function divide(numberA, numberB)
{
    return numberA / numberB;
}

function operate(operator, numberA, numberB)
{
    let result = null;

    switch(operator)
    {
        case '+':
            result = add(numberA, numberB);
            break;
        case '−':
            result = subtract(numberA, numberB);
            break;
        case '×':
            result = multiply(numberA, numberB);
            break;
        case '÷':
            result = divide(numberA, numberB);
            break;
    }

    return result;
}

// This function needed to be declared separately to make use of function closures
// with event handlers
function addFunctionalityToEqualsButton(displayMessage)
{
    const equalsButton = document.querySelector('.button-equals');

    equalsButton.addEventListener('click', () => {
        // The displayMessage DOM element contains a string in the form of
        // [operand] [operator] [operand], for example: "2 + 3"
        const displayArray = displayMessage.textContent.split(' ');
        const firstOperand = Number(displayArray[0]);
        const operator = displayArray[1];
        const secondOperand = Number(displayArray[2]);

        displayMessage.textContent = '';

        displayMessage.textContent = operate(operator, firstOperand, secondOperand);
    });
}

function addFunctionalityToButtons()
{
    const numberButtons = document.querySelectorAll('.number-button');
    const displayMessage = document.querySelector('.display-message');
    const operatorButtons = document.querySelectorAll('.operator-button');

    numberButtons.forEach((numberButton) => {
        numberButton.addEventListener('click', (event) => {
            displayMessage.textContent += event.target.textContent;
        });
    });

    operatorButtons.forEach((operatorButton) => {
        operatorButton.addEventListener('click', (event) => {
            displayMessage.textContent += ' ' + event.target.textContent + ' ';
        });
    });

    addFunctionalityToEqualsButton(displayMessage);
}

addFunctionalityToButtons();
