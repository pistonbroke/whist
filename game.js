/*
 * game.js
 * 03.03.13
 * PJT
 */

// players
var GameCount;
var OriginalDealer;
var DealerIndex;
var FirstCaller;
var MaxPlayers;

// cards
var MaxCards;
var CardCount;
var CardIncr;

// hands
var MaxHands;
var HandIndex;
var BidsState;
var TotLokState;

// scores
var TotalBids;
var TotalTricks;
var InvalidDealerTricks;

function Play( AudioFile )
{
	var audio = new Audio( AudioFile );
	audio.play();
}

function ShowDealerPrompt()
{
	var Info;
	$("#TotalBids").text(TotalBids);
	$("#TotalTricks").text(TotalTricks);
	Info = sprintf("Round %d: %s to deal %d cards (%s)",
		HandIndex+1,
		$("#Plyr_"+DealerIndex).text(),
		CardCount,
		TrumpList[TrumpsIndex]
		);
	$('#Bidding').text(Info);
	$("#Bidding").show();
	Info = sprintf("%s (%d)", TrumpList[TrumpsIndex], CardCount );
	$("#Trumps").text( Info );
	$("#Trumps").show();
}

function preDealer()
{
	var id = DealerIndex - 1;
	if ( id < 0 ) 
		id = MaxPlayers-1;
return id;
}
function aftDealer()
{
return nextPlayerId(DealerIndex);
}
function nextPlayerId( PlayerId )
{
	var id = PlayerId + 1;
	if ( id >= MaxPlayers ) 
		id = 0;
return id;
}
function SetDealer( Index )
{
	try
	{
		$(".Dealers").text(" ");
		$(".Plyrs").css('color', $("#Trumps").css('color') );
		DealerIndex = Index;
		FirstCaller = nextPlayerId( Index );
		$("#Dealing_"+Index).text('*');
		$("#Plyr_"+Index).css('color','Lime');
		$(".Bids").attr("value","-1");
		_LockTrks();
		$("#bNext").attr("disabled",true);
		$("#bNext").css('background-color','DarkGray');
		_LockBids();
		_UnlockBids( FirstCaller );
	}
	catch(e)
	{
		alert(e);
	}
}

function _LockBids( Index )
{
	if ( Index === undefined )
	{
		BidsState = true;
		$(".Bids").hide();
		$(".SavedBids").show();
		$("#ClearBids").hide();
		$("#TotalBids").show();
	}
	else 
	{
		$("#Bid_"+Index).hide();
		$("#SavedBid_"+Index).show();
	}	
}
function _UnlockBids( Index )
{
	if ( Index === undefined )
	{
		BidsState = false;
		$(".Bids").show();
		$(".SavedBids").hide();
		$("#ClearBids").show();
		$("#TotalBids").hide();
	}	
	else 
	{
		$("#Bid_"+Index).show();
		$("#SavedBid_"+Index).hide();
	}	
}
function _ToggleBidsLock()
{
	if ( BidsState ) _UnlockBids();
	else 
	{
		_LockBids();
		NewBid( DealerIndex );
	}
}

function _ClearAllBids()
{
	$(".Bids").attr("value","-1");
	$(".Bids").show();	
	$("#TotalBids").text( '' );
	$(".SavedBids").text( '' );
	TotalBids = 0;
}

function _LockTrks()
{
	//$(".Tricks").attr("disabled",true);	
	$(".Tricks").attr("value","-1");
	$(".Tricks").hide();
	$(".incrTrick").hide();
}

function _UnlockTrks()
{
	//$(".Tricks").attr("disabled",false);
	$(".Tricks").show();
	$(".incrTrick").show();
}

function _UnlockTots()
{
	TotLokState = false;
	$(".TotScore").attr( "readonly", TotLokState );
	$(".TotScore").css('color', 'Black' );	
	$(".TotScore").css('background-color', 'Yellow' );	
}

function LockTots()
{
	TotLokState = true;
	$(".TotScore").attr( "readonly", TotLokState );
	$(".TotScore").css('color', $("#Sub_1").css('color') );	
	$(".TotScore").css('background-color', $("#Sub_1").css('background-color') );	
}

