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
    }
    // Case: Both operands and the operator are in the display
    else if (displayArray.length === 3)
    {
        if (displayArray[displayArray.length - 1].endsWith('.'))
        {
            disableOperatorButtons(operatorButtons);
            equalsButton.disabled = true;
        }
    }
}

function addFunctionalityToButtons()
{
    const numberButtons = document.querySelectorAll('.number-button');
    const displayMessage = document.querySelector('.display-message');
    const operatorButtons = document.querySelectorAll('.operator-button');
    const equalsButton = document.querySelector('.button-equals');
    const clearButton = document.querySelector('.button-clear');
    const decimalButton = document.querySelector('.button-decimal');
    const backspaceButton = document.querySelector('.button-backspace');
    let displayMessageArray = null;
    let calculationIsComplete = true;
    equalsButton.disabled = true;

    numberButtons.forEach((numberButton) => {
        numberButton.addEventListener('click', (event) => {
            if (calculationIsComplete)
            {
                displayMessage.textContent = '';
                calculationIsComplete = false;
            }

            displayMessage.textContent += event.target.textContent;

            displayMessageArray = displayMessage.textContent.trimEnd().split(' ');

            enableOperatorButtons(operatorButtons);

            // Only enable equals button when an operation contains both operands and operator
            if (displayMessageArray.length >= 3)
            {
                equalsButton.disabled = false;
            }
        });
    });

    operatorButtons.forEach((operatorButton) => {
        operatorButton.disabled = true;

        operatorButton.addEventListener('click', (event) => {
            displayMessage.textContent += ' ' + event.target.textContent + ' ';

            disableOperatorButtons(operatorButtons);

            displayMessageArray = displayMessage.textContent.trimEnd().split(' ');

            // If the user has entered more than one operator in a calculation, simulate
            // the clicking of the "=" button, and use the result of the calculation as the
            // first operand of a new calculation, adding to it the second operator entered
            if (displayMessageArray.length > 3)
            {
                equalsButton.dispatchEvent(new Event('click'));

                // Only add the operator to the display if the display does not contain a letter.
                // This prevents the user from creating a calculation after they try to divide
                // by 0, and a message appears on the display
                if (!displayMessage.textContent.match(/[a-z]/))
                {
                    displayMessage.textContent += ' ' + event.target.textContent + ' ';
                    calculationIsComplete = false;
                }
            }
            else
            {
                calculationIsComplete = false;
            }

            // If an operator is used, that means the user is currently entering the second
            // operand, so the decimal button should be enabled again if it had been previously
            // disabled with the first operand
            decimalButton.disabled = false;
        });
    });

    equalsButton.addEventListener('click', () => {
        const displayArray = displayMessage.textContent.split(' ');
        const firstOperand = Number(displayArray[0]);
        const operator = displayArray[1];
        const secondOperand = Number(displayArray[2]);

        displayMessage.textContent = '';

        displayMessage.textContent = calculator.operate(operator, firstOperand, secondOperand);

        equalsButton.disabled = true;
        calculationIsComplete = true;
        decimalButton.disabled = false;

        // If the user previously tried to divide by 0, disable the operator buttons to prevent
        // an error in calculation
        if (displayMessage.textContent.match(/[a-z]/))
        {
            disableOperatorButtons(operatorButtons);
        }
        // Round answers with long decimals up to 4 decimal places or 4 significant figures
        // to avoid overflow of the display
        else if (!Number.isInteger(Number(displayMessage.textContent)))
        {
            if (Number(displayMessage.textContent) > 1)
            {
                displayMessage.textContent = Number(displayMessage.textContent).toFixed(4) * 1;
            }
            else
            {
                displayMessage.textContent = Number(displayMessage.textContent).toPrecision(4) * 1;
            }
        }
    });

    clearButton.addEventListener('click', () => {
        displayMessage.textContent = '';
        disableOperatorButtons(operatorButtons);
        equalsButton.disabled = true;
        decimalButton.disabled = false;
    });

    decimalButton.addEventListener('click', (event) => {
        if (calculationIsComplete)
        {
            displayMessage.textContent = '';
            calculationIsComplete = false;
        }

        displayMessage.textContent += event.target.textContent;

        // Only allow one decimal point to be used per operand
        decimalButton.disabled = true;

        disableOperatorButtons(operatorButtons);
    });

    backspaceButton.addEventListener('click', () => {
        if (displayMessage.textContent === '') return;

        if (calculationIsComplete)
        {
            displayMessage.textContent = '';
            return;
        }

        let displayString = displayMessage.textContent;

        deleteCharactersFromDisplay(displayString, displayMessage, decimalButton);

        let displayArray = displayMessage.textContent.trimEnd().split(' ');

        enableOrDisableButtons(displayArray, operatorButtons, decimalButton, equalsButton);
    });
}

addFunctionalityToButtons();
