calculator = {
    methods: {
        '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
        '−': (firstOperand, secondOperand) => firstOperand - secondOperand,
        '×': (firstOperand, secondOperand) => firstOperand * secondOperand,
        '÷': (firstOperand, secondOperand) => firstOperand / secondOperand,
    },

    operate: function(operator, firstOperand, secondOperand)
    {
        return this.methods[operator](firstOperand, secondOperand);
    }
}

function addFunctionalityToButtons()
{
    const numberButtons = document.querySelectorAll('.number-button');
    const displayMessage = document.querySelector('.display-message');
    const operatorButtons = document.querySelectorAll('.operator-button');
    const equalsButton = document.querySelector('.button-equals');

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

    equalsButton.addEventListener('click', () => {
        const displayArray = displayMessage.textContent.split(' ');
        const firstOperand = Number(displayArray[0]);
        const operator = displayArray[1];
        const secondOperand = Number(displayArray[2]);

        displayMessage.textContent = '';

        displayMessage.textContent = calculator.operate(operator, firstOperand, secondOperand);
    });
}

addFunctionalityToButtons();
