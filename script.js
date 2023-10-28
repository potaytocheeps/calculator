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

function addFunctionalityToButtons()
{
    const numberButtons = document.querySelectorAll('.number-button');
    const displayMessage = document.querySelector('.display-message');
    const operatorButtons = document.querySelectorAll('.operator-button');
    const equalsButton = document.querySelector('.button-equals');
    const clearButton = document.querySelector('.button-clear');
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

        // If the user previously tried to divide by 0, disable the operator buttons to prevent
        // an error in calculation
        if (displayMessage.textContent.match(/[a-z]/))
        {
            disableOperatorButtons(operatorButtons);
        }
    });

    clearButton.addEventListener('click', () => {
        displayMessage.textContent = '';
        disableOperatorButtons(operatorButtons);
        equalsButton.disabled = true;
    });
}

addFunctionalityToButtons();
