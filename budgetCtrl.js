var budgetController = (function(){

    var Expense = function(id, value, description){
        
        this.id = id;
        this.description = description;
        this.value = Math.round((parseFloat(value) * 100)) / 100;
        this.percentage = -1;
    };

    Expense.prototype.calculatePercentage = function(totalIncome) {
        
        if(totalIncome > 0) {
            this.percentage = Math.floor((this.value/totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, value, description){
        
        this.id = id;
        this.description = description;
        this.value = Math.round((parseFloat(value) * 100)) / 100;
    };
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    var getNewId = function(type) {
        var highestID = 0;

        for(i = 0; i < data.allItems[type].length; i++) {
            if(data.allItems[type][i].id > highestID)
                highestID = data.allItems[type][i].id;
        }

        return highestID + 1;
    }
    
    var sumItemsValue = function(items){
        var total = 0;
        
        items.forEach(i => total += i.value);
    
        return total;
    };
    
    return {
        /*test: function() {
            return  { data: data };
        },*/
        
        addItem: function(des, val, type){
            
            var newItem, ID;

            ID = getNewId(type);
            
            if(type == 'inc')
                newItem = new Income(ID, val, des);
            else 
                newItem = new Expense(ID, val, des);
        
            data.allItems[type].push(newItem);
    
            return newItem;
        },

        removeItem: function(id, type){
            var a = data.allItems[type];
            data.allItems[type] = data.allItems[type].filter(item => item.id !== id);
        },

        calculateBudget: function(){
            
            //Calculate total inc and exp 
            data.totals.inc = sumItemsValue(data.allItems.inc);
            data.totals.exp = sumItemsValue(data.allItems.exp);
        
            //Calculate the budget
            data.budget = data.totals.inc - data.totals.exp;
            
            //Calculate the percentage of income expent
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(expense => expense.calculatePercentage(data.totals.inc));
        },

        getPercentages: function() {
            return data.allItems.exp.map(expense => expense.percentage);
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpense: data.totals.exp,
                percentage: data.percentage
            };
        }
    };
})();



var controller = (function(budgetCtrl, UICtrl){

    //Get DOM strings from UI
    var DOM = UICtrl.getDOMStrings();

    var setUpEventListeners = function(){
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.querySelector(DOM.inputValue).addEventListener('keypress', function(e) {
            if(e && (e.keyCode == 13 || e.which == 13))
                ctrlAddItem();
        });
        document.querySelector(DOM.inputDescription).addEventListener('keypress', function(e) {
            if(e && (e.keyCode == 13 || e.which == 13))
                ctrlAddItem();
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
    }

    var displayDate = function() {
        //document.querySelector('.budget__title--month').innerHTML 
        const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July'
        , 'August', 'September', 'October','November', 'December'];
    
        const dateNow = new Date();
    
        UICtrl.displayDate(months[dateNow.getMonth()], dateNow.getFullYear());
    }
    
    var updateBudget = function(){
        
        // Calc the budget
        budgetCtrl.calculateBudget();

        // get the budget 
        var budget = budgetCtrl.getBudget();

        // Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {

        // Calculate percentages 
        budgetCtrl.calculatePercentages();

        // Read percentages from budget controller
        var percentages = budgetCtrl.getPercentages();

        // Update UI
        UICtrl.displayPercentages(percentages);

    };
    
    var ctrlAddItem = function(){
        var input, newItem;

        //Get input values
        input = UICtrl.getInput();

        //Validate inputs
        if(isNumeric(input.value) && input.description != "") {

            //Add item to budget
            newItem = budgetCtrl.addItem(input.description, input.value, input.type);
            
            //Add item to UI
            UICtrl.addItemToList(newItem, input.type);

            //Clear fields
            UICtrl.clearFields();

            //Calculate the budget
            updateBudget();

            //Update percentages 
            updatePercentages();
        }
    }

    var ctrlDeleteItem = function(event) {
        //Find first parent element with id field
        var element = closestWithId(event.target);
        
        if (element && element.id) {
            //Get the type and the id of the item
            const type = element.id.split('-')[0];
            const id = parseInt(element.id.split('-')[1]);

            //remove the item from budget list
            budgetCtrl.removeItem(id, type);

            //remove item from ui
            UICtrl.removeItemFromList(element.id);

            //Update budget
            updateBudget();

            //Update percentages 
            updatePercentages();
        }
    };

    var isNumeric = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    

    var closestWithId = function (element) {
        var elementParent = element;
        var limit = 0;
    
        while((elementParent && elementParent.parentNode) && limit < 20){
            elementParent = elementParent.parentNode;
            limit++;
    
            if (elementParent.id !== '') {
                return elementParent;
            }
        }
    };
    
    return {
        init: function(){
            setUpEventListeners();
            displayDate();
        }
    }
    

})(budgetController, UIController);

controller.init();



