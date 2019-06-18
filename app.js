//Private stand alone controller usin IIFE and Closure

var budgetConroller = (function(){

	var x = 23;

	var add = function(num){
		return x + num;
	}

	return{
		publicTest: function(numPuplic){
			return add(numPuplic);
		}
	}

})();


var UIController = (function(){

	//some code

})();



var controller = (function(budgetCtrl, UICtrl){

	var z = budgetCtrl.publicTest(5);

	return{
		anotherPublic: function(){
			console.log(z);
		}
	}

})(budgetConroller, UIController);