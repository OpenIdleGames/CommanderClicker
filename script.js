window.ondragstart = function() { return false; };

var tickTime =  100;

var coinIMG;

var MainWindowNum;
var MainWindowTitle;

var clickLevel = 0;
var clickCount = 0;
var clickUnitBonus = 1;

var coins = 0;

var coinsOverflow = 0;
var cpsOverflow = 0;

var units = [];
var Upgrades = [];

var buyAmount = 1;

var lastTickTime = 0.0;

var run = true;

var UnitOuterDiv;
var UpgradeOuterDiv;
var UnitOverviewTable;


var overviewWindow;
var UpgradesWindow;
var commanderWindow;
var achievmentsWindow;
var optionsWindow;



var UpgradeCosts = [];

var c = new Commander(0);

var deltaTime = 0;

var AllCoinProd = 0;
var ClickCoinProd = 0;

function CalcCoinsPerClick(){
    var ccps = CalculateGameTickProduction(false, deltaTime);  
    var base = 1 * c.ClickBonus() * (1 + clickLevel);
    if(ccps == 0){
        return base;
    }
    else{
        return base * ((ccps /  (1 + clickUnitBonus) / (20 - clickLevel)));
    }    
}

function Click() {
    clickCount = Clamp(clickCount + 1, 0, 20);
    setTimeout(ClickMin,1000);
    var clickCoins = CalcCoinsPerClick()  * clickCount;
    coins += clickCoins;
    ClickCoinProd += clickCoins;
    AllCoinProd += clickCoins;
    UpdateCoinTexts();
    UpdateCPS();
    coinIMG =  document.getElementById("coin");
    coinIMG.style.width = 210 + "px";
    coinIMG.style.height = 210 + "px";
    setTimeout(ClickStyle, 40);
}

function ClickMin() {
    clickCount = Clamp(clickCount - 1, 0, 20);
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
    var cpsText = format(( CalculateNormalCPS() + CalcCoinsPerClick() * clickCount));
    if(cps != 1){
        cpsText += " per second";
    }
    else{
        cpsText += " per second";        
    }
    document.getElementById("cps1").innerHTML = cpsText;
}

function GameTick(){ 
    if(run){       
        deltaTime = parseFloat(((parseFloat(Date.now())-parseFloat(lastTickTime)) / tickTime));   
        coins += CalculateGameTickProduction(true, deltaTime);
        clickUnitBonus =  clickCount * (0.005 + clickLevel * 0.001);  
        lastTickTime = parseInt(Date.now());

    }
}

function GameUpdateUI(){
    var radios = document.getElementsByName('amount');
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            buyAmount = parseInt(radios[i].value);
            break;
        }
    }
    UpdateCoinTexts();
    UpdateCPS(); 
    UpdateUnitStuff();
    UpdateUpgradeStuff();
    DisplayUpgradeUIObjects();
    c.updateTab();
    
    document.getElementById("UnitCombinedProd").innerHTML = format(AllCoinProd);
    if(AllCoinProd > 0){
        document.getElementById("ClickProd").innerHTML = format(ClickCoinProd) + " (" + Math.round(ClickCoinProd * 100 / AllCoinProd) + "%)";
    }
    else{
        document.getElementById("ClickProd").innerHTML = 0;
    }
    document.getElementById("clicksC").innerHTML = format(Math.round(CalcCoinsPerClick() * clickCount)) + " coins from clicks per second<br>Bonus unit production multiplier for clicks: " + (1 +clickUnitBonus).toFixed(2) + "x";
}

function Save(){
    if(coins != NaN){
        localStorage.setItem("coin", coins);
    }
    else{
        //Reset();
        console.log("Coin was NaN");
    }
    localStorage.setItem("cps", cps);
    localStorage.setItem("lastTick", lastTickTime);
    for(var i = 0; i < units.length; i++){
        var u = units[i];
        localStorage.setItem("unit" + i, u.num);
        localStorage.setItem("unit" + i + "Upgrades", u.Upgrades);
        localStorage.setItem("unit" + i + "Prod", u.CoinProd)
    }
    localStorage.setItem("AllCoinProd", AllCoinProd);
    localStorage.setItem("ClickCoinProd", ClickCoinProd);
    
    for(var j = 0; j < Upgrades.length; j++) {
        localStorage.setItem("Upgrade" + j, Upgrades[j].activated);
    }
    
    localStorage.setItem("CLevel", c.Level);
    
    localStorage.setItem("MainWindowNum", MainWindowNum);
    localStorage.setItem("MainWindowTitle", MainWindowTitle);
    localStorage.setItem("ClickUpgradeLevel", clickLevel);
    
}


