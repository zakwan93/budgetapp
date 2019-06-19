//Private stand alone controller usin IIFE and Closure

// Budget Controller 
var budgetConroller = (function(){

	var Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var data = {

		allItems:{
			exp: [],
			inc: [],
		},
		totals:{
			exp: 0,
			inc: 0
		}

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
		expensesContainer: ".expenses__list"
	}

	return{
		getInput: function(){
			return{
				type: document.querySelector(DOMstrings.inputType).value, // value should be eighter inc or exp
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: document.querySelector(DOMstrings.inputValue).value
			};
		},

		addListItem: function(obj, type){
			var html, element, newHtml;
			// Create HTML String with placeholder text

			if(type === 'inc'){
				element = DOMstrings.incomeContainer;
				html ='<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			} else if(type === 'exp') {
				element = DOMstrings.expensesContainer;
				html ='<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
			}

			//Replace the placeholder with actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);

			// Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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

	}

	var ctrlAddItem = function(){
		var input, newtem;
		
		//1 . Get the filled input data 
		input = UICtrl.getInput();
		// console.log(input);

		//2. add the item into budget controller 
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);

		// 3. Add item to the UI  
		UICtrl.addListItem(newItem, input.type);
		
		// 4. Calculate the budget

		// 5. Display the budget on the UI

	}

	return {
		init: function(){
			setupEventListeners();
		}
	}

})(budgetConroller, UIController);

controller.init();