function _ToggleTotsLock( LockState )
{
	if ( LockState != undefined )
		TotLokState = LockState;
	if ( TotLokState )
	{
		$(".TotScore").attr( "readonly", TotLokState );
		$(".TotScore").css('color', $("#Sub_1").css('color') );	
		$(".TotScore").css('background-color', $("#Sub_1").css('background-color') );	
	}	
	else
	{
		$(".TotScore").attr( "readonly", TotLokState );
		$(".TotScore").css('color', 'Black' );	
		$(".TotScore").css('background-color', 'Yellow' );	
	}
	TotLokState = ! TotLokState;
}

function NewBid(id)
{
	var InfoLine, Bid, DealerBid, BidCnt = 0;
	DealerBid = parseInt($('#Bid_'+id).val());
	TotalBids = 0;
	if ( !isNaN( DealerBid ) && DealerBid >= 0 )
	_UnlockBids( nextPlayerId(id) );
	for ( var i = 0; i < MaxPlayers; i++ )
	{
		Bid = parseInt($('#Bid_'+i).val());
		if ( ! isNaN( Bid ) && Bid >= 0 )
		{
  			if ( i != DealerIndex )
  				TotalBids += Bid;	
  			BidCnt++;
		}
	}
	$("#SavedBid_"+id).text( $('#Bid_'+id).val() );
	if ( BidsState )
	{
		ShowDealerPrompt();
		if ( id == preDealer() )
		{
			if ( TotalBids > CardCount )
			{
				InfoLine = "Dealer can call anything";	
			}
			else
			{
				InvalidDealerTricks = CardCount - TotalBids;
				InfoLine = sprintf( "Dealer cannot call %d", InvalidDealerTricks );	
			}
			$("#Bidding").text( ' ' + InfoLine + ' ' );
		}	
		else if ( id == DealerIndex )
		{
			_LockBids();
			$("#UnlockBids").attr("disabled",false);
			TotalBids += DealerBid;
			$("#TotalBids").text( TotalBids );
			if ( TotalBids > CardCount )
			{
				InfoLine = sprintf("Bids are %d over",TotalBids-CardCount);
				_UnlockTrks();
			}
			else if ( TotalBids < CardCount )
			{
				InfoLine = sprintf("Bids are %d under",CardCount-TotalBids);
				_UnlockTrks();
			}
			else
			{
				Play("computersaysno.wav");
				InfoLine = sprintf("Dealer cannot call %d try again",InvalidDealerTricks);
				_LockTrks();
				_UnlockBids();
				BidsState = true;
				$("#UnlockBids").attr("disabled",true);
			}
			$("#Bidding").text( ' ' + InfoLine + ' ' );
		}
	}
}

function IncTrick(id)
{
	if ( $("#Tricks_"+id).is(":visible") )
	{
		var Trick = parseInt($('#Tricks_'+id).val());
		if ( Trick < 0 ) Trick++;
		$("#Tricks_"+id).attr("value",Trick+1);
		NewTrick(id);
		$("#Bidding").text( '>' );
		Play("button-7.wav");
	}
}

function TricksOK(id)
{
	if ( $("#Tricks_"+id).is(":visible") )
	{
		var Trick = parseInt($('#Bid_'+id).val());
		$("#Tricks_"+id).attr("value",Trick);
		NewTrick(id);
		$("#Bidding").text( '>' );
		Play("button-7.wav");
	}
}

function NewTrick(id)
{
	TotalTricks = 0;
	var Trick, Bid, InfoTxt = '', TrickCnt = 0;
	if ( parseInt($('#Tricks_'+id).val()) == -2 )
	{
		$('#Tricks_'+id).attr( 'value', parseInt($('#Bid_'+id).val()) );
		Play( "cash.wav" );
	}
	for ( var i = 0; i < MaxPlayers; i++ )
	{
		Trick = parseInt($('#Tricks_'+i).val());
		if ( ! isNaN( Trick ) && Trick >= 0 )
		{
  			TotalTricks += Trick;	
  			TrickCnt++;
		}
	}
	Bid = parseInt($('#Bid_'+id).val());
	Trick = parseInt($('#Tricks_'+id).val());
	if ( Bid == Trick ) 
		Trick += 10;
	$("#Sub_"+id).text(Trick);
	ShowDealerPrompt();	
	_ToggleTotsLock(true);
	if ( TrickCnt == MaxPlayers )
	{
		if ( TotalTricks == CardCount )
		{
			$("#bNext").attr("disabled",false);
			$("#bNext").css('background-color','Lime');
			$("#TotalTricks").css('background-color', $("#Trumps").css('background-color') );
			InfoTxt = "Hand over";
		}
		else
		{
			$("#TotalTricks").css('background-color', 'Red' );
			Play( 'computersaysno.wav' );
			if ( TotalTricks > CardCount )
			{
				InfoTxt = sprintf( "There are %d too many tricks", TotalTricks - CardCount ) ;
			}
			else // ( TotalTricks < CardCount )
			{
				InfoTxt = sprintf( "There are %d too few tricks", CardCount - TotalTricks ) ;
			}
		}
		$("#Bidding").text( InfoTxt );	
	}
}

