//developmental small loan
document.getElementById('loanAmount0').value = 15000;
document.getElementById('loanInterestRate0').value = 17;
document.getElementById('minPayment0').value = 600;
//developmental House loan
//            document.getElementById('loanAmount0').value= 238500;
//            document.getElementById('loanInterestRate0').value= 3.125;
//            document.getElementById('minPayment0').value= 1021.68;
var debtLineChart;
var debtPieChart;
var whatIfDebtLineChart;
var whatIfDebtPieChart;
var numberOfLoans =0;
var additionalPay = 0;
var allMinPayment =0;

function addLoan() {
    numberOfLoans ++;
    $("#additionalLoans").html(function(j, origText){
        return origText +'<div id="loanInputSection'+numberOfLoans+'" class="invisible">' +
                            '<hr width="100%" noshade><div id="loanInputs'+numberOfLoans+'">' +
                            '<label for="loanAmount">Loan Amount ($):</label>'+
                            '<input name="loanAmount" type="text" id="loanAmount'+numberOfLoans+'"/><span id ="loanRemove'+numberOfLoans+'" onclick="removeLoan(this)" class="floatRight removeLoan"></span><br>' +
                            '<label for="loanInterestRate">Loan Interest Rate (%):</label><input name="loanInterestRate" type="text" id="loanInterestRate'+numberOfLoans+'"/>' +
                            '<span id ="loanInputsDataTime'+numberOfLoans+'" class="floatMiddle"></span><span id ="loanInputsData'+numberOfLoans+'"  class="floatRight"></span><br>' +
                            '<label for="minPayment">Minimum Monthly Payment ($):</label><input name="minPayment" type="text" id="minPayment'+numberOfLoans+'"/></div>' +
                        '</div>';
    });
    if($('#loanRemove' + (numberOfLoans - 1))){
        $('#loanRemove' + (numberOfLoans - 1)).attr("class","");
    }
    if(numberOfLoans>=4) {
        $("#addLoanButton").attr("disabled",true);
    }
    $('#loanInputSection'+numberOfLoans).slideDown("fast");


    $("#loanAmount1").val(8000);
    $("#loanInterestRate1").val(9.8);
    $("#minPayment1").val(675);

    $("#loanAmount2").val(6000);
    $("#loanInterestRate2").val(3);
    $("#minPayment2").val(500);
}

function removeLoan(e) {
    numberOfLoans --;
    var parent = e.parentNode.parentNode.parentNode;
    parent.removeChild(e.parentNode.parentNode);

    document.getElementById('loanRemove'+ (numberOfLoans)).setAttribute("class", "floatRight removeLoan");

    if(numberOfLoans<4) {
        document.getElementById('addLoanButton').disabled = false;
    }

    if(debtLineChart){
        debtLineChart.destroy();
        debtPieChart.destroy();

        document.getElementById('pieLegend').removeChild(document.getElementById('pieLegendPrincipal'));
        document.getElementById('pieLegend').removeChild(document.getElementById('pieLegendInterest'));
    }
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
    allMinPayment =0;
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
        allMinPayment =parseFloat((minPayment + allMinPayment).toFixed(2));

        document.getElementById('loanInputsData'+i).innerHTML ='Total Interest: <span class=bold> $' +totalInterest[i].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</span>';
        document.getElementById('loanInputsDataTime'+i).innerHTML ='Total Time: <span class=bold>'+ (dates.length -1) +' months</span>';

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
            color: "#4D4F53",
            highlight: "#5F6164"
        },
        {
            label: "Interest",
            value: allInterest,
            color: "#991F00",
            highlight: "#A33519"
        }

    ];
    var pieOptions = {
        segmentShowStroke: true,
        animateScale: true
    };
    var interestRatio = document.getElementById("interestRatio").getContext("2d");
    debtPieChart = new Chart(interestRatio).Pie(pieData, pieOptions);


    document.getElementById('pieLegend').innerHTML = '<span id="pieLegendPrincipal">Principal: $' + allLoanAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</span><br>' +
    '<span id="pieLegendInterest">Interest: $' + allInterest.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</span>';
    $('#totalCost').html('<h3>Total Cost of the Loan(s): $' + (allLoanAmount + allInterest).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + 
                            '<span class="red smallFont">*Minimum payments only</span></h3>'+
                            '<hr width=100% noshade>');

    whatIf(allMinPayment);
}

