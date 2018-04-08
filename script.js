window.ondragstart = function() { return false; };

var tickTime =  100;

var coinIMG;

var MainWindowNum;
var MainWindowTitle;

var clickLevel = 0;
var clickCount = 0;
var clickUnitBonus = 1;

var supplyBoxes = 0;

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

var c = new Commander(0.01);

var deltaTime = 0;

var AllCoinProd = 0;
var ClickCoinProd = 0;

function CalcCoinsPerClick(){
    var ccps = CalculateGameTickProduction(false, deltaTime);  
    var base = 1 * c.CommanderClickBonus() * Math.pow(1.3, clickLevel);
    if(ccps == 0){
        return base;
    }
    else{
        var applied = base * ((ccps /  (1 + clickUnitBonus) / (20 - clickLevel)));
        return Math.max(base, applied);
    }    
}

function Click() {
    clickCount = Clamp(clickCount + 1, 0, 15);
    setTimeout(ClickMin,1000);
    var clickCoins = CalcCoinsPerClick()  * clickCount * (1 + GetSupplyBonus());
    coins += clickCoins ;
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
    clickCount = Clamp(clickCount - 1, 0, 15);
}

function ClickStyle() {
    coinIMG.style.width = 200 + "px";
    coinIMG.style.height = 200 + "px";
}


function UpdateCoinTexts() {
    var cText = format(coins);
    document.title = cText + " coin(s)" + " - Comdr. Clicker";
    document.getElementById("coin1").innerHTML = cText + " coin(s)";     
    
}

function UpdateCPS() {    
    var cpsText = format(( CalculateNormalCPS()  * (1 + GetSupplyBonus()) + CalcCoinsPerClick() * clickCount   * (1 + GetSupplyBonus())));
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
    var clickC = CalcCoinsPerClick() * clickCount;
    document.getElementById("clicksC").innerHTML = format(clickC) + " coins from clicks per second<br>Bonus unit production multiplier for clicks: " + (1 +clickUnitBonus).toFixed(2) + "x";
    document.getElementById("SupplyBoxNumCurrent").innerHTML = format(supplyBoxes);
    document.getElementById("SupplyBoxNumGain").innerHTML = format(CalcSupplyBoxGain());
    document.getElementById("SupplyBoxBoost").innerHTML = format(GetSupplyBonus() * 100) + "%";

}

function Save(){
    localStorage.setItem("coin", coins);
    localStorage.setItem("cps", cps);
    localStorage.setItem("lastTick", lastTickTime);
    localStorage.setItem("supplyBoxes", supplyBoxes);
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


function Load(applyDCOM = true){
    c.Level = parseInt(StorageErrorSolverAndGetter("CLevel", 0));
    coins = parseInt(StorageErrorSolverAndGetter("coin", 0));
    lastTickTime = parseInt(StorageErrorSolverAndGetter("lastTick", 0));
    clickLevel = parseInt(StorageErrorSolverAndGetter("ClickUpgradeLevel", 0));
    supplyBoxes = parseInt(StorageErrorSolverAndGetter("supplyBoxes", 0));
    for(var i = 0; i < units.length; i++){
        var u = units[i];
        u.num = parseInt(StorageErrorSolverAndGetter("unit" + i, 0));
        u.Upgrades = parseInt(StorageErrorSolverAndGetter("unit" + i + "Upgrades", 0));
        u.CoinProd = parseInt(StorageErrorSolverAndGetter("unit" + i + "Prod", 0));
    }
    AllCoinProd = parseInt(StorageErrorSolverAndGetter("AllCoinProd", 0));
    ClickCoinProd = parseInt(StorageErrorSolverAndGetter("ClickCoinProd", 0));
    
    for(var j = 0; j < Upgrades.length; j++) {
        Upgrades[j].activated = StorageErrorSolverAndGetter("Upgrade" + j, false) == "true" ? true : false;
    }    
    if(applyDCOM){
        DCOMLoad();
    }
    lastTickTime = Date.now();
}

function DCOMLoad(){
    var commDeltaTime = c.currentTime() * 60000;   
    var deltaTime = parseFloat(((parseFloat(Date.now())-parseFloat(lastTickTime)) / tickTime)); 
    var ccps = CalculateGameTickProduction(true, Math.min(deltaTime, commDeltaTime));
    coins += ccps;

    var mins = deltaTime/1000;
    alert("Game loaded and you got " + format(ccps) + " coins." + " You were away for " + (mins >= 1?formatMinslong(mins): " less than a minute.")  + (deltaTime > commDeltaTime?"\nUpgrade your commander for more than " + formatMinslong(commDeltaTime / 60000) + " offline time!":"")); 
    //console.log(deltaTime);
}

function Reset(noConfirm = false){
    if(noConfirm || (confirm("Do you really want to reset your game?"))){
        localStorage.setItem("coin", 0);
        localStorage.setItem("cps", 0);
        if(noConfirm || confirm("Do you want to reset you Supply boxes too?")){            
            localStorage.setItem("supplyBoxes", 0);
        }
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
        localStorage.setItem("PlayCounter", 0);
        Load(false);
    }
        
    
}

function CalcSupplyBoxGain(){
    return Math.round(Math.pow(AllCoinProd / 10e5, 0.3));
}

function Promote(){
    if(confirm("Do you really want to promote?")){
        supplyBoxes += CalcSupplyBoxGain();
        localStorage.setItem("supplyBoxes", supplyBoxes);
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
        localStorage.setItem("ClickUpgradeLevel", 0); 
        Load(false);
    }
}

function GetSupplyBonus(){
    return supplyBoxes * 0.035;
}

function CalculateGameTickProduction(isApplied = false, time = deltaTime){
    cps = 0;
    for(var i = 0; i < units.length; i++){
        var u = units[i];
        if(u.num > 0){
            var ct = u.ccps() * (1 + GetSupplyBonus());
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
    return Math.round(cps * (1 + clickUnitBonus) * (1 + GetSupplyBonus()));
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
    for(var i = 0; i < 6; i++){
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

function TryLoad(){  
    StorageErrorSolverAndGetter("AllTimeStart", Date.now());
    if(isNaN(localStorage.getItem("PlayCounter"))){
        localStorage.removeItem("PlayCounter");
    }
    if(localStorage.getItem("PlayCounter") === null){
        Reset(true); 
        alert("Thank you for playing the game. Click the coin to get started.");
        localStorage.setItem("PlayCounter", 0);
    }
    else{    
        Load(true);
        var cu = localStorage.getItem("PlayCounter");
        localStorage.setItem("PlayCounter", parseInt(cu) + 1);
    }
    setTimeout(DisplayUnitUIObjects + DisplayUpgradeUIObjects, 20);
}

WriteWelcomeMessage();

UnitInit();
UpgradeInit();


TryLoad();

setTimeout(LoadLastPage, 100);
setTimeout(UnitStuffGen, 100);
setTimeout(UpgradeGenStuff, 10);
setInterval(GameUpdateUI, 100);
setInterval(GameTick, tickTime);
setInterval(Save, 1500);
setInterval(DisplayUnitUIObjects,  500);
setInterval(DisplayUpgradeUIObjects, 500);
setTimeout(start, 10);