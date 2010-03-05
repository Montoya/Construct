/* construct.js */

/* Version 0.3 - Christian Montoya, christianmontoya.net */ 

/* Changes:
    Code completely rewritten to use jQuery DOM traversal, no need for arrays, pointers, counters, etc.
    Added support for deleting columns and containers
    Add container, column moved to separate functions
    Keys mapped for add container, column
*/

/* Standard elements that are created on actions */

var containerEl = '<div class="container selected"></div>';

var columnEl = '<div class="column span-1 last selected"></div>';

/* Functions triggered by keyboard events */

// change selected container
function containerSel(n){ 
  // less than two containers, just cancel
  if( $('.container').size() < 2 ) {
    return false;
  }
  if( n == -1 ) {
    // deselect current and move up
    $('.container.selected').removeClass('selected').prev('.container').addClass('selected');
    
    if( $('.container.selected').size() < 1 ) {
      // we were at the first child, so select the last one (wrap up)
      $('.container:last').addClass('selected');
    }
  }
  else {
    $('.container.selected').removeClass('selected').next('.container').addClass('selected');
    
    if( $('.container.selected').size() < 1 ) {
      // we were at the last child, so select the first one (wrap down)
      $('.container:first').addClass('selected');
    }
  }
  
  return false;
}

// change selected column
function columnSel(n){
  if( $('.container.selected .column').size() < 2 ) {
    // less than two columns, so quit
    return false;
  }
  if( n == -1 ) {
    // deselect current and move left
    $('.container.selected .column.selected').removeClass('selected').prev('.column').addClass('selected');
    
    if( $('.container.selected .column.selected').size() < 1 ) {
      // we were at the first child, so select the last one (wrap left)
      $('.container.selected .column:last').addClass('selected');
    }
  }
  else {
    // deselect current and move right
    $('.container.selected .column.selected').removeClass('selected').next('.column').addClass('selected');
    
    if( $('.container.selected .column.selected').size() < 1 ) {
      // we were at the last child, so select the first one (wrap right)
      $('.container.selected .column:first').addClass('selected');
    }
  }
  
  return false;
}

// expand or contract the selected column
function columnScale(n){
  // get span-X by measuring width
  var columnWidth = $('.container.selected .column.selected').width();
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
  $('.container.selected .column.selected').addClass(addSpan);
  $('.container.selected .column.selected').removeClass(removeSpan);
  
  return false;
}

// toggle "last" class on selected column
function columnToggleLast(){
  $('.container.selected .column.selected').toggleClass('last');
  
  return false;
}

function containerAdd() {
  // deselect any currently selected container
  $('.container.selected').removeClass('selected');
  // append a new container to the #construct space
  $('#construct').append(containerEl);
  
  // add "onclick" event to select by click
  $('.container:last').click(function(){
    containerClick(this);
    return false;
  });
  
  return false;
}

function columnAdd() {
  // if no selected container, just cancel
  if( $('.container.selected').size() < 1 ) {
    return false;
  }
  
  // remove .last from any previous column
  $('.container.selected .column:last').removeClass('last');
  // append a column to the selected container
  $('.container.selected').append(columnEl);
  // remove .selected from any selected column in this container
  $('.container.selected .column.selected').removeClass('selected');
  // add .selected to the column just added
  $('.container.selected .column:last').addClass('selected');

  // add "onclick" event to select by click
  $('.container.selected .column:last').click(function(){
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
  $('.container.selected').next('.container').addClass('selected');
  $('.container.selected:first').remove();
  if( $('.container.selected').size() < 1 ) {
    // we deleted the last container, so now select the "new" last container 
    $('.container:last').addClass('selected');
  }
  
  return false;
}

function columnDelete() {
  // remove the selected column from the DOM and select the next one
  $('.container.selected .column.selected').next('.column').addClass('selected');
  $('.container.selected .column.selected:first').remove();
  if( $('.container.selected .column.selected').size() < 1 ) {
    // we deleted the last column, so now select the "new" last column
    $('.container.selected .column:last').addClass('selected');
  }
  
  return false;
}

function containerClick(el){
  // de-select the currently selected container
  $('.container.selected').removeClass('selected');
  // add .selected
  $(el).addClass('selected');
  
  return false;
}

function columnClick(el){
  // de-select the currently selected column
  $('.container.selected .column.selected').removeClass('selected');
  // add .selected
  $(el).addClass('selected');
  
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
      case 65: // A
        columnAdd();
        return false;
      case 69: // E
        containerDelete();
        return false;
      case 68: // D
        columnDelete();
        return false;
      default:
        alert(key);
        break;
    }
  });
  
  // add a container to the #construct space
  $('#addContainer').click(function(){
    containerAdd();
    return false;
  });
  
  // add a column (only if a container exists)
  $('#addColumn').click(function(){
    columnAdd();
    return false;
  });
  
  $('#hideControls').click(function(){
    $("#controls").slideUp();
    return false;
  });
  
  $('#viewControls').click(function(){
    $("#controls").slideDown();
    return false;
  });
  
  $('#hideAbout').click(function(){
    $("#about").slideUp();
    return false;
  });
  
  $('#viewAbout').click(function(){
    $('#about').slideDown();
    return false;
  });
  
});