  
var unitNumPropActivationValues = [25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];  


class Achievement{
    constructor(name, requiredProperties){
        this.Name = name;
        this.Props = requiredProperties;
        this.Unlocked = false;
    }
}

class AchievementController
{
    constructor(){
        this.Props = {};
        this.Achievements = {};

        this.getValue =  function(PropertyName) {
            return this.Props[PropertyName].Value;
        };
           
        this.setValue = function(PropertyName, Value){            
            this.Props[PropertyName].Value = Value;
        };

        this.checkAchievements = function(){
            var aRet = [];           
            for (var n in this.Achievements) {
              var aAchivement = this.Achievements[n];
           
              if (aAchivement.Unlocked == false) {
                var aActiveProps = 0;
           
                for (var p = 0; p < aAchivement.Props.length; p++) {
                  var aProp = this.Props[aAchivement.Props[p]];
                  if (aProp.isActive()) {
                    aActiveProps++;
                  }
                }           
                if (aActiveProps == aAchivement.Props.length) {
                  aAchivement.Unlocked = true;
                  aRet.push(aAchivement);
                }
              }
            }
            return aRet;
        };
    }
}


function AchievementInit(){
    
}


