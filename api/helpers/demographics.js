
var logger = (require("./logging.js"))();


var group_with_gender = function(genders, demographic) {
  var found = false;
  for(var i = 0; i < genders.length; i++) {
    if (genders[i].label == demographic.Gender) {
      found = true;
      genders[i].impressions += demographic.Impressions;
      break;
    }
  }
  if (!found) {
    genders.push({
      label : demographic.Gender,
      impressions : demographic.Impressions
    });
  }
}

var group_with_race = function(races, demographic) {
  var found = false;
  var label = (demographic.Race == "AfricanAmerican" ? 
                      "African American" :
                      demographic.Race)
  for(var i = 0; i < races.length; i++) {
    if (races[i].label == label) {
      found = true;
      races[i].impressions += demographic.Impressions;
      break;
    }
  }
  if (!found) {
    races.push({
      label : label,
      impressions : demographic.Impressions
    });
  }
}

var group_with_household = function(households, demographic) {
  var found = false;
  var label = "No Children";
  if (demographic.HaveChildren_03to13 ||
      demographic.HaveChildren_00to06 ||
      demographic.HaveChildren_07to11 ||
      demographic.HaveChildren_12to17) {
    label = "Children";
  }
  for(var i = 0; i < households.length; i++) {
    if (households[i].label == label) {
      found = true;
      households[i].impressions += demographic.Impressions;
      break;
    }
  }
  if (!found) {
    households.push({
      label : label,
      impressions : demographic.Impressions
    });
  }
}

var group_with_age = function(ages, demographic) {
  var demo_min = demographic.AgeMin;
  var demo_max = demographic.AgeMax;
  
  var found = false;
  for(var i = 0; i < ages.length; i++) {
    if (ages[i].range[0] == demo_min &&
        ages[i].range[1] == demo_max) {
      found = true;
      ages[i].impressions += demographic.Impressions;
      break;
    }
  }
  if (!found) {
    ages.push({
      range : [demo_min, demo_max],
      impressions : demographic.Impressions
    });
  }
}

var group_with_income = function(incomes, demographic) {
  var demo_min = demographic.IncomeMin;
  var demo_max = demographic.IncomeMax;
  
  var found = false;
  for(var ii = 0; ii < incomes.length; ii++) {
    if (incomes[ii].range[0] == demo_min &&
        incomes[ii].range[1] == demo_max) {
      found = true;
      incomes[ii].impressions += demographic.Impressions;
      break;
    }
  }
  if (!found) {
    incomes.push({
      range : [demo_min, demo_max],
      impressions : demographic.Impressions
    });
  }
}


module.exports.group = function(demographics, source) {
  
  var grouping = {
    gender    : [],
    ethnicity : [],
    income    : [],
    age       : [],
    household : []
  };
  
  switch(source.toLowerCase()) {
    case "mpg":
      module.exports.group_mpg(grouping, demographics);
      break;
      
    case "nielsen":
      module.exports.group_nls(grouping, demographics);
      break;
      
    default:
      logger.warn("unknown demographic source: "+source);
      return false;
  }

  module.exports.calculate_demographic_percent(grouping.gender);
  module.exports.calculate_demographic_percent(grouping.ethnicity);
  module.exports.calculate_demographic_percent(grouping.income);
  module.exports.calculate_demographic_percent(grouping.age);
  module.exports.calculate_demographic_percent(grouping.household);

  return grouping;
}

module.exports.group_mpg = function(result, demographics) {

  for(var i = 0; i < demographics.length; i++) {
    var demographic = demographics[i];
    if (demographic.IncomeMin != null || demographic.IncomeMax != null) {
      group_with_income(result.income, demographic);
    }
    else if (demographic.Race != null) {
      group_with_race(result.ethnicity, demographic);
    }
    else if (demographic.Gender != null) {
      group_with_gender(result.gender, demographic);
    }
    else if (demographic.AgeMin != null || demographic.AgeMax != null) {
      group_with_age(result.age, demographic);
    }
    else if (demographic.HaveChildren_03to13 != null) {
      group_with_household(result.household, demographic);
    }
    else {
      logger.warn("unable to parse demographics object: ");
      logger.warn(demographic);
    }
  }
}

