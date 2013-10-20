// Copyright 2013 Matt Jadud & Namukaba Hichilo[hichilon@berea.edu] All Rights Reserved

(function(window,undefined){
	
  /**
  * To avoid cluttering the global space with variables only expose helper and h variables outside the library
  * These server as entry points into the iibrary
  *
  * @property helper || h
  * @type {object}
  */
  var helper = helper || new Helper();
  window.h = window.helper = helper;
  
  /**
  * Represents the days of the week
  *
  * @property days
  * @type {array}
  */
  var days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"],
  
  /**
  * Represents the icons that the website is going to use
  *
  * @property icons
  * @type {object}
  */
  icons = { 
	"reading"     : awesome("book"),
	"pdf"         : "<img src='{{site.base}}/images/pdf.png'/>",
	"doc"         : "<img src='{{site.base}}/images/doc.png'/>",
	"code"        : awesome("linux"),
	"planning"    : awesome("cogs"),
	"warning"     : awesome("warning-sign"),
	"www"         : awesome("globe"),
	"calendar"    : awesome("calendar"),
	"video"       : awesome("facetime-video"),
	"think"       : awesome("cogs"),
	"idea"        : awesome("lightbulb"),
	"arrow-up"    : awesome("circle-arrow-up"),
	"group"       : awesome("group"),
	"reading"        : awesome("book"),
	"local"       : "<img src='{{site.base}}/images/bclogo24.png'/>",
	"berea24"       : "<img src='{{site.base}}/images/bclogo24.png'/>",
	"berea16"     : "<img src='{{site.base}}/images/bclogo16.png'/>",
	"default"     : ""
  };
  
  /**
  *  Add the indexOf method to the Array object in browsers that don't have it implemented
  *
  * @method indexOf 
  * @param elem {} element to be searched against the array
  * @return {int} If elem is in the array,the function returns its index in the array,else it returns -1
  */
  if (typeof Array.prototype.indexOf !== 'function') {
    Array.prototype.indexOf = function (elem) {
      for(var i = 0; i < this.length; i++) {
	    if (this[i] === elem) return i;
	  }
	  return -1;
	}; 
  }

  /**
  *  Create the string equivalent of a li element for an awesome-font icon
  *
  * @method awesome 
  * @param ico {string} name of icon.
  * @return {string} A string representing an li element with the class attribute set to "icon-' + ico + '"
  */
  var awesome = function (ico) { return '<i class="icon-' + ico + '"></i>'; };

  /**
  * This serves as the constructor for the helper library. 
  *
  * @constructor 
  */
  function Helper(){};

  /**
  *  Check if an element exists in an array
  *
  * @method member 
  * @param myArray {Array} The array we are searching against.
  * @param elem {string} The element we want to find in the array
  * @return {int} Returns index of the element if it is in the array,otherwise it returns -1
  */
  Helper.prototype.member = function(myArray, elem){ return (myArray.indexOf(elem) != -1); };

  /**
  *  Expose the awesome function that is in this context to other contexts that are going to be using the Helper library
  */
  Helper.prototype.awesome = awesome;
	
  /**
  *  Get a single or multiple icons 
  *
  * @method getIcon 
  * @param allcats {string} A string of icons deliminated by ','.
  * @return {string} Returns a string of icons as html elements.
  */
  Helper.prototype.getIcon = function(allcats){
	var cats = allcats.split(","),
	  result = "";

	for (var cat in cats) {
	  sw = cats[cat].trim();
	  if (result == "") {
		if (icons[sw] != undefined) {
		  result += icons[sw];
		}
	  } else {
		result += " , " + icons[sw];
	  }
	}
    return result;
  };

  /**
  *  Checks if an assignment has been released
  *
  * @method isReleased 
  * @param after {date} A string of icons deliminated by ','.
  * @return {bool} Returns true if the assignment is released and false if it hasn't
  */
  Helper.prototype.isReleased = function(after){
  
	/**
	* Here's a way to cheat when testing on localhost.
	* I can pretend it is some date in the future for purposes of
	* testing my release dates. 
	*/
    if (window.location.hash.indexOf("#date") != -1) {
      var re = /date(\d+)/;
      var result = re.exec(window.location.hash);
	  if (window.moment(after, "YYYYMMDD").unix() < window.moment(result[1], "YYYYMMDD").unix()) {
	    return true;
	  }
    }

	switch (after) {
	  case "":
	    return false;
	  case "now":
	    return true;
	  default:
		return window.moment(after, "YYYYMMDD").unix() < window.moment().unix();
	}
  };
	
  /**
  *  Gets number of days until due date for a future assignment 
  *
  * @method onlyInFuture 
  * @param due {date} A future date.
  * @return {string} Returns number of days from future date
  */
  Helper.prototype.onlyInFuture = function(due){
    var m,returnText = "";
    m = parseDueDate(due);

    if (m.diff(window.moment(), 'days') >= 0) {
	  returnText = txt;
	}

	return returnText;
  };
	
  /**
  *  Checks if the date is a valid date
  *
  * @method isValidDueDate 
  * @param due {date} A date.
  * @return {string} Returns true if date is valid,otherwise returns false
  */
  Helper.prototype.isValidDueDate = function(due){ return (due.length == 12 || due.length == 8); };

  /**
  *  Date formatting 
  *
  * @method parseDueDate 
  * @param due {date} A date.
  * @return {date} Returns date in YYYYMMDDHHmm or YYYYMMDD format 
  */
  Helper.prototype.parseDueDate = function(due){
	var m;
	if (due.length == 12) {
	  m = window.moment(due, "YYYYMMDDHHmm");
	} else if (due.length == 8) {
	  m = window.moment(due, "YYYYMMDD");
	}
	return m;
  };
	
  /**
  *  Get the color for an assignment
  *  Red: less than or equal to 5 days, Yellow: less than or equal to 8 days, Green: more than or equal to 9 days
  *
  * @method getRangeColor 
  * @param due {mom} A date.
  * @return {string} Returns the appropriate label-* depending on which color range the date falls. 
  */ 
  Helper.prototype.getRangeColor = function (mom) {
	var difference = mom.diff(window.moment(), 'days');
	if (difference >= 0) {
	  if (difference <= 5) {
		return "label-danger";
	  } else if (difference <= 8) {
		return "label-warning";
	  } else if (difference >= 9) {
		return "label-success";
	  }
	} else {
	  return "";
	}		
  };
	
})(window);