function Load(){
    c.Level = parseInt(localStorage.getItem("CLevel"));
    coins = parseInt(localStorage.getItem("coin"));
    lastTickTime = parseInt(localStorage.getItem("lastTick"));
    clickLevel = parseInt(localStorage.getItem("ClickUpgradeLevel"));
    for(var i = 0; i < units.length; i++){
        var u = units[i];
        u.num = parseInt(localStorage.getItem("unit" + i));
        u.Upgrades = parseInt(localStorage.getItem("unit" + i + "Upgrades"));
        u.CoinProd = parseInt(localStorage.getItem("unit" + i + "Prod"));
    }
    AllCoinProd = parseInt(localStorage.getItem("AllCoinProd"));
    ClickCoinProd = parseInt(localStorage.getItem("ClickCoinProd"));
    
    for(var j = 0; j < Upgrades.length; j++) {
        Upgrades[j].activated = localStorage.getItem("Upgrade" + j) == "true" ? true : false;
    }
    var deltaTime = parseFloat(((parseFloat(Date.now())-parseFloat(lastTickTime)) / tickTime));
    var commDeltaTime = c.currentTime() * 60000;
    var mins = deltaTime/1000;  
    var ccps = CalculateGameTickProduction(true, Math.min(deltaTime, commDeltaTime));
    alert("Game loaded and you got " + format(ccps) + " coins." + " You were away for " + (mins >= 1?formatMins(mins): " less than a minute.")  + (deltaTime > commDeltaTime?"\nUpgrade your commander for more offline time!":"")); 
    coins += ccps;
    lastTickTime = Date.now();
}

function Reset(){
    localStorage.setItem("coin", 0);
    localStorage.setItem("cps", 0);
    for(var i = 0; i < units.length; i++){
        localStorage.setItem("unit" + i, 0);
        localStorage.setItem("unit" + i + "Upgrades", 0);
        localStorage.setItem("unit" + i + "Prod", 0)
        if(i != 0){
            units[i].known = false;
        }
    }
    localStorage.setItem("AllCoinProd", 0);
    localStorage.setItem("ClickCoinProd", 0);
    for(var j = 0; j < Upgrades.length; j++) {
        localStorage.setItem("Upgrade" + j, false);
    }
    localStorage.setItem("lastTick", Date.now());
    localStorage.setItem("CLevel", 0);    
    localStorage.setItem("MainWindowNum", -1);
    localStorage.setItem("MainWindowTitle", "");
    localStorage.setItem("ClickUpgradeLevel", 0);
    Load();
    DisplayUnitUIObjects();
    DisplayUpgradeUIObjects();
}

function CalculateGameTickProduction(isApplied = false, time = deltaTime){
    cps = 0;
    for(var i = 0; i < units.length; i++){
        var u = units[i];
        if(u.num > 0){
            var ct = u.ccps();
            if(isApplied){
                u.CoinProd += ct;
                AllCoinProd += ct;
            }
            cps += ct;
        }
    }
    return Math.round((cps * (1 + clickUnitBonus) / (1000 / tickTime)) * time);
}

function CalculateNormalCPS(){
    var cps = 0;
    for(var i = 0; i < units.length; i++){
        var u = units[i];
        if(u.num > 0){         
            cps += u.ccps();
        }
    }
    return Math.round(cps * (1 + clickUnitBonus));
}

function SumReputation (){
    var rep = 0; 
    for(var i = 0; i < units.length; i++){
        var u = units[i];
        if(u.num > 0){         
            rep += u.ReputationBonus();
        }
    }
    return rep;
}

function SelectMainWindow (num, title){    
    document.getElementById("D2Title").innerHTML = title;
    MainWindowNum = num;
    MainWindowTitle = title;
    for(var i = 0; i < 5; i++){
        if(num != i){
            document.getElementById("Main2W"+i).classList.add("DisabledMain2");
            document.getElementById("Main2W"+i).classList.remove("Main2");
        }
        else{
            document.getElementById("Main2W"+i).classList.remove("DisabledMain2");
            document.getElementById("Main2W"+i).classList.add("Main2");
        }
    }
}

function LoadLastPage(){
    var n = parseInt(localStorage.getItem("MainWindowNum"));
    var t = localStorage.getItem("MainWindowTitle");
    if(n > -1 && t != ""){
        SelectMainWindow(n, t);
    }
}


WriteWelcomeMessage();
UnitInit();
UpgradeInit();
Load();
setTimeout(LoadLastPage, 100);
setTimeout(UnitStuffGen, 100);
setTimeout(UpgradeGenStuff, 10);
setInterval(GameUpdateUI, 100);
setInterval(GameTick, tickTime);
setInterval(Save, 1500);
setInterval(DisplayUnitUIObjects,  1000);
setInterval(DisplayUpgradeUIObjects, 1000);
setTimeout(start, 10);