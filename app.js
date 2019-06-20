//Private stand alone controller usin IIFE and Closure

// Budget Controller 
var budgetConroller = (function(){

	var Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	Expense.prototype.calcPercentage = function(totalIncome){
		if(totalIncome > 0){
			this.percentage = Math.round((this.value / totalIncome) * 100 );
		}else{
			this.percentage = -1;
		}
	}

	Expense.prototype.getPercentage = function(){
		return this.percentage;
	}

	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var calculateTotal = function(type){
		var sum = 0;
		data.allItems[type].forEach( cur => {
			sum += cur.value;
		});
		data.totals[type] = sum;
	};

	var data = {

		allItems:{
			exp: [],
			inc: [],
		},
		totals:{
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1
};

	return{
		addItem: function(type, dec, val){
			var newItem, ID;

			//Create new ID
			if(data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			}else{
				ID = 0;
			}
			
			//Create new item based on type is 'inc' or 'exp'
			if (type === "exp") {
				newItem = new Expense(ID, dec, val);
			}else if (type === "inc") {
				newItem = new Income(ID, dec, val);
			}

			// push it into our data structucture
			data.allItems[type].push(newItem);

			// Return the new element
			return newItem;
		},

		deleteItem: function(type, id){
			var ids, index;

			ids = data.allItems[type].map(function(cur) {
				return cur.id;
			});

			index = ids.indexOf(id);

			if(index !== -1){
				data.allItems[type].splice(index, 1);
			}
		},

		calculateBudget: function(){

			//1. calculate total income and expense 
			calculateTotal('exp');
			calculateTotal('inc');

			//2. calculate the budget : income - expense
			data.budget = data.totals.inc - data.totals.exp;

			//3. calculate the percentage of income we get
			if(data.totals.inc > 0){
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			}else{
				data.percentage = -1;
			}

		},

		calculatePercentages: function(){
			data.allItems.exp.forEach( function(cur){
				cur.calcPercentage(data.totals.inc);
			});
		},

		getPercentages: function(){
			var allPerc = data.allItems.exp.map(function(cur) {
				return cur.getPercentage();
			});
			return allPerc;
		},

		getBudget: function(){
			return{
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			};
		},

		testing: function(){
			console.log(data);
		}
	};


})();


// UI Controller 
var UIController = (function(){

	var DOMstrings = {
		inputType: ".add__type",
		inputDescription: ".add__description",
		inputValue: ".add__value",
		inputBtn: ".add__btn",
		incomeContainer: ".income__list",
		expensesContainer: ".expenses__list",
		budgetLable: '.budget__value',
		incomeLable: '.budget__income--value',
		expenseLable: '.budget__expenses--value',
		percentageLable: '.budget__expenses--percentage',
		container: '.container',
		expensesPercLabel: '.item__percentage',
		dateLable: '.budget__title--month'
	};

	var formatNumber =  function(num, type){

		var numSplit, int, dec, type;

		/* RULES
			+ || - sign before || after num
			Exectly 2 decimal points for each num
			Comma for seperating thousands 
		*/
		num = Math.abs(num);
		num = num.toFixed(2);

		numSplit = num.split('.');

		int = numSplit[0];
		if(int.length > 3){
			int = int.substr(0, int.length - 3) + "," + int.substr(int.length-3, 3);
		}

		dec = numSplit[1];

		// type === "exp" ? sign = '-' : sign = '+';

		return (type === "exp" ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;
	};

	var nodeListForEach = function(list, callback){
		for(var i=0; i<list.length; i++){
			callback(list[i], i);
		}
	};

	return{
		getInput: function(){
			return{
				type: document.querySelector(DOMstrings.inputType).value, // value should be eighter inc or exp
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},

		addListItem: function(obj, type){
			var html, element, newHtml;
			// Create HTML String with placeholder text

			if(type === 'inc'){
				element = DOMstrings.incomeContainer;
				html ='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			} else if(type === 'exp') {
				element = DOMstrings.expensesContainer;
				html ='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}

			//Replace the placeholder with actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

			// Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		deleteListItem: function(selectorID){
			var el;
			el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);

		},

		clearField: function(){
			var fileds, fieldArr;
			
			fileds = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

			fieldArr = Array.prototype.slice.call(fileds);

			fieldArr.forEach( array => {
				 array.value = "";
			});

			fieldArr[0].focus();
		},

		displayBudget: function(obj){

			var type;
			obj.budget > 0 ? type = "inc" : type = "exp";

			document.querySelector(DOMstrings.budgetLable).textContent = formatNumber(obj.budget,type);
			document.querySelector(DOMstrings.incomeLable).textContent = formatNumber(obj.totalInc,'inc');
			document.querySelector(DOMstrings.expenseLable).textContent = formatNumber(obj.totalExp,'exp');
			
			if(obj.percentage > 0){
				document.querySelector(DOMstrings.percentageLable).textContent = obj.percentage + '%';
			}else{
				document.querySelector(DOMstrings.percentageLable).textContent = '---';
			}
		},

		displayPercentages: function(percentages){
			var fields;

			fields = document.querySelectorAll(DOMstrings.expensesPercLabel);


			nodeListForEach(fields, function(current, index){
				if(percentages[index] > 0){
					current.textContent = percentages[index] + '%';
				}else{
					current.textContent = '---';
				}
			});
		},

		displayDate: function(){

			var now, month, months, year;
			now = new Date();
			months = ["January", "February", "March", "April", "May", "June", "July", "Augest", "September", "October", "November", "December"]
			month = now.getMonth();
			year = now.getFullYear();
			document.querySelector(DOMstrings.dateLable).textContent = months[month] + ' ' + year;

		},

		changedType: function(){
			var fields = document.querySelectorAll(
				DOMstrings.inputType + ',' +
				DOMstrings.inputDescription + ',' +
				DOMstrings.inputValue);
			
			nodeListForEach(fields, function(cur){
				cur.classList.toggle('red-focus');
			});

			document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

		},

		getDOMstrings: function(){
			return DOMstrings;
		}
	};

})();



// Global App Controller 
var controller = (function(budgetCtrl, UICtrl){

	var setupEventListeners = function(){

		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener("keypress", function(event){
			if(event.keyCode === 13 || event.which === 13){
				ctrlAddItem();
			}
		});

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
		document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType)

	}

	var updateBudget = function(){

		// 1. Calculate the budget
		budgetCtrl.calculateBudget();

		//2. Return the budget
		var budget = budgetCtrl.getBudget();

		// 3. Display the budget on the UI
		UICtrl.displayBudget(budget);
	}

	var updatePercentages = function(){

		// 1. Calculate percentages
		budgetCtrl.calculatePercentages();

		// 2. Read percenntages from budget conntroller 
		var percentages = budgetConroller.getPercentages();

		// 3. Update the UI with new percentages
		// console.log(percentages);
		UICtrl.displayPercentages(percentages);
	}

	var ctrlAddItem = function(){
		var input, newtem;
		
		//1 . Get the filled input data 
		input = UICtrl.getInput();
		// console.log(input);

		if(input.description !== "" && !isNaN(input.value) && input.value > 0){

			//2. add the item into budget controller 
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// 3. Add item to the UI  
			UICtrl.addListItem(newItem, input.type);

			//4. Clear the input field after adding one item
			UICtrl.clearField();

			//5. Calculate and update a budget
			updateBudget();

			//6. Calculate and Update Percentages
			updatePercentages();
		}
	};

	var ctrlDeleteItem = function(event){
		var itemId, splitId, type, id;

		itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if(itemId){
			splitId = itemId.split('-');
			type = splitId[0];
			id = parseInt(splitId[1]);

			//1. Delete the item from data structure
			budgetCtrl.deleteItem(type, id);

			//2. delete the item form UI
			UIController.deleteListItem(itemId);

			// 3. Update and show new budget
			updateBudget();

			// 4. Calculate and Update Percentages
			updatePercentages();
		}
	
	};

	return {
		init: function(){
			UICtrl.displayDate();
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListeners();
		}
	}

})(budgetConroller, UIController);

controller.init();