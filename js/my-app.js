
// Initialize your app
var myApp = new Framework7({
		swipePanel : 'right',
		precompileTemplates : true, //
		template7Pages : true,
		tapHold : true, //enable tap hold events
		tapHoldDelay : 100,
		tapHoldPreventClicks : false
	});

// Export selectors engine
var $$ = Dom7;
var photons;
var cameraTimer;
var videoTimer;
var FPS=33;
var storedData = myApp.formGetData('my-form2');
if (storedData) {
	getPhotons();

}
$$('.close').on('click', function () {
	myApp.sortableClose('.sortable');
});
$$('.panel-left').on('opened', function () {
	var q = 'https://api.particle.io/v1/devices/' + photons[0].id + '/tempf/?access_token=' + storedData.token;
	$$.get(q, function (results) {
		results = JSON.parse(results);
		$$('#val1').html(results.result);
	});
	var q = 'https://api.particle.io/v1/devices/' + photons[1].id + '/tempf/?access_token=' + storedData.token;
	$$.get(q, function (results) {
		results = JSON.parse(results);
		$$('#val2').html(results.result);
	});

	$$('.element-add-location').on('click', function () {
		appendLocation('test');
	});
});
$$('.panel-right').on('opened', function () {
	$$('.DynaSwitch').on('click', function () {

		var PinNum = $$(this).data('val');
		var DeviceID = $$(this).data('device');
		var obj = $$(this);
		var q = 'https://api.particle.io/v1/devices/' + DeviceID + '/switchRelay/';

		$$.post(q, {
			access_token : storedData.token,
			val : PinNum
		}, function (data) {
			if (obj.hasClass('color-red')) {
				obj.removeClass('color-red');
				obj.addClass('color-green');

			} else {
				obj.removeClass('color-green');
				obj.addClass('color-red');

			}
		});

	});

});

var mainView = myApp.addView('.view-main', {
		// Because we use fixed-through navbar we can enable dynamic navbar
		dynamicNavbar : true

	});
myApp.onPageInit('camera', function (page) {
	console.log('init');
	drawCamera();
});
myApp.onPageInit('about', function (page) {
	try {
		drawPhotons();
	} catch (err) {
		console.log('error on drawPhotons function call');
	}

	$$('.dynamicForm').on('click', function () {
		var formname = $$(this).data('val');
		var id = $$(this).data('id');
		$$('.formSpot').html('');
		appendForm(formname, id);

		$$('.save-storage-data-dynamic').on('click', function () {
			var text = '{' +
				'"DeviceID_' + formname + '":"' + $$('#ParticleID').val() + '",' +
				'"token_' + formname + '":"' + $$('#ParticleToken').val() + '",' +
				'"RToggle_' + formname + '":"' + $$('#RToggle').val() + '",' +
				'"Rpin_' + formname + '":"' + $$('#Rpin').val() + '",' +
				'"RpinVis_' + formname + '":"' + $$('#RpinVis').prop('checked') + '",' +
				'"Lpin_' + formname + '":"' + $$('#Lpin').val() + '",' +
				'"LToggle_' + formname + '":"' + $$('#LToggle').val() + '",' +
				'"LpinVis_' + formname + '":"' + $$('#LpinVis').prop('checked') + '",' +
				'"S1pin_' + formname + '":"' + $$('#S1pin').val() + '",' +
				'"S1pinName_' + formname + '":"' + $$('#S1pinName').val() + '",' +
				'"S1pinVis_' + formname + '":"' + $$('#S1pinVis').prop('checked') + '",' +
				'"S2pin_' + formname + '":"' + $$('#S2pin').val() + '",' +
				'"S2pinName_' + formname + '":"' + $$('#S2pinName').val() + '",' +
				'"S2pinVis_' + formname + '":"' + $$('#S2pinVis').prop('checked') + '",' +
				'"S3pin_' + formname + '":"' + $$('#S3pin').val() + '",' +
				'"S3pinName_' + formname + '":"' + $$('#S3pinName').val() + '",' +
				'"S3pinVis_' + formname + '":"' + $$('#S3pinVis').prop('checked') + '",' +
				'"S4pin_' + formname + '":"' + $$('#S4pin').val() + '",' +
				'"S4pinName_' + formname + '":"' + $$('#S4pinName').val() + '",' +
				'"S4pinVis_' + formname + '":"' + $$('#S4pinVis').prop('checked') + '",' +
				'"S5pin_' + formname + '":"' + $$('#S5pin').val() + '",' +
				'"S5pinName_' + formname + '":"' + $$('#S5pinName').val() + '",' +
				'"S5pinVis_' + formname + '":"' + $$('#S5pinVis').prop('checked') + '"}';
			var obj = JSON.parse(text);
			var DynamicFormData = myApp.formStoreData(formname, obj);
		});
	});
});

