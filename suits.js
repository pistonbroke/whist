/*
 * suits.js
 * 03.03.13
 * PJT
 */

var TrumpList = new Array();
var TrumpsIndex;

function _initSuits()
{
	try
	{
		var SuitLst = new Array();
		var SuitCnt;
		var SuitsStr;
		SuitsStr = localStorage[ "SuitOrder" ];
		// there may not be any data saved yet
		if( typeof SuitsStr == 'undefined' || SuitsStr.length < 5 )
		{
			SuitsStr = "0,1,2,3,4,5";
			localStorage[ "SuitOrder" ] = SuitsStr;
		}
		SuitLst = SuitsStr.split(",");
		SuitCnt = SuitLst.length;
		//$("#autoSave").attr("checked",( self.location.hostname.indexOf("www") < 0 ));
		for ( var i = 1; i <= 5; i++ )
		{
			$('#siu_'+i).attr("checked",true);
			if ( SuitCnt != 6 )
				$('#spos_'+i).text(i);
			else
				$('#spos_'+i).text(SuitLst[i]);
		}
		$("#status").text(self.location.hostname);
	}
	catch(e)
	{
		alert(e);
	}
}

function _DefaultSuits()
{
	localStorage[ "SuitOrder" ] = '0,1,2,3,4,5';
	_initSuits();	
}

function _clearSuits()
{
	try
	{
		for ( var i = 1; i <= 5; i++ )
		{
			$('#siu_'+i).attr("checked",false);
			$('#spos_'+i).text('X');
		}
	}
	catch(e)
	{
		alert(e);
	}
}

function _changeSuits( CheckBox )
{
	try
	{
		var cbName = $(CheckBox).attr('id');
		var ndx = cbName.substring(4);
		var DivName, SuitOrder, MaxSuit = 0;
		DivName = '#spos_'+ndx;
		$(DivName).text('X');	
		if ( $(CheckBox).is(':checked') )
		{
			for ( var i = 1; i <= 5; i++ )
			{
				if ( $('#siu_'+i).is(':checked') )
				{
					SuitOrder = parseInt($('#spos_'+i).text());
					if ( SuitOrder > MaxSuit )	
						MaxSuit = SuitOrder;
				}
			}
			SuitOrder = MaxSuit+1;
			$(DivName).text(SuitOrder);	
		}
	}
	catch(e)
	{
		alert(e);
	}
}

function _useSuits()
{
	try
	{
		var SuitList = new Array();
		var SuitOrder;
    	$("#tabs").tabs( "enable" , 1 );
    	$("#tabs").tabs( "disable" , 3 );
    	$("#suits").hide();
    	$("#players").show();
    	$("#tabs").tabs( "option", "active", 1 );
    	$('#cph').attr( 'disabled', false );
    	$('#cph').attr( 'value', 10 );
    	//
    	TrumpList.length = 0;
    	for ( var a = 1; a < 4; a++ )
    	{
    		for ( var b = 1; b <= 5; b++ )
    		{
    			for ( var c = 1; c <= 5; c++ )
    			{
    				SuitOrder = parseInt($('#spos_'+c).text());
    				if ( SuitOrder == b )
    				{
    					window.TrumpList.push( $('#suit_'+c).text() );
    					break;
    				}	
    			}
    		}
    	}
    	SuitList.push('0');
    	for ( var i = 1; i <= 5; i++ )
    		SuitList.push( parseInt($('#spos_'+i).text()) );
    	localStorage[ "SuitOrder" ] = SuitList;
 	}
	catch(e)
	{
		alert(e);
	}
}

