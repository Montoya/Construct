/* construct.js */

/* Version 0.4 - Christian Montoya, christianmontoya.net */ 

/* Changes:
    #construct added to all traversals
    parsing & generating completed
*/

/* Standard elements that are created on actions */

var containerEl = '<div class="container selected"></div>';

var columnEl = '<div class="column span-1 last selected"></div>';

/* Functions triggered by keyboard events */

// change selected container
function containerSel(n){ 
  // less than two containers, just cancel
  if( $('#construct .container').size() < 2 ) {
    return false;
  }
  if( n == -1 ) {
    // deselect current and move up
    $('#construct .container.selected').removeClass('selected').prev('#construct .container').addClass('selected');
    
    if( $('#construct .container.selected').size() < 1 ) {
      // we were at the first child, so select the last one (wrap up)
      $('#construct .container:last').addClass('selected');
    }
  }
  else {
    $('#construct .container.selected').removeClass('selected').next('#construct .container').addClass('selected');
    
    if( $('#construct .container.selected').size() < 1 ) {
      // we were at the last child, so select the first one (wrap down)
      $('#construct .container:first').addClass('selected');
    }
  }
  
  return false;
}

// change selected column
function columnSel(n){
  if( $('#construct .container.selected .column').size() < 2 ) {
    // less than two columns, so quit
    return false;
  }
  if( n == -1 ) {
    // deselect current and move left
    $('#construct .container.selected .column.selected').removeClass('selected').prev('#construct .column').addClass('selected');
    
    if( $('#construct .container.selected .column.selected').size() < 1 ) {
      // we were at the first child, so select the last one (wrap left)
      $('#construct .container.selected .column:last').addClass('selected');
    }
  }
  else {
    // deselect current and move right
    $('#construct .container.selected .column.selected').removeClass('selected').next('#construct .column').addClass('selected');
    
    if( $('#construct .container.selected .column.selected').size() < 1 ) {
      // we were at the last child, so select the first one (wrap right)
      $('#construct .container.selected .column:first').addClass('selected');
    }
  }
  
  return false;
}

// expand or contract the selected column
function columnScale(n){
  // get span-X by measuring width
  var columnWidth = $('#construct .container.selected .column.selected').width();
  var spanNumber = (columnWidth + 10) / 40;
  // don't contract if span-1
  if(spanNumber < 2 && n == -1) {
    return false;
  }
  // don't expand if span-24
  if(spanNumber > 23 && n == 1) {
    return false;
  }
  // change size (have to add new class, then remove old one)
  var removeSpan = 'span-' + spanNumber;
  spanNumber = spanNumber + n;
  var addSpan = 'span-' + spanNumber;
  // add new span-X class, then remove old span-X class
  $('#construct .container.selected .column.selected').addClass(addSpan);
  $('#construct .container.selected .column.selected').removeClass(removeSpan);
  
  return false;
}

// toggle "last" class on selected column
function columnToggleLast(){
  $('#construct .container.selected .column.selected').toggleClass('last');
  
  return false;
}

function containerAdd() {
  // deselect any currently selected container
  $('#construct .container.selected').removeClass('selected');
  // append a new container to the #construct space
  $('#construct').append(containerEl);
  
  // add "onclick" event to select by click
  $('#construct .container:last').click(function(){
    containerClick(this);
    return false;
  });
  
  return false;
}

function columnAdd() {
  // if no selected container, just cancel
  if( $('#construct .container.selected').size() < 1 ) {
    return false;
  }
  
  // remove .last from any previous column
  $('#construct .container.selected .column:last').removeClass('last');
  // append a column to the selected container
  $('#construct .container.selected').append(columnEl);
  // remove .selected from any selected column in this container
  $('#construct .container.selected .column.selected').removeClass('selected');
  // add .selected to the column just added
  $('#construct .container.selected .column:last').addClass('selected');

  // add "onclick" event to select by click
  $('#construct .container.selected .column:last').click(function(){
    // first select the parent container (reusing containerClick function)
    containerClick( $(this).parent() );
    // then select this column
    columnClick(this);
    return false;
  });
  
  return false;
}

