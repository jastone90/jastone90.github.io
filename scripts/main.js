//developmental small loan
document.getElementById('loanAmount0').value = 15000;
document.getElementById('loanInterestRate0').value = 7;
document.getElementById('minPayment0').value = 600;
//developmental House loan
//            document.getElementById('loanAmount0').value= 238500;
//            document.getElementById('loanInterestRate0').value= 3.125;
//            document.getElementById('minPayment0').value= 1021.68;
var debtLineChart;
var debtPieChart;
var numberOfLoans =0;

function addLoan() {

    numberOfLoans ++;
    document.getElementById('additionalLoans').innerHTML +='<div id="loanInputSection'+numberOfLoans+'"><hr width="100%" noshade><div id="loanInputs'+numberOfLoans+'">' +
    '<label for="loanAmount">Loan Amount ($):</label>'+
    '<input name="loanAmount" type="text" id="loanAmount'+numberOfLoans+'"/><span id ="loanRemove'+numberOfLoans+'" onclick="removeLoan(this)" class="floatRight removeLoan"></span><br>' +
    '<label for="loanInterestRate">Loan Interest Rate (%):</label>' +
    '<input name="loanInterestRate" type="text" id="loanInterestRate'+numberOfLoans+'"/><span id ="loanInputsDataTime'+numberOfLoans+'" class="floatMiddle"></span><span id ="loanInputsData'+numberOfLoans+'"  class="floatRight"></span><br>' +
    '<label for="minPayment">Minimum Monthly Payment ($):</label><input name="minPayment" type="text" id="minPayment'+numberOfLoans+'"/></div></div>';



    document.getElementById('loanAmount1').value = 8000;
    document.getElementById('loanInterestRate1').value = 9.8;
    document.getElementById('minPayment1').value = 675;

    document.getElementById('loanAmount2').value = 6000;
    document.getElementById('loanInterestRate2').value = 30;
    document.getElementById('minPayment2').value = 500;
}

function removeLoan(e) {
    numberOfLoans --;
    var parent = e.parentNode.parentNode.parentNode;
    parent.removeChild(e.parentNode.parentNode);
}

function calculate() {
    document.getElementById('errorSpan').innerHTML = "";
    if(debtLineChart){
        debtLineChart.destroy();
        debtPieChart.destroy();
    }
    var allDebt=[];
    var allDates=[];
    var numberOfDates=0;
    var dateLabels;
    var totalInterest = [];
    var allInterest = 0;
    var allLoanAmount=0;
    var debtLineData = {
        labels: allDates[0],
        datasets: []
    };

    for( var i=0; i<=numberOfLoans; i++){

        var loan = parseFloat(document.getElementById('loanAmount'+i).value);
        var interestRate = parseFloat(document.getElementById('loanInterestRate'+i).value) / 100;
        var minPayment = parseFloat(document.getElementById('minPayment'+i).value);

        if (minPayment < parseFloat(((loan * interestRate) / 12).toFixed(2))) {
            document.getElementById('errorSpan').innerHTML = "Dude You need a higher minimum Payment";
            return;
        }

        var originalLoanAmount = loan;
        var date = new Date();
        date.setDate(1);
        var label = (date.getMonth() + 1) + "/" + date.getFullYear();
        var debt=[loan];
        var dates=[label];

        totalInterest[i] = 0;
        while (loan > 0) {
            var accruedInterest = parseFloat(((loan * interestRate) / 12).toFixed(2));
            var decrementingDebt = minPayment - accruedInterest;
            totalInterest[i] = parseFloat((totalInterest[i] + accruedInterest).toFixed(2));
            loan = parseFloat((loan - decrementingDebt).toFixed(2));
            if (loan < 0) loan = 0;
            debt.push(loan);

            date = new Date(date.setMonth(date.getMonth() + 1));
            label = (date.getMonth() + 1) + "/" + date.getFullYear();
            dates.push(label);
        }

        allDebt.push(debt);
        allDates.push(dates);
        allInterest = parseFloat((totalInterest[i] + allInterest).toFixed(2));
        allLoanAmount =parseFloat((originalLoanAmount + allLoanAmount).toFixed(2));

        document.getElementById('loanInputsData'+i).innerHTML ='Total Interest: $' +totalInterest[i].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        document.getElementById('loanInputsDataTime'+i).innerHTML ='Total Time: '+ dates.length +' months';

        var fillColor;
        var strokeColor;
        var pointStrokeColor;


        if(i==0){
            fillColor = "rgba(172,194,132,0.4)";
            strokeColor = "#ACC26D";
            pointStrokeColor = "#9DB86D";
        }
        if(i==1){
            fillColor = "rgba(140,181,250,0.4)";
            strokeColor = "#74a5f9";
            pointStrokeColor ="4385F7";
        }
        if(i==2){
            fillColor = "rgba(250,210,140,0.4)";
            strokeColor = "#f9c874";
            pointStrokeColor ="f8bf5b";
        }

        debtLineData.datasets.push({fillColor: fillColor,
            strokeColor: strokeColor,
            pointColor: strokeColor,
            pointStrokeColor: pointStrokeColor,
            datasetFill : false,
            data: debt});

        if(dates.length>numberOfDates){
            numberOfDates = dates.length;
            dateLabels= dates;
        }
    }






    // Line Chart
    debtLineData.labels = dateLabels;
    var debtLineGraph = document.getElementById('debtLineGraph').getContext('2d');
    debtLineChart = new Chart(debtLineGraph).Line(debtLineData);

    // Pie Chart
    var pieData = [
        {
            label: "Principal",
            value: allLoanAmount,
            color: "#4ACAB4"
        },
        {
            label: "Interest",
            value: allInterest,
            color: "#FF8153"
        }

    ];
    var pieOptions = {
        segmentShowStroke: false,
        animateScale: true
    };
    var interestRatio = document.getElementById("interestRatio").getContext("2d");
    debtPieChart = new Chart(interestRatio).Pie(pieData, pieOptions);


    document.getElementById('pieLegend').innerHTML = '<span id="pieLegendPrincipal">Principal: $' + allLoanAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</span><br>' +
    '<span id="pieLegendInterest">Interest: $' + allInterest.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</span>';
    document.getElementById('totalCost').innerHTML = "Total Cost of the Loan(s): $" + (allLoanAmount + allInterest).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
