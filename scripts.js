	
	$(document).ready(function(){

		JSONarray = $('body > div').attr('data-init');
		arr = eval(JSONarray);
		for (i=1;i<=9;i++) {
			$('body > div div:nth-child('+i+')').attr('data-number',arr[i-1]);
		}
		numsInPositions = [[],[],[]];
		posXOfNumbers = [];
		posYOfNumbers = [];
		for (i=0;i<3;i++) for (j=0;j<3;j++) {
			numsInPositions[i][j] = arr[i*3+j];
			posXOfNumbers[arr[i*3+j]] = j;
			posYOfNumbers[arr[i*3+j]] = i;
		}

		if (!window.BlobBuilder && window.WebKitBlobBuilder) window.BlobBuilder = window.WebKitBlobBuilder;
		if (!window.storageInfo && window.webkitStorageInfo) window.storageInfo = window.webkitStorageInfo;
		if (!window.requestFileSystem && window.webkitRequestFileSystem) window.requestFileSystem = window.webkitRequestFileSystem;

	})


	function switchPositions(ax,ay,bx,by) {

		numA = numsInPositions[ay][ax];
		numB = numsInPositions[by][bx];
		var tmp = numsInPositions[ay][ax];
		arr[ay*3+ax] = numsInPositions[ay][ax] = numsInPositions[by][bx];
		arr[by*3+bx] = numsInPositions[by][bx] = tmp;
		posXOfNumbers[numA] = bx;
		posYOfNumbers[numA] = by;
		posXOfNumbers[numB] = ax;
		posYOfNumbers[numB] = ay;
		
		$('body > div > div[data-number='+(numsInPositions[ay][ax])+']').attr('data-number',0);
		$('body > div > div[data-number='+(numsInPositions[by][bx])+']').attr('data-number',numsInPositions[ay][ax]);
		$('body > div > div[data-number=0]').attr('data-number',numsInPositions[by][bx]);

		freeIndexX = bx;
		freeIndexY = by;
	}

	$('body > div > div').draggable({
		start:function(event,ui){
			freeIndex = $( "body > div > div" ).index( this );
			freeIndexX = freeIndex%3;
			freeIndexY = Math.floor(freeIndex/3);
		},


		drag:function( event, ui ){
			$(this).css({color:'red',borderColor:'red',zIndex:10});

			var index = $( "body > div > div" ).index( this );
			var indexX = posXOfNumbers[$(this).attr('data-number')];
			var indexY = posYOfNumbers[$(this).attr('data-number')];
			console.log(posXOfNumbers[$(this).attr('data-number')],' | ',indexY);

			//ui.position.left = Math.floor(ui.position.left/100)*100;
			//ui.position.top = Math.floor(ui.position.top/100)*100;

			console.log(ui.position.top+' '+ui.position.left+' | '+indexY+' '+indexX);
			if (ui.position.top+indexY*100<0) ui.position.top=-indexY*100;
			if (ui.position.top+indexY*100>200) ui.position.top=200-indexY*100;
			if (ui.position.left+indexX*100<0) ui.position.left=-indexX*100;
			if (ui.position.left+indexX*100>200) ui.position.left=200-indexX*100;

			try {
				if ((nextIndexX!=freeIndexX) || (nextIndexY!=freeIndexY))
					$($('body > div > div[data-number='+(numsInPositions[nextIndexY][nextIndexX])+']')).css({color:'inherit',borderColor:'gray',zIndex:10});
			} catch(e) {
			}

			nextIndexX = Math.round(ui.position.left/100)+freeIndexX;
			nextIndexY = Math.round(ui.position.top/100)+freeIndexY;

			if ((nextIndexX!=freeIndexX) || (nextIndexY!=freeIndexY))
				$($('body > div > div[data-number='+(numsInPositions[nextIndexY][nextIndexX])+']')).css({color:'blue',borderColor:'blue',zIndex:5});


			console.log(freeIndexY,freeIndexX,nextIndexY,nextIndexX);


		},


		stop:function( event, ui ){


			if ((nextIndexX!=freeIndexX) || (nextIndexY!=freeIndexY)) {
				switchPositions(freeIndexX,freeIndexY,nextIndexX,nextIndexY);
				$('input').removeAttr('disabled');
			}
			$('body > div > div').css({color:'inherit',borderColor:'gray',zIndex:0})
			$('body > div > div').css({top:0,left:0});
			JSONarray = JSON.stringify(arr);
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				window.webkitStorageInfo.requestQuota(TEMPORARY, 100, function(grantedBytes) {
				  window.requestFileSystem(TEMPORARY, grantedBytes, writeData, errorHandler);
				  console.log(grantedBytes);
				}, function(e) {
				  console.log('Error', e);
				});
			}
			}
	});




function errorHandler(e) {
  var msg = '';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };

  console.log('Error: ' + msg);
}

function writeData(fs)
{
	fs.root.getFile('array.json', {create:true, exclusive:false}, function(fileEntry){
		fileEntry.createWriter(function(fileWriter) {

	      fileWriter.onwriteend = function(e) {
	        console.log('Write completed.');
	      };

	      fileWriter.onerror = function(e) {
	        console.log('Write failed: ' + e.toString());
	      };

		  bb = new Blob([JSONarray], {type : 'text/plain'});
	      fileWriter.write(bb.slice());

	    }, errorHandler);
	}, errorHandler)
}

$('input').click(function(){

	  xhr = new XMLHttpRequest();
	  xhr.open('POST', './server.php', true);
	  xhr.onload = function(e) { console.log('uploaded'); };
	 
  	var formData = new FormData();
	formData.append("thefile", bb);
	xhr.send(formData);

  	console.log(xhr);
  	return false;
})