function containerDelete() {
  // remove the selected container from the DOM and select the next one
  $('#construct .container.selected').next('#construct .container').addClass('selected');
  $('#construct .container.selected:first').remove();
  if( $('#construct .container.selected').size() < 1 ) {
    // we deleted the last container, so now select the "new" last container 
    $('#construct .container:last').addClass('selected');
  }
  
  return false;
}

function columnDelete() {
  // remove the selected column from the DOM and select the next one
  $('#construct .container.selected .column.selected').next('#construct .column').addClass('selected');
  $('#construct .container.selected .column.selected:first').remove();
  if( $('#construct .container.selected .column.selected').size() < 1 ) {
    // we deleted the last column, so now select the "new" last column
    $('#construct .container.selected .column:last').addClass('selected');
  }
  
  return false;
}

function containerClick(el){
  // de-select the currently selected container
  $('#construct .container.selected').removeClass('selected');
  // add .selected
  $(el).addClass('selected');
  
  return false;
}

function columnClick(el){
  // de-select the currently selected column
  $('#construct .container.selected .column.selected').removeClass('selected');
  // add .selected
  $(el).addClass('selected');
  
  return false;
}

function identify(el){
  // prompt the user for a unique ID to apply to this element
  var uniqueID = prompt("Enter a unique ID for this element");
  // if the user clicked "OK", then keep going
  if(uniqueID){
    // check that this ID does not already exist
    if( $('#' + uniqueID).size() > 0 ){ alert("That ID already exists! Please try again."); return false; }
    // apply this ID and add the class "identified"
    $(el).attr({ id: "" + uniqueID }).addClass('identified');
  }
  
  return false;
}

function unIdentify(el){
  // remove the ID on the element and remove the class "identified"
  $(el).removeAttr('id').removeClass('identified');
  
  return false;
}

/* Bind events for Construct interface */

$(document).ready(function(){
  
  // create keyboard events
  $(document).keydown(function(e){
    var key = e.charCode || e.keyCode || 0;
    switch(key) {
      case 38: // up arrow
        containerSel(-1);
        return false;
        break;
      case 40: // down arrow
        containerSel(1);
        return false;
        break;
      case 37: // left arrow
        columnSel(-1);
        return false;
        break;
      case 39: // right arrow
        columnSel(1);
        return false;
        break;
      case 74: // J
        columnScale(-1);
        return false;
        break;
      case 75: // K
        columnScale(1);
        return false;
        break;
      case 76: // L
        columnToggleLast();
        return false;
        break;
      case 81: // Q
        containerAdd();
        return false;
        break;
      case 87: // W
        identify( $('.container.selected') );
        return false;
        break;
      case 65: // A
        columnAdd();
        return false;
        break;
      case 83: // S
        identify( $('.container.selected .column.selected') );
        return false;
        break;
      case 69: // E
        containerDelete();
        return false;
        break;
      case 82: // R
        unIdentify( $('.container.selected') );
        return false;
        break;
      case 68: // D
        columnDelete();
        return false;
        break;
      case 70: // F
        unIdentify( $('.container.selected .column.selected') );
        return false;
        break;
      default:
        //alert(key);
        break;
    }
  });
  
  // add a container to the #construct space
  $('#construct-addContainer').click(function(){
    containerAdd();
    return false;
  });
  
  // add a column (only if a container exists)
  $('#construct-addColumn').click(function(){
    columnAdd();
    return false;
  });
  
  $('#construct-parseConstruct').click(function(){
    parseConstruct();
    return false;
  });
  
  $('#construct-hideOutput').click(function(){
    $("#construct-output").slideUp();
    return false;
  });
  
  $('#construct-hideControls').click(function(){
    $("#construct-controls").slideUp();
    return false;
  });
  
  $('#construct-viewControls').click(function(){
    $("#construct-controls").slideDown();
    return false;
  });
  
  $('#construct-hideAbout').click(function(){
    $("#construct-about").slideUp();
    return false;
  });
  
  $('#construct-viewAbout').click(function(){
    $('#construct-about').slideDown();
    return false;
  });
  
});