function _GameTableRow( Index, PlayerName )
{
	try
	{
		var i;
		row = '<tr>';
		// create the current dealer '*' cell and the player name cell
		td = sprintf( "<td><span id='Dealing_%d' class='Dealers'> </span></td><td><span id='Plyr_%d' class='Plyrs' onClick='javascript:IncTrick(%d)'>%s</span></td>", Index, Index, Index, PlayerName );
		row = row + td;
		// add the bids drop-down cell
		td = sprintf("<td><select class='Bids' id='Bid_%d' onChange='javascript:NewBid(%d)'><option selected value = -1></option>",Index,Index);
		row = row + td;
		for ( i = 0; i <= MaxCards; i++ )
		{
			td = sprintf("<option value=%d>%d</option>",i,i);
			row = row + td;	
		}
		td = sprintf("</select><div class='SavedBids' id='SavedBid_%d' style='text-align:center;' onClick='javascript:TricksOK(%d)' ></div></td>",Index,Index);
		row = row + td;
		// add the tricks drop-down cell
		td = sprintf("<td><select class='Tricks' id='Tricks_%d' onChange='javascript:NewTrick(%d)'><option selected value = -1></option>",Index,Index);
		row = row + td;
		td = sprintf("<option value=%d>Yes</option>",-2);
		row = row + td;	
		for ( i = 0; i <= MaxCards; i++ )
		{
			td = sprintf("<option value=%d>%d</option>",i,i);
			row = row + td;	
		}
		td = "</select></td>";
		row = row + td;
		// add the current hand score cell
		td = sprintf( "<td><span class='ReqScore' id='Sub_%d'>0</span></td>", Index );
		row = row + td;
		// add the running total score cell
		td = sprintf( "<td><input class='TotScore' id='Tot_%d' type='text' readonly='readonly' style='width: 80px;' /></td>", Index );
		row = row + td;
		row = row + '</tr>';
		$('#GameTable tr:last').after( row );
	}
	catch(e)
	{
		alert(e);
	}
}

function _initGame( Players )
{
	try
	{
		var StatusRow; 
		BidsState = false;
		TotLokState = true;
		GameCount = 0;
		OriginalDealer = 0;
		MaxPlayers = Players.length;
		// cards count = 5..10
		MaxCards = parseInt( $("#cph").val() );
		CardCount = MaxCards;
		CardIncr = -1;
		$('#GameTable tr:gt(0)').remove();
		for ( var i = 0; i < MaxPlayers; i++ )
		{
			$('#GameTable tr:last').after( _GameTableRow( i, Players[i] ) );
		} 
		StatusRow = "<tr>";
		StatusRow = StatusRow + "<td colspan=2><div id='Trumps'>....</div><button type='button' id='bStart' onClick='javascript:_startGame();'>Start</button></td>";
		StatusRow = StatusRow + "<td align='center'><div id='TotalBids'>....</div><button id='ClearBids' onClick='javascript:_ClearAllBids();'>CLR</button></td><td><div id='TotalTricks'>....</div></td>";
		StatusRow = StatusRow + "<td colspan=2 align='center'><button type='button' id='bNext' onClick='javascript:_nextHand();'>Next Hand</button></td>";
		StatusRow = StatusRow + "</tr>";
		$('#GameTable tr:last').after( StatusRow );
		StatusRow = "<tr>";
		StatusRow = StatusRow + "<td colspan=6 style='color: black; background-color: #FFFF00; '><span id='Bidding'>&nbsp;</span></td>";
		StatusRow = StatusRow + "</tr>";
		$('#GameTable tr:last').after( StatusRow );
		
		//$('#Bids').val(0).gentleSelect("update");
		//$('#Tricks').val(0).gentleSelect("update");
				
		TrumpsIndex = 10 - MaxCards;
		MaxHands = (((MaxCards - 4) * 2) + 1);
		HandIndex = 0;
		_LockTrks();
		_LockBids();
		$('#GameTable').attr("disabled",true);
		$('#GameInfo').text('');
		$("#bStart").show();
		$("#bNext").hide();
		$("#Trumps").hide();
		$("#ClearBids").hide();
		$("#UnlockBids").attr("disabled",true);
		$("#UnlockTrks").attr("disabled",true);
		_initScores( Players );
		$(".ReqScore").text('');
		$(".TotScore").text('');
		_ToggleTotsLock(true);
	}
	catch(e)
	{
		alert(e);
	}
}

