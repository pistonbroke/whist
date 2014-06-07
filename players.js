/*
 * players.js
 * 03.03.13
 * PJT
 */

var PlayerList = new Array();


function _initPlayers()
{
	try
	{
	var names, id, row, NameText, cbInUse, PosnText;
		
		//names = GetFile( 'players.txt' );	
		names = localStorage["PlayerNames"];
		if ( names != undefined )
			PlayerList = names.split(',');
		if ( PlayerList.length < 3 )
		{
			names = "Kev,Kim,Mike,Norm,Phil,Spare1,Spare2,Spare3"; 
			PlayerList = names.split(',');
			$('#PlayerNames').text(names);
			_savePlayers();
		}
		$("#PlayerNames").attr('value', names.replace( /,/g, "\n" ) );
		$("#PlayerNames").hide();
		$('#PlayerTable tr:gt(0)').remove();
		for ( var i = 1; i <= PlayerList.length; i++ )
		{
			NameText = sprintf("<td><label for='inuse%d' id='pn%d'>%s</label></td>", i, i, PlayerList[i-1] ); 
			cbInUse = sprintf("<td align='%s'><input id='inuse%d' class='player_in_use' type='checkbox'  onclick='javascript:SlctPlayer(this);' /></td>", 
				((i & 1)==1) ? "center" : "center", i );
			PosnText = sprintf("<td align='center'><span id='psn%d'></span></td>", i );
			row = sprintf("<tr id='r%d'>%s%s%s</tr>", i, NameText, cbInUse, PosnText );
			$('#PlayerTable tr:last').after( row );
		}
		$("#cph").attr('value', 10 );
		$("#bUsePlayers").attr("disabled",true);
		$("#cph").attr("disabled",true);
		$("#bSavePlyr").hide();
	}
	catch(e)
	{
		alert(e);
	}	
}

function SlctPlayer( plyr )
{
	var minVal, MaxCards, PlayerCnt = 0, ndx = $(plyr).attr('id').substring(5);
	if ( $(plyr).is(':checked') )
	{
		$("#bEditPlyr").hide();
		$("#bUsePlayers").attr("disabled",false);
		$("#cph").attr("disabled",false);
		minVal = 0;
		for ( var i = 1; i <= $("#PlayerTable tr").length; i++ )
		{
			if ( $('#inuse'+i).is(':checked') )	
			{
				PlayerCnt = parseInt( $("#psn"+i).text() );
				if ( PlayerCnt > minVal )
					minVal = PlayerCnt;
			}
		}
		minVal++;
		if ( minVal <= 8 )
			$("#psn"+ndx).text(minVal);
		else	
			$(plyr).attr("checked",false);
	}
	else
	{
		$("#bEditPlyr").show();
		$("#bUsePlayers").attr("disabled",true);
		$("#cph").attr("disabled",true);
		minVal = parseInt( $("#psn"+ndx).text() );
		$("#psn"+ndx).text('');	
		for ( var i = 1; i <= $("#PlayerTable tr").length; i++ )
		{
			if ( $('#inuse'+i).is(':checked') )	
			{
				PlayerCnt = parseInt( $("#psn"+i).text() );
				if ( PlayerCnt > minVal )
					$("#psn"+i).text( PlayerCnt-1 );
				$("#bEditPlyr").hide();
				$("#bUsePlayers").attr("disabled",false);
				$("#cph").attr("disabled",false);
			}	
		}
		minVal--;
	}
	MaxCards = Math.floor( 52 / minVal );
	if ( MaxCards > 10 ) 
		MaxCards = 10;
	$("#cph").attr('value', MaxCards );
	for ( var i = 10; i >= 5; i-- )
	{
		$("#cph"+i).attr("disabled", $("#cph"+i).val() > MaxCards );
	}
	//Play('pop.wav');
}

function _editPlayers()
{
	$("#PlayersControls").hide();
	$("#PlayerTable").hide();
	$("#PlayerNames").show();
	$("#bClrPlayers").hide();
	$("#bEditPlyr").hide();
	$("#bSavePlyr").show();
}

function _savePlayers()
{
	var PlayersCSV;
	$("#PlayersControls").show();
	$("#PlayerNames").hide();
	$("#PlayerTable").show();
	$("#bSavePlyr").hide();
	$("#bClrPlayers").show();
	$("#bEditPlyr").show();
	PlayerList = $('#PlayerNames').val();
	PlayersCSV = PlayerList.toString().replace( /\n/g, "," );
	//PutFile( PlayersCSV, 'players.txt', 'w' );
	localStorage["PlayerNames"] = PlayersCSV;
	_initPlayers();
}

function _clearPlayers()
{
	for ( var i = 1; i < $("#PlayerTable tr").length; i++ )
	{
		$("#inuse"+i).attr('checked',false);
		$("#psn"+i).text( '' );
	}	
	$("#cph").attr('value', 10 );
	$("#bUsePlayers").attr("disabled",true);
	$("#cph").attr("disabled",true);
	$("#bEditPlyr").show();
	$("#bUsePlayers").show();
}

function _usePlayers()
{
	var ndx, usedPlayers = new Array();
	try
	{
		for ( var a = 1; a <= $("#PlayerTable tr").length; a++ )
		{
			for ( var b = 1; b <= $("#PlayerTable tr").length; b++ )
			{
				if ( $('#inuse'+b).is(':checked') )	
				{
					ndx = parseInt( $("#psn"+b).text() );	
					if ( ndx == a )
					{
						usedPlayers.push( $("#pn"+b).text() );
						break;
					}
				}	
			}
		}
		PlayerList.length = 0;
		PlayerList = usedPlayers.slice(0);
    	$( "#tabs" ).tabs( "enable" , 2 );
    	$( "#players" ).hide();
    	$( "#game" ).show();
    	$( "#tabs" ).tabs( "option", "active", 2 );
    	_initGame( PlayerList );
	}
	catch(e)
	{
		alert(e);
	}	
	ndx = 0;
}