myApp.onPageInit('form', function (page) {
	// run createContentPage func after link was clicked
	if (storedData) {
		var q = 'https://api.particle.io/v1/devices/' + storedData.DeviceID + '/?access_token=' + storedData.token;
		$$.get(q, function (results) {
			results = JSON.parse(results);
			$$('#photon-name').html('Device Name: ' + results.name);
		});

	}

	$$('.save-storage-data').on('click', function () {

		var storedData = myApp.formStoreData('my-form2');
		storedData = myApp.formGetData('my-form2');
	});
});

myApp.onPageInit('setDisplay', function (page) {
	drawSwitches($$('#SwitchSettings'));

});
myApp.onPageInit('lights', function (page) {
	var HostIP=storedData.wemoIP;
	var HostPort=storedData.wemoPort;
	var URL= 'http://' + HostIP + ':' + HostPort;
	var postbodyheader= '<?xml version="1.0" encoding="utf-8"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body>';
	var postbodyfooter= '</s:Body></s:Envelope>';
 
	
	var URL= 'http://mth3r.ddns.net:49153'
	var postbodyheader= '<?xml version="1.0" encoding="utf-8"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body>';
	var postbodyfooter= '</s:Body></s:Envelope>';
 
	

	var body = [
	  postbodyheader, 
	  '<u:GetEndDevices xmlns:u="urn:Belkin:service:bridge:1">', 
<<<<<<< HEAD
	  '<DevUDN>uuid:Bridge-1_0-231445B0100742</DevUDN>', 
=======
	  '<DevUDN>%s</DevUDN>', 
>>>>>>> origin/master
	  '<ReqListType>PAIRED_LIST</ReqListType>',
	  '</u:GetEndDevices>',
	  postbodyfooter
	].join('\n');
<<<<<<< HEAD
	
	var xmlhttp;
	var cmd = '/upnp/control/bridge1';
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", URL+cmd, false);
	xmlhttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	xmlhttp.setRequestHeader("SOAPAction", '"urn:Belkin:service:bridge:1#GetEndDevices"');
	xmlhttp.setRequestHeader("Accept","");
	//xmlhttp.setRequestHeader("User-Agent","QuickSwitch/507 CFNetwork/758.1.6 Darwin/15.0.0");
	xmlhttp.send(body);
	//var xmlDoc=xmlhttp.responseText;
	var xmlResponse =xmlhttp.responseXML.documentElement;
	var resultSet = xmlhttp.responseXML.getElementsByTagName("*");
	
	
	var xmlstr= resultSet[3].childNodes[0].nodeValue;
	
	var foo = jQuery(xmlstr).find('friendlyname');
	for (i=0; i< foo.length; i++){
	console.log(foo[i].innerHTML);
	}
	
=======

	var xmlhttp;
	var cmd = '/upnp/control/bridge1';
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", URL+cmd, true);
	xmlhttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	xmlhttp.setRequestHeader("SOAPAction", "urn:Belkin:service:bridge:1#GetEndDevices");
	xmlhttp.setRequestHeader("Accept","");
	xmlhttp.send(body);


>>>>>>> origin/master

                     
	$$('#roomSwitch').on('click', function () {
			
	
			var xmlhttp;
			var cmd = '/upnp/control/basicevent1';
			xmlhttp = new XMLHttpRequest();
			xmlhttp.open("POST", URL+cmd, true);
			xmlhttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
			xmlhttp.setRequestHeader("SOAPAction", "urn:Belkin:service:basicevent:1#SetBinaryState");
			xmlhttp.setRequestHeader("Accept","");
	

		if(!$$('#roomSwitchData').prop('checked')){
			console.log('on');
			var body = [
				postbodyheader,
				'<u:GetBinaryState xmlns:u="urn:Belkin:service:basicevent:1">',
				'<BinaryState>1</BinaryState>',
				'</u:GetBinaryState>',
				postbodyfooter
			].join('\n');    		
			
			xmlhttp.send(body);
		}
			else{
			console.log('off');
			var body = [
				postbodyheader,
				'<u:GetBinaryState xmlns:u="urn:Belkin:service:basicevent:1">',
				'<BinaryState>0</BinaryState>',
				'</u:GetBinaryState>',
				postbodyfooter
			].join('\n');    		
			xmlhttp.send(body);
			}
		
	});

});

