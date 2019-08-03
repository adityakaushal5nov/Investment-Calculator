import {Component} from 'react';
/*
class Simulate extends Component{
  
    //Actual Simulation Method
      sample = ( goalinitialAmount, goaltargetAmount,  goalMonthlySaving,  goalTargetDate, riskProfile, volatility ) => {
		                             
        var conf = []; //ArrayList<>;
        var standardDeviationValueMap = [];   
        var confidence68Prcnt;
        var confidence95Prcnt;                     
        try{    
            var iterations = 1000;
            var simulationMonths = 0;
            var simulationYear = 0;    
            var annualSaving = this.goalMonthlySaving*12;
            var initialAmount = this.goalinitialAmount;            
            //var targetAmount = this.goaltargetAmount; 
            //var goalMonthlySaving = this.goalMonthlySaving;
            var goalriskProfile = this.riskProfile;     
            var SD = this.volatility;     //inflation
            var targetDate = this.goalTargetDate;
            var simulatedVals = [];
            var avg = 5.0;    //risk profile

            var tdate = targetDate; 
            var today = new Date();
            var diffTime = Math.abs(tdate.getTime() - today.getTime());
            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            var months = diffDays/30;

            if(months < 12) {
                simulationMonths = months;
            } else {
                simulationYear = months/12;
            }        
            
            for(var j=0; j < iterations; j++) {         
                 var finalAmount = 0.0;
                 var calInitialAmount = initialAmount;
                
                if(simulationMonths != 0 && simulationMonths > 0) {             
                    for(var i = 0; i<simulationMonths; i++) {   
                        finalAmount = calInitialAmount + goalMonthlySaving;      
                        calInitialAmount = finalAmount;      
                    }
                }
                
                else{                
                    for(var i = 0; i < simulationYear; i++){
                        var normal = this.normInv(avg, SD);
                        finalAmount = calInitialAmount+((calInitialAmount*normal)/100) + annualSaving;
                        calInitialAmount = finalAmount;
                    }
                    if((months% 12) > 0) {
                        for(var i=0; i < (months% 12); i++){
                            finalAmount = calInitialAmount + goalMonthlySaving;
                            calInitialAmount = finalAmount;
                        }                        
                    }
                }
                
                simulatedVals.push(finalAmount);
            } //end for

            var standardDeviation = Math.round(standardDeviation(simulatedVals));
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
            conf.add(confidence68Prcnt);
            conf.add(confidence95Prcnt);

        } catch(e){
            console.log('Erroe' + e);
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
            while (rds == 0 || rds > 1);
            // Box-Muller Transform
            var multiplier = Math.sqrt(-2*Math.log(rds)/rds);
            this.nextNextGaussian = y*multiplier;
            this.haveNextNextGaussian = true;
            return x*multiplier;
        }       
    }

    //get mean
    getMean = (simulatedVals) =>   {
        var sum = 0.0;
        for(var i =0; i<=simulatedVals.length; i++)
        {
            sum += simulatedVals[i];
        }

        var mean = sum / simulatedVals.size();
        return Math.round(mean);
    }

    //get standard deviation
    standardDeviation = (simulatedVals) => {
          var sum = 0.0;
          for(var i =0; i<=simulatedVals.length; i++)
          {
              sum += simulatedVals[i];
          }
        
          var mean = sum / simulatedVals.size();
          //var MeanValue = Math.round(mean);

          //for each number subtract the mean and square the result
          var squaredDifferencesSum = 0.0;
          for(var i =0; i<=simulatedVals.length; i++)
          {
              squaredDifferencesSum += Math.pow((simulatedVals[i]-mean), 2);
          }
        
          //determine the mean for the squared differences
          var squaredDifferencesMean = squaredDifferencesSum / simulatedVals.size();
        
          //determine the standard deviation
          var standardDeviation = Math.sqrt(squaredDifferencesMean);
        
          return standardDeviation;
    }
    
     evaluatePercentile = (sorted, p) => {
        var n = sorted.size();
        var pos = (p * (n + 1) / 100);
        var fpos = Math.floor(pos);

        var intPos = Math.round(fpos);
        var dif = pos - fpos;
        if (pos < 1) {
            return sorted.get(0);
        }
        if (pos >= n) {
            return sorted.get(sorted.size() - 1);
        }
        var lower = sorted.get(intPos - 1);
        var upper = sorted.get(intPos);
        return lower + dif * (upper - lower);
        
    }  
}

export default Simulate;
*/