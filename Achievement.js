  
var unitNumPropActivationValues = [10, 25, 50, 100, 250, 500, 1000];  

class Property
{
    constructor(name, initialValue, activation, activationValue ) {
        this.Value;
        this.Name = name;
        this.Activation = activation;
        this.ActivationValue = activationValue;
        this.InitialValue = initialValue;

        this.isActive = function(){
            var aRet = false;
         
            switch(this.Activation) {
              case Achieve.GREATER_THAN: aRet = this.Value > this.ActivationValue; break;
              case Achieve.LESS_THAN: aRet = this.Value < this.ActivationValue; break;
              case Achieve.EQUALS_TO: aRet = this.Value == this.ActivationValue; break;
            }
         
            return aRet;
          }
    }
}

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

        this.GREATER_THAN = ">";
        this.LESS_THAN = "<";
        this.EQUALS_TO = "==";

        this.getValue =  function(PropertyName) {
            return this.Props[PropertyName].Value;
        };
           
        this.setValue = function(PropertyName, Value){
            switch(this.Props[PropertyName].activation) {
                case AchievementController.GREATER_THAN:
                    Value = Value > this.Props[PropertyName].Value ? Value : this.Props[PropertyName].Value;
                    break;
                case AchievementController.LESS_THAN:
                    Value = Value < this.Props[PropertyName].Value ? Value : this.Props[PropertyName].Value;
                    break;                
             }
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
        }
    };
}

function AchievementInit(){
    
}