function getPhotons() {
	var q = 'https://api.particle.io/v1/devices/?access_token=' + storedData.token;
	$$.get(q, function (results) {
		results = JSON.parse(results);
		photons = results;
		drawRightPanel();
		for (i = 0; i < photons.length; i++) {
			drawGarage(photons[i].name);

		}
		$$('.garageDoorButton').on('click', function () {

			var deviceID = $$(this).data('device');
			var pin = $$(this).data('pinNum');

			var q = 'https://api.particle.io/v1/devices/' + deviceID + '/toggleRelay/';
			$$.post(q, {
				access_token : storedData.token,
				val : pin
			}, function (data) {
				console.log('Load was performed:' + storedData.Lpin);

			});

		});
	});

}
function drawPhotons() {
	var newDiv = $$('#PhotonDetail').html();

	for (i = 0; i < photons.length; i++) {
		$$('.PhotonList').append(newDiv);
		$$('#dynamicPhotonLink').text(photons[i].name);
		$$('#dynamicPhotonLink').addClass('dynamicForm');
		$$('#dynamicPhotonLink').attr('data-val', photons[i].name)
		$$('#dynamicPhotonLink').attr('data-id', photons[i].id)
		$$('#dynamicPhotonLink').attr('id', photons[i].name);

	}
}
function drawGarage(a) {
	try {
		var DynData = myApp.formGetData(a);
	} catch (err) {
		var DynData = 'false';
	}

	if (eval(eval('DynData.LpinVis_' + a)) || eval(eval('DynData.RpinVis_' + a))) {

		$$('#dynacol1').hide();
		$$('#dynacol2').hide();
		$$('#dynacol1img').hide();
		$$('#dynacol2img').hide();

		if (eval(eval('DynData.LpinVis_' + a))) {
			$$('#dynacol1').show();
			$$('#dynacol1img').show();
		}
		if (eval(eval('DynData.RpinVis_' + a))) {
			$$('#dynacol2').show();
			$$('#dynacol2img').show();
		}
		$$('#dynacol1Button').attr('data-device', eval('DynData.DeviceID_' + a));
		$$('#dynacol2Button').attr('data-device', eval('DynData.DeviceID_' + a));
		$$('#dynacol1Button').html(eval('DynData.LToggle_' + a))
		$$('#dynacol1Button').attr('data-pinNum', eval('DynData.Lpin_' + a));
		$$('#dynacol2Button').html(eval('DynData.RToggle_' + a))
		$$('#dynacol2Button').attr('data-pinNum', eval('DynData.Rpin_' + a));
		$$('#dynacol1').attr('id', a + '_Lpin');
		$$('#dynacol1Button').attr('id', a + '_Lbut');
		$$('#dynacol2Button').attr('id', a + '_Rbut');
		$$('#dynacol2').attr('id', a + '_Rpin');
		$$('#dynacol1img').attr('id', a + '_LpinImg');
		$$('#dynacol2img').attr('id', a + '_RpinImg');
		var newDiv = $$('#GarageDetail').html();
		$$('#GarageControls').append(newDiv);

	}

}
function appendLocation(a) {
	var newDiv = $$('#SomeClassTemplate').html();
	$$('.tempReadout').append(newDiv);
	$$('.dynamic').html(a);
}
function appendForm(a, b) {
	$$('#photon-name').html('Device Settings:   ' + a);

	$$('#my-form3').attr('id', a);
	$$('#ParticleID').attr('name', 'DeviceID_' + a);
	$$('#ParticleToken').attr('name', 'token_' + a);
	$$('input#ParticleToken').val(storedData.token);
	$$('#LToggle').attr('name', 'LToggle_' + a);
	$$('#Lpin').attr('name', 'Lpin_' + a);
	$$('#LpinVis').attr('name', 'LpinVis' + a);
	$$('#RToggle').attr('name', 'RToggle_' + a);
	$$('#Rpin').attr('name', 'Rpin_' + a);
	$$('#RpinVis').attr('name', 'RpinVis' + a);
	$$('#S1pin').attr('name', 'S1pin_' + a);
	$$('#S1pinName').attr('name', 'S1pinName_' + a);
	$$('#S1pinVis').attr('name', 'S1pinVis' + a);
	$$('#S2pin').attr('name', 'S2pin_' + a);
	$$('#S2pinName').attr('name', 'S2pinName_' + a);
	$$('#S2pinVis').attr('name', 'S2pinVis' + a);
	$$('#S3pin').attr('name', 'S3pin_' + a);
	$$('#S3pinName').attr('name', 'S3pinName_' + a);
	$$('#S3pinVis').attr('name', 'S3pinVis' + a);
	$$('#S4pin').attr('name', 'S4pin_' + a);
	$$('#S4pinName').attr('name', 'S4pinName_' + a);
	$$('#S4pinVis').attr('name', 'S4pinVis' + a);
	$$('#S5pin').attr('name', 'S5pin_' + a);
	$$('#S5pinName').attr('name', 'S5pinName_' + a);
	$$('#S5pinVis').attr('name', 'S5pinVis' + a);
	var newDiv = $$('#dynForm').html();
	$$('.formSpot').append(newDiv);
	try {
		var DynData = myApp.formGetData(a);
	} catch (err) {
		var DynData = 'false';
	}
	$$('input#ParticleID').val(b);
	$$('input#ParticleToken').val(storedData.token);
	try {
		if (DynData) {
			$$('input#ParticleID').val(eval('DynData.DeviceID_' + a));
			$$('input#ParticleToken').val(eval('DynData.token_' + a));
			$$('input#LToggle').val(eval('DynData.LToggle_' + a));
			$$('input#Lpin').val(eval('DynData.Lpin_' + a));
			$$('#LpinVis').prop('checked', eval(eval('DynData.LpinVis_' + a)));
			$$('input#RToggle').val(eval('DynData.RToggle_' + a));
			$$('input#Rpin').val(eval('DynData.Rpin_' + a));
			$$('input#RpinVis').prop('checked', eval(eval('DynData.RpinVis_' + a)));
			$$('#S1pin').val(eval('DynData.S1pin_' + a));
			$$('#S1pinName').val(eval('DynData.S1pinName_' + a));
			$$('input#S1pinVis').prop('checked', eval(eval('DynData.S1pinVis_' + a)));
			$$('#S2pin').val(eval('DynData.S2pin_' + a));
			$$('#S2pinName').val(eval('DynData.S2pinName_' + a));
			$$('input#S2pinVis').prop('checked', eval(eval('DynData.S2pinVis_' + a)));
			$$('#S3pin').val(eval('DynData.S3pin_' + a));
			$$('#S3pinName').val(eval('DynData.S3pinName_' + a));
			$$('input#S3pinVis').prop('checked', eval(eval('DynData.S3pinVis_' + a)));
			$$('#S4pin').val(eval('DynData.S4pin_' + a));
			$$('#S4pinName').val(eval('DynData.S4pinName_' + a));
			$$('input#S4pinVis').prop('checked', eval(eval('DynData.S4pinVis_' + a)));
			$$('#S5pin').val(eval('DynData.S5pin_' + a));
			$$('#S5pinName').val(eval('DynData.S5pinName_' + a));
			$$('input#S5pinVis').prop('checked', eval(eval('DynData.S5pinVis_' + a)));
		}
	} catch (err) {
		console.log('error on form fill out')
	}

}
function drawRightPanel() {
	drawSwitches($$('#SwitchList'));
}
function drawSwitches(dest) {
	var newDiv = $$('#SwitchDetail').html();
	for (i = 0; i < photons.length; i++) {
		var DynData = myApp.formGetData(photons[i].name);
		if (DynData) {
			for (j = 0; j < 5; j++) {
				console.log(eval('DynData.S' + (j + 1) + 'pinVis_' + photons[i].name));
				if (eval(eval('DynData.S' + (j + 1) + 'pinVis_' + photons[i].name))) {
					dest.append(newDiv);
					$$('#DynamicSwitchID').text(eval('DynData.S' + (j + 1) + 'pinName_' + photons[i].name));
					$$('#DynamicSwitchID').addClass('DynaSwitch');
					$$('#DynamicSwitchID').attr('data-val', eval('DynData.S' + (j + 1) + 'pin_' + photons[i].name));
					$$('#DynamicSwitchID').attr('data-device', photons[i].id)
					$$('#DynamicSwitchID').attr('id', photons[i].name + '_Switch_' + (j + 1));
				}
			}
		}
	}

}

