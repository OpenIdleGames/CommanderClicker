window.ondragstart = function() { return false; };


var tickTime =  100;

var coinIMG;

var clickCount = 0;
var clickM = 1;

var clickingBonus = 1;


var coins = 0;
var cps = 0;

var coinsOverflow = 0;
var cpsOverflow = 0;

var units = [];


var buyAmount = 1;


var lastTickTime = 0.0;

var run = true;

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
    UnitShow();
    
}

function GCoins (amount) {
    
}

function ACoins (amount) {
    
}


function UnitInit(){
    //name, baseCost, cps, known
    units[0] = new Unit("Peasant", 16, 1, true, 0);
    units[1] = new Unit("Brute", 130, 16, true, 0);
    units[2] = new Unit("Spearman", 1280, 80, false, 0);
    units[3] = new Unit("Knight", 15600, 490, false, 0);
    units[4] = new Unit("Bowman", 233000, 3600, false, 0);
    
    units[5] = new Unit("Musketeer", 4118000, 32200, false, 0);
    units[6] = new Unit("Rifleman", 83890000, 328000, false, 0);
    units[7] = new Unit("Marine", 1937100000, 3783000, false, 0);
    units[8] = new Unit("Swat", 50000000000, 696600000, false, 0);
    units[9] = new Unit("Cannon", 1426560000000, 10883900000, false, 0);

    units[10] = new Unit("SAS", 44580500000000, 10883900000, false, 0);
    units[11] = new Unit("Spetznaz", 1514375500000000, 184860000000, false, 0);
    units[12] = new Unit("APC", 55560034000000000, 3391120000000, false, 0);
    units[13] = new Unit("MBT", 2189469450000000000, 66817300000000, false, 0);
    units[14] = new Unit("Choppa", 92233720400000000000, 1407374900000000, false, 0);

    units[15] = new Unit("Aircraft", 4136201309000000000000, 31556712000000000, false, 0);
    units[16] = new Unit("ICBM", 196732040380000000000000, 750473180000000000, false, 0);
    units[17] = new Unit("Mecha", 9892098278300000000000000, 18867680100000000000, false, 0);
    units[18] = new Unit("Death ray", 524288000000000000000000000, 500000000000000000000, false, 0);

}


function Click() {
    clickCount++;
    setTimeout(ClickMin,1000);
    coins += clickM * 1;
    UpdateCoinTexts();
    UpdateCPS();
    coinIMG =  document.getElementById("coin");
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
        cpsText += " per second";
    }
    else{
        cpsText += " per second";        
    }
    document.getElementById("cps1").innerHTML = cpsText;
}


function UpdateUnitStuff() {
    
    for(var i = 0; i < units.length; i++) {
        var u = units[i];
        
        if(u.known){
            var c = document.getElementById("UnitCost" + i);
            c.innerHTML = "Cost: " + format(u.cost2(buyAmount));
            if(coins - u.cost2(buyAmount) >= 0){
                c.style.color = "#00c129";
            }
            else{
                c.style.color = "#ff0000";
            } 
            document.getElementById("UnitCPS" + i).innerHTML = "CPS: " + format(u.cps);
            document.getElementById("UnitNum" + i).innerHTML = "Owned: " + format(u.num);
        }
        //document.getElementById("UnitName" + i).innerHTML = units[i].name;
    }
}

function format(value) {
    var text = "";
    if(value < 1000000){
        text = numeral(value).format("0,000");
    }
    else{
        
        text = nFormatter(value, 3);
    }
    return text;
}


