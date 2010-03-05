/* construct-parser.js */

/* Version 1.0 - Christian Montoya, christianmontoya.net */ 

/*
Copyright 2010 Christian Montoya. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are
permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice, this list of
      conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright notice, this list
      of conditions and the following disclaimer in the documentation and/or other materials
      provided with the distribution.

THIS SOFTWARE IS PROVIDED BY CHRISTIAN MONTOYA ``AS IS'' AND ANY EXPRESS OR IMPLIED
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

The views and conclusions contained in the software and documentation are those of the
authors and should not be interpreted as representing official policies, either expressed
or implied, of Christian Montoya.
*/

var parseDepth = 0; // for tabbing

var styles = new Object(); // for collecting IDs and classes
styles["construct-loose"] = "";

// for tabbing
function tabToDepth() { 
  var str = "";
  for(var t = 0; t < parseDepth; t++){
    str += "&nbsp;";
  }
  return str;
}

/**
 * Removes duplicates in the array 'a'
 * @author Johan Känngård, http://dev.kanngard.net
 */
function unique(a) {
	tmp = new Array(0);
	for(i=0;i<a.length;i++){
		if(!contains(tmp, a[i])){
			tmp.length+=1;
			tmp[tmp.length-1]=a[i];
		}
	}
	return tmp;
}

/**
 * Returns true if 's' is contained in the array 'a'
 * @author Johan Känngård, http://dev.kanngard.net
 */
function contains(a, e) {
	for(j=0;j<a.length;j++)if(a[j]==e)return true;
	return false;
}

// defining custom trim functions (found in comments at http://www.codestore.net/store.nsf/unid/BLOG-20060313, thanks John Z Marshall)
String.prototype.trim = function() {
  return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,"");
}
String.prototype.fulltrim = function() {
  return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,"").replace(/\s+/g," ");
}

// function for generating CSS based on "styles" and "gridArray"
function generateCSS() {
  
  var css = "";
  var classes = new Array();
  
  // quick trim 
  styles["construct-loose"] = styles["construct-loose"].fulltrim();
  
  for (var s in styles) {
    if (s == 'construct-loose' && styles["construct-loose"].length > 0) {
      classes = styles[s].split(" "); // split string to array
      classes = unique(classes); // remove duplicates
      for (var i = 0; i < classes.length; i++) {
        css += "." + classes[i] + " { " + theGrid[classes[i]] + " }<br>";
      }
    }
    else if (styles[s].length > 0) {
      css += "#" + s + " { ";
      classes = styles[s].fulltrim().split(" ");
      for (var i = 0; i < classes.length; i++) {
        css += theGrid[classes[i]] + " ";
      }
      css += "} <br>";
    }
  }
  
  return css;
  
}

// simple function for parsing element and its children recursively
function parseElement(el){
  
  var markup = "";
  
  var tagName = el.nodeName.toLowerCase(); // tag name!
  
  if( tagName == 'hr' ) { 
    markup += tabToDepth() + "&lt;" + tagName + "&gt; <br>";
    return markup;
  }
  else if( tagName == 'p' ) { 
    parseDepth += 2;
    markup += tabToDepth() + "&lt;" + tagName + "&gt;Lorem Ipsum...&lt;/" + tagName + "&gt; <br>";
    parseDepth -= 2;
    return markup;
  }
  
  var id = $(el).attr('id');
  
  var classes = $(el).attr('class') + ''; // classes!
  classes = classes.replace(/selected/, "");
  classes = classes.replace(/identified/, "");
  classes = classes.fulltrim();
  
  // build opening tag
  markup += tabToDepth() + "&lt;" + tagName;
  // possibly has an ID
  if( id ){ 
    markup += " id='" + id + "'";
  }
  // possibly has classes
  else if( classes ){
    markup += " class='" + classes + "'";
  }
  markup += "&gt; <br>";
  
  // process css for id and classes
  if( id && classes ) {
    styles[id] = classes;
  }
  else if( classes ) {
    styles["construct-loose"] = styles["construct-loose"] + " " + classes;
  }
  
  parseDepth += 2;
  
  // recursively process children
  $(el).children().each(function(){
    
    // keep building output
    markup += parseElement(this);
    
  });
  
  parseDepth -= 2; 
  
  // build closing tag
  markup += tabToDepth() + "&lt;/" + tagName + "&gt; <br>";
  
  // all done, return!
  return markup;
  
}

// wrapper function to process all elements in #construct
function parseConstruct(){
  
  var markup = "";
  
  $('#construct').children().each(function(){
    
    markup += parseElement(this);
    
  });
  
  var css = generateCSS();
  
  $('#construct-output div#construct-markup').empty().append(markup);
  $('#construct-output div#construct-styles').empty().append(css);
  $('#construct-output').slideDown();
  
  styles = new Object(); // for collecting IDs and classes
  styles["construct-loose"] = "";
  
  return false;
}