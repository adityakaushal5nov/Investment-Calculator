import React, { Component } from 'react';
import './form.css';

class Simulation extends Component{
   state = {
        name: null,
        initAmount : null,
       // targetAmount: null, 
        monSaving: null,
        targetDate: null,
        riskProfile: null,
        volatility: null,
        showGraph: false,
    }

     
    handleChange = (e) => {
        this.setState({
            [e.target.id] : e.target.value
        });
    }

    handleSimulate = (e) => {
        e.preventDefault();
        console.log('State' + JSON.stringify(this.state));
        var t = this.sample(this.state.initAmount, this.state.monSaving,
                            this.state.targetDate, this.state.riskProfile,this.state.volatility);
        console.log(JSON.stringify(t));
        alert('We have estimated the mean value of your investment to '+ t[6] + ' by '+ this.state.targetDate + 
        '. Also there is 95% chance it will mature to an amount betweeen ' + t[2] + ' and ' + t[3] + 
        '. Further we can say that there is less 1% chance that the amount will be greater than ' + t[0] + 
        ' or less than ' + t[5] + '.');
    }

    //simulation function which samples data
    sample = (goalinitialAmount, goalMonthlySaving, goalTargetDate, riskProfile, volatility) => {
                 
        console.log(goalinitialAmount + ' ' + goalMonthlySaving + ' ' + riskProfile);
        var conf = []; //ArrayList<>;
        var standardDeviationValueMap = [];   
        var confidence68Prcnt;
        var confidence95Prcnt;                     
        try{    
            var iterations = 100000;
            var simulationMonths = 0;
            var simulationYear = 0;    
            var annualSaving = Number(goalMonthlySaving*12);
            var SD = Number(volatility);     //inflation
            var simulatedVals = [];
            var avg = Number(riskProfile);   //risk profile
            var targetDate = new Date(goalTargetDate);
            var today = new Date();
            var diffTime = Math.abs(targetDate.getTime() - today.getTime());
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            var months = diffDays/30;
            if(months < 12) {
                simulationMonths = months;
            } else {
                simulationYear = months/12;
            }  


            for(var j=0; j < iterations; j++) {         
                 var  finalAmount = Number(0);
                 var calInitialAmount = Number(goalinitialAmount);
                
                if(simulationMonths !== 0 && simulationMonths > 0) {             
                    for(var i = 0; i < simulationMonths; i++) {   
                        finalAmount = calInitialAmount + goalMonthlySaving;      
                        calInitialAmount = finalAmount;      
                    }
                }
                
                else{                
                    for( i = 0; i < simulationYear; i++){
                        var normal = this.normInv(avg, SD);
                        finalAmount = calInitialAmount+((calInitialAmount*normal)/100) + annualSaving;
                        calInitialAmount = finalAmount;
                    }
                    if((months% 12) > 0) {
                        for( i=0; i < (months% 12); i++){
                            finalAmount = calInitialAmount + goalMonthlySaving;
                            calInitialAmount = finalAmount;
                        }                        
                    }
                }
                
                simulatedVals.push(finalAmount);
            } //end for

            //var standardDeviation = Math.round(standardDeviation(simulatedVals));
            var mean = this.getMean(simulatedVals); 
            simulatedVals.sort();
            standardDeviationValueMap = [];
            standardDeviationValueMap.push(Math.round(this.evaluatePercentile(simulatedVals, 99)));
            standardDeviationValueMap.push(Math.round(this.evaluatePercentile(simulatedVals, 95)));
            standardDeviationValueMap.push(Math.round(this.evaluatePercentile(simulatedVals, 68)));
            standardDeviationValueMap.push(Math.round(this.evaluatePercentile(simulatedVals, 32)));
            standardDeviationValueMap.push(Math.round(this.evaluatePercentile(simulatedVals, 5)));
            standardDeviationValueMap.push(Math.round(this.evaluatePercentile(simulatedVals, 1)));
            standardDeviationValueMap.push(mean);
            confidence68Prcnt = Math.round(this.evaluatePercentile(simulatedVals, 32));
            confidence95Prcnt = Math.round(this.evaluatePercentile(simulatedVals, 5));        
            conf.push(confidence68Prcnt);
            conf.push(confidence95Prcnt);

        } catch(e){
            console.log('Error' + e);
        }
                                 
         return standardDeviationValueMap;
   }
   
  
    normInv = (avg, SD) =>{      
   	   var nG = this.nextGaussian();  
       return  (avg + SD * nG);
   }    
   
    static nextNextGaussian;
    static haveNextNextGaussian = false;
    