function drawVideo(){
	var snapshot;
	var url = 'http://mth3r.ddns.net:';
	var port = storedData.CameraPort + '/';
	var action = 'snapshot.cgi?cmd=snapPicture';
	var user = '&user=' + storedData.FoscamUser;
	var password = '&pwd=' + storedData.FoscamPass;
	var src = url + port + action + user + password;
    console.log(src); 
	//$$('#foscam').attr('src', src);
	$$('#foscam').attr('alt', 'no dice');
	var i=0;
	
	videoTimer = set_interval(function () {
			try{
				//$$('#foscam').attr('src', src);
				$$.get(src, {}, function (data) {        
        			//$$('#foscam').attr('src', 'data:image/jpeg;base64,\'' + data + '\'' );
        			
        			$$('#cameraIframe').attr('src',src);
        			
        		});  
				
			}catch(err){
				console.log('error');
			}
		}, FPS, 'videoTimer');
	
				
}
function stopVideo(){
	clearTimeout(videoTimer);

}

function drawCamera(timeInterval) {
	var url = storedData.DDNSurl + ':';
	var port = storedData.CameraPort + '/';
	var action = 'snapshot.cgi?cmd=snapPicture';
	var user = '&user=' + storedData.FoscamUser;
	var password = '&pwd=' + storedData.FoscamPass;
	var src = url + port + action + user + password;
	src = encodeURI(src);
	$$('#cameraIframe').attr('src',src);
	
	//$$('#foscam').attr('alt', 'This is the camera spot');
	//$$('#foscam').attr('width', '360');
	//$$('#foscam').attr('hieght', '380');
    //$$('#foscam').attr('src', src);
    
	//drawVideo();

	$$('.CameraControl').on('taphold', function () {
		var url = storedData.DDNSurl + ':';
		var cmd = '&command=' + $$(this).data('cmd');
		var touch= $$(this).attr('id');
		$$('#windrose').attr('src', 'img/400px-Windrose-' + touch + '.png');
		action = "decoder_control.cgi?";
		var src = url + port + action;
		var cmd = $$(this).data('cmd');
		clearTimeout(cameraTimer);
		cameraTimer = set_interval(function () {
				try{
				$$.get(src, {
					command : cmd,
					user : storedData.FoscamUser,
					pwd : storedData.FoscamPass
                       
				}, function (data) {
					
					
				});}
				catch(err){console.log('error');}
				
			}, 100, 'cameraTimer');

	});

	$$('.CameraControl').on('click', function () {
		clearTimeout(cameraTimer);
		$$('#windrose').attr('src', 'img/400px-Windrose-CTR.png');
		console.log('mouseup');
		var cmd = $$(this).data('cmdStop');
		var action = "decoder_control.cgi?";
		var url = 'http://mth3r.ddns.net:';
		var port = storedData.CameraPort + '/';
		var src = url + port + action;
		console.log(src);
		
			$$.get(src, {
				command : cmd,
				user : storedData.FoscamUser,
				pwd : storedData.FoscamPass
			}, function (data) {
				
				
				
			});
	});

	$$('.CameraSnapShot').on('click', function () {
		action = "snapshot.cgi?";
		var src = url + port + action;
		$$.get(src, {
			user : storedData.FoscamUser,
			pwd : storedData.FoscamPass
		}, function (data) {
			console.log('snapshot');
		});

	});
	$$('.CameraAlarm').on('click', function () {
		action = "set_alarm.cgi?";
		cmd = '&motion_armed=1&motion_sensitivity=5';
		var src = url + port + action;
		$$.get(src, {
			command : cmd,
			user : storedData.FoscamUser,
			pwd : storedData.FoscamPass
		}, function (data) {
			console.log('Alarm');
		});
	});
	$$('.CameraStop').on('click', function () {
		clearTimeout(timer);
		console.log('stop');
	});
	$$('#videoSwitch').on('click', function () {
		if(!$$('#videoSwitchData').prop('checked')){
			drawVideo();
			}else{
			stopVideo();
			}
		
	});
}

