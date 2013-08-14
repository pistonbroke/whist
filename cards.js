//---------------------------------------------------------------------------
//
function Score()
{
	this.Bid = 0;
	this.Tricks = 0;
	this.SubTotal = 0;
	this.Calc = function(){
		this.SubTotal = parseInt(this.Tricks);
		if ( this.Bid == this.Tricks ) 
			this.SubTotal += 10;
		return this.SubTotal;
	}
}
//---------------------------------------------------------------------------
//
function Player( Forename, Position )
{
	this.Name = Forename;
	this.Index = Position;
	this.Total = 0;
	this.Bid = 0;
	this.Round = new Score;
}
//---------------------------------------------------------------------------
//
function AllPlayers()
{
	this.Count = 0;
	this.Selected = 0;
	this.Players = undefined;
	this.Empty = function()
	{
		this.Count = 0;
		this.Selected = 0;
		this.Players = [];
	}
	this.Load = function( PlayerNames )
	{
		this.Empty();
		try
		{
			this.Players[PlayerNames.length] = undefined;
			for ( var i = 0; i < PlayerNames.length; i++ )
			{
    			var newplayer = new Player( PlayerNames[i], 0 ) ; 
    			this.Players[i] = newplayer;
    			this.Count++;
			}
		}
		catch(e)
		{
			alert(e); 
		}
	}
	this.ByName = function ( PlayerName )
	{
		for ( var i = 0; i < this.Count; i++ )
		{
			if ( this.Players[i].Name == PlayerName )
				return this.Players[i];
		}
		return null;
	}
	this.ByIndex = function ( id )
	{
		for ( var i = 0; i < this.Count; i++ )
		{
			if ( this.Players[i].Index == id )
				return this.Players[i];
		}
		return null;
	}
	this.NameByIndex = function( id )
	{
		return this.Players[ id ].Name;
	}
}
//---------------------------------------------------------------------------
//
function Whist()
//window.CardGame.Whist = function()
{
	this.Players = new AllPlayers();
	this.Suits = undefined;
	this.TrumpsID = 0;
	this.FirstDealer = 0;
	this.Dealer = 1;
	this.NextBidder = 0;
	this.LastBidder = 0;
	this.MaxCards = 10;
	this.CardCount = 10;
	this.CardCountDir = -1; 
	this.HandNumber = 0;
	this.MaxHands = 13;
	this.SortOrder = 0;
	this.BidsThisRound = 0;
	//(function(){})();
	//-------------------------------------
	this.ShowInfo = function()
	{
		var Info;
		
		Info = sprintf("%s to deal %d cards (%s): Bids %d, Tricks %d",
			this.Players.ByIndex(this.Dealer).Name,
			this.CardCount,
			this.Suits[this.TrumpsID],
			this.CountBids( this.Players.Selected ),
			this.CountTricks( this.Players.Selected )
			);
		$('#GameInfo').text(Info);
	}
	//-------------------------------------
	this.IncrDealer = function( DealerNo )
	{
		var NewDealer;
			NewDealer = DealerNo + 1;
			if ( NewDealer > this.Players.Selected )
				NewDealer = 1;
		return NewDealer;	
	}
	//-------------------------------------
	this.DecrDealer = function( DealerNo )
	{
		var NewDealer;
			NewDealer = DealerNo - 1;
			if ( NewDealer <= 0 )
				NewDealer = this.Players.Selected;
		return NewDealer;	
	}
	//-------------------------------------
	this.CountBids = function (MaxPlayers)
	{
		var Bid, BidCount = 0;
  		for ( var i = 1; i <= MaxPlayers; i++ )
  		{
			Bid = parseInt($('#Bid_'+i).val());
			if ( ! isNaN( Bid ) )
			{
	  			BidCount += Bid;	
			}
  		}	
		return BidCount;
	}
	//-------------------------------------
	this.CountTricks = function (MaxPlayers)
	{
		var Trk, TrkCount = 0;
  		for ( var i = 1; i <= MaxPlayers; i++ )
  		{
			Trk = parseInt($('#Tricks_'+i).val());
			if ( ! isNaN( Trk ) )
	  			TrkCount += Trk;	
  		}	
		return TrkCount;
	}
	//-------------------------------------
	this.ShowStatus = function( Message )
	{
		if ( Message.length == 0 )
			$('#Bidding').hide();
		else
		{
			$('#Bidding').text(' ' + Message + ' ');
			$('#Bidding').show();
		}
		//this.MessageBox( 'Error...', Message );
	}
	//-------------------------------------
	this.MessageBox = function( Caption, Message )
	{
		$('#dialog').text( Message );
		$('#dialog').attr( 'title', Caption );
		$('#dialog').dialog();	
	}
	//-------------------------------------
	this.TotaliseTricks = function()
	{
		var Player, Tricks;
		for ( var id = 1; id <= this.Players.Selected; id++ )
		{
			Player = this.Players.ByIndex(id);
			Tricks = parseInt( $('#Sub_'+id).text() );
			if ( ! isNaN(Tricks) )
			{
				Player.Total += Tricks;
				$('#Tot_'+id).text( Player.Total );
			}
		}	
	}
	//-------------------------------------
	this.ClearLastHand = function ()
	{
		for ( var id = 1; id <= this.Players.Selected; id++ )
		{
			$('#Bid_'+id).attr( 'value','' );
			$('#Tricks_'+id).attr( 'value','' );
		}
		this.ShowInfo();	
	}
	//-------------------------------------
	this.NextGame = function()
	{
		var id, Playr;
		// erase the dealer prompt from all positions
		for ( var i = 1; i <= this.Players.Selected; i++ )
			$('#Dealing_'+i).text( ' ' );
		// its a new game so the dealer moves one to the right
		this.FirstDealer = this.IncrDealer( this.FirstDealer );
		this.Dealer = this.FirstDealer;
		this.NextBidder = this.IncrDealer( this.Dealer );
		this.LastBidder = this.DecrDealer( this.Dealer );
		$('#Dealing_'+this.Dealer).text( '*' );
		this.TrumpsID = (this.MaxCards == 8) ? 2 : 0 ;
		this.MaxHands = (this.MaxCards == 8) ? 9 : 13 ;
		this.HandNumber = 1;
		this.CardCount = this.MaxCards;
		this.CardCountDir = -1;
		$('#bNext').attr( "disabled", false );
		$("#bStart").attr( "disabled", true );
		id = this.Dealer;
		for ( var i = 1; i <= this.Players.Selected; i++ )
		{
			if ( id > this.Players.Selected ) { id = 1; }
			try
			{
				Playr = this.Players.ByIndex( id );
				if ( Playr != null )
				{
					Playr.Round.Bid = 0;
					Playr.Round.Tricks = 0;
					Playr.Total = 0;
					$('#Plyr_'+id).text(Playr.Name);
					$('#Sub_'+id).text( '0' );
					$('#Tot_'+id).text( '0' );
					$('#Bid_'+id).attr( 'value', '' );
					$('#Tricks_'+id).attr( 'value', '' );
				}
				id++;
			}
			catch(e)
			{
				alert(e);
			}
		}
		$('#Bid_'+this.NextBidder).focus();
		this.ClearLastHand();
		this.ShowInfo();
		$('#GameTable').find('input, textarea, button, select').attr('disabled',false);
    	$("#GameStatus").text('Hand '+this.HandNumber+' of '+this.MaxHands);
	}
	//-------------------------------------
	this.NextHand = function()
	{
		var Playr, LastDealer, id = 1, Cards = parseInt( this.CardCount );
		this.TotaliseTricks();
		this.ClearLastHand();
		$('#Bidding').hide();
		this.HandNumber++;
		if ( this.HandNumber > this.MaxHands )
		{
			// its game over !
			$('#bNext').attr( "disabled", true );
			$("#bStart").attr( "disabled", false );
			$('#GameTable').find('input, textarea, button, select').attr('disabled',true);
		}
		else
		{
			this.ClearLastHand();
			for ( var i = 1; i <= this.Players.Selected; i++ )
				$('#Dealing_'+i).text( ' ' );
			this.Dealer = this.IncrDealer( this.Dealer );
			this.LastBidder = this.DecrDealer( this.Dealer );
			this.NextBidder = this.IncrDealer( this.Dealer );
			Playr = this.Players.ByIndex( this.Dealer );
			$('#Dealing_'+this.Dealer).text( '*' );
			Cards = (Cards + this.CardCountDir);
			if ( Cards < 4 )
			{
				this.CardCountDir = 1;
				Cards = 5;
			}
			id = this.IncrDealer( this.Dealer );
			$('#Bid_'+id).focus();
			this.CardCount = Cards;
			this.TrumpsID++;
			if ( this.TrumpsID > this.Suits.lemgth )
				this.TrumpsID = (this.MaxCards == 8) ? 2 : 0 ;
	    	$("#GameStatus").text('Hand '+this.HandNumber+' of '+this.MaxHands);
		}
		this.ShowInfo();
	}
	//-------------------------------------
	this.BidCheck = function (id) 
	{
		var NotPermitted;
		$('#Bidding').hide();
	  	if ( this.Dealer == id )
	  	{
	  		this.BidsThisRound = this.CountBids(this.Players.Selected);
	  		if ( this.BidsThisRound <= this.CardCount )
	  		{
	  			NotPermitted = this.CardCount - this.BidsThisRound;	
	  			this.ShowStatus('Dealer cannot call '+NotPermitted);
	  		}	
	  	}
	}
	//-------------------------------------
	this.BidWatch = function(id) 
	{
		var Playr = this.Players.ByIndex( id );
		
		Playr.Bid =  parseInt($('#Bid_'+id).val());
  		var BadBid, Bid, TotalBids = 0;
  		this.BidsThisRound = this.CountBids(this.Players.Selected);
  		for ( var i = 1; i <= this.Players.Selected; i++ )
  		{
			Bid = parseInt($('#Bid_'+i).val());
			if ( ! isNaN( Bid ) )
			{
	  			if ( i != this.Dealer )
	  				TotalBids += Bid;	
			}
  		}	
	  	if ( id == this.Dealer )
	  	{
	  		if ( TotalBids == this.CardCount )
	  		{
	  			this.ShowStatus('Dealer cannot bid 0');
	  			return;	
	  		}
	  		TotalBids = (this.CardCount-(Playr.Bid+TotalBids));
	  		if ( TotalBids > 0 )
		  		this.ShowStatus('Bids are '+ TotalBids + ' under');
	  		else if ( TotalBids < 0 )
		  		this.ShowStatus('Bids are '+ -TotalBids + ' over');
	  		else
	  		{
		  		//alert('Bids are +0 - Change now !');
		  		this.ShowStatus('Bids = '+this.CardCount+' - Change now !', {} );
		  		$('#Bid_'+id).focus();
		  		$('#Bid_'+id).effect("highlight", {}, 3000);
		  	}
	  	}
	  	else if ( id == this.LastBidder )
	  	{
	  		if ( TotalBids <= this.CardCount )
	  		{
	  			if ( TotalBids < this.CardCount )
	  				this.ShowStatus('Dealer cannot bid '+ (this.CardCount-TotalBids) );	
	  			else
	  				this.ShowStatus('Dealer cannot bid 0');	
	  		}
	  	}
	  	$("#bNext").attr( "disabled", true );
	}
	//-------------------------------------
	this.SubTotal = function(id)
	{
		var Bid, Trk, Points, TrkCnt = 0;
		Bid = parseInt($('#Bid_'+id).val());
		if ( ! isNaN(Bid) )
		{
			Trk = parseInt($('#Tricks_'+id).val());
			if ( ! isNaN(Trk) )
			{
				Points = Trk;
				if ( Trk === Bid )
					Points += 10;
				$('#Sub_'+id).text(Points)
				for ( var i = 1; i <= this.Players.Selected; i++ )
				{
					Trk = parseInt($('#Tricks_'+i).val());
					if ( ! isNaN(Trk) )
						TrkCnt++;					
				}
				$("#bNext").attr( "disabled", ( this.Players.Selected  > TrkCnt ) );
			}
		}
		this.ShowInfo();
	}
	//-------------------------------------
	this.UpdateResults = function()
	{
		var Points = 0;
		var Playr, NameCell, BidCell, TrickCell, SubTotCell, TotCell;
    	var Bid, Trick;
		for ( var i = 1; i <= this.Players.Selected; i++ )
		{
			BidCell = $('#Bid_'+i);	
			TrickCell = $('#Tricks_'+i);	
    		Bid = BidCell.val();
    		Trick = TrickCell.val();
    		if ( Bid === '' || Trick === '' )
    			return;
		}
		for ( var i = 1; i < this.Players.Count; i++ )
		{
			try
			{
				NameCell = $('#Plyr_'+i);	
				BidCell = $('#Bid_'+i);	
				TrickCell = $('#Tricks_'+i);	
				SubTotCell = $('#Sub_'+i);	
				TotCell = $('#Tot_'+i);
				Playr = this.Players.ByName( $(NameCell).text() );
				if ( Playr != null )
				{
					Playr.Round.Bid = parseInt(BidCell.val());
					Playr.Round.Tricks = parseInt(TrickCell.val());
					Points = Playr.Round.Calc();
					Playr.Total += Points;
					SubTotCell.text( Points );
					TotCell.text( Playr.Total );
				}
			}
			catch(e)
			{
				alert(e);
			}
		}
		if ( (this.CardCount == this.MaxCards) && (this.CardCountDir > 0) )
		{
			// its game over !
			$('#bNext').attr( "disabled", true );
			$("#bStart").attr( "disabled", false );
		}
		this.ShowInfo();
	}
	//-------------------------------------
	this.AssignPlayer = function (cb_name)
	{
    	var ndx = cb_name.substring(5,cb_name.length);
    	var id = '#psn'+ndx;
    	var newval = 0, oldval = $(id).text();
    	if ( $('#'+cb_name).attr('checked') )
    	{
    		this.SortOrder++;
	    	this.Players.Selected++;
    		this.Players.Players[ndx].Index = this.SortOrder;
	    	$(id).text(this.Players.Selected);
    	}
	    else
	    {
	    	$(id).text('');
	    	this.SortOrder--;
	    	this.Players.Selected--;
	    	for ( var i = 1; i < this.Players.Count; i++ )
	    	{
	    		id = '#psn'+i;
	    		newval = $(id).text();
	    		if ( newval > oldval )
	    		{
	    			$(id).text(newval-1);
	    			this.Players.Players[ndx].Index = newval-1;
	    		}
	    	}
	    }
	    this.MaxCards = ( this.Players.Selected > 5 ) ? 8 : 10 ;
	}
	//-------------------------------------
    this.LoadSuits = function ()
    {
    	try {
    		var slct;
			var suitarray[] = 'Clubs\nDiamonds\nSpades\nHearts\nNone' ;
			for ( var i = 1; i <= 5; i++ )
			{
				slct = $( "#SuitPlay" + i ).attr('value');
				suitarray[slct] =  $( "#Suit" + i ).text();
			}
			this.Suits = undefined;
	    	for ( var a = 0; a < 3; a++ )
	    		for( var b = 0; b < 5; b++ )
	    			this.Suits.push(suitarray[b]);
    	} catch(e) { alert(e); }
    }
    //-------------------------------------
	this.LoadPlayers = function()
	{
		var names = GetFile( 'players.txt' );
		$("#PlayerNames").attr('value', names );
		$("#PlayerNames").hide();
		names = 'Dummy\n' + names;
		this.Players.Load( names.split('\n') );
		var id, row;
		$('#PlayerTable tr:gt(0)').remove();
		for ( var i = 1; i < this.Players.Count; i++ )
		{
			row = sprintf( "<tr id='r%d'><td><span id='pn%d'>%s</span></td><td><input id='inuse%d' class='in_use' type='checkbox'/></td><td><span id='psn%d'></span></td></tr>",
				i, i, this.Players.NameByIndex(i), i, i );
			$('#PlayerTable tr:last').after( row );
		}
		this.SortOrder = 0;
	}
	//-------------------------------------
	this._TableRow = function( playr )
	{
		var ThisPlayer = this.Players.ByIndex(playr) ;
		if ( ThisPlayer != null )
		{
			row = '<tr>';
			td = sprintf( "<td><span id='Dealing_%d'> </span></td><td><span id='Plyr_%d'>%s</span></td>", playr, playr, ThisPlayer.Name );
			row = row + td;
			td = sprintf( "<td><input class='Bids' type='text' id='Bid_%d' size='2' onkeyup='javascript:window.CardGame.BidWatch(%d);' onclick='javascript:window.CardGame.BidCheck(%d);'></td>", playr, playr, playr );
			row = row + td;
			td = sprintf( "<td><input class='Tricks' type='text' id='Tricks_%d' size='2' onkeyup='javascript:window.CardGame.SubTotal(%d);'></td>", playr, playr );
			row = row + td;
			td = sprintf( "<td><span class='ReqScore' id='Sub_%d'>00</span></td>", playr );
			row = row + td;
			td = sprintf( "<td><span class='TotScore' id='Tot_%d'>0</span></td>", playr );
			row = row + td;
			row = row + '</tr>';
			$('#GameTable tr:last').after( row );
		}
	}
    this.LoadGame = function()
    {
		var ThisPlayer, playr, i, row, td;
		$('#GameTable tr:gt(0)').remove();
		for ( i = 1; i <= this.Players.Selected; i++ )
		{
			this._TableRow( i );
		}
		this.FirstDealer = 0;
		this.Dealer = this.FirstDealer;
		this.LastBidder = this.DecrDealer( this.Dealer );
		this.NextBidder = this.IncrDealer( this.Dealer );
		this.MaxCards = $('#cph').val();
		this.MaxHands = (this.MaxCards == 8) ? 9 : 13 ;
		this.TrumpsID = (this.MaxCards == 8) ? 2 : 0 ;
		this.HandNumber = 1;
    	this.BidsThisRound = 0;
    	$("#bNext").attr( "disabled", true );
    	$("#bStart").attr( "disabled", false );
    	$('#Bidding').hide();
		$('#GameTable').find('input, textarea, button, select').attr('disabled',true);
    }
}
//---------------------------------------------------------------------------
//
function setCookie(c_name,value,exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;;
}
//---------------------------------------------------------------------------
//
function readCookie(name) 
{
    var cookies = document.cookie.split(';'),
        length = cookies.length,
        i,
        cookie,
        nameEQ = name + '=';
    for (i = 0; i < length; i += 1) {
        cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return unescape(cookie.substring(nameEQ.length, cookie.length));
        }
    }
    return null;
}
//---------------------------------------------------------------------------
//
function eraseCookie(name) 
{
    setCookie(name, '', -1);
}
//---------------------------------------------------------------------------
//
function a1()
{
}			
//---------------------------------------------------------------------------
//
function a2()
{
}			

