
var UnitNames = ["Peasant", "Brute", "Slinger", "Spearman", "Knight", "Archer", "Musketeer", "Frigate", "Rifleman", "Marine", "Swat", "Cannon", "SAS", "Artillery", "Spetznaz", "APC", "Battleship", "MBT", "Chopper", "Aircraft", "Cruiser", "ICBM", "Mecha", "H-bomb", "Deathray", "AM Torpedo", "USS Enterprise", "Star Destroyer", "Gravity Warper", "Reality machine"];

var unitCosts = [];
var unitCPSs = [];
var unitNums = [];
var unitUPs = [];
var unitProds = [];
var unitOverviewTRs = [];
var unitCCPSInfos = [];

class Unit {
    constructor(id, name, baseCost, cps, known, num) {
        this.ID = id;
        this.name = name;
        this.baseCost = baseCost;
        this.cps = cps;
        this.known = known;
        this.num = num;
        this.Upgrades = 0;
        this.MultFactor = 1.15;
        this.CoinProd = 0;

        this.cost = function () {
            return Math.round(this.baseCost * Math.pow(this.MultFactor, this.num));
        };
        this.cost2 = function (num) {
            if(num == 0){
                var maxNum = this.maxBuyable();
                if(maxNum < 1){
                    return this.cost();
                }
                else{
                    return this.cost2(maxNum);
                }
            }
            else{
                return Math.round(this.baseCost * (Math.pow(this.MultFactor, this.num) * (Math.pow(this.MultFactor, num) - 1)) / (this.MultFactor - 1));
            }
        };
        this.ccps = function () {
            return Math.round(this.cps * this.num * Math.pow(2, this.Upgrades) * Math.floor(Math.pow(1.5, this.CalcAchievementMult())));
        };

        this.maxBuyable = function (){
            var maxNum = Math.floor((Math.log((coins * (this.MultFactor - 1)) / ( this.baseCost * Math.pow(this.MultFactor, this.num)) + 1)) / Math.log(this.MultFactor));
            return maxNum;
        };
        
        this.CalcAchievementLevel = function (){          
            for(var i = unitNumPropActivationValues.length; i >= 0; i--){
                if(this.num >= unitNumPropActivationValues[i]){
                    return i + 1;
                }
            }
            return 0;
        };

        this.CalcAchievementMult = function(){
            var AchievementLevel = this.CalcAchievementLevel();
            if(AchievementLevel == 0){
                return 0;
            }            
            return Math.ceil((Math.pow(Math.log(Math.pow(AchievementLevel,2) + 60 - (this.ID + 1)/3), (6-((2/200)*(this.ID + 1)) + ((2/40 * AchievementLevel)))) + 5) / 1000);
        };

        this.ReputationBonus = function (){
            return Math.pow(this.ID + 1, 2) * this.num * this.Upgrades;
        };
    }
}


function BuyUnit(id){
    if(id < units.length){
        var u = units[id];            
        var c = u.cost2(buyAmount);
        if(buyAmount > 0){
            if(coins - c>= 0){
                coins -= c;
                u.num += buyAmount;
            }
        }
        else{
            if(coins - c >= 0){
                u.num += u.maxBuyable();
                coins -= c;
            }
        }   
    }
    DisplayUnitUIObjects();
    DisplayUpgradeUIObjects();
    Save();
}



