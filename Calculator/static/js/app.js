(function () {
	const displayEl = document.querySelector('#display .text-calc-display-text');
	const buttons = document.querySelectorAll('.btn');

	let display = '0';
	let previousValue = null;
	let operation = null;
	let waitingForNewValue = false;

	function setDisplay(value) {
		display = value;
		displayEl.textContent = formatDisplay(display);
	}

	function inputNumber(num) {
		if (waitingForNewValue) {
			setDisplay(num);
			waitingForNewValue = false;
		} else {
			setDisplay(display === '0' ? num : display + num);
		}
	}

	function inputDecimal() {
		if (waitingForNewValue) {
			setDisplay('0.');
			waitingForNewValue = false;
		} else if (display.indexOf('.') === -1) {
			setDisplay(display + '.');
		}
	}

	function clearAll() {
		setDisplay('0');
		previousValue = null;
		operation = null;
		waitingForNewValue = false;
		updateActiveOperator(null);
	}

	function calculate(firstValue, secondValue, op) {
		switch (op) {
			case '+':
				return firstValue + secondValue;
			case '-':
				return firstValue - secondValue;
			case '×':
				return firstValue * secondValue;
			case '÷':
				return secondValue !== 0 ? firstValue / secondValue : 0;
			default:
				return secondValue;
		}
	}

	function performOperation(nextOperation) {
		const inputValue = parseFloat(display);
		if (previousValue === null) {
			previousValue = inputValue;
		} else if (operation) {
			const currentValue = previousValue || 0;
			const newValue = calculate(currentValue, inputValue, operation);
			setDisplay(String(newValue));
			previousValue = newValue;
		}
		waitingForNewValue = true;
		operation = nextOperation || null;
		updateActiveOperator(operation);
	}

	function updateActiveOperator(op) {
		for (const btn of document.querySelectorAll('.btn.operator')) {
			btn.classList.toggle('active', btn.getAttribute('data-op') === op);
		}
	}

	function formatDisplay(value) {
		if (value.length > 12) {
			const num = parseFloat(value);
			if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
				return num.toExponential(5);
			}
			return num.toPrecision(10);
		}
		return value;
	}

	for (const btn of buttons) {
		btn.addEventListener('click', () => {
			const num = btn.getAttribute('data-num');
			const op = btn.getAttribute('data-op');
			const action = btn.getAttribute('data-action');

			if (num) {
				inputNumber(num);
				return;
			}
			if (op) {
				performOperation(op);
				return;
			}
			if (action === 'decimal') {
				inputDecimal();
				return;
			}
			if (action === 'clear') {
				clearAll();
				return;
			}
			if (action === 'backspace') {
				const newValue = display.slice(0, -1) || '0';
				setDisplay(newValue);
				return;
			}
			if (action === 'equals') {
				performOperation();
				return;
			}
		});
	}

	window.addEventListener('keydown', (event) => {
		const { key } = event;
		if (key >= '0' && key <= '9') {
			inputNumber(key);
			return;
		}
		if (key === '.') {
			inputDecimal();
			return;
		}
		if (key === '+' || key === '-') {
			performOperation(key);
			return;
		}
		if (key === '*') {
			performOperation('×');
			return;
		}
		if (key === '/') {
			event.preventDefault();
			performOperation('÷');
			return;
		}
		if (key === 'Enter' || key === '=') {
			performOperation();
			return;
		}
		if (key === 'Escape' || key === 'c' || key === 'C') {
			clearAll();
		}
	});
})();
