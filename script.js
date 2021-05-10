//Math functions
function add(x,y){
	return x + y;
}

function subtract (x,y) {
	return x - y;
}

function divide (x,y) {
	return x / y;
	
}

function multiply (x,y) {
	return x * y;
}

//Checks for overflow from user inputting too many numbers
function checkForInputOverflow(){
	if(displayedNumbers.length > 12){
		display.textContent = "Error: Overflow";
		return true;
	}
	else{
		return false;
	}
}

//Checks for overflow from result containing too many numbers
function checkForResultOverflow(result){
	if(result.length > 12){
		display.textContent = "Error: Overflow";
		return true;
	}
	else{
		return false;
	}
}


//Inputs value from button on calculator being pressed
function inputValueFromButton(){
	//Inputs number if not overflowed
	if(!checkForInputOverflow()){
		//Checks for duplicate decimals before inputting
		if(this.textContent == '.'){
			if(!displayedNumbers.includes('.')){
				displayedNumbers.push(this.textContent);
				display.textContent = displayedNumbers.join('');
			}
		}
		//Input non decimal digit
		else{
			displayedNumbers.push(this.textContent);	
			display.textContent = displayedNumbers.join('');
		}
	}

}

//Inputs decimal from user pressing keyboard
function inputDecimalFromKeyboard(){
	//Inputs decimal character if not overflowed or duplicate
	if(!checkForInputOverflow()){
		if(!displayedNumbers.includes('.')){
			displayedNumbers.push('.');
			display.textContent = displayedNumbers.join('');
		}
	}
}

//Undo the most recently entered input
function undoInput(){
	//If theres only one number displayed, remove and replace with 0
	if(displayedNumbers.length == 1){
		displayedNumbers.pop();
		display.textContent = 0;
	}
	//If more than one number, remove the most recently entered
	else if (displayedNumbers.length > 1){
		displayedNumbers.pop();
		display.textContent = displayedNumbers.join('');
	}
	
}


//Clears display
function clearDisplay(){
	//Resets all relevant values to clear display
	displayedNumbers.length = 0;
	expression.length = 0;
	display.textContent = 0;
}

//Adds operator from calculator button being pressed to expression
function addOperatorFromButton(){
	//If there are already numbers in the expression, it means this time the operator pressed is being used to
	//chain the expression
	if(expression.length > 1){
		//Display the expression up until right before the current operator was pressed
		evaluateExpression();
		//Push the result as the first number of new expression
		expression.push(display.textContent);
		//Dont push = to be used as an operator, push the most recently pressed operator
		if(this.textContent != '='){
			expression.push(this.textContent);
		}
		displayedNumbers.length = 0;
	}
	//First push the number entered and then the operator pressed
	else{
		//Prevent duplicate if expression continues chain after an = is used
		if(!expression.includes(display.textContent)){
			expression.push(display.textContent);
		}
		expression.push(this.textContent);
		//Refresh display when next number is entered
		displayedNumbers.length = 0;
	}	
}


//Adds operator from keyboard being pressed to expression
function addOperatorFromKeyboard(operator){
	if(expression.length > 1){
		evaluateExpression();
		expression.push(display.textContent);
		//Dont push = to be used as an operator
		if(this.textContent != '='){
			expression.push(operator);
		}
		displayedNumbers.length = 0;
	}
	else{
		//Prevent duplicate if expression continues chain after an = is used
		if(!expression.includes(display.textContent)){
			expression.push(display.textContent);
		}
		expression.push(operator);
		displayedNumbers.length = 0;
	}
}

//Checks if result contains a decimal
function checkForDecimalResult(result){
	let decimalIndex = result.toString().indexOf('.');	
	if(decimalIndex != -1){
		return true;
	}
	else{
		return false;
	}
}

//Rounds any long decimal result to 3 places
function formatDecimalResult(result){
	let decimalIndex = result.toString().indexOf('.');
	//Rounds if result contains more than 3 decimals
	if(result.toString().length - decimalIndex > 4){
		result = parseFloat(result.toFixed(3));
	}

	//Update display with result if not overflowed
	if(!checkForResultOverflow(result.toString())){
		display.textContent = result;
	}
}

function evaluateExpression(){
	//Has to be some previous numbers in order for an expression to be evaluated
	if(expression.length > 1){
		//Push the most recently input number
		expression.push(display.textContent);
		
		let result;
		let divByZero = false;
		let x = expression.shift(); //First number in expression
		let y = expression.pop();	//Second number in expression

		
		//Determines if either numbers were a float or int
		if(x.includes('.')){
			x = parseFloat(x);
		}
		else{
			x = parseInt(x);
		}

		if(y.includes('.')){
			y = parseFloat(y);
		}
		else{			
			y = parseInt(y);
		}

		//Determine what math operation to use based on the operator
		switch(expression.pop()) {
			case '+':
				result = add(x,y);		
				break;
			case '-':
				result = subtract(x,y);
				break;
			case '÷':
				if(y == 0){
					divByZero = true;
				}
				else{
					result = divide(x,y);
				}		
				break;		
			case '*':
				result = multiply(x,y);		
		}
		if(divByZero){
			display.textContent = "Error: DivByZero";
		}
		else{
			if(checkForDecimalResult(result)){
				formatDecimalResult(result);
			}
			else{
				if(!checkForResultOverflow(result.toString())){
					display.textContent = result;
				}
			}
		}
		displayedNumbers.length = 0;
	}
}

//-------------------MAIN---------------------------//
const display = document.querySelector('#display');
const undo = document.querySelector('#undo');
const clear = document.querySelector('#clear');
const equals = document.querySelector('#equals');

let displayedNumbers = [];
let expression = [];
let numberButtons = Array.from(document.querySelectorAll('.numbers'));
let operators = Array.from(document.querySelectorAll('.operators'));

undo.addEventListener('click', undoInput);
clear.addEventListener('click', clearDisplay);
equals.addEventListener('click', evaluateExpression);

//Add functionality to number buttons
for (let i = 0; i < numberButtons.length; i++) {
	numberButtons[i].addEventListener('click', inputValueFromButton);
}

//Add functionality to operator buttons
for (let i = 0; i < operators.length; i++) {
	operators[i].addEventListener('click', addOperatorFromButton);
}

//Keyboard functionality
document.addEventListener("keydown", (event) => {
	if(event.key == "Backspace"){
		undoInput();
	}
	else if(event.key == "c"){
		clearDisplay();
	}
	else if(event.key == "Enter"){
		evaluateExpression();
	}
	//Numbers
	else if(!isNaN(parseInt(event.key))){
		//Inputs number if not overflowed
		if(!checkForInputOverflow()){
			displayedNumbers.push(event.key);	
			display.textContent = displayedNumbers.join('');
		}
	}
	//Decimal
	else if(event.key == '.'){
		inputDecimalFromKeyboard();
	}
	//Operators
	else if(event.key == '+' ||
			event.key == '-' || 
			event.key == '*'   ){
				addOperatorFromKeyboard(event.key);	
	}
	//Division symbol
	else if(event.key == '/'){
		addOperatorFromKeyboard('÷');
	}
});