    //This Method Creates the Random Variable
      nextGaussian = () => {
        if(this.haveNextNextGaussian) {
         this.haveNextNextGaussian = false;
         return this.nextNextGaussian;
       } else {    
            var x = 0, y = 0, rds;
            do {
            x = Math.random()*2-1;
            y = Math.random()*2-1;
            rds = x*x + y*y;
            }
            while (rds === 0 || rds > 1);
            // Box-Muller Transform
            var multiplier = Math.sqrt(-2*Math.log(rds)/rds);
            this.nextNextGaussian = y*multiplier;
            this.haveNextNextGaussian = true;
            return x*multiplier;
        }       
    }
  
     evaluatePercentile = (sorted, p) => {
        var n = Number(sorted.length);
        var pos = Number(p * (n + 1) / 100);
        var fpos = Math.floor(pos);
        var intPos = Math.round(fpos);
        var dif = Number(pos - fpos);
        if (pos < 1) {
            return sorted[0];
        }
        if (pos >= n) {
            return sorted[n - 1];
        }
        var lower = Number(sorted[intPos - 1]);
        var upper = Number(sorted[intPos]);
        return Number(lower + dif * (upper - lower));
        
    }  

     //get mean
     getMean = (simulatedVals) =>   {
        var sum = Number(0);
        for(var i = 0; i < Number(simulatedVals.length); i++)
        {
            sum = sum + Number(simulatedVals[i]);
        }
        console.log(sum);
        var mean = sum / simulatedVals.length;
        return Math.round(mean);
    }

    //get standard deviation
    standardDeviation = (simulatedVals) => {
          var sum = 0.0;
          for(var i =0; i<=simulatedVals.length; i++)
          {
              sum += simulatedVals[i];
          }
        
          var mean = sum / simulatedVals.length;
          console.log('Mean2: ' + mean);
          //var MeanValue = Math.round(mean);

          //for each number subtract the mean and square the result
          var squaredDifferencesSum = 0.0;
          for(i =0; i<=simulatedVals.length; i++)
          {
              squaredDifferencesSum += Math.pow((simulatedVals[i]-mean), 2);
          }
        
          //determine the mean for the squared differences
          var squaredDifferencesMean = squaredDifferencesSum / simulatedVals.length;
        
          //determine the standard deviation
          var standardDeviation = Math.sqrt(squaredDifferencesMean);
        
          return standardDeviation;
    }

    render(){
        return(
            <div class="simulation">
            <h4>Understand your investments</h4>
                <form onSubmit = {this.handleSimulate}>

                <div class="row">
                <div class="col-25">
                <label htmlFor="name">Investment Name: </label>
                </div>
                <div class="col-75">
                <input type="text" id="name" placeholder="Name of Investment" onChange = {this.handleChange}/>
                </div>
                </div>

                 <div class="row">
                <div class="col-25">
                <label htmlFor="initAmount">Current Amount: </label>
                </div>
                <div class="col-75">
                <input type="number" id="initAmount" placeholder="Current investment amount" onChange = {this.handleChange}/>
                </div>
                </div>    

                {/*< label htmlFor="targetAmount">Goal Target Amount</label -->
                <input type="number" id="targetAmount" onChange = {this.handleChange}/><br/>*/}
                
                <div class="row">
                <div class="col-25">
                <label htmlFor="monSaving">Monthly Investment Amount: </label>
                </div>
                <div class="col-75">
                <input type="number" id="monSaving" onChange = {this.handleChange} placeholder="Montly contributions"/>
                </div>
                </div>   


                <div class="row">
                <div class="col-25">
                <label htmlFor="targetDate">Target Date: </label>
                </div>
                <div class="col-75">
                <input type="date" id="targetDate" onChange = {this.handleChange}/>
                </div>
                </div>  

                <div class="row">
                <div class="col-25">
                <label htmlFor="riskProfile">Risk Profile: </label>
                </div>
                <div class="col-75">
                <select name="Risk Profile" id="riskProfile" onChange = {this.handleChange} >
                <option value="3">Short Term</option>
                <option value="4">Conservative</option>
                <option value="5">Balanced</option>
                <option value="7">Growth</option>
                <option value="9">Agressive</option>
                <option value="11">Very Aggresive</option>
                </select>
                </div>
                </div>
                
                <div class="row">
                <div class="col-25">
                <label htmlFor="volatility">Market Volatility: </label>
                </div>
                <div class="col-75">
                <input type="number" id="volatility" placeholder="Degree of price variation(%)" onChange = {this.handleChange}/>
                </div>
                </div> 
                
                {/*<div class="slidecontainer">
                <input type="range" min="0" max="10" value="1" class="slider" id="myRange" onChange={this.sliderAction}/>
                <p>Value: <span id="demo"></span></p>
            </div>*/}

                <div class="row">
                <input type="submit" value="Simulate"/>
                </div>

                </form>
            </div>
        )//end return

        
}//end render
}

export default Simulation;