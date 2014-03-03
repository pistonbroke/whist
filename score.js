/*
 * score.js
 * 05/03/13
 * PJT
 */
var PlayerCount;
var db = openDatabase ("WhistScoreboard", "1.0", "Scores", 65535);

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

function _InitDB()
{
    //Check databases are supported
    if(openDatabase){
        //Open a database transaction
        db.transaction(function(tx){
            //Execute an SQL statement to create the table "tblDemo" 
            //only if it doesn't already exist                
            tx.executeSql('CREATE TABLE IF NOT EXISTS tbl_Players ('
                           + 'personId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,'
                           + 'personName VARCHAR(20)'
                           + ');',[],nullData,errorHandler);
            tx.executeSql('DELETE FROM tbl_Players',[],nullData,errorHandler);
            tx.executeSql('CREATE TABLE IF NOT EXISTS tbl_Suits ('
                           + 'suitId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,'
                           + 'suitName VARCHAR(8)'
                           + ');',[],nullData,errorHandler);
            tx.executeSql('CREATE TABLE IF NOT EXISTS tbl_GameCtrl ('
                           + 'handId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,'
                           + 'played INTEGER,'
                           + 'cardCount INTEGER,'
                           + 'trumps VARCHAR(20)'
                           + ');',[],nullData,errorHandler);
            tx.executeSql('CREATE TABLE IF NOT EXISTS tbl_Scores ('
                           + 'handNumber INTEGER,'
                           + 'personNumber INTEGER,'
                           + 'bid INTEGER,'
                           + 'tricks INTEGER,'
                           + 'subTotal INTEGER'
                           + ');',[],nullData,errorHandler);
        });

        //Open a new transaction
        db.transaction(function(tx){
            //Exexute an INSERT with the name, age and favourite colour, 
            //we set values outside the SQL string for added security and 
            //to prevent SQL injections, the values are represented with "?"
            tx.executeSql('INSERT INTO tblDemo ('
                           + 'personName, personAge, personColour)'
                           + 'VALUES (?, ?, ?);'
                           ,[txtName,intAge,txtColour],nullData,errorHandler);
        });
    }	
} 
   
function _SaveScores( quiet )
{
}

function _LoadScores()
{
}

function _addScoreLine( Suit, Bids, Tricks, Scores, EndLine, Winner )
{
	var row = sprintf("<tr class='ScoreLine'><td>%s</td><td>%d</td>",Suit,HandIndex);
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
	row = sprintf("<td colspan='%d' align='center'><h4>Whist Score Board</h4></td>",2+(Players.length*3));
	$("#ScoresCaption").html(row);
	// erase all last scores
	$('#ScoreTable tr:gt(0)').remove();
	// add in the players sub title
	row = "<tr><td>Trumps</td><td>#</td>";
	for ( i = 0; i < Players.length; i++ )
	{
		row = row + "<td colspan='3'>" + Players[i].replace(/\"/g, '') + "</td>";
	}
	row = row + "</tr>";
	$('#ScoreTable tr:last').after( row );
}

