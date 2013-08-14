/*	fileio.js
**	P.Towers
**	December 2012
**
**	function PutFile( txtValue, Filename )
**
**	function GetFile( Filename )
**
*/

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