module.exports.group_nls = function(result, demographics) {

  for(var i = 0; i < demographics.length; i++) {
    var demographic = demographics[i];
    
    if (demographic.IsMarketBreakAgnostic) {
      var fake_age = {
        dont : false,
        Impressions : demographic.Impressions
      }
      if (demographic.AgeMin == 12 || demographic.AgeMin == 15) {
        fake_age.AgeMin = 13;
        fake_age.AgeMax = 17;
      }
      else if (demographic.AgeMin == 18 || demographic.AgeMin == 24) {
        fake_age.AgeMin = 18;
        fake_age.AgeMax = 24;
      }
      else if (demographic.AgeMin == 25 || demographic.AgeMin == 34) {
        fake_age.AgeMin = 25;
        fake_age.AgeMax = 34;
      }
      else if (demographic.AgeMin == 35 || demographic.AgeMin == 44) {
        fake_age.AgeMin = 35;
        fake_age.AgeMax = 44;
      }
      else if (demographic.AgeMin == 45 || demographic.AgeMin == 54) {
        fake_age.AgeMin = 45;
        fake_age.AgeMax = 54;
      }
      else if (demographic.AgeMin == 55 || demographic.AgeMin == 64) {
        fake_age.AgeMin = 55
        fake_age.AgeMax = 64;
      }
      else if (demographic.AgeMin == 65) {
        fake_age.AgeMin = 65;
        fake_age.AgeMax = null;
      }
      else {
        logger.warn("unable to parse demographics object as age: ");
        logger.warn(demographic);
        fake_age.dont = true;
      }
      if (!fake_age.dont) {
        group_with_age(result.age, fake_age);
      }
      group_with_gender(result.gender, demographic);
    }
    else if (demographic.IncomeMin != null || demographic.IncomeMax != null) {
      
      var fake_income = {
        dont : false,
        Impressions : demographic.Impressions
      }
      if (demographic.IncomeMin == 0 ||
          demographic.IncomeMin == 20000) {
        fake_income.IncomeMin = 0;
        fake_income.IncomeMax = 30000;
      }
      else if (demographic.IncomeMin == 30000 ||
               demographic.IncomeMin == 40000 ||
               demographic.IncomeMin == 50000) {
        fake_income.IncomeMin = 30001;
        fake_income.IncomeMax = 60000;
      }
      else if (demographic.IncomeMin == 60000 || 
               demographic.IncomeMin == 75000) {
        fake_income.IncomeMin = 60001;
        fake_income.IncomeMax = 100000;
      }
      else if (demographic.IncomeMin == 100000 || 
               demographic.IncomeMin == 125000) {
        fake_income.IncomeMin = 100001;
        fake_income.IncomeMax = null;
      }
      else {
        logger.warn("unable to parse demographics object as age: ");
        logger.warn(demographic);
        fake_income.dont = true;
      }
      if (!fake_income.dont) {
        group_with_income(result.income, fake_income);
      }
    }
    else if (demographic.Race) {
      group_with_race(result.ethnicity, demographic);
    }
    else if (demographic.HaveChildren_03to13 != null ||
             demographic.HaveChildren_00to06 != null ||
             demographic.HaveChildren_07to11 != null ||
             demographic.HaveChildren_12to17 != null) {
      group_with_household(result.household, demographic);
    }
    else {
      logger.warn("unable to parse demographics object: ");
      logger.warn(demographic);
    }
  }
  
  if(result.household.length > 0){
	  var householdWKids = 0;
	  for(var i=0; i<result.household.length; i++)
		householdWKids += result.household[i].impressions;
		
	  var total = 0;
	  for(var i=0; i<result.gender.length; i++)
		total += result.gender[i].impressions;
	  
	  result.household.push({
		label : "No Children",
		impressions : total - householdWKids
	  });
  }
}

