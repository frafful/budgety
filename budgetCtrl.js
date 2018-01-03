var budgetController = (function(){

    var _expenses = [];
    var _incomes = [];

    var addItem = function(description, value, type){
        var item = new Item(description, value, type);
    
        if(type == 'inc')
            _incomes.push(item);
        else 
            _expenses.push(item);
    
        return item;
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

    var Item = function(description, value, type){
        
        this.description = description;
        this.value = Math.round((parseFloat(value) * 100)) / 100;
        this.type = type;
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
    
    var ctrlAddItem = function(){
        
        //Get input values
        var input = UICtrl.getInput();

        //Add item to budget
        var newItem = budgetCtrl.addItem(input.description, input.value, input.type);
        
        //Add item to UI
        UICtrl.addItem(newItem.description, newItem.value, newItem.type);

        //Calculate the budget

    }
    
    return {
        init: function(){
            setUpEventListeners();
        }
    }
    

})(budgetController, UIController);

controller.init();