function UnitInit(){
    
    for(var i = 1; i <= 30; i++){
        var name = "";
        if(i-1 >= UnitNames.length){
            name = "Unit" + i;
        }
        else{            
            name = UnitNames[i-1];
        }
        var baseCostPart = Math.pow(Math.exp(i + 1), 2) / 5 + 5;
        var costDecimals = Math.round(LogA((baseCostPart), 300)) - 1;
        var baseCost = ERound((baseCostPart), costDecimals);

        var cpsPart = Math.pow(Math.exp(i), 1.25) / 4;
        var cpsDecimals = Math.round(LogA(cpsPart, 300));
        var cps = ERound(cpsPart, cpsDecimals);
        if (i == 1){
            units[i - 1] = new Unit(i, name, baseCost, cps, true, 0);
        }
        else{
            units[i - 1] = new Unit(i, name, baseCost, cps, false, 0);
        }
    }
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
        for(var m = 0; m < units.length; m++){
            unitUPs.push(document.getElementById("UnitUP" + m));
        }
    }
    if(unitProds.length < units.length){
        unitProds = [];
        for(var m = 0; m < units.length; m++){
            unitProds.push(document.getElementById("unitProd" + m));
        }
    }

    if(unitCCPSInfos.length < units.length){
        unitCCPSInfos = [];
        for(var n = 0; n < units.length; n++){
            unitCCPSInfos.push(document.getElementById("UnitCCPSInfo" + n));
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
                unitCPSs[i].innerHTML = "CPS: " + format(u.ccps() * (1 + GetSupplyBonus()));
            }
            else {
                unitCPSs[i].innerHTML = "CPS: " + format(u.cps * (1 + GetSupplyBonus()));
            }
            unitUPs[i].innerHTML = "Level: " + u.Upgrades;
            var m = u.maxBuyable();
            var o =  (buyAmount == 0?(m > 0?" + " + m:""):"");
            unitNums[i].innerHTML = "Owned: " + format(u.num) + o;
            if(u.num > 0 && AllCoinProd > 0){
                unitProds[i].innerHTML = format(u.CoinProd) + " (" + Math.round(u.CoinProd * 100 / AllCoinProd) + "%)";                
            }            
            unitCCPSInfos[i].innerHTML = "Base CPS: " + format(u.cps) + "<span> </span>" + "<span> </span>" + " ACHM: x" + Math.floor(Math.pow(1.5, this.CalcAchievementMult())) + ", UPGR: x" + format(Math.pow(2, u.Upgrades)) + ", SPLY: x" + ((1 + GetSupplyBonus())).toFixed(2);
        }
    }
}



function DisplayUnitUIObjects() {
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
            document.getElementById("unitProdName" + i).innerHTML = u.name;
            unitOverviewTRs[i].style.display = "";
            if(u.CoinProd > 0 && AllCoinProd > 0){
                document.getElementById("unitProd" + i).innerHTML = format(u.CoinProd) + " (" + Math.round(u.CoinProd * 100 / AllCoinProd) + "%)";
            }
            else{
                document.getElementById("unitProd" + i).innerHTML = format(u.CoinProd) + " (" + 0 + "%)";
            }
        }
        else if(i !== 0 && (units[i-1].known || units[i-1].num > 0)){
            document.getElementById("UnitName" + i).innerHTML = "???";
            var a = document.getElementById("U"+i);
            var c = unitCosts[i];
            c.innerHTML = "Cost: " + format(units[i].baseCost);
            c.style.color = "black";
            unitCPSs[i].innerHTML = "CPS: ???";
            unitNums[i].innerHTML = "Owned: 0";
            unitUPs[i].innerHTML = "Upgrades: 0";
            document.getElementById("UD" + i).className = "UnitDivUnknown";
            var f = document.getElementById("U"+i);
            f.className = "UnitA";
            unitOverviewTRs[i].style.display = "none";
        }
        else{
            var f = document.getElementById("U"+i);
            f.className = "DisabledUnitA";
            unitOverviewTRs[i].style.display = "none";
        }
        
    }
}



function createUnitDisplayUIObjects(unitID) {
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
    
     
    var trInfo2 = document.createElement("tr");
        table.appendChild(trInfo2);
        trInfo2.classList.add("UnitHoveredOpener");

    var tdCCPS = document.createElement("td");
        trInfo2.appendChild(tdCCPS);
        tdCCPS.setAttribute("colspan", "2");
        tdCCPS.setAttribute("id", "UnitCCPSInfo" + unitID);
        tdCCPS.innerHTML = unitID;



    //create overview
    if(UnitOverviewTable == null){
        UnitOverviewTable = document.getElementById("UnitOverviewTableBody");
    }
    var tr = document.createElement("tr");
        UnitOverviewTable.appendChild(tr);
        unitOverviewTRs.push(tr);
    var tdName = document.createElement("td");
        tr.appendChild(tdName);
        tdName.setAttribute("id", "unitProdName" + unitID);
        tdName.innerHTML = "???";
    
    var tdProd = document.createElement("td");
        tr.appendChild(tdProd);
        tdProd.setAttribute("id", "unitProd" + unitID);
        tdProd.innerHTML = 0;


}

function UnitStuffGen() {
    for(var i = 0; i < units.length; i++) {
        createUnitDisplayUIObjects(i);
    }
    UnitOuterDiv.appendChild(document.createElement("br"));
    UnitOuterDiv.appendChild(document.createElement("br"));
    DisplayUnitUIObjects();
}
