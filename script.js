window.ondragstart = function() { return false; };

var tickTime =  100;

var coinIMG;

var MainWindowNum;
var MainWindowTitle;


var clickCount = 0;
var clickM = 1;

var clickingBonus = 1;

var coins = 0;
var cps = 0;

var coinsOverflow = 0;
var cpsOverflow = 0;

var units = [];
var Upgrades = [];

var buyAmount = 1;

var lastTickTime = 0.0;

var run = true;

var UnitOuterDiv;
var UpgradeOuterDiv;


var overviewWindow;
var UpgradesWindow;
var commanderWindow;
var achievmentsWindow;
var optionsWindow;


var unitCosts = [];
var unitCPSs = [];
var unitNums = [];
var unitUPs = [];


var UpgradeCosts = [];

var c = new Commander();


function Unit(name, baseCost, cps, known, num) {
    
    this.name = name;
    this.baseCost = baseCost;
    this.cps = cps;
    this.known = known;
    this.num = num;
    this.Upgrades = 0;
    this.MultFactor = 1.15;
    this.Reputation;

    this.cost = function () {
        return Math.round(this.baseCost * Math.pow(this.MultFactor, this.num));
    };
    
    this.cost2 = function (num) {
        return this.sum(this.num + num) - this.sum(this.num);
    };
    
    this.sum = function(n) {
      return Math.round(-this.baseCost * ((1-Math.pow(this.MultFactor, n))/(this.MultFactor - 1 )));  
    }; 
    
    this.ccps = function () {
        return Math.round(this.cps * this.num * (1 + this.Upgrades));
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
    UnitShow();
    UpgradeShow();
    Save();
}

function Upgrade(name, cost, type, unitID, amount, known, desc) {
    this.name = name;
    this.cost = cost;
    this.type = type;
    this.unitID = unitID;
    this.amount = amount;
    this.desc = desc;
    this.known = known;
    this.activated = false;
    this.unit = units[unitID];
    
    this.cost2 = function () {
        switch(this.type) 
        {
            case "Unit":
                {
                    return Math.pow(this.unit.baseCost, 2) * (this.amount * this.amount * this.amount) * 32;
                    break;
                }
            case "Click":
                {
                    return Math.pow(128, this.amount);
                    break;
                }
        }
        
    }
}

function BuyUpgrade(id){
    if(id < Upgrades.length){
        var u = Upgrades[id];
        if(coins - u.cost2() >= 0){
            coins -= u.cost2();
            u.activated = true;
            if(u.type == "Unit"){                
                units[u.unitID].Upgrades = u.amount;
            }
            else if(u.type == "Click") {
                clickM = u.amount * 2;
            }
        }
    }
    UpgradeShow();
}

function UnitInit(){
    //name, baseCost, cps, known
    units[0] = new Unit("Peasant", 16, 1, true, 0);
    units[1] = new Unit("Brute", 130, 16, false, 0);
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

function UpgradeInit() {
    //name, cost, type, unitID, amount, known, desc
    for(var i = 0; i < units.length; i++){
        var u = units[i];
        for(var j = 0; j < 4; j++){
            Upgrades.push(
                new Upgrade(u.name + " lvl " + (j+1), 1, "Unit", i, j+1, true, "+" + (100) + "% raiding power for " + u.name));
        }
    }
    
    for(var k = 0; k < 10; k++) {
        Upgrades.push(new Upgrade("Clicking lvl " + (k+1), 1, "Click", -1, k+1, true, "Doubles click strength."));
    }
}

function Commander(){
	this.Name = "Commander";
	this.Level = 0;
	this.BaseUpCost = 100;
	this.MultFactor = 1.9;
	this.RepP = null;
	this.LevelP = null;
	this.TimeP = null;
	this.CostP = null;

	this.cost = function(){
		return Math.round(this.BaseUpCost * Math.pow(this.MultFactor, this.Level));
	};

	this.updateTab = function(){
        var rx = /(\d+)(\d{3})/;
		if(this.LevelP == null)
		{			
			this.LevelP = document.getElementById("CommanderLevel");
		}
		this.LevelP.innerHTML = format(this.Level);
		if(this.RepP == null)
		{			
			this.RepP = document.getElementById("CommanderRep");
		}
		this.RepP.innerHTML =  format(this.Reputation());
		if(this.TimeP == null)
		{			
			this.TimeP = document.getElementById("CommanderCurrentTime");
		}
		this.TimeP.innerHTML = this.Reputation() > 0 ? "Current time: " + formatMins(this.currentTime() * 60) : "Your Commander has no reputation so he can't command your army.";
		if(this.CostP == null){
			this.CostP = document.getElementById("CommanderCurrentCost");			
		}
		if(this.cost() >= coins){
			this.CostP.style.color = "#dd0000";
		}
		else{
			this.CostP.style.color = "#1e9231";
		}
		this.CostP.innerHTML = format(this.cost());
	};

	this.currentTime = function(){
		return Math.round(Math.log10(this.Reputation()) * 100) / 100;
	};

	this.Reputation = function(){
        var r = 5 * Math.pow(1.3, this.Level);
        if(r > 100 || r < -100){
            return Math.round(r / 100) * 100;
        }
        else if(r > 10 || r < -10){
            return Math.round(r / 10) * 10;
        }
        else{
            return Math.round(r);
        }    
	}
	this.upgrade = function(){
		if(coins >= this.cost()){
			coins -= this.cost();
			this.Level++;
		}
	};
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

function UnitArrayTest () {
    
    if(unitCosts.length < units.length){
         unitCosts = [];
        for(var i = 0; i < units.length; i++){
            unitCosts.push(document.getElementById("UnitCost" + i));
        }
    }
    if(unitCPSs.length < units.length){
        unitCPSs = [];
        for(var j = 0; j < units.length; j++){
            unitCPSs.push(document.getElementById("UnitCPS" + j));
        }
    }
    if(unitNums.length < units.length){
        unitNums = [];
        for(var k = 0; k < units.length; k++){
            unitNums.push(document.getElementById("UnitNum" + k));
        }
    }
    if(unitUPs.length < units.length){
        unitUPs = [];
        for(var l = 0; l < units.length; l++){
            unitUPs.push(document.getElementById("UnitUP" + l));
        }
    }
}

function UpgradeArrayTest () {
    
    if(UpgradeCosts.length < Upgrades.length){
        UpgradeCosts = [];
        for(var i = 0; i < Upgrades.length; i++){
            UpgradeCosts.push(document.getElementById("Upgr" + i));
        }
    }
    
}

function UpdateUnitStuff() {  
    UnitArrayTest();
    
    for(var i = 0; i < units.length; i++) {
        var u = units[i];        
        if(u.known){
            var c = unitCosts[i];
            c.innerHTML = "Cost: " + format(u.cost2(buyAmount));
            if(coins - u.cost2(buyAmount) >= 0){
                c.style.color = "#1e9231";
            }
            else{
                c.style.color = "#ee0000";
            } 
            if(u.num > 0){                
                unitCPSs[i].innerHTML = "CPS: " + format(u.ccps());
            }
            else {
                unitCPSs[i].innerHTML = "CPS: " + format(u.cps);
            }
            unitUPs[i].innerHTML = "Level: " + u.Upgrades;
            unitNums[i].innerHTML = "Owned: " + format(u.num);
        }
    }
}

function tick(){ 
    if(run){       
        CalcCPS();    
        var deltaTime = parseFloat(((parseFloat(Date.now())-parseFloat(lastTickTime))/ tickTime));
        var ccps = (cps / (1000 / tickTime)) * deltaTime;    
        coins += ccps; 
        lastTickTime = parseInt(Date.now());
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
    UpdateUpgradeStuff();
    UpgradeShow();
    c.updateTab();
    document.getElementById("clicksC").innerHTML = (clickCount * clickM) + " coins from clicks per second";
}

function Save(){
    localStorage.setItem("coin", coins);
    localStorage.setItem("cps", cps);
    localStorage.setItem("lastTick", lastTickTime);
    for(var i = 0; i < units.length; i++){
        localStorage.setItem("unit" + i, units[i].num);
        localStorage.setItem("unit" + i + "Upgrades", units[i].Upgrades);
    }

    
    for(var j = 0; j < Upgrades.length; j++) {
        localStorage.setItem("Upgrade" + j, Upgrades[j].activated);
    }
    localStorage.setItem("ClickM", clickM);
    
    localStorage.setItem("CLevel", c.Level);
    
    localStorage.setItem("MainWindowNum", MainWindowNum);
    localStorage.setItem("MainWindowTitle", MainWindowTitle);
}

function Load(){
    c.Level = parseInt(localStorage.getItem("CLevel"));
    coins = parseFloat(localStorage.getItem("coin"));
    cps = parseFloat(localStorage.getItem("cps"));
    lastTickTime = parseInt(localStorage.getItem("lastTick"));
    for(var i = 0; i < units.length; i++){
        units[i].num = parseInt(localStorage.getItem("unit" + i));
        units[i].Upgrades = parseInt(localStorage.getItem("unit" + i + "Upgrades"));
    }
    for(var j = 0; j < Upgrades.length; j++) {
        Upgrades[j].activated = localStorage.getItem("Upgrade" + j) == "true" ? true : false;
    }
    clickM = parseInt(localStorage.getItem("ClickM"));
    
    var deltaTime = parseFloat(((parseFloat(Date.now())-parseFloat(lastTickTime)) / tickTime));
    var commDeltaTime = c.currentTime() * 60000;
    var ccps = (cps / (1000 / tickTime)) * Math.min(deltaTime, commDeltaTime);
    alert("Game loaded and you got " + format(ccps) + " coins." + (deltaTime > commDeltaTime?"\nUpgradeyour commander for more offline time!":"")); 
    coins += ccps;
    lastTickTime = Date.now();
}

function Reset(){
    localStorage.setItem("coin", 0);
    localStorage.setItem("cps", 0);
    for(var i = 0; i < units.length; i++){
        localStorage.setItem("unit" + i, 0);
        localStorage.setItem("unit" + i + "Upgrades", 0);
        if(i != 0){
            units[i].known = false;
        }
    }
    localStorage.setItem("ClickM", 1);
    for(var j = 0; j < Upgrades.length; j++) {
        localStorage.setItem("Upgrade" + j, false);
    }
    localStorage.setItem("lastTick", Date.now());
    localStorage.setItem("CLevel", 0);    
    localStorage.setItem("MainWindowNum", -1);
    localStorage.setItem("MainWindowTitle", "");
    Load();
    UnitShow();
}

function CalcCPS(){
    cps = 0;
    for(var i = 0; i < units.length; i++){
        cps += units[i].ccps();
    }
    cps *= clickingBonus;
}

function UnitShow() {
    UnitArrayTest();    
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
            var c = unitCosts[i];
            c.innerHTML = "Cost: ???";
            c.style.color = "black";
            unitCPSs[i].innerHTML = "CPS: ???";
            unitNums[i].innerHTML = "Owned: 0";
            unitUPs[i].innerHTML = "Upgrades: 0";
            document.getElementById("UD" + i).className = "UnitDivUnknown";
        }
        else{
            var f = document.getElementById("U"+i);
            f.className = "DisabledUnitA";
        }
        
    }
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

function formatMins(mins){
    var dMins = mins;
    if(mins >= 86400){
        var days = Math.round(mins / 86400);        
        mins %= 86400;
        var hours = Math.round(mins / 60);
        mins %= 60;
        return days + " days, " + hours + " hours and " + Math.round(mins) + " mins.";
    }
    else if(mins >= 60){
        var hours = Math.round(mins / 60);
        mins %= 60;
        return hours + " hours and " + Math.round(mins) + " mins.";
    }
    else{
        return Math.round(mins) + " mins.";
    }
}


function format(value) {
    var text = "";
    if(value < 1000000){
        text = addCommas(value);
    }
    else if(value <= 10e+71){        
        text = nFormatter(value, 3);
    }
    else{
        text = normalFormat(value);
    }
    return text;
}

function normalFormat(value, decimals = 3){
    var str = String(Math.round(value));    
    str = str.replace('.', '');
    var first = str.substring(0,1);
    var second = str.substring(1, Math.min(decimals + 1, str.length - 1));
    var final = first + "." + second + "e+" + (str.length - 1);
    return final;

}

function addCommas(n){
    var rx = /(\d+)(\d{3})/;
    return String(Math.round(n)).replace(/^\d+/, function(w){
        while(rx.test(w)){
            w = w.replace(rx, '$1,$2');
        }
        return w;
    });
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

function createUnit(unitID) {
    if(UnitOuterDiv == null){
        UnitOuterDiv = document.getElementById("UnitOuterDiv");
    }
    var a = document.createElement("a");
        a.setAttribute("id", "U" + unitID);
        a.setAttribute("onclick", "BuyUnit(" + unitID + ")");
        UnitOuterDiv.appendChild(a);
    var div1 = document.createElement("div");
        a.appendChild(div1);
        div1.classList.add("UnitDiv");
        div1.setAttribute("id", "UD" + unitID);
    var table = document.createElement("table");
        div1.appendChild(table);
        table.classList.add("UnitTable");
    
    var trTitle = document.createElement("tr");
        table.appendChild(trTitle);
    
    var tdTitle = document.createElement("td");
        trTitle.appendChild(tdTitle);
        tdTitle.setAttribute("colspan", "4");
    
    var pTitle = document.createElement("p");
        tdTitle.appendChild(pTitle);
        pTitle.setAttribute("id", "UnitName" + unitID);
        pTitle.classList.add("UnitP");
    
    var trInfo = document.createElement("tr");
        table.appendChild(trInfo);
    
    var tdCost = document.createElement("td");
        trInfo.appendChild(tdCost);
    var spanCost = document.createElement("span");
        tdCost.appendChild(spanCost);
        spanCost.setAttribute("id", "UnitCost" + unitID);
    
    var tdCPS = document.createElement("td");
        trInfo.appendChild(tdCPS);
    var spanCPS = document.createElement("span");
        tdCPS.appendChild(spanCPS);
        spanCPS.setAttribute("id", "UnitCPS" + unitID);
    
    
    var tdUP = document.createElement("td");
        trInfo.appendChild(tdUP);
    var spanUP = document.createElement("span");
        tdUP.appendChild(spanUP);
        spanUP.setAttribute("id", "UnitUP" + unitID);    
    
    var tdNum = document.createElement("td");
        trInfo.appendChild(tdNum);
    var spanNum = document.createElement("span");
        tdNum.appendChild(spanNum);
        spanNum.setAttribute("id", "UnitNum" + unitID);
    
}

function UnitStuffGen() {
    for(var i = 0; i < units.length; i++) {
        createUnit(i);
    }   
    UnitShow();
}

function UpgradeShow() {
    UpgradeArrayTest();
    
    for(var i = 0; i < Upgrades.length; i++) {
        var u = Upgrades[i];
        if(u.type == "Unit") {
            if(u.unit.num == 0 || u.activated || u.unit.Upgrades + 1 != u.amount) {
                document.getElementById("Upgrade" + i).classList.add("DisabledMain2");
                document.getElementById("Upgrade" + i).classList.remove("Upgrade");
            }
            else {
                document.getElementById("Upgrade" + i).classList.add("Upgrade");
                document.getElementById("Upgrade" + i).classList.remove("DisabledMain2");
            } 
        } 
        else if(u.type == "Click") {
            if(u.activated || clickM != u.amount) {
                document.getElementById("Upgrade" + i).classList.add("DisabledMain2");
                document.getElementById("Upgrade" + i).classList.remove("Upgrade");
            }
            else {
                document.getElementById("Upgrade" + i).classList.add("Upgrade");
                document.getElementById("Upgrade" + i).classList.remove("DisabledMain2");
            }
        }
        
        
    }
}

function UpdateUpgradeStuff() {
    UpgradeArrayTest();
    for(var i = 0; i < Upgrades.length; i++) {
        var u = Upgrades[i];
        if(u.known && !u.activated){
            var c = UpgradeCosts[i];
            if(u.type == "Unit"){
                if(u.unit.num > 0) {
                c.innerHTML = "Cost: " + format(u.cost2());
                }
            }
            else if(u.type == "Click") {
                c.innerHTML = "Cost: " + format(u.cost2());
            }
            if(coins - u.cost2() >= 0){
                c.style.color = "#1e9231";
            }
            else{
                c.style.color = "#ee0000";
            }
        }
    } 
}

function createUpgrade (UpgradeID) {
    if(UpgradeOuterDiv == null) {
        UpgradeOuterDiv = document.getElementById("UpgradeOuterDiv");
    }
    var u = Upgrades[UpgradeID];
    var a = document.createElement("a");
        a.setAttribute("onclick", "BuyUpgrade(" + UpgradeID + ")");
        UpgradeOuterDiv.appendChild(a);
        a.classList.add("Upgrade");
        a.setAttribute("id", "Upgrade" + UpgradeID);
    var h5 = document.createElement("h5");
        a.appendChild(h5);
        h5.innerHTML = u.name;
    var h6 = document.createElement("h6");
        a.appendChild(h6);
        h6.innerHTML = u.desc;
    var span = document.createElement("span");
        a.appendChild(span);
        span.innerHTML = format(u.cost);
        span.setAttribute("id", "Upgr" + UpgradeID);
}

function UpgradeGenStuff() {
    for(var i = 0; i < Upgrades.length; i++) {
        createUpgrade(i);
    }
    
}

function LoadLastPage(){
    var n = parseInt(localStorage.getItem("MainWindowNum"));
    var t = localStorage.getItem("MainWindowTitle");
    if(n > -1 && t != ""){
        SelectMainWindow(n, t);
    }
}




UnitInit();
UpgradeInit();
Load();
setTimeout(LoadLastPage, 100);
setTimeout(UnitStuffGen, 100);
setTimeout(UpgradeGenStuff, 10);
setInterval(update, 100);
setInterval(tick, tickTime);
setInterval(Save, 1500);
