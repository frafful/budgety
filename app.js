var UIController = (function(){
    
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        expensesPercentageLabel : '.budget__expenses--percentage',
        container: '.container',
        itemExpensesPercentageLabel: '.item__percentage',
        budgetDateLabel: '.budget__title--month',
        addBtn: '.ion-ios-checkmark-outline'
    }

    var formatNumber = function(num, type) {
        
        var numSplit, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2);
        
        numsplit = num.split('.');
        int = numsplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numsplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    }
    
    return {
            getInput: function(){
                return {
                    type: document.querySelector(DOMStrings.inputType).value,
                    value: document.querySelector(DOMStrings.inputValue).value,
                    description: document.querySelector(DOMStrings.inputDescription).value
                };
            },

            addItemToList: function(obj, type) {
                var html, newHtml, element;
                // Create HTML string with placeholder text
                
                if (type === 'inc') {
                    element = DOMStrings.incomeContainer;
                    
                    html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                } else if (type === 'exp') {
                    element = DOMStrings.expensesContainer;
                    
                    html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }
                
                // Replace the placeholder text with some actual data
                newHtml = html.replace('%id%', obj.id);
                newHtml = newHtml.replace('%description%', obj.description);
                newHtml = newHtml.replace('%value%', formatNumber(obj.value));
                
                // Insert the HTML into the DOM
                document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            },

            changeType: function() {
                var fields = document.querySelectorAll(
                    DOMStrings.inputType + ',' +
                    DOMStrings.inputDescription + ',' +
                    DOMStrings.inputValue
                );

                for(i = 0; i < fields.length; i++) {
                    fields[i].classList.toggle('red-focus');
                }

                document.querySelector(DOMStrings.addBtn).classList.toggle('red');
            },

            clearFields: function(){
                var fields, fieldsArray;
                fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
    
                fieldsArray = Array.prototype.slice.call(fields);
                fieldsArray.forEach((element, i, array) => {
                    element.value = "";
                });
                fieldsArray[0].focus();
            },

            displayBudget: function(obj) {
                
                obj.budget > 0 ? type = 'inc' : type = 'exp';

                //Set budget element
                document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
                //Set Income element
                document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'inc');
                //Set Expense element
                document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExpense, 'exp');
                //Set expenses x incomes percentual

                if(obj.percentage > 0) {
                    document.querySelector(DOMStrings.expensesPercentageLabel).textContent = obj.percentage + "%";
                } else {
                    document.querySelector(DOMStrings.expensesPercentageLabel).textContent = " --- ";
                }
            },

            displayDate: function(month, year) {
                document.querySelector(DOMStrings.budgetDateLabel).textContent = month + ' ' + year;
            },

            removeItemFromList: function(selectorId) {
                document.getElementById(selectorId).remove();
            },

            displayPercentages: function(percentages) {
                
                var fields = document.querySelectorAll(DOMStrings.itemExpensesPercentageLabel);

                for(i = 0; i < fields.length; i++){
                    if(percentages[i] > 0) {
                        fields[i].textContent = percentages[i] + "%";
                    } else {
                        fields[i].textContent = " --- ";
                    }
                }
            },

            getDOMStrings: function(){
                return DOMStrings;
            }
        };
})();
