function Commander(){
	this.Name;
	this.Level;
	this.Reputation;
	this.BaseUpCost = 100;
	this.MultFactor = 1.2;

	this.cost = function(){
		return Math.round(this.BaseUpCost * Math.pow(this.MultFactor, this.Level));
	};

	this.updateTab = function(){
	
	};
}