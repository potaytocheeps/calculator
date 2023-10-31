calculator = {
    methods: {
        '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
        '−': (firstOperand, secondOperand) => firstOperand - secondOperand,
        '×': (firstOperand, secondOperand) => firstOperand * secondOperand,
        '÷': (firstOperand, secondOperand) => {
                            if (secondOperand === 0)
                            {
                                return 'Cannot divide by 0';
                            }
                            else
                            {
                                return firstOperand / secondOperand
                            }
                        }
    },

    operate: function(operator, firstOperand, secondOperand)
    {
        return this.methods[operator](firstOperand, secondOperand);
    }
}

function disableOperatorButtons(operatorButtons)
{
    operatorButtons.forEach((operatorButton) => {
        operatorButton.disabled = true;
    });
}

function enableOperatorButtons(operatorButtons)
{
    operatorButtons.forEach((operatorButton) => {
        operatorButton.disabled = false;
    });
}

function addFunctionalityToNumberButtons(calculatorElements, displayMessage)
{
    const numberButtons = document.querySelectorAll('.number-button');
    let displayMessageArray = null;

    numberButtons.forEach((numberButton) => {
        numberButton.addEventListener('click', (event) => {
            if (calculatorElements.calculationIsComplete)
            {
                displayMessage.textContent = '';
                calculatorElements.calculationIsComplete = false;
            }

            displayMessage.textContent += event.target.textContent;

            displayMessageArray = displayMessage.textContent.trimEnd().split(' ');

            enableOperatorButtons(calculatorElements.operatorButtons);

            // Only enable equals button when an operation contains both operands and operator
            if (displayMessageArray.length >= 3)
            {
                calculatorElements.equalsButton.disabled = false;
            }
        });
    });
}

function addFunctionalityToOperatorButtons(calculatorElements, displayMessage)
{
    let displayMessageArray = null;

    calculatorElements.operatorButtons.forEach((operatorButton) => {
        operatorButton.disabled = true;

        operatorButton.addEventListener('click', (event) => {
            displayMessage.textContent += ' ' + event.target.textContent + ' ';

            disableOperatorButtons(calculatorElements.operatorButtons);

            displayMessageArray = displayMessage.textContent.trimEnd().split(' ');

            // If the user has entered more than one operator in a calculation, simulate
            // the clicking of the "=" button, and use the result of the calculation as the
            // first operand of a new calculation, adding to it the second operator entered
            if (displayMessageArray.length > 3)
            {
                calculatorElements.equalsButton.dispatchEvent(new Event('click'));

                // Only add the operator to the display if the display does not contain a letter.
                // This prevents the user from creating a calculation after they try to divide
                // by 0, and a message appears on the display
                if (!displayMessage.textContent.match(/[a-z]/))
                {
                    displayMessage.textContent += ' ' + event.target.textContent + ' ';
                    calculatorElements.calculationIsComplete = false;
                }
            }
            else
            {
                calculatorElements.calculationIsComplete = false;
            }

            // If an operator is used, that means the user is currently entering the second
            // operand, so the decimal button should be enabled again if it had been previously
            // disabled with the first operand
            calculatorElements.decimalButton.disabled = false;
        });
    });
}

function addFunctionalityToEqualsButton(calculatorElements, displayMessage, previousCalculationMessage)
{
    calculatorElements.equalsButton.addEventListener('click', () => {
        const displayArray = displayMessage.textContent.split(' ');
        const firstOperand = Number(displayArray[0]);
        const operator = displayArray[1];
        const secondOperand = Number(displayArray[2]);

        previousCalculationMessage.textContent = displayMessage.textContent + ' = ';
        displayMessage.textContent = '';

        displayMessage.textContent = calculator.operate(operator, firstOperand, secondOperand);
        previousCalculationMessage.textContent += displayMessage.textContent;

        calculatorElements.equalsButton.disabled = true;
        calculatorElements.calculationIsComplete = true;
        calculatorElements.decimalButton.disabled = false;

        // If the user previously tried to divide by 0, disable the operator buttons to prevent
        // an error in calculation
        if (displayMessage.textContent.match(/[a-z]/))
        {
            disableOperatorButtons(calculatorElements.operatorButtons);
        }
        // Round answers with long decimals up to 4 decimal places or 4 significant figures
        // to avoid overflow of the display
        else if (!Number.isInteger(Number(displayMessage.textContent)))
        {
            if (Number(displayMessage.textContent) > 1)
            {
                displayMessage.textContent =
                        Number(displayMessage.textContent).toFixed(4) * 1;
            }
            else
            {
                displayMessage.textContent =
                        Number(displayMessage.textContent).toPrecision(4) * 1;
            }
        }
    });
}

function addFunctionalityToClearButton(calculatorElements, displayMessage, previousCalculationMessage)
{
    const clearButton = document.querySelector('.button-clear');

    clearButton.addEventListener('click', () => {
        displayMessage.textContent = '';
        previousCalculationMessage.textContent = '';
        disableOperatorButtons(calculatorElements.operatorButtons);
        calculatorElements.equalsButton.disabled = true;
        calculatorElements.decimalButton.disabled = false;
    });
}

