<?php 

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

/*  
    Parse a CSS file, 
    collect all the classes and the associated rule-sets, 
    create one set of rules per class 
*/

$css = "grid.css"; 
$arrayFile = "gridArray.js"; 

$file = fopen("$css", "r");

$r = '';

do{
  $data = fread($file, 8192);
  $r .= $data;
}
while(strlen($data) != 0);

preg_match_all("/\.(.+?)\{((.|\r|\n)+?)\}/", $r, $matches);

$selectors = $matches[1]; 

$rules = $matches[2]; 

$count = sizeof($selectors); 

$theCSS = array(); 

for($i = 0; $i < $count; $i++)
{
  $arr = explode(',', $selectors[$i]); 
  
  foreach($arr as $sel)
  {
    $sel = trim($sel);
    
    $sel = str_replace('.', '', $sel); 
    
    if(!isset($theCSS[$sel])) { 
      
      $theCSS[$sel] = ''; 
      
    }
    
    $theCSS[$sel] .= $rules[$i]; 
  }
}

$out = <<<OPEN
var theGrid = {};\n
OPEN;

foreach($theCSS as $s => $r)
{
  $r = ereg_replace("\n", "", $r);
  $r = ereg_replace("\r", "", $r);
  $r = trim($r);

  $out .= <<<LINE
theGrid['{$s}'] = '{$r}';\n
LINE;
}

$fh = fopen($arrayFile, 'w'); 

fwrite($fh, $out); 

fclose($fh); 

echo "I just created $arrayFile\n\nView the file to see the result.\n\n";

?>