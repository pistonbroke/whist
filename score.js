/*
 * score.js
 * 05/03/13
 * PJT
 */
var PlayerCount;

function Array2String( arr )
{
var str;
	str = arr + "";	
return str;
}

function toCSV( TableName ) 
{
var data = $(TableName).first(); //Only one table
var csvData = [];
var tmpArr = [];
var tmpStr = '';
	data.find("tr:visible").each( function() 
	{
		if($(this).find("th").length) 
		{
			$(this).find("th").each(function() 
			{
				tmpStr = $(this).text().replace(/"/g, '""');
				tmpArr.push('"' + tmpStr + '"');
			});
			csvData.push(tmpArr);
		} 
		else 
		{
			tmpArr = [];
			$(this).find("td").each(function() 
			{
				if($(this).text().match(/^-{0,1}\d*\.{0,1}\d+$/)) 
				{
					tmpArr.push(parseFloat($(this).text()));
				} 
				else 
				{
					tmpStr = $(this).text().replace(/"/g, '""');
					tmpArr.push('"' + tmpStr + '"');
				}
			});
			csvData.push(tmpArr.join(','));
		}
	});
	var output = csvData.join('\n');
	
return (output);
}
    
function _SaveScores( quiet )
{
	var csvText = toCSV( "#ScoreTable");
	PutFile( csvText, 'scores.txt', "w" );
	if ( quiet == undefined )
	{
		var audio = new Audio( "arcade.wav" );
		audio.play();
	}
}

function _LoadScores()
{
	var Row = Array();
	var Rows = Array();
	var Bids = Array();
	var Tricks = Array();
	var Scores = Array();
	var Trumps, StoredScores;
	StoredScores = GetFile("scores.txt");
	Rows = StoredScores.split('\n');
	Row = Rows[1].replace(/\\"/g, '').split(',');
	Row.splice(0,1);
	_initScores( Row );
	for ( var i = 2; i < Rows.length; i++ )
	{
		Row = Rows[i].replace(/\\"/g, '').split(',');
		Trumps = Row[0].replace(/\"/g, '');
		Row.splice(0,1);
		Bids.length = 0;
		Tricks.length = 0;
		Scores.length = 0;
		for ( var j = 0; j < Row.length; j += 3 )
		{
			Bids.push( Row[j] );	
			Tricks.push( Row[j+1] );	
			Scores.push( Row[j+2] );	
		}
		_addScoreLine( Trumps, Bids, Tricks, Scores );
	}
}

function _addScoreLine( Suit, Bids, Tricks, Scores, EndLine, Winner )
{
	var row = sprintf("<tr class='ScoreLine'><td>%s</td>",Suit);
	for ( var i = 0; i < Bids.length; i++ )
	{
		row = row + "<td>" + Bids[i] + "</td>";
		row = row + "<td>" + Tricks[i] + "</td>";
		row = row + "<td align='right' style='color:red;'>" + Scores[i] + "</td>";
	}
	row = row + "</tr>";
	$('#ScoreTable tr:last').after( row );
	if ( EndLine != undefined )
	{
		row = sprintf("<tr><td>Game %d</td><td colspan='%d'>%s</td></tr>",EndLine,Bids.length*3,Winner );
		$('#ScoreTable tr:last').after( row );
	}
}


function _initScores( Players )
{
	var i, row;
	// create the main scoreboard title
	row = sprintf("<td colspan='%d' align='center'><h4>Whist Score Board</h4></td>",1+(Players.length*3));
	$("#ScoresCaption").html(row);
	// erase all last scores
	$('#ScoreTable tr:gt(0)').remove();
	// add in the players sub title
	row = "<tr><td>Trumps</td>";
	for ( i = 0; i < Players.length; i++ )
	{
		row = row + "<td colspan='3'>" + Players[i].replace(/\"/g, '') + "</td>";
	}
	row = row + "</tr>";
	$('#ScoreTable tr:last').after( row );
}

