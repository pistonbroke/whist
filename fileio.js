/*	fileio.js
**	P.Towers
**	December 2012
**
**	function PutFile( txtValue, Filename )
**
**	function GetFile( Filename )
**
*/
    // This will parse a delimited string into an array of
    // arrays. The default delimiter is the comma, but this
    // can be overriden in the second argument.
    function CSVToArray( strData, strDelimiter ){
    	// Check to see if the delimiter is defined. If not,
    	// then default to comma.
    	strDelimiter = (strDelimiter || ",");

    	// Create a regular expression to parse the CSV values.
    	var objPattern = new RegExp(
    		(
    			// Delimiters.
    			"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

    			// Quoted fields.
    			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

    			// Standard fields.
    			"([^\"\\" + strDelimiter + "\\r\\n]*))"
    		),
    		"gi"
    		);


    	// Create an array to hold our data. Give the array
    	// a default empty first row.
    	var arrData = [[]];

    	// Create an array to hold our individual pattern
    	// matching groups.
    	var arrMatches = null;


    	// Keep looping over the regular expression matches
    	// until we can no longer find a match.
    	while (arrMatches = objPattern.exec( strData )){

    		// Get the delimiter that was found.
    		var strMatchedDelimiter = arrMatches[ 1 ];

    		// Check to see if the given delimiter has a length
    		// (is not the start of string) and if it matches
    		// field delimiter. If id does not, then we know
    		// that this delimiter is a row delimiter.
    		if (
    			strMatchedDelimiter.length &&
    			(strMatchedDelimiter != strDelimiter)
    			){

    			// Since we have reached a new row of data,
    			// add an empty row to our data array.
    			arrData.push( [] );

    		}


    		// Now that we have our delimiter out of the way,
    		// let's check to see which kind of value we
    		// captured (quoted or unquoted).
    		if (arrMatches[ 2 ]){

    			// We found a quoted value. When we capture
    			// this value, unescape any double quotes.
    			var strMatchedValue = arrMatches[ 2 ].replace(
    				new RegExp( "\"\"", "g" ),
    				"\""
    				);

    		} else {

    			// We found a non-quoted value.
    			var strMatchedValue = arrMatches[ 3 ];

    		}


    		// Now that we have our value string, let's add
    		// it to the data array.
    		arrData[ arrData.length - 1 ].push( strMatchedValue );
    	}

    	// Return the parsed data.
    	return( arrData );
    }

function PutFile( txtValue, Filename, Mode )
{
var oRequest, sURL, txtSSV, txt, fMode, isLocal;
	try
	{
		// swap newlines for caret
		txtSSV = escape(txtValue) ;//.replace( /\n/g, "%0D" );
		if ( self.location.hostname.indexOf("www") < 0 )
		{
			window.localStorage[ Filename ] = txtSSV;	
		}
		else
		{
			oRequest = new XMLHttpRequest();
			sURL = 	"http://"
					 + self.location.hostname
					 + "/fsave.php?content="
					 + txtSSV
					 + "&filename="
					 + Filename
					 + "&mode="
					 + Mode;
			oRequest.open("GET",sURL,false);
			oRequest.setRequestHeader("User-Agent",navigator.userAgent);
			oRequest.send(null)
			
			if (oRequest.status!=200)
				alert("Error executing XMLHttpRequest call!");
		}
	}
	catch(e)
	{
		alert(e);
	}
}

function GetFile( Filename )
{
var Result;

	try
	{
		if ( self.location.hostname.indexOf("www") < 0 )
		{
			Result = window.localStorage[ Filename ];
		}
		else
		{
		var oRequest = new XMLHttpRequest();
		var sURL = "http://"
		         + self.location.hostname
		         + "/"
				 + Filename;
			oRequest.open("GET",sURL,false);
			oRequest.setRequestHeader("User-Agent",navigator.userAgent);
			oRequest.send(null)
			
			if (oRequest.status==200) 
			{
				// read the stored text
				Result = oRequest.responseText;
			}
			else return ""; // an empty file !
		}
		// swap the carets for newlines to recreate the original text
		if ( Result != undefined )
		{
			Result = unescape( Result );
			Result = Result.replace(/\^/g,'\n');
		}
	}
	catch(e)
	{
		alert(e);
	}
return Result;
}