function addFunctionalityToDecimalButton(calculatorElements, displayMessage)
{
    calculatorElements.decimalButton.addEventListener('click', (event) => {
        if (calculatorElements.calculationIsComplete)
        {
            displayMessage.textContent = '';
            calculatorElements.calculationIsComplete = false;
        }

        displayMessage.textContent += event.target.textContent;

        // Only allow one decimal point to be used per operand
        calculatorElements.decimalButton.disabled = true;

        disableOperatorButtons(calculatorElements.operatorButtons);
    });
}

function deleteCharactersFromDisplay(displayString, displayMessage, decimalButton)
{
    if (displayString.endsWith(' '))
    {
        // Delete the operator and the two added spaces on each side
        displayMessage.textContent = displayString.slice(0, -3);
    }
    else
    {
        // If the character to be deleted is a decimal point, enable the
        // decimal button for use again
        if (displayString.endsWith('.'))
        {
            decimalButton.disabled = false;
        }

        displayMessage.textContent = displayString.slice(0, -1);
    }
}

function enableOrDisableButtons(displayArray, operatorButtons, decimalButton, equalsButton)
{
    // Case: Only the first operand is in the display
    if (displayArray.length === 1)
    {
        if (displayArray[0] === '')
        {
            disableOperatorButtons(operatorButtons);
            equalsButton.disabled = true;
            return;
        }

        enableOperatorButtons(operatorButtons);

        if (displayArray[0].includes('.'))
        {
            decimalButton.disabled = true;
        }
    }
    // Case: The operator and first operand are in the display
    else if (displayArray.length === 2)
    {
        disableOperatorButtons(operatorButtons);
        equalsButton.disabled = true;
    }
    // Case: Both operands and operator are in the display
    else if (displayArray.length === 3)
    {
        equalsButton.disabled = false;
        enableOperatorButtons(operatorButtons);
    }


    if (displayArray[displayArray.length - 1].endsWith('.'))
    {
        disableOperatorButtons(operatorButtons);
        equalsButton.disabled = true;
    }
}

function addFunctionalityToBackspaceButton(calculatorElements, displayMessage)
{
    const backspaceButton = document.querySelector('.button-backspace');

    backspaceButton.addEventListener('click', () => {
        if (displayMessage.textContent === '') return;

        if (calculatorElements.calculationIsComplete)
        {
            displayMessage.textContent = '';
            disableOperatorButtons(calculatorElements.operatorButtons);
            return;
        }

        let displayString = displayMessage.textContent;

        deleteCharactersFromDisplay(displayString, displayMessage, calculatorElements.decimalButton);

        let displayArray = displayMessage.textContent.trimEnd().split(' ');

        enableOrDisableButtons(displayArray, calculatorElements.operatorButtons,
                                calculatorElements.decimalButton, calculatorElements.equalsButton);
    });
}

function addFunctionalityToButtons()
{
    // Calculator elements that need to be accessed in more than one button function
    const calculatorElements = {
        operatorButtons: document.querySelectorAll('.operator-button'),
        equalsButton: document.querySelector('.button-equals'),
        decimalButton: document.querySelector('.button-decimal'),
        calculationIsComplete: false,
    }

    // Declared outside of calculatorElements object to improve readability of code since
    // it is used a lot throughout the functions. This way, I can avoid needing to access
    // the calculatorElements each time I need to access the displayMessage
    const displayMessage = document.querySelector('.display-message');
    const previousCalculationMessage = document.querySelector('.previous-calculation-message');

    calculatorElements.equalsButton.disabled = true;

    addFunctionalityToNumberButtons(calculatorElements, displayMessage);

    addFunctionalityToOperatorButtons(calculatorElements, displayMessage);

    addFunctionalityToEqualsButton(calculatorElements, displayMessage, previousCalculationMessage);

    addFunctionalityToClearButton(calculatorElements, displayMessage, previousCalculationMessage);

    addFunctionalityToDecimalButton(calculatorElements, displayMessage);

    addFunctionalityToBackspaceButton(calculatorElements, displayMessage);
}

function addKeyboardSupport()
{
    window.addEventListener('keydown', (event) => {
        if (event.key >= 0 && event.key <= 9)
        {
            document.querySelector(`.button-${event.key}`).click();
            return;
        }

        switch (event.key)
        {
            case '+':
                document.querySelector('.button-add').click();
                break;
            case '-':
                document.querySelector('.button-subtract').click();
                break;
            case '*':
            case 'x':
                document.querySelector('.button-multiply').click();
                break;
            case '/':
                document.querySelector('.button-divide').click();
                break;
            case '=':
            case 'Enter':
                document.querySelector('.button-equals').click();
                break;
            case '.':
                document.querySelector('.button-decimal').click();
                break;
            case 'Backspace':
                document.querySelector('.button-backspace').click();
                break;
            case 'c':
                document.querySelector('.button-clear').click();
                break;
        }
    });
}

addFunctionalityToButtons();
addKeyboardSupport();