function whatIf(allMinPayment) {
    $("#whatIfTitle").html("How will additional money affect your loans?");
    $("#currentMinPayment").html('Currently you have<strong> $' + allMinPayment.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</strong> in minimum monthly payments towards your loan(s)');
    $("#newMinPayment").html('Specify additional money to apply to monthly payments ($): <input name="addMinPay" type="text" id="addMinPay"/>');


    $("#payOffChoiceTitle").html('<span class="center">When it comes to additional monthly payments there are two ideologies:</br></span>');

    $("#payOffChoice").html('<span class=bold>Avalanche:</span> Target additonal money to the highest interest loans first. Finacially, this is the best option. </br>'+
                                '<span class=bold>Snowball:</span> Target the lowest balance loans first. Psychologically, this can be more motivating by quickly reducing the number of loans you have.');

    $("#payOffChoiceButton").html('<button  id="recalculateButton" type="button" onclick="recalculate()">Recalculate Loan(s)</button>' +
                                    '<input id="avalancheRadio" checked="true" class="radioChoice" type="radio" value="avalanche"/>Avalanche</input>' +
                                    '<input id="snowballRadio" class="radioChoice" type="radio" value="snowball"/>Snowball</input>'+
                                    '<span class="newPaymentTitle">New Payment: <span id="newPayment" class="bold spaceRight"></span></span>');
    additionalPay = 100;
    var newPay = (additionalPay + allMinPayment).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    var addMinPayDiv = $("#addMinPay");


    $('html, body').animate({
        scrollTop: addMinPayDiv.offset().top
    }, 600);

    addMinPayDiv.val(additionalPay);
    $("#newPayment").html("$"+newPay);
    addMinPayDiv.keypress(function(e) {
        if(e.which == 13){
            additionalPay = parseFloat($("#addMinPay").val());
            recalculate();
        }
    });
    addMinPayDiv.change(function() {
        additionalPay = parseFloat(addMinPayDiv.val());
        var newPayment = parseFloat(additionalPay + allMinPayment);
        $("#newPayment").html("$"+ newPayment.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    });

    $("#avalancheRadio").on('change',function(){
        $("#snowballRadio").attr('checked',false);
        //alert($("#avalancheRadio").val());
    });
    $("#snowballRadio").on('change',function(){
        $("#avalancheRadio").attr('checked',false);
        //alert($("#snowballRadio").val());
    });

}

function recalculate() {
    if(whatIfDebtLineChart){
        whatIfDebtLineChart.destroy();
        whatIfDebtPieChart.destroy();
    }
    var payOffChoice;
    if($("#avalancheRadio").is(':checked')){
        payOffChoice = 'Avalanche';
    }else{
        payOffChoice = 'Snowball';
    }

    $('#whatIfDebtGraphs').html('<hr width="100%" noshade><section id="whatIfDebtGraphs" class="paddingBottom">'+
                                                            '<div id="graphLeft"><canvas id="whatIfDebtLineGraph" width="760" height="300"></canvas></div>'+
                                                            '<div id="graphright"><canvas id="whatIfInterestRatio" width="200" height="200"></canvas></div>' +
                                                            '<div id="whatIfPieLegend"></div>' +
                                                        '</section>');
    var loanData =orderLoansInterestRate(payOffChoice);

    var interestRate = [];
    var loan = [];
    var loanAmounts =[];
    var minPayment = [];
    var color = [];
    var debt=[];
    var paidOff = [];
    var totalInterest = [];
    var totalMonths = [];
    var allInterest =0;
    var allLoans =0;
    var paymentTableColor = [];
    var paymentTableDebt = [];
    var paymentTableDate = [];
    var paymentTableMonthlyPay = [];
    var paymentTableMonthlyInterest = [];

    var currentAdditionalPay = parseFloat(additionalPay.toFixed(2));
    for (var i=0; i < loanData.length; i++) {
        interestRate.push(loanData[i][0]);
        loan.push(loanData[i][1]);
        loanAmounts.push(loanData[i][1]);
        minPayment.push(loanData[i][2]);
        color.push(loanData[i][3]);
        debt.push([loan[i]]);
        paidOff.push(false);
        totalInterest[i]=0;
        allLoans = parseFloat((allLoans+loanData[i][1]).toFixed(2));
        paymentTableDebt[i] = [loanData[i][1]];
        paymentTableColor[i]= loanData[i][3];
        paymentTableDate[i] = [0];
        paymentTableMonthlyPay[i] = [0];
        paymentTableMonthlyInterest[i] = [0];

    }

    var loanReceivingAdditionalPay =0;
    var leftOverPayment =0;
    var repurposedMinPayment = 0;
    var computingNewLoans =true;
    var month= 0;
    var newMonth =false;
    var totalMonthlyPayment = 0;
    while(computingNewLoans) {
        for (var j=0; j<i; j++){
            var currentLoanPayment = 0;
            if(j==0){
                totalMonthlyPayment=0;
                month++;
                newMonth = true;
            }
            var currentLoanAmount = loan[j];
            var currentAccruedInterest = 0;

            if (currentLoanAmount > 0) {
                var currentMinPayment = minPayment[j];
                var currentInterestRate = interestRate[j];

                currentAccruedInterest = parseFloat(((currentLoanAmount * currentInterestRate) / 12).toFixed(2));
                totalInterest[j]= parseFloat((totalInterest[j] +currentAccruedInterest).toFixed(2));
                currentLoanAmount = (currentLoanAmount + currentAccruedInterest) - currentMinPayment;

                totalMonthlyPayment += currentMinPayment;
                currentLoanPayment += currentMinPayment;
                if(j==loanReceivingAdditionalPay && newMonth){
                    currentLoanAmount = currentLoanAmount - currentAdditionalPay;
                    totalMonthlyPayment += currentAdditionalPay;
                    currentLoanPayment += currentAdditionalPay;
                    newMonth=false;
                }
                if (leftOverPayment > 0 && j==loanReceivingAdditionalPay) {
                    currentLoanAmount = currentLoanAmount - leftOverPayment;
                    totalMonthlyPayment += leftOverPayment;
                    currentLoanPayment += leftOverPayment;
                    leftOverPayment = 0;
                }
                if (currentLoanAmount <= 0) {
                    leftOverPayment = parseFloat(-currentLoanAmount.toFixed(2));
                    totalMonthlyPayment -= leftOverPayment;
                    currentLoanPayment -= leftOverPayment;
                    currentLoanAmount = 0;
                    paidOff[j] = true; //Congrats!
                    allInterest = parseFloat((totalInterest[j] + allInterest).toFixed(2));
                    repurposedMinPayment = repurposedMinPayment +currentMinPayment;
                    currentAdditionalPay = currentAdditionalPay +currentMinPayment;

                    for(var k=0; k<i; k++){
                        if(paidOff[k] == false){
                            loanReceivingAdditionalPay = k;
                            break;
                        }
                    }
                    totalMonths[j]=month;
                }
                currentLoanAmount = parseFloat((currentLoanAmount).toFixed(2));
                debt[j].push(currentLoanAmount);
                loan[j]=currentLoanAmount;
            }
            if(paidOff[j]){
                function isTrue(element) {
                    return element == true;
                }
                computingNewLoans = !paidOff.every(isTrue);
            }
            paymentTableMonthlyInterest[j].push(currentAccruedInterest);
            paymentTableDebt[j].push(currentLoanAmount);
            paymentTableMonthlyPay[j].push(currentLoanPayment);
            paymentTableDate[j].push(month);
        }
        //alert('Repurposed Min Payments: ' + repurposedMinPayment + '\n Current Additional Pay: ' +currentAdditionalPay +'\n Total:'+ totalMonthlyPayment);
    }
    var date = new Date();
    date.setDate(1);
    var label = (date.getMonth()+1) + "/" + date.getFullYear();
    var dates = [label];
    for (var i=0; i < month; i++){
        date = new Date(date.setMonth(date.getMonth()+1));
        label = (date.getMonth()+1) + "/" + date.getFullYear();
        dates.push(label);
    }

    var debtLineData = {
        datasets: []
    };

    var fillColor;
    var strokeColor;
    var pointStrokeColor;

    for (var i=0; i < loanData.length; i++) {
        if(color[i]==0){
            fillColor = "rgba(172,194,132,0.4)";
            strokeColor = "#ACC26D";
            pointStrokeColor = "#9DB86D";
        }
        if(color[i]==1){
            fillColor = "rgba(140,181,250,0.4)";
            strokeColor = "#74a5f9";
            pointStrokeColor ="4385F7";
        }
        if(color[i]==2){
            fillColor = "rgba(250,210,140,0.4)";
            strokeColor = "#f9c874";
            pointStrokeColor ="f8bf5b";
        }
        debtLineData.datasets.push({fillColor: fillColor,
            strokeColor: strokeColor,
            pointColor: strokeColor,
            pointStrokeColor: pointStrokeColor,
            datasetFill : false,
            data: debt[i]});
    }

    // Line Chart
    debtLineData.labels = dates;
    var debtLineGraph = document.getElementById('whatIfDebtLineGraph').getContext('2d');
    whatIfDebtLineChart = new Chart(debtLineGraph).Line(debtLineData);

    // Pie Chart
    var pieData = [
        {
            label: "Principal",
            value: allLoans,
            color: "#4D4F53",
            highlight: "#5F6164"
        },
        {
            label: "Interest",
            value: allInterest,
            color: "#991F00",
            highlight: "#A33519"
        }

    ];
    var pieOptions = {
        segmentShowStroke: true,
        animateScale: true
    };
    var interestRatio = document.getElementById("whatIfInterestRatio").getContext("2d");
    whatIfDebtPieChart = new Chart(interestRatio).Pie(pieData, pieOptions);

    $('#whatIfPieLegend').html('<span id="pieLegendPrincipal">Principal: $' + allLoans.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</span><br>' +
                                '<span id="pieLegendInterest">Interest: $' + allInterest.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</span>');


    $('#payTable').html('<table id="whatIfTable">');
    var table = document.getElementById("whatIfTable");
    var tableMonthlyPaymentSum = [];
    for(var r = 0; r<=(i+1);r++){
        var row = table.insertRow(r);
        for (var c = 0; c < (paymentTableDebt[0].length + 1); c++) {

            var cell;
            //labels
            if(c==0){
                if(r!=0) {
                    cell = row.insertCell(c);
                    if (r > 0 && r != i + 1) {
                        cell.innerHTML = '<span class=bold>Loan Balance: $' + paymentTableDebt[r - 1][0].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</span></br>' +
                        '<span class="smallFont interest">Accrued Interest (' + (interestRate[r - 1] * 100).toFixed(2) + '%)</span></br>' +
                        '<span class="smallFont">Monthly Payment</span>';
                        cell.className = 'tableHeight backGround' + paymentTableColor[r - 1];
                    }
                    if (r == i + 1) {//footer
                        cell.innerHTML = "Total Monthly</br> Payment";
                        cell.className = 'totalMonPayColor';
                    }
                }else{
                    var th = document.createElement('th');
                    row.appendChild(th);

                    th.innerHTML = payOffChoice;
                }
            }

            if (c > 0) {
                if (r == 0) {
                    var th = document.createElement('th');
                    row.appendChild(th);
                    var headerDate = new Date();
                    headerDate.setDate(1);
                    var headerLabel = (headerDate.getMonth()+1) + "/" + headerDate.getFullYear();
                    var currentMonth = paymentTableDate[r][c - 1];
                    headerDate = new Date(headerDate.setMonth(headerDate.getMonth()+currentMonth));
                    headerLabel = (headerDate.getMonth()+1) + "/" + headerDate.getFullYear();

                    th.innerHTML = headerLabel;
                }

                if(r!=0){
                    cell = row.insertCell(c);
                    if (r > 0 && r!= i+1) {//Content
                        if(!tableMonthlyPaymentSum[c-1]){
                            tableMonthlyPaymentSum[c-1]=0;
                        }
                        tableMonthlyPaymentSum[c-1] = parseFloat(tableMonthlyPaymentSum[c-1])+parseFloat(paymentTableMonthlyPay[r - 1][c - 1]);
                        cell.innerHTML = '<span class=bold>$' + (paymentTableDebt[r - 1][c - 1]).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</span></br>';

                        if(paymentTableMonthlyInterest[r - 1][c - 1] > 0 || c==1){
                            cell.innerHTML += '<span class="smallFont interest">+$' + (paymentTableMonthlyInterest[r - 1][c - 1]).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '</span></br>' +
                                                '<span class="smallFont">-$' + (paymentTableMonthlyPay[r - 1][c - 1].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')) + '</span>';
                        }
                        cell.className = 'backGround'+paymentTableColor[r - 1];

                    }
                    if (r == i+1) {//footer
                        cell.innerHTML = '$' + (tableMonthlyPaymentSum[c - 1]).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                        cell.className = 'totalMonPayColor';
                    }
                }
            }
        }
    }


    var whatIfDebtData =[loanAmounts,totalInterest,totalMonths,color];
    compareLoans(whatIfDebtData);
}

function compareLoans(whatIfData) {
    var compareLoansDiv = $("#compareLoansDiv");
    compareLoansDiv.html("");

    var totalCost=0;
    var totalDiffInterest =0;
    for(var i=0;i<whatIfData[0].length;i++){
        totalCost +=whatIfData[0][i];
        var loanAmount =  whatIfData[0][i].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        var newInterest = whatIfData[1][i];
        var newTime = whatIfData[2][i];
        var color = whatIfData[3][i];
        var oldTime =  $("#loanInputsDataTime" + color).html();
        var oldInterest =  $("#loanInputsData" + color +" span").text();
        totalCost = totalCost +newInterest;
        oldTime = parseInt(oldTime.substring(31,oldTime.indexOf("months")));
        oldInterest = parseFloat((oldInterest.substring(2)).replace(/,/g,''));
        var diffTime = newTime - oldTime;
        var diffInterest =(newInterest-oldInterest);
        totalDiffInterest = totalDiffInterest + diffInterest;
        diffInterest =diffInterest.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

        $("#compareLoansDiv").html(function(j, origText){
            return origText +'<div id="compareLoans'+ color +'" class=" compareLoans backGround'+ color +'"></div>';
        });

        $('#compareLoans' + color).html('<span id="loanAmt" class="left">Loan Amount: $'+loanAmount+'</span>' +
                                        '<span id="newTime" class="center">New Total Time: '+ newTime + ' months<span class="green bold"> ('+diffTime+')</span></span>' +
                                        '<span id="newInterest" class="right">New Total Interest: $'+ newInterest+'<span class="green bold"> ($'+diffInterest+')</span></span>');
    }





    totalCost= totalCost.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    totalDiffInterest = totalDiffInterest.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    compareLoansDiv.html(function(j, origText){
        return origText +'<div id="compareLoanSummary" class="center"><h3>New Cost of the Loan(s): $'+totalCost +'<span class="green"> ($'+totalDiffInterest+')</span></h3></div>';
    });



    $('#whatIfCompare').slideDown(500, function(){
        var thisDiv = $('#whatIfCompare');
        $('html, body').animate({
            scrollTop: thisDiv.offset().top
        }, 600);
    });
}

function orderLoansInterestRate(payOffChoice) {
    var allLoanData=[];
    for (var i = 0; i <= numberOfLoans; i++) {
        var interestRate = parseFloat(document.getElementById('loanInterestRate' + i).value) / 100;
        var loanAmount = parseFloat(document.getElementById('loanAmount' + i).value);
        var minPayment = parseFloat(document.getElementById('minPayment' + i).value);
        allLoanData.push([interestRate,loanAmount,minPayment,i]);
    }

    if(payOffChoice == 'Avalanche'){
        allLoanData.sort(function(a, b){return b[0]-a[0]});
    }
    if(payOffChoice == 'Snowball'){
        allLoanData.sort(function(a, b){return a[1]-b[1]});
    }
    return allLoanData;
}