function _startGame()
{
	try
	{
		$("#tabs" ).tabs( { disabled: [0,1] } );
		$("#GameTable").attr("disabled",false);
		$("#bStart").hide();
		$("#bNext").attr("disabled",true);
		$("#bNext").css('background-color','DarkGray');
		$("#bNext").show();
		_LockTrks();
		_LockBids();
		_UnlockBids( aftDealer() );
		$("#TotalBids").text('0');
		$("#TotalTricks").text('0');
		MaxHands = (((MaxCards - 4) * 2) + 1);
		HandIndex = 0;
		CardCount = MaxCards;
		CardIncr = -1;
		TrumpsIndex = (10 - MaxCards);
		SetDealer(OriginalDealer);
		ShowDealerPrompt();
		$(".SavedBids").text('');
		$("#TotalBids").text('');
		$("#TotalTricks").text('');
		$(".TotScore").val('0');
		$(".ReqScore").text('0');
		_ToggleTotsLock(true);
	}
	catch(e)
	{
		alert(e);
	}
}

function VisitScores()
{
	$("#tabs").tabs( "option", "active", 3 );	
	_SaveScores();
}

function _nextHand()
{
var i, id, Bid, Trick, Score, Total, Suit = TrumpList[TrumpsIndex];
var BidLst = new Array();
var TrkLst = new Array();
var ScoreLst = new Array();
var WinnerLst = new Array();
	try
	{
		for ( id = 0; id < PlayerList.length; id++ )
		{
			Bid = parseInt($('#Bid_'+id).val());
			Trick = parseInt($('#Tricks_'+id).val());
			Score = parseInt($('#Sub_'+id).text());
			Total = Score + parseInt($('#Tot_'+id).val());
			$('#Tot_'+id).val( Total );
			BidLst.push( Bid );
			TrkLst.push( Trick );
			ScoreLst.push( Total );
		}		
		SetDealer( aftDealer() );
		TrumpsIndex++;
		HandIndex++;
		CardCount += CardIncr;
		if ( CardCount < 4 )
		{
			CardCount = 5;
			CardIncr = 1;
			_addScoreLine( Suit, BidLst, TrkLst, ScoreLst );
		}
		else if ( CardCount > MaxCards )
		{
			_LockTrks();
			_LockBids();
			Total = -1;
			for ( i = 0; i < ScoreLst.length; i++ )
			{
				if ( ScoreLst[i] > Total )
				{
					Total = ScoreLst[i];
					id = i;
				}
			}
			WinnerLst.length = 0;
			for ( i = 0; i < ScoreLst.length; i++ )
			{
				if ( ScoreLst[i] >= Total )
				{
					WinnerLst.push( PlayerList[i] );
				}
			}
			OriginalDealer = nextPlayerId( OriginalDealer );
			var WinningState;
			var Winners = Array2String( WinnerLst );
			if ( WinnerLst.length > 1 )
				WinningState = Winners.replace(/,/g, ' and ') + ' are drawn !';
			else
				WinningState = PlayerList[id] + ' Wins !';
			$("#Bidding").text( ' Game Over >>>> ' + WinningState );
			_addScoreLine( Suit, BidLst, TrkLst, ScoreLst, ++GameCount, WinningState );
			$("#bStart").show();
			$("#bNext").hide();	
			Play("applause-1.wav");
			window.setTimeout(function() { VisitScores(); }, 10000 );
			//$("#tabs").tabs( "option", "active", 3 );
			return;
		}	
		else
		{
			_addScoreLine( Suit, BidLst, TrkLst, ScoreLst );
		}
		//if ( $("#autoSave").is(':checked') ) _SaveScores(0);
		ShowDealerPrompt();
		$(".SavedBids").text('');
		$("#TotalBids").text('');
		$("#TotalTricks").text('');
		_ToggleTotsLock(true);
	}
	catch(e)
	{
		alert(e);
	}
}
