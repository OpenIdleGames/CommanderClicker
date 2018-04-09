class Upgrade {
    constructor(name, cost, type, unitID, amount, known, desc) {
        this.name = name;
        this.cost = cost;
        this.type = type;
        this.unitID = unitID;
        this.amount = amount;
        this.desc = desc;
        this.known = known;
        this.activated = false;
        this.unit = units[unitID];
        this.element = null;

        this.cost2 = function () {
            switch (this.type) {
                case "Unit":
                    {
                        return Math.pow(this.unit.baseCost, 1.8) * Math.pow(this.amount, this.amount);
                        break;
                    }
                case "Click":
                    {
                        return 80 * Math.exp(this.amount * this.amount / 1.6);
                        break;
                    }
            }
        };
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

function DisplayUpgradeUIObjects() {
    UpgradeArrayTest();
    
    for(var i = 0; i < Upgrades.length; i++) {
        var u = Upgrades[i];
        if(u.element == null){
            u.element = document.getElementById("Upgrade" + i);
        }
        if(u.type == "Unit") {
            if(u.unit.num == 0 || u.activated || u.unit.Upgrades + 1 != u.amount) {
                u.element.className = "DisabledMain2";
            }
            else {
                u.element.className = "Upgrade";
            } 
        } 
        else if(u.type == "Click") {
            if(u.activated || Upgrades[i].amount != clickLevel + 1 ) {
                u.element.className = "DisabledMain2";
            }
            else {
                u.element.className = "Upgrade";
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


function BuyUpgrade(id){
    if(id < Upgrades.length){
        var u = Upgrades[id];
        if(coins - u.cost2() >= 0){
            coins -= u.cost2();
            u.activated = true;
            if(u.type == "Unit"){      
                u.unit.Upgrades = u.amount;
            }
            else if(u.type == "Click") {
                clickLevel = parseInt(u.amount);
            }
        }
    }
    DisplayUpgradeUIObjects();
}


function UpgradeInit() {
    //name, cost, type, unitID, amount, known, desc
    for(var i = 0; i < units.length; i++){
        var u = units[i];
        for(var j = 0; j < 8; j++){
            Upgrades.push(new Upgrade(u.name + " lvl " + (j+1), 1, "Unit", i, j+1, true, "Doubles raiding power for " + u.name + " units."));
        }
    }
    
    for(var k = 0; k < 10; k++) {
        Upgrades.push(new Upgrade("Clicking lvl " + (k+1), 1, "Click", -1, k+1, true, "Doubles click strength."));
    }
}
