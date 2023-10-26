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
        case '-':
            result = subtract(numberA, numberB);
            break;
        case '*':
            result = multiply(numberA, numberB);
            break;
        case '/':
            result = divide(numberA, numberB);
            break;
    }

    return result;
}

function addFunctionalityToButtons()
{
    const numberButtons = document.querySelectorAll('.number-button');
    const displayMessage = document.querySelector('.display-message');

    numberButtons.forEach((numberButton) => {
        numberButton.addEventListener('click', (event) => {
            displayMessage.textContent += event.target.textContent;
        });
    });
}

addFunctionalityToButtons();