function nFormatter(num, digits) {
  var si = [
    { value: 1E69, symbol: "DuoVg" },
    { value: 1E66, symbol: "UnVg" },
    { value: 1E63, symbol: "Vg" },
    { value: 1E60, symbol: "NoDc" },
    { value: 1E57, symbol: "OcDc" },
    { value: 1E54, symbol: "SeDc" },
    { value: 1E51, symbol: "SxDc" },
    { value: 1E48, symbol: "QiDc" },
    { value: 1E45, symbol: "QaDc" },
    { value: 1E42, symbol: "TreDc" },
    { value: 1E39, symbol: "DuoDc" },
    { value: 1E36, symbol: "UnDc" },
    { value: 1E33, symbol: "Dc" },
    { value: 1E30, symbol: "No" },
    { value: 1E27, symbol: "Oc" },
    { value: 1E24, symbol: "Sp" },
    { value: 1E21, symbol: "Sx" },
    { value: 1E18, symbol: "Qi" },
    { value: 1E15, symbol: "Qa" },
    { value: 1E12, symbol: "T" },
    { value: 1E9,  symbol: "B" },
    { value: 1E6,  symbol: "M" }
  ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;
  for (i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(rx, "$1") + " " + si[i].symbol;
    }
  }
  return num.toFixed(digits).replace(rx, "$1");
}




function tick(){ 
    if(run){       
        CalcCPS();    
        var deltaTime = parseFloat(((parseFloat(Date.now())-parseFloat(lastTickTime))/ tickTime));
        var ccps = (cps / (1000 / tickTime)) * deltaTime;    
        coins += ccps; 
        lastTickTime = parseInt(Date.now());   
        Save(); 
    }
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
    localStorage.setItem("lastTick", lastTickTime);
    for(var i = 0; i < units.length; i++){
        localStorage.setItem("unit" + i, units[i].num);
    }
    
}

function Load(){
    coins = parseFloat(localStorage.getItem("coin"));
    cps = parseFloat(localStorage.getItem("cps"));
    lastTickTime = parseInt(localStorage.getItem("lastTick"));
    for(var i = 0; i < units.length; i++){
        units[i].num = parseInt(localStorage.getItem("unit" + i));
    }
    
    var deltaTime = parseFloat(((parseFloat(Date.now())-parseFloat(lastTickTime))/ tickTime));
    var ccps = (cps / (1000 / tickTime)) * deltaTime;
    if(deltaTime / 10 >= 10  && deltaTime * 10 <= 3600){
        alert("Game loaded and you got " + format(ccps) + " coins after being away for " + Math.round(deltaTime / 1000 * tickTime) + " seconds."); 
    }
    coins += ccps;
    lastTickTime = Date.now();
}


function Reset(){
    localStorage.setItem("coin", 0);
    localStorage.setItem("cps", 0);
    for(var i = 0; i < units.length; i++){
        localStorage.setItem("unit" + i, 0);
    }
    Load();
    localStorage.setItem("lastTick", Date.now());
}

function CalcCPS(){
    cps = 0;
    for(var i = 0; i < units.length; i++){
        cps += units[i].ccps();
    }
    cps *= clickingBonus;
}




UnitInit();
Load();
setInterval(update, 100);
setInterval(tick, tickTime);


function UnitShow() {
    for(var i = 0; i < units.length; i++) {
        var u = units[i];
        if(i !== 0 && units[i-1].num > 0){
            u.known = true;
        }
        if(u.known){
            document.getElementById("UnitName" + i).innerHTML = u.name;
            var k = document.getElementById("U"+i);
            k.className = "UnitA";
            document.getElementById("UD" + i).className = "UnitDiv";
        }
        else if(i !== 0 && units[i-1].known){
            document.getElementById("UnitName" + i).innerHTML = "???";
            var a = document.getElementById("U"+i);
            a.className = "";
            var c = document.getElementById("UnitCost" + i);
            c.innerHTML = "Cost: ???";
            document.getElementById("UnitCPS" + i).innerHTML = "CPS: ???";
            document.getElementById("UnitNum" + i).innerHTML = "Owned: ???";
            document.getElementById("UD" + i).className = "UnitDivUnknown";
        }
        else{
            var f = document.getElementById("U"+i);
            f.className = "";
            f.className += "DisabledUnitA";
        }
        
    }
}

function SelectMainWindow (num, title)
{
    document.getElementById("D2Title").innerHTML = title;
    for(var i = 0; i < 4; i++){
        if(num != i){
            document.getElementById("Main2W"+i).className += " DisabledMain2";
        }
        else{
            document.getElementById("Main2W"+i).className -= " DisabledMain2";
        }
    }
}












setTimeout(UnitShow, 100);
