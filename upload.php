<?

/*******************
 This is VERY bad script, but serves as a basic example of how to recieve the data send by my imgDrop jQuery plugin.
 This script stores the uploaded file no-questions-asked and is a mayor security hole in it's current form. 
 Also, in your actual script DON'T use the HTTP_X_FILE_TYPE as a verification of the filetype, but try a gd-library function on it or something. the HTTP_X_FILE_TYPE is set cliënt side and therefore cannot be trusted, people can be masking scripts and executables as images.
 ********************/

$file = array(
	'data' => file_get_contents('php://input'),
	'name' => $_SERVER['HTTP_X_FILE_NAME'],
	'size' => $_SERVER['HTTP_X_FILE_SIZE'],
	'type' => $_SERVER['HTTP_X_FILE_TYPE'],	
);

$handle = fopen('img/'.$file['name'],'w');
fwrite($handle,$file['data']);
fclose($handle);
echo 'img/'.$file['name'];

?>