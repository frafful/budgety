var UIController = (function(){
    
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expense__list'
    }
    
    return {
            getInput: getInput,
            addItemToList: addItemToList,
            clearFields: clearFields,

            getDOMStrings: function(){
                return DOMStrings;
            }
        };

        var clearFields = function(){
            var fields, fieldsArray;
            document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.array.forEach((element, i, array) => {
                element.value = "";
            });
            fieldsArray[0].focus();
        };

        var getInput = function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                value: document.querySelector(DOMStrings.inputValue).value,
                description: document.querySelector(DOMStrings.inputDescription).value
            };
        };

        var addItemToList = function(newItem, type){
            
            var newElement, parentElement;

            if(type == 'inc') {
                newElement = "<div class=\"item clearfix\" id=\"income-" + (budget.getIncomes().length - 1) + "\">"
                                 +  "<div class=\"item__description\">" + newItem.description + "</div>"
                                 +  "<div class=\"right clearfix\">"
                                 +      "<div class=\"item__value\">+ " + newItem.value.toFixed(2) + "</div>"
                                 +       "<div class=\"item__delete\">"
                                 +          "<button class=\"item__delete--btn\" onclick=\"removeItem(this, 'inc');\"><i class=\"ion-ios-close-outline\"></i></button>"
                                 +      "</div>"
                                 +  "</div>"
                                 +  "</div>";
    
                element = document.querySelector(DOMStrings.incomeContainer);
            } 
            else {
                newElement = "<div class=\"item clearfix\" id=\"expense-" + (budget.getExpenses().length - 1) + "\">"
                                +  "<div class=\"item__description\">" + newItem.description + "</div>"
                                +  "<div class=\"right clearfix\">"
                                +      "<div class=\"item__value\">- " + newItem.value.toFixed(2) + "</div>"
                                +      "<div class=\"item__percentage\">" + budget.getValuePercentageBudget(budget.getExpenses().length - 1) + " %" + "</div>"
                                +       "<div class=\"item__delete\">"
                                +          "<button class=\"item__delete--btn\" onclick=\"removeItem(this, 'exp');\"><i class=\"ion-ios-close-outline\"></i></button>"
                                +      "</div>"
                                +  "</div>"
                                +  "</div>";
                element = document.querySelector(DOMStrings.expenseContainer);
            }

            element.insertAdjacentElement('beforeend', newElement);
        }
    
    })();

var budget = new Budget();

document.querySelector('.budget__title--month').innerHTML = function(){
    const months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July'
    , 'August', 'September', 'October','November', 'December'];

    const dateNow = new Date();

    return months[dateNow.getMonth()] + ' ' + dateNow.getFullYear();
}();

//Add event handler to Add Button
document.querySelector('.add__btn').addEventListener('click', addItem);
document.querySelector('.add__value').addEventListener('keypress', function(e){
    if(e && (e.keyCode == 13 || e.which == 13))
        addItem();
});
document.querySelector('.add__description').addEventListener('keypress', function(e){
    if(e && (e.keyCode == 13 || e.which == 13))
        addItem();
});

document.querySelector('.container').addEventListener('click', function(e){
    if(e.target && e.target.id.indexOf('income-')  !== -1){

    }
});

function addItem(){
    // Get selected operation type
    var selectElement = document.querySelector('.add__type');
    var selectedType = selectElement.options[selectElement.selectedIndex].value;
    // Get input value
    var inputValue = document.querySelector('.add__value').value;
    // Get input description
    var inputDescription = document.querySelector('.add__description').value;

    if(isNumeric(inputValue) && inputDescription != ""){
        var addedItem = budget.addItem(inputDescription, inputValue, selectedType);
        
        //Set budget element
        document.querySelector('.budget__value').innerHTML = budget.getBudget().toFixed(2);
        //Set Income element
        document.querySelector('.budget__income--value').innerHTML = '+ ' + budget.getTotalIncome().toFixed(2);
        //Set Income element
        document.querySelector('.budget__expenses--value').innerHTML = '- ' + budget.getTotalExpenses().toFixed(2);
        
        
        if(selectedType == 'inc'){
            var newElement = "<div class=\"item clearfix\" id=\"income-" + (budget.getIncomes().length - 1) + "\">"
                             +  "<div class=\"item__description\">" + addedItem.description + "</div>"
                             +  "<div class=\"right clearfix\">"
                             +      "<div class=\"item__value\">+ " + addedItem.value.toFixed(2) + "</div>"
                             +       "<div class=\"item__delete\">"
                             +          "<button class=\"item__delete--btn\" onclick=\"removeItem(this, 'inc');\"><i class=\"ion-ios-close-outline\"></i></button>"
                             +      "</div>"
                             +  "</div>"
                             +  "</div>";

            document.querySelector('.income__list').innerHTML += newElement;
        } 
        else{
            var newElement = "<div class=\"item clearfix\" id=\"expense-" + (budget.getExpenses().length - 1) + "\">"
                            +  "<div class=\"item__description\">" + addedItem.description + "</div>"
                            +  "<div class=\"right clearfix\">"
                            +      "<div class=\"item__value\">- " + addedItem.value.toFixed(2) + "</div>"
                            +      "<div class=\"item__percentage\">" + budget.getValuePercentageBudget(budget.getExpenses().length - 1) + " %" + "</div>"
                            +       "<div class=\"item__delete\">"
                            +          "<button class=\"item__delete--btn\" onclick=\"removeItem(this, 'exp');\"><i class=\"ion-ios-close-outline\"></i></button>"
                            +      "</div>"
                            +  "</div>"
                            +  "</div>";

            document.querySelector('.expenses__list').innerHTML += newElement;
        }
        refreshItemExpensesPercentual();
    }
}

function removeItem(element, type){

    var mainElement;
    //Search for the main parent element
    if(type == 'inc')
        mainElement = closest(element, 'income');
    else {
        mainElement = closest(element, 'expense');
    }

    if(mainElement){
        //Removes the item from budget object
        var idxItem = mainElement.id.substring((mainElement.id.indexOf('-') + 1), mainElement.id.length);
        budget.removeItem(idxItem, type);
        
        //Remove node from DOM
        document.getElementById(mainElement.id).remove();

        refreshItemExpensesPercentual();
    }
}




//Runs through all parent elements to find target
function closest(element, targetId){
    var elementParent = element;
    var limit = 0;

    while((elementParent && elementParent.parentNode) && limit < 20){
        elementParent = elementParent.parentNode;
        limit++;

        if(elementParent.id.indexOf(targetId) !== -1){
            return elementParent;
        }
    }
}

function refreshItemExpensesPercentual(){
    
    //Refresh individual expenses 
    var expensesElements = document.querySelector('.expenses__list').children;

    for(i = 0; i < expensesElements.length; i++){
        expensesElements[i].querySelector('.item__percentage').innerHTML = budget.getValuePercentageBudget(i) + "%";
    }

    //Refresh expenses x incomes percentual
    document.querySelector('.budget__expenses--percentage').innerHTML = budget.getExpensesBudgetPercentage() + "%";
}

/* Utils */

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
