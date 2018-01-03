var budgetController = (function(){

    var _expenses = [];
    var _incomes = [];

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    function getNewID(type) {
        var highestID = 0;

        for(i = 0; data.allItems[type].length; i++) {
            if(data.allItems[type].ID > highestID)
                highestID = data.allItems[type].ID;
        }

        return highestID + 1;
    }

    var addItems = function(des, val, type){
    
        var newItem, ID;

        ID = getNewID(type);
        
        if(type == 'inc')
            newItem = new Income(ID, description, value);
        else 
            newItem = new Expense(ID, description, value);
    
        data.allItems[type].push(newItem);

        return newItem;
    };

    var Expense = function(id, value, description){
        
        this.id = id;
        this.description = description;
        this.value = Math.round((parseFloat(value) * 100)) / 100;
    };

    var Income = function(id, value, description){
        
        this.id = id;
        this.description = description;
        this.value = Math.round((parseFloat(value) * 100)) / 100;
    };
    
    var removeItem = function(index, type){
        if(type == 'inc')
            _incomes.splice(index, 1);
        else 
            _expenses.splice(index, 1);
    }
    
    var getIncomes = function() {
        return _incomes;
    };
    
    var getExpenses = function(){
        return _expenses;
    };
    
    var getTotalIncome = function(){
        var totalIncome = 0;
        
        for(i = 0; i < _incomes.length; i++){
            totalIncome += _incomes[i].value;
        }
    
        return totalIncome;
    };
    
    var getTotalExpenses = function(){
        var total_expenses = 0;
        
        for(i = 0; i < _expenses.length; i++){
            total_expenses += _expenses[i].value;
        }
    
        return total_expenses;
    };
    
    var getBudget = function(){
    
        return this.getTotalIncome() - this.getTotalExpenses();
    };
    
    var getValuePercentageBudget = function(index){
        return Math.floor((_expenses[index].value/this.getTotalIncome()) * 100); 
    };
    
    var getExpensesBudgetPercentage = function(){
        return Math.floor((getTotalExpenses()/getTotalIncome()) * 100);
    };

    return {
        addItem: function(description, value, type){
            return addItem(description, value, type);
        },
        removeItem: function(index, type){
            removeItem(index, type);
        },
        getTotalIncome: function(){
            return getTotalIncome();
        },
        getTotalExpenses: function(){
            return getTotalExpenses();
        },
        getBudget: function(){
            return getBudget();
        },
        getValuePercentageBudget: function(index){
            return getValuePercentageBudget(index);
        },
        getExpensesBudgetPercentage: function(){
            return getExpensesBudgetPercentage();
        }
    };
})();



var controller = (function(budgetCtrl, UICtrl){

    var setUpEventListeners = function(){
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.querySelector(DOM.inputValue).addEventListener('keypress', function(e){
            if(e && (e.keyCode == 13 || e.which == 13))
                ctrlAddItem();
        });
        document.querySelector(DOM.inputDescription).addEventListener('keypress', function(e){
            if(e && (e.keyCode == 13 || e.which == 13))
                ctrlAddItem();
        });
    }
    
    var DOM = UICtrl.getDOMStrings();

    var updateBudget = function(){

    }
    
    var ctrlAddItem = function(){
        var input, newItem;

        //Get input values
        input = UICtrl.getInput();

        //Validate inputs
        if(isNumeric(input.value) && input.description != "") {

            //Add item to budget
            newItem = budgetCtrl.addItem(newItem, input.type);
            
            //Add item to UI
            UICtrl.addItemToList(input.description, newItem.value, newItem.type);
            
            //Clear fields
            UICtrl.clearFields();

            //Calculate the budget
            updateBudget();
        }

    }
    
    return {
        init: function(){
            setUpEventListeners();
        }
    }
    

})(budgetController, UIController);

controller.init();



