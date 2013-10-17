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
	
  var awesome = function (ico) { return '<i class="icon-' + ico + '"></i>'; };
	
  function Helper(){};
	
  Helper.prototype.member = function(ls, v){ return (ls.indexOf(v) != -1); };
	
  Helper.prototype.awesome = awesome;
	
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
	
  Helper.prototype.onlyInFuture = function(due){
    var m,returnText = "";
    m = parseDueDate(due);

    if (m.diff(window.moment(), 'days') >= 0) {
	  returnText = txt;
	}

	return returnText;
  };
	
  Helper.prototype.isValidDueDate = function(due){ return (due.length == 12 || due.length == 8); };
	
  Helper.prototype.parseDueDate = function(due){
	var m;
	if (due.length == 12) {
	  m = window.moment(due, "YYYYMMDDHHmm");
	} else if (due.length == 8) {
	  m = window.moment(due, "YYYYMMDD");
	}

	return m;
  };
	
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