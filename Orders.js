var orderAs = null;

var OrdersButton = null;
var Highlighted = false;

var orderPrefabs = [];
var currentOrders = [];

var OrderActive = false;
var choosenOrderID = -1;
var timeToFinish = 0;

var times = [10, 15, 20, 25, 30];
//var times = [0.1, 0.1, 0.1, 0.1];

class Order{
    constructor(name, desc, bonusType){
        this.Name = name;
        this.Desc = desc;
        this.BonusType = bonusType;
        this.Time;
        this.BonusAmount = 0;
        

        this.ToSaveString = function(){
            return this.Name + "," + this.Desc + "," + this.BonusType + "," + this.Time + "," +  this.BonusAmount;
        };
    }
}

function SaveOrders(){
    if(OrderActive){
        localStorage.setItem("OrderActive", true);
        localStorage.setItem("ChoosenOrderID", choosenOrderID);
        for(var i = 0; i < 3;i++){
            localStorage.setItem("CurrentOrder" + i, currentOrders[i].ToSaveString());
        }
        var remainingTime = Math.round(timeToFinish-Date.now());
        localStorage.setItem("RemainingTime", remainingTime);
    }
}

function ResetOrders(){
    localStorage.setItem("OrderActive", false);
}

function LoadOrders(){
    if(localStorage.getItem("OrderActive") !== null ){
        
        OrderActive = localStorage.getItem("OrderActive")=="true"?true:false;
        if(OrderActive){
            choosenOrderID = parseInt(localStorage.getItem("ChoosenOrderID"));
            for(var i = 0; i < 3;i++){
                var save = localStorage.getItem("CurrentOrder" + i).split(",");
                currentOrders[i].Name = save[0];
                currentOrders[i].Desc = save[1];
                currentOrders[i].BonusType = save[2];
                currentOrders[i].Time = parseInt(save[3]);
                currentOrders[i].BonusAmount = parseInt(save[4]);
                console.log(currentOrders[i].BonusAmount);
            }
            timeToFinish = parseInt(localStorage.getItem("RemainingTime")) + Date.now();
            DisplayCurrentOrders();
            DeactivateOrderAs(choosenOrderID);
        }
        else{
            GenerateCurrentOrders();
            DisplayCurrentOrders();
        }
    }
}

function ChoseOrder(num){
    if(!OrderActive){
        timeToFinish = Date.now() + currentOrders[num].Time * 60000;
        OrderActive = true;
        choosenOrderID = num;
        DeactivateOrderAs(num);
        HighlightDisabler();
    }
}

function UpdateChoosenOrder(){
    if(OrderActive){
        var remainingTime = Math.round(timeToFinish-Date.now());
        if(remainingTime >= 0){
            document.getElementById("OrderTime" + (choosenOrderID)).innerHTML = millisToMinutesAndSeconds(remainingTime) + " Minutes left";
        }
        else{
            // Order finished
            ResetOrders();
            if(OrderActive && currentOrders[choosenOrderID%3].BonusType == "supply"){
                supplyBoxes += SupplyReward();
                console.log("supply");
            }
            //UnitReward();
            OrderActive = false;
            GenerateCurrentOrders();
            DisplayCurrentOrders();
        }
    }
}

function SupplyReward(){
    var calculated = Math.round(Math.pow(supplyBoxes, 1/5));
    return Math.max(1, calculated);
}

function UnitReward(){
    if(OrderActive && currentOrders[choosenOrderID%3].BonusType == "unit"){
        var lastUnitID = 0;
        for(var i = units.length; i > 0;i--){
            if(units[i - 1].num > 0 && units[i].num <= 0){
                lastUnitID = i - 1;
                break;
            }
        }

    }
    else{
        return 0;
    }
}

function OrderUnitMult(){
    if(OrderActive && currentOrders[choosenOrderID%3].BonusType == "coin"){
        return 1 + currentOrders[choosenOrderID%3].BonusAmount;
    }
    else{
        return 1;
    }
}

function GenerateCurrentOrders(){
    var generatedOrders = getRandomFromArray(orderPrefabs, 3);
    times = shuffle(times);
    for(var i = 0; i < generatedOrders.length;i++){
        generatedOrders[i].Time = times[i]
        generatedOrders[i].BonusAmount = (40 - times[i]) / 80;
    }
    currentOrders = generatedOrders;
}

function DisplayCurrentOrders(){
    for(var i = 0; i < currentOrders.length;i++){
        if(choosenOrderID != i){
            document.getElementById("OrderA" + i).classList.add("OrderA");
            document.getElementById("OrderA" + i).classList.remove("DisabledOrderA");
        }
        document.getElementById("OrderName" + i).innerHTML = currentOrders[i].Name;
        document.getElementById("OrderDesc" + i).innerHTML = currentOrders[i].Desc;
        document.getElementById("OrderTime" + i).innerHTML = currentOrders[i].Time + " Minutes";
        document.getElementById("OrderBonus" + i).innerHTML = GetBonusAmountText(currentOrders[i].BonusType, currentOrders[i].BonusAmount);
    }
    ToggleHighlightOrdersButton();
}

function GetBonusAmountText(type, amount){
    switch(type){
        case "coin":
        {
            return (amount * 100) + "% more coin production for units.";
        }
        case "supply":
        {
            return "Get " + SupplyReward() + " of supply boxes at the end.";
        }

        case "unit":
            return "Get random unit(s) you already know.";
    }
}

function DeactivateOrderAs(except){
    if(orderAs == null){
        orderAs = [];
        orderAs.push(document.getElementById("OrderA1"));
        orderAs.push(document.getElementById("OrderA2"));
        orderAs.push(document.getElementById("OrderA3"));
    }

    for(var i = 0; i < orderAs.length;i++){
        if(i != except){
            document.getElementById("OrderA" + i).classList.remove("OrderA");
            document.getElementById("OrderA" + i).classList.add("DisabledOrderA");        
        }
    }
}


function OrdersInit(){
    var coinNames = ["Attack village", "Raid town", "Colonise", "Delivery"];
    var coinDescs = ["Attack a village for more coins.", "Raid a town for more coins.", "Colonise a new land and take the riches.", "Deliver something precious."];
    for(var i = 0; i < coinNames.length; i++){
        var o = new Order(coinNames[i], coinDescs[i], "coin");
        orderPrefabs.push(o);
    }

    var supplyNames = ["Forage" ];
    var supplyDescs = ["Forage for additional supply."];
    for(var i = 0; i < supplyNames.length; i++){
        var o = new Order(supplyNames[i], supplyDescs[i], "supply");
        orderPrefabs.push(o);
    }
    //var unitNames = ["Clear lair"];
    //var unitDescs = ["Clair out the lair of monsters and save the jailed units."];
    //for(var i = 0; i < unitNames.length; i++){
    //    var o = new Order(unitNames[i], unitDescs[i], "unit");
    //    orderPrefabs.push(o);
    //}
}

function ToggleHighlightOrdersButton(){
    if(MainWindowTitle != "Orders"){
        if(OrdersButton === null){
            OrdersButton = document.getElementById("OrderButton");
        }
        Highlighted = !Highlighted;
        if(Highlighted){
            OrdersButton.classList.add("ButtonBlink");
        }
        else{
            OrdersButton.classList.remove("ButtonBlink");
        }
    }
}

function HighlightDisabler(){
    if(Highlighted){
        ToggleHighlightOrdersButton();
    }
}