window.ondragstart = function() { return false; };

var tickTime =  100;

var coinIMG;

var clickCount = 0;
var clickM = 1;


var coins = 0;
var cps = 0;
var units = [];


var buyAmount = 1;

function Unit(name, baseCost, cps, known, num) {
    
    this.name = name;
    this.baseCost = baseCost;
    this.cps = cps;
    this.known = known;
    this.num = num;
    
    this.cost = function () {
        return Math.round(this.baseCost * Math.pow(1.15, this.num));
    };
    
    this.cost2 = function (num) {
        return this.sum(this.num + num) - this.sum(this.num);
    };
    
    this.sum = function(n) {
      return Math.round(-this.baseCost * ((1-Math.pow(1.15, n))/0.15));  
    };
    
    this.ccps = function () {
        return Math.round(this.cps * this.num);
    };
}

function BuyUnit(id){
    if(id < units.length){
        var u = units[id];
        if(coins - u.cost2(buyAmount) >= 0){
            coins -= u.cost2(buyAmount);
            u.num += buyAmount;
        }
    }
    //console.log("buy " + buyAmount + " of " + units[id].name + " worth " + units[id].cost2(val));
}

function UnitInit(){
    //name, baseCost, cps, known
    units[0] = new Unit("Peasant", 16.0, 1, true, 0);
    units[1] = new Unit("Brute", 130, 5, true, 0);
    units[2] = new Unit("Spearman", 1280, 32, true, 0);
    units[3] = new Unit("Knight", 15600, 220, true, 0);
    units[4] = new Unit("Bowman", 233000, 1710, true, 0);

}

function Click() {
    clickCount++;
    setTimeout(ClickMin,1000);
    coins += clickM * 1;
    UpdateCoinTexts();
    UpdateCPS();
    coinIMG =  document.getElementById("coin")
    coinIMG.style.width = 210 + "px";
    coinIMG.style.height = 210 + "px";
    setTimeout(ClickStyle, 40);
}

function ClickMin() {
    clickCount--;
}

function ClickStyle() {
    coinIMG.style.width = 200 + "px";
    coinIMG.style.height = 200 + "px";
}



function UpdateCoinTexts() {
    var cText = format(coins);
    if(coins != 1){
        cText += " coins";
    }
    else{
        cText += " coin";        
    }
    
    document.title = cText;
    document.getElementById("coin1").innerHTML = cText;     
    
}

function UpdateCPS() {
    var cpsText = format(cps + clickCount * clickM);
    
    if(cps != 1){
        cpsText += " coins per second";
    }
    else{
        cpsText += " coin per second";        
    }
    document.getElementById("cps1").innerHTML = cpsText;
}


function UpdateUnitStuff() {
    
    for(var i = 0; i < units.length; i++) {
        var u = units[i];
        var c = document.getElementById("UnitCost" + i);
        c.innerHTML = "Cost: " + format(u.cost2(buyAmount));
        if(coins - u.cost2(buyAmount) >= 0){
            c.style.color = "#00c129"
        }
        else{
            c.style.color = "#ff0000"
        }
        document.getElementById("UnitCPS" + i).innerHTML = "CPS: " + format(u.ccps());
        document.getElementById("UnitNum" + i).innerHTML = "Owned: " + format(u.num);
        
    }
}

function format(value) {
    var text = "";
    if(value < 1000000){
        text = numeral(value).format("0,0");
    }
    else if(value < 100000000000000000){
        text = numeral(value).format("0,0.00 a");
    }
    else{
        text = numeral(value).format("0.0e+0");
    }
    return text;
}



function tick(){
    CalcCPS();
    coins += cps / (1000 / tickTime);
    //console.log("tick");    
    //Save();
}

function update(){
    var radios = document.getElementsByName('amount');

    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            // do whatever you want with the checked radio
            buyAmount = parseInt(radios[i].value);

            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    
    UpdateCoinTexts();
    UpdateCPS(); 
    UpdateUnitStuff();
    document.getElementById("clicksC").innerHTML = (clickCount * clickM) + " coins from clicks per second";
}




function Save(){
    localStorage.setItem("coin", coins);
    localStorage.setItem("cps", cps);
    
    for(var i = 0; i < units.length; i++){
        localStorage.setItem("unit" + i, units[i].num);
    }
}

function Load(){
    coins = parseFloat(localStorage.getItem("coin"));
    cps = parseFloat(localStorage.getItem("cps"));
    for(var i = 0; i < units.length; i++){
        units[i].num = parseInt(localStorage.getItem("unit" + i));
    }
}


function Reset(){
    localStorage.setItem("coin", 0);
    localStorage.setItem("cps", 0);
    for(var i = 0; i < units.length; i++){
        localStorage.setItem("unit" + i, 0);
    }
    Load();
}

function CalcCPS(){
    cps = 0;
    for(var i = 0; i < units.length; i++){
        cps += units[i].ccps();
    }
}




UnitInit();
Load();
setInterval(update, 100);
setInterval(tick, tickTime);




