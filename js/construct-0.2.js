/* construct.js */

/* Initial testing for Construct - Christian Montoya, christianmontoya.net */ 

/* Ctrs and pointers to hold state */

var containerCtr = 0; // any number of containers
var containerPtr; // the selected container

var columnCtrs = []; // counters for the columns in each container
var columnPtrs = []; // pointers to the selected column in each container

/* Standard elements that are created on actions */

var containerElPre = '<div class="container selected" id="constructContainer-';
var containerElSuf = '"></div>';

var columnElPre = '<div class="column span-1 last selected" id="constructColumn-';
var columnElSuf = '"></div>';

/* Functions triggered by keyboard events */

// change selected container
function containerSel(n){ 
  if(containerCtr < 2) {
    // only zero or one containers, so quit
    return false;
  }
  var container = '#constructContainer-' + containerPtr;
  $(container).removeClass('selected');
  // point to previous or next container (-1: previous, 1: next)
  containerPtr = containerPtr + n; 
  // wrap around to last
  if(containerPtr < 0) { 
    containerPtr = containerCtr - 1; 
  }
  // wrap around to first 
  if(containerPtr >= containerCtr) {
    containerPtr = 0;
  }
  container = '#constructContainer-' + containerPtr;
  $(container).addClass('selected');
  
  return false;
}

// change selected column
function columnSel(n){
  if(columnCtrs[containerPtr] < 2) {
    // only zero or one columns, so quit
    return false;
  }
  var column = '#constructColumn-' + containerPtr + '-' + columnPtrs[containerPtr];
  $(column).removeClass('selected');
  // point to previous or next container (-1: previous, 1:next)
  columnPtrs[containerPtr] = columnPtrs[containerPtr] + n;
  // wrap around to last
  if(columnPtrs[containerPtr] < 0) {
    columnPtrs[containerPtr] = columnCtrs[containerPtr] - 1;
  }
  // wrap around to first
  if(columnPtrs[containerPtr] >= columnCtrs[containerPtr]) {
    columnPtrs[containerPtr] = 0;
  }
  column = '#constructColumn-' + containerPtr + '-' + columnPtrs[containerPtr];
  $(column).addClass('selected');
  
  return false;
}

// expand or contract the selected column
function columnScale(n){
  var column = '#constructColumn-' + containerPtr + '-' + columnPtrs[containerPtr];
  // get span-X by measuring width
  var columnWidth = $(column).width();
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
  $(column).addClass(addSpan);
  $(column).removeClass(removeSpan);
  
  return false;
}

// toggle "last" class on selected column
function columnToggleLast(){
  var column = '#constructColumn-' + containerPtr + '-' + columnPtrs[containerPtr];
  $(column).toggleClass('last');
  
  return false;
}

function containerClick(el){
  // de-select the currently selected container
  var previousContainer = '#constructContainer-' + containerPtr;
  $(previousContainer).removeClass('selected');
  // get the id of the clicked container
  var id = $(el).attr('id');
  // remove "constructContainer-"
  id = id.replace(/constructContainer-/,'');
  // set containerPtr to this integer
  containerPtr = parseInt(id);
  // add 'selected'
  $(el).addClass('selected');
  return false;
}

function columnClick(el){
  // de-select the currently selected column
  var previousColumn = '#constructColumn-' + containerPtr + '-' + columnPtrs[containerPtr]; 
  $(previousColumn).removeClass('selected');
  // get the id of the clicked column
  var id = $(el).attr('id');
  // remove "constructColumn-X-"
  id = id.replace(/constructColumn-[0-9]+-/,'');
  // set columnPtrs[containerPtr] to this integer
  columnPtrs[containerPtr] = parseInt(id);
  // add 'selected'
  $(el).addClass('selected');
  return false;
}

/* Bind events for Construct interface */

$(document).ready(function(){
  
  // create keyboard events
  $(document).keydown(function(e){
    var key = e.charCode || e.keyCode || 0;
    switch(key) {
      case 38:
        containerSel(-1);
        return false;
        break;
      case 40:
        containerSel(1);
        return false;
        break;
      case 37:
        columnSel(-1);
        return false;
        break;
      case 39:
        columnSel(1);
        return false;
        break;
      case 74:
        columnScale(-1);
        return false;
        break;
      case 75:
        columnScale(1);
        return false;
        break;
      case 76:
        columnToggleLast();
        return false;
        break;
      default:
        break;
    }
  });
  
  // add a container to the #construct space
  $('#addContainer').click(function(){
    // create the container element with a unique ID
    var containerEl = '' + containerElPre + containerCtr + containerElSuf;
    // append this container to the #construct space
    $('#construct').append(containerEl);
    
    // need to remove .selected if there is a previous container
    if(containerCtr > 0) {
      // get the # for the previous container
      var previousContainer = '#constructContainer-' + containerPtr;
      $(previousContainer).removeClass('selected');
    }
    
    // set the current pointer to this container
    containerPtr = containerCtr;
    // add a counter for the columns in this container
    columnCtrs[containerPtr] = 0;
    // increment the number of containers
    containerCtr++;
    
    // add "onclick" event to select by click
    $('#constructContainer-' + containerPtr).click(function(){
      containerClick(this);
      return false;
    });
    
    return false;
  });
  
  // add a column (only if a container exists)
  $('#addColumn').click(function(){
    
    // check if no containers exist
    if(containerCtr < 1) {
      return false;
    }
    
    // create the column element with a unique ID
    var columnEl = '' + columnElPre + containerPtr + '-' + columnCtrs[containerPtr] + columnElSuf;
    // access the currently selected container
    var containerEl = '#constructContainer-' + containerPtr;
    // append this column to this container
    $('' + containerEl).append('' + columnEl);
    
    // need to remove .last & .selected if there is a previous column
    if(columnCtrs[containerPtr] > 0) {
      // get the # for the previous column
      var n = columnCtrs[containerPtr] - 1;
      var previousColumn = '#constructColumn-' + containerPtr + '-' + n;
      $(previousColumn).removeClass('last');
      // get the selected column
      var selectedColumn = '#constructColumn-' + containerPtr + '-' + columnPtrs[containerPtr]; 
      $(selectedColumn).removeClass('selected');
    }
    
    // set the column pointer for this container to the new column
    columnPtrs[containerPtr] = columnCtrs[containerPtr];
    // increment the number of columns for this container
    columnCtrs[containerPtr]++;
    
    // add "onclick" event to select by click
    $('#constructColumn-' + containerPtr + '-' + columnPtrs[containerPtr]).click(function(){
      // first select the parent container (reusing containerClick function)
      containerClick( $(this).parent() );
      // then select this column
      columnClick(this);
      return false;
    });
    
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