module.exports.collide = function(demographics) {
  
  if (demographics.length == 0) {
    return false;
  }
  
  var result = {
    gender    : [],
    ethnicity : [],
    income    : [],
    age       : [],
    household : []
  }
  
  for(var demo_it in demographics) {
    var demographic = demographics[demo_it];
    
    // add all of the gender impressions to total_demographics
    for(var gi = 0; gi < demographic.gender.length; gi++) {
      var gender = demographic.gender[gi];
      var gender_found = false;
      for(var gis in result.gender) {
        var g_check = result.gender[gis];
        if (g_check.label == gender.label) {
          g_check.impressions += gender.impressions;
          gender_found = true;
        }
      }
      if (!gender_found) {
        result.gender.push({
          label : gender.label,
          impressions : gender.impressions
        });
      }
    }
    
    // add all of the ethnicity impressions to total_demographics
    for(var ei = 0; ei < demographic.ethnicity.length; ei++) {
      var ethnicity = demographic.ethnicity[ei];
      var ethnicity_found = false;
      for(var eis in result.ethnicity) {
        var e_check = result.ethnicity[eis];
        if (e_check.label == ethnicity.label) {
          e_check.impressions += ethnicity.impressions;
          ethnicity_found = true;
        }
      }
      if (!ethnicity_found) {
        result.ethnicity.push({
          label : ethnicity.label,
          impressions : ethnicity.impressions
        });
      }
    }
    
    // now income impressions
    for(var ii = 0; ii < demographic.income.length; ii++) {
      var income = demographic.income[ii];
      var income_found = false;
      for(var iis in result.income) {
        var i_check = result.income[iis];
        if (i_check.range[0] == income.range[0] &&
            i_check.range[1] == income.range[1]) {
          i_check.impressions += income.impressions;
          income_found = true;
        }
      }
      if (!income_found) {
        result.income.push({
          range : [
            income.range[0],
            income.range[1]
          ],
          impressions : income.impressions
        });
      }
    }
    
    // now age impressions
    for(var ai = 0; ai < demographic.age.length; ai++) {
      var age = demographic.age[ai];
      var age_found = false;
      for(var ais in result.age) {
        var a_check = result.age[ais];
        if (a_check.range[0] == age.range[0] &&
            a_check.range[1] == age.range[1]) {
          a_check.impressions += age.impressions;
          age_found = true;
        }
      }
      if (!age_found) {
        result.age.push({
          range : [
            age.range[0],
            age.range[1]
          ],
          impressions : age.impressions
        });
      }
    }
    
    // now household impressions
    for(var hi = 0; hi < demographic.household.length; hi++) {
      var household = demographic.household[hi];
      var household_found = false;
      for(var his in result.household) {
        var h_check = result.household[his];
        if (h_check.label == household.label) {
          h_check.impressions += household.impressions;
          household_found = true;
        }
      }
      if (!household_found) {
        result.household.push({
          label : household.label,
          impressions : household.impressions
        });
      }
    }
  }

  module.exports.calculate_demographic_percent(result.gender);
  module.exports.calculate_demographic_percent(result.ethnicity);
  module.exports.calculate_demographic_percent(result.income);
  module.exports.calculate_demographic_percent(result.age);
  module.exports.calculate_demographic_percent(result.household);
  
  return result;
}

module.exports.calculate_demographic_percent = function(impressions) {
  var total_impressions = 0;
  for(var i = 0; i < impressions.length; i++) {
    total_impressions += impressions[i].impressions;
  }

  for(var i = 0; i < impressions.length; i++) {
    impressions[i].percent = (impressions[i].impressions / total_impressions);
    impressions[i].percent = Math.round(impressions[i].percent * 100);
  }
}
