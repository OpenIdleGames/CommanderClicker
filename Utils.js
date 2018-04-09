function Clamp(value, min, max){
    if(value > max){
        value = max;
    }
    else if(value < min){
        value = min;
    }
    return value;
}


function LogA(num, a){
    return Math.log(num) / Math.log(a);
}



function formatMinsLong(mins){
    var days = Math.floor(mins/24/60);
    var hours = Math.floor(mins/60%24);
    var mins = Math.round(mins%60);

    if(days >= 1){
        if(hours >= 1 && mins >= 1){
            return Math.round(days) + " day(s), " + Math.round(hours) + " hour(s) and " + Math.round(mins) + " min(s).";
        }
        else if(hours >= 1){
            return Math.round(days) + " day(s) and " + Math.round(hours) + " hour(s).";
        }
        else if(mins >= 1){
            return Math.round(days) + " day(s) and " + Math.round(mins) + " min(s).";
        }
        else{
            return Math.round(days) + " day(s).";
        }
    }
    else if(hours >= 1){
        if(mins >= 1){
            return Math.round(hours) + " hour(s) and " + Math.round(mins) + " min(s).";
        }
        else{
            return Math.round(hours) + " hour(s).";
        }
    }
    else{
        return Math.round(mins) + " min(s).";
    }
}

function formatMinsShort(mins){
    return pad(Math.floor(mins/24/60), 4) + ":" + pad(Math.floor(mins/60%24), 2) + ':' + pad(Math.round(mins%60), 2);
}

function pad(num, size){ return ('000000000' + num).substr(-size); }

function StorageErrorSolverAndGetter(name, defaultValue){
    if(localStorage.getItem(name) === null){
        localStorage.setItem(name, defaultValue);
    }
    if(isNaN(localStorage.getItem(name))){
        localStorage.setItem(name, defaultValue);
    }
    return localStorage.getItem(name);
}


function ERound(value, digits = 0){
    var factor = Math.pow(10, digits);
    return Math.round(value / factor) * factor;
}

function format(value) {
    var text = "";    
    if(isNaN(value) || value == null){
        return "error - reset pls";
    }
    if(value < 1000000){
        text = addCommas(value);
    }
    else if(value <= 10e+71){        
        text = nFormatter(value, 3);
    }
    else{
        text = normalFormat(value, 3);
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
  ];
  for (i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits) + " " + si[i].symbol;
    }
  }
  return num.toFixed(digits);
}

function WriteWelcomeMessage(){
    console.log("You can play with the variables and check out my code on github.\nThanks for playing the game!\nDISCLAIMER: You might ruin your gaming experience by meddling with variables.")
}