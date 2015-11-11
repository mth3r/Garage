
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
	body_onload();

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

function drawCamera(timeInterval) {
	//var newDiv = $$('#cameraDetail').html();
	var url = 'http://mth3r.ddns.net:';
	var port = storedData.CameraPort + '/';
	var action = 'live.htm?'
		var user = '&user=' + storedData.FoscamUser;
	var password = '&pwd=' + storedData.FoscamPass
		//var timer;
		//var IntervalTimer;

		var src = url + port + action + user + password;
	console.log(src);
	//$$('#controls').append(newDiv);
	$$('#foscam').attr('alt', 'This is the camera spot');
	$$('#foscam').attr('width', '360');
	$$('#foscam').attr('hieght', '380');
	try{
		$$('#foscam').attr('src', src);
	}catch(err){
		myApp.alert(error);
	}

	$$('.CameraControl').on('taphold', function () {
		var cmd = '&command=' + $$(this).data('cmd');
		var touch= $$(this).attr('id');
		console.log('touch : ' +touch);
		$$('#windrose').attr('src', 'img/400px-Windrose-' + touch + '.png');
		action = "decoder_control.cgi?";
		
		//var src=url+port+action+cmd+user+password;
		var src = url + port + action;
		var cmd = $$(this).data('cmd');
		//var q = url+port+action;
		$$('.test').html('mouse down before interval: ' + cmd);
		clearTimeout(cameraTimer);
		cameraTimer = set_interval(function () {
				$$('.test').html('mouse down before get: ' + cmd);
				$$.get(src, {
					command : cmd,
					user : storedData.FoscamUser,
					pwd : storedData.FoscamPass
				}, function (data) {
					$$('.test').html('mouse down: ' + cmd);
					console.log('mouse down: ' + cmd);
				});
				console.log('mouse down: ' + cmd);
			}, 100, 'cameraTimer');

	});

	$$('.CameraControl').on('click', function () {
		clearTimeout(cameraTimer);
		$$('#windrose').attr('src', 'img/400px-Windrose-CTR.png');
		console.log('mouseup');
		var cmd = $$(this).data('cmdStop');
		action = "decoder_control.cgi?";
		$$('.test').html('up: ' + cmd);
		var src = url + port + action
			$$.get(src, {
				command : cmd,
				user : storedData.FoscamUser,
				pwd : storedData.FoscamPass
			}, function (data) {
				$$('.test').html('mouseup: ' + cmd);
				console.log('mouseup: ' + cmd);
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
}
var e=navigator.userAgent.toLowerCase();
var isOpera=e.indexOf("opera")!=-1;
var isAndroid=e.indexOf("android")!=-1;
var isIE=document.all&&e.indexOf("msie")!=-1&&!isIE;
var isChrome=e.indexOf("chrome")!=-1;
if (isIE) document.execCommand("ClearAuthenticationCache");
//***********************************************************************************
//                                                                                  *
//                 Generic Browser Interface for MJPEG PTZ Camera V3.1              *
//      Copyright By TheUberOverLord AKA Don Kennedy TheUberOverLord@yahoo.com      *
//                               All Rights Reserved                                *
//                 Saves Bandwidth and Includes Zoom On Image Click                 *
//                   Reset Zoom to Normal By Double Click On Image                  *
//                    PTZ controls work properly on flipped images                  *
//                     Force Logon Prompt or Set Logon Password                     *
//                           You Chooze Zoom Percentage                             *
//                            Advanced Config Options                               *
//                                Admin Functions                                   *
//                                  Many Options                                    *
//                                                                                  *
//      PLEASE REVIEW AND CHANGE THE VALUES BELOW TO YOUR CONFIGURATION NEEDS       *
//    You can make many copies of this Interface with different configurations      *
//    ------------------------------------------------------------------------      *
// More detail here: http://foscam.us/forum/free-generic-browser-interface-for-foscam-mjpeg-ptz-cameras-t2522.html
//                                                                                  *
// This is the 12th version and am waiting for feedback to add more functionality.  *
//                                                                                  *
// Added: Some outdoor cameras have up down reversed added a configuration option.  *
//                                                                                  *
// Tested On: Windows 32 and 64 bit systems With Internet Explorer 32 and 64 based  *
//            browsers, FireFox, Safari as well as Chrome. This interface does not  *
//            require ActiveX or User Id's or passwords placed here, minus Chrome   *
//            for Chrome browsers, dies to a bug/issue currently with Chrome. See   *
//            below for more details.                                               *
//                                                                                  *
//            Linux Ubuntu with FireFox.                                            *
//                                                                                  *
//            Please provide feedback on other Browsers as well as mobile browsers. *
//                                                                                  *
// Known Browser Issues: You can change camera logon when you do not specify a user *
//                       and password here with Internet Explorer versions by doing *
//                       a refresh of the page.                                     *
//                                                                                  *
//                       This is helpful to on-the-fly change from a Visitor to     *
//                       Operator logon, since no camera movement can be done as a  *
//                       Visitor using this interface, which is intentional.        *
//                                                                                  *
//                       Firefox requires you completely close The Firefox browser  *
//                       window and re-open it to be prompted to enter a different  *
//                       logon. This issue is the same on Windows and Linux.        *
//                                                                                  *
//                       Chrome has a bug/issue that in most cases will NOT allow   *
//                       any recent Chrome version to use this interface unless a   *
//                       user and password is included, user and password cannot be *
//                       left blank if you wish to use this interface with Chrome.  *
//                                                                                  *
//                       One solution, at the moment, for both the above, would be  *
//                       to have multiple copies of this interface with different   *
//                       configuration options, while I am looking for a fix.       *
//                                                                                  *
//                       Cam1Operator.htm   ("Operator user/password set")          *
//                       Cam1Vistor.htm     ("Visitor user/password set")           *
//                       Cam1ForceLogon.htm ("Prompt for login")                    *
//                                                                                  *
// Other Known Issues:   Some FI8910W camera models have left/right controls        *
//                       reversed. Please see var lrReversed for more details.      *
//                                                                                  *
//                       As always, please also suggest your ideas for changes and  *
//                       enhancements as well.                                      *
//                                                                                  *
//                       Thanks Don Kennedy AKA TheUberOverLord.                    *
//                                                                                  *
// Note: If you have a "Vistor" user Id, try using the interface with it as well as *
//       an "Operator" user Id, so that you can see how the camera movement controls*
//       are automatically removed for "Vistor" user Id's.                          *
//                                                                                  *
//       Infinite Zoom Works for "Visitor", "Operator" and "Admin" User Id's by a   *
//       single left mouse click on the image, increasing the zoom by the percent   *
//       you choose below, each time. To reset the image to normal size, simply     *
//       double left click the image and the image will return to normal size.      *
//                                                                                  *
// You MUST enter the local IP address and port or your ISP IP address and port     *
// or your DDNS and port ("If you have properly setup the camera for remote access")*
// Example: var IPandPort = "192.168.1.111:91";  ("Local IP Address and Port")      *
// Example: var IPandPort = "78.102.134.11:91";  ("ISP IP Address and Port")        *
// Example: var IPandPort = "mycam.ddns.org:91"; ("DDNS IP Address and Port")       *
//                                                                                  *
var IPandPort = "mth3r.ddns.net:59512"; // <- ***** You MUST Change This *****          *
//                                                                                  *
// If you enter a valid user and password here then there will not be any           *
// prompt to login. Note: Please Don't use a Admin login, if this will be public    *
// otherwise people will be able to change the camera configuration.                *
// Both of the values below are case sensitive.                                     *
//                                                                                  *
// Example: var user = "operator"; ("Operator Id for camera")                       *
// Example: var user = "vistor"; ("Visitor Id for camera")                          *
// Example: var user = ""; ("Forces prompt for login")                              *
//                                                                                  *
var user = ""; // <- ***** Change This? *****                               *
//                                                                                  *
// Example: var pwd  = "oper"; ("Operator password for camera")                     *
// Example: var pwd = "visit"; ("Visitor password for camera")                      *
// Example: var pwd = ""; ("Prompts for login, unless password is really blank")    *
//                                                                                  *
var pwd  = "b0wldawg"; // <- ***** Change This? *****                               *
//                                                                                  *
// Some FI8910W cameras have left/right controls reversed. If you see this issue    *
// please set this to "Y".                                                          *
//                                                                                  *
var lrReversed = ""; // < ***** Change This? *****                                  *
//                                                                                  *
// Some outdoor cameras have up/down controls reversed. If you see this issue       *
// please set this to "Y".                                                          *
//                                                                                  *
var udReversed = ""; // < ***** Change This? *****                                  *
//                                                                                  *
// When this is set to "Y" it will display links to your other cameras.             *
//                                                                                  *
var showOtherCameras = "Y"; // ***** Change This? ***** "" = no.                    *
//                                                                                  *
// Note: The below does NOT really change your camera FPS. It is an internal rate   *
//       Specific to this interface ONLY! The purpose is to minimize bandwidth while*
//       monitoring your cameras, without actually changing the actual FPS used     *
//       for the camera for alarm emails, FTP and recordings.                       *
//                                                                                  *
//       Because this interface supports infinite zooms by clicking the image as    *
//       many times as you wish, double clicking the image to reset the image to    *
//       Normal resolution. You maybe able to use a smaller resolution than before  *
//       if you choose to, to help minimize exceeding any ISP bandwidth limits as   *
//       well as control the overhead on your local network.                        *
//                                                                                  *
// Example: var MyFPS = 33 ms is 30 FPS 114KBps at 160*120, 228KBps at 320*240 and  *
//          456KBps with 640*480 Resolution.                                        *
//                                                                                  *
// Example: var MyFPS = 67 ms is 15 FPS 57KBps at 160*120, 114KBps at 320*240 and   *
//          228KBps with 640*480 Resolution.                                        *
//                                                                                  *
// Example: var MyFPS = 100 ms is 10 FPS 38KBps at 160*120, 76KBps at 320*240 and   *
//          152KBps with 640*480 Resolution.                                        *
//                                                                                  *
// Example: var MyFPS = 200 ms is 5 FPS 19KBps at 160*120, 38KBps at 320*240 and    *
//          76KBps with 640*480 Resolution.                                         *
//                                                                                  *
// Example: var MyFPS = 1000 ms is 1 FPS 4KBps at 160*120, 8KBps at 320*240 and     *
//          16KBps with 640*480 Resolution.                                         *
//                                                                                  *
// Example: var MyFPS = 5000 ms is 1 Frame every 5 seconds 4KBp5s at 160*120,       *
//          8KBp5s at 320*240 and 16KBp5s with 640*480 Resolution.                  *
//                                                                                  *
var MyFPS = 33; // <- ***** Change This? ***** ("This is 30 FPS") In MilliSeconds   *
//                                                                                  *
// NOTE: WARNING changing MyResolution to ANYTHING besides -1, will change the      *
//       resolution for your camera. This WILL change the image resolutions for     *
//       email alarms, FTP alarm images as well as recording or video streaming     *
//       resolutions.                                                               *
//                                                                                  *
//       If the user using this is visitor, the default resolution will be the      *
//       resolution set in the camera, since only an Operator or Admin is allowed   *
//       to change the camera resolution. If the user using this is a Operator or   *
//       Admin, then default resolution can also be changed by the below setting.   *
//                                                                                  *
// Example: var MyResolution = -1 is Keep camera default.                           *
// Example: var MyResolution =  2 Changes camera default to 160*120 resolution      *
// Example: var MyResolution =  8 Changes camera default to 320*240 resolution      *
// Example: var MyResolution = 32 Changes camera default to 640*480 resolution      *
//                                                                                  *
var MyResolution = -1; // <- ***** Change This? *****                               *
//                                                                                  *
// Zoom percentage. Generally a 50 percent increase is best, but you can change the *
// Zoom percentage here to be anything you want from 1 to 100. Each click on the    *
// image itself will increase Zoom by this percentage, a double click on the image  *
// itself, will reset the image to no Zoom.                                         *
//                                                                                  *
var MyZoom = 50; // <- ***** Change This? ***** to be +- more than 50 percent Zoom  *
//                                                                                  *
//                                                                                  *
// This will display the name for the camera that you have assigned.                *
//                                                                                  *
var DisplayCameraName = "Y"; // < *** Change This? *** ""; = no "Y"; = Yes          *
//                                                                                  *
//                         ADVANCED CONFIGURATION OPTIONS                           *
//                                                                                  *
// There is no need to change the below unless you wish to get very fancy.          *
//                                                                                  *
// If you have a mobile phone or some other device where this will look better      *
// left justifed vs. centered, set this to "Y".                                     *
//                                                                                  *
var JustifyLeft = ""; // *** Change This? ***                                       *
//                                                                                  *
// This will display buttons for Zoom and UnZoom for mobile devices to make it      *
// easier to not Zoom the entire page but simply the image by clicking the buttons. *
// Values are "A" = Only show Zoom Buttons for devices with Touch screens.          *
// "" = Never show Zoom Buttons.                                                    *
//                                                                                  *
var DisplayZoomButtons = "A"; // Only for devices with Touch Screens.               *
//                                                                                  *
// If left empty the default MyFPS will be used.                                    *
//                                                                                  *
var VisitorFPS  = ""; // < *** Change This? *** See MyFPS for proper values.        *
var OperatorFPS = ""; // < *** Change This? *** See MyFPS for proper values.        *
var AdminFPS    = ""; // < *** Change This? *** 30 FPS.                             *
//                                                                                  *
//  This will handles the FPS and Bytes Per second Statistics Gathering and Display *
//                                                                                  *
//  Note: if DisplayStatsEvery = ""; No Statatistics for FPS and Bytes per second   *
//        will be gathered/displayed for any User Level, even if they are set to Y  *
//                                                                                  *
var DisplayStatsEvery = "5"; // < *** Change This? *** In Seconds every 5 Seconds   *
var StatsForVisitor   = "";  // < *** Change This? *** "Y"; = yes                   *
var StatsForOperator  = "Y"; // < *** Change This? *** ""; = no                     *
var StatsForAdmin     = "Y"; // < *** Change This? *** ""; = no                     *
//                                                                                  *
//  This will allow internal FPS Rate Changes By User Level                         *
//                                                                                  *
var VisitorChangeInternalFPS = "";   // < *** Change This? *** ""; = no             *
var OperatorChangeInternalFPS = "Y"; // < *** Change This? *** ""; = no             *
var AdminChangeInternalFPS = "Y";    // < *** Change This? *** ""; = no             *
//                                                                                  *
// If your camera is public or if you want more control for your camera, here are a *
// few more settings you can modify:                                                *
//                                                                                  *
// This will automatically go to preset #1 based on user id, if that user id made   *
// any camera position changes, before they timeout. Since only Operator and Admin  *
// user id's can change camera position, there is no need for a visitor user id     *
// setting for this. If this is left empty, no goto preset #1 will be done, if the  *
// session timed out. The value can be anything a "Y" even. You must have preset #1 *
// set for this to work. An attempt will also be made to do this if any camera      *
// position changed when the person leaves the page as well. However, this may not  *
// work in all cases, it depends on the browser being used.                         *
//                                                                                  *
var OperatorGoToPre1 = ""; // *** Change This? ***                                  *
var AdminGoToPre1    = ""; // *** Change This? ***                                  *
//                                                                                  *
// These settings allow you to restrict what Operator user level id's can access    *
// The value can be anything a "Y" even.                                            *
//                                                                                  *
var ShowChangePosition1 = "Y"; // *** Change This? *** Above Image Controls         *
var ShowChangePosition2 = "Y"; // *** Change This? *** Below Image Controls         *
var ShowHPatrol =         "Y"; // *** Change This? ***                              *
var ShowVPatrol =         "Y"; // *** Change This? ***                              *
var ShowResMode =         "Y"; // *** Change This? ***                              *
var ShowBrightContrast =  "Y"; // *** Change This? ***                              *
var ShowGoToPresets =     "Y"; // *** Change This? ***                              *
var ShowSetPresets =      "Y"; // *** Change This? ***                              *
var ShowFlip =            "Y"; // *** Change This? ***                              *
var ShowIR =              "Y"; // *** Change This? ***                              *
var ShowLeftRight =       "Y"; // *** Change This? ***                              *
var ShowUpDown =          "Y"; // *** Change This? ***                              *
//                                                                                  *
// If you have enabled timeout's below and you wish to go to a jump page after the  *
// timeout happens, based on user id level, you can enter a valid web page below.   *
//                                                                                  *
// Example: Say you had 2 cameras, and would automatically like to see both of them *
// once every 5 minutes, without doing anything. You could have two copies of this  *
// interface, setup for auto logon, set the timeout in both to 5 minutes and use    *
// the other copy jump page to point back to this one. Now, your browser window will*
// cycle from one camera to the next, without human intervention. Every 5 Minutes.  *
//                                                                                  *
// Say, you have a public camera, and after so long you want the viewer viewing the *
// the camera to go to one of your web pages, you can do that as well.              *
//                                                                                  *
var VisitorJumpPage  = ""; // *** Change This? ***                                  *
var OperatorJumpPage = ""; // *** Change This? ***                                  *
var AdminJumpPage    = ""; // *** Change This? ***                                  *
//                                                                                  *
// NOTE: You Must have assigned a valid JumpPage for the User Level ID above        *
//       when setting any timeout value for that user level below!                  *
//                                                                                  *
// This will timeout a session based on user id level. Example, maybe you have a    *
// public camera and don't want people to be using it forever or maybe you want     *
// to set a max time limit by user level id that will require another login. The    *
// time is in Milli Seconds, so for example. a 5 minutes max, would be a value of   *
// 300000. There are 60000 Milli Seconds per minute, so 300000/60000 = 5. If the    *
// value is left empty, there will be no forced timeout.                            *
//                                                                                  *
var VisitorTimeout  = ""; // <- *** Change This? ***                                *
var OperatorTimeout = ""; // <- *** Change This? ***                                *
var AdminTimeout    = ""; // <- *** Change This? ***                                *
//                                                                                  *
// **********************************************************************************
// Please don't change anything below, report any problems using the email above    *
// **********************************************************************************
//
var startTime = 0;
var endTime = 0;
var countFPS = 0;
var totalKBps = 0;
var statsOn = false;
var img = new Image();
var imgObj;
var firstTime = true;
var tilt_up = 0;
var tilt_down = 2;
var pan_left = 4;
var pan_left_stop = 5;
var pan_right = 6;
var pan_right_stop = 7;
var ptz_left_up = 90;
var ptz_right_up = 91;
var ptz_left_down = 92;
var ptz_right_down = 93;
var unique_name = (new Date()).getTime();
var isTouchDevice = ((typeof Touch !== "undefined") || 
(e.match(/(iphone|ipod|ipad)/) ||
e.match(/(android)/)  || 
e.match(/(iemobile)/) || 
e.match(/iphone/i) || 
e.match(/ipad/i) || 
e.match(/ipod/i) || 
e.match(/blackberry/i) || 
e.match(/bada/i))) ? true: false;
function goforit(s) 
{
    var rxi = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var rxo = "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm5678901234";
    var map = [];    
    var buf = "";
    for (z = 0; z <= rxi.length; z++) {map[rxi.substr(z, 1)] = rxo.substr(z, 1)};
    for (z = 0; z <= s.length; z++) 
    {        
         var c = s.charAt(z);
         buf  += (c in map ? map[c] : c);    
    }
    return buf;
}
var url = window.location.pathname;
var filename = url.substring(url.lastIndexOf('/')+1);
var checkurl = decodeURIComponent(window.location.href).toLowerCase();
if ((location.search.length > 0) && (showOtherCameras == "Y") && (checkurl.length < 300) && (checkurl.length > 26) && (checkurl.match(/=$/) == null))
{
     var parameters = location.search.substring(1).split("&");
     var temp = parameters[0].split("=");
     if ((parameters.length == 1) && (temp[0] == "thecameraname"))
          IPandPort = unescape(temp[1]).toLowerCase().replace("http://","").replace("www.","");
     else if (parameters.length == 3)
     {
          if (goforit(temp[0]) == "thecameraname")
              IPandPort = goforit(unescape(temp[1]));
          temp = parameters[1].split("=");
          if (goforit(temp[0]) == "user")
              user = goforit(unescape(temp[1]));
          temp = parameters[2].split("=");
          if (goforit(temp[0]) == "pwd")
              pwd = goforit(unescape(temp[1]));
     }
}
else if ((IPandPort == '') && (showOtherCameras == "Y"))
          document.write('Invalid Camera DDNS. Please click the back button in your browser window and try again.');
document.write('<script type="text/javascript" src="http://'+IPandPort+'/'+'check_user.cgi?user='+user+'&pwd='+pwd+'"><\/script>');
document.write('<script type="text/javascript" src="http://'+IPandPort+'/'+'public.js"><\/script>');
document.write('<script type="text/javascript" src="http://'+IPandPort+'/'+'get_status.cgi?user='+user+'&pwd='+pwd+'"><\/script>');


if ((typeof pri !== "undefined") && (pri > 0))
     document.write('<script type="text/javascript" src="http://'+IPandPort+'/'+'get_camera_params.cgi?user='+user+'&pwd='+pwd+'"><\/script>');
if ((typeof pri !== "undefined") && (pri > 2))
{
     document.write('<script type="text/javascript" src="http://'+IPandPort+'/'+'get_misc.cgi?user='+user+'&pwd='+pwd+'"><\/script>');
     document.write('<script type="text/javascript" src="http://'+IPandPort+'/'+'get_params.cgi?user='+user+'&pwd='+pwd+'"><\/script>');
     document.write('<script type="text/javascript" src="http://'+IPandPort+'/'+'get_forbidden.cgi?user='+user+'&pwd='+pwd+'"><\/script>');
}
document.write('<script type="text/javascript" src="http://'+IPandPort+'/'+'english/string.js"><\/script>');
function leftup_onmousedown() 
{
    if (typeof flip !== "undefined") 
    {
	if ((flip&0x03)==0x03)
		 decoder_control_2(ptz_right_down);
	else if (flip&0x02)
		 decoder_control_2(ptz_right_up);
	else if (flip&0x01)
		 decoder_control_2(ptz_left_down);
	else		
		 decoder_control_2(ptz_left_up);
    }
}
function leftdown_onmousedown() 
{
    if (typeof flip !== "undefined") 
    {
	if ((flip&0x03)==0x03)
		 decoder_control_2(ptz_right_up);
	else if (flip&0x02)
		 decoder_control_2(ptz_right_down);
	else if (flip&0x01)
		 decoder_control_2(ptz_left_up);
	else		
		 decoder_control_2(ptz_left_down);
    }
}
function left_onmousedown() 
{
    if (typeof flip !== "undefined")
    {
	if (flip&0x02)
            decoder_control_2(pan_right);
	else	
            decoder_control_2(pan_left);
    }
}
function left_onmouseup() 
{
    if (typeof flip !== "undefined")
    {	
        if (flip&0x02)
            decoder_control_2(pan_right_stop);
	else	
	    decoder_control_2(pan_left_stop);
    }	
}
function up_onmousedown() 
{
    if (typeof flip !== "undefined")
    {
	if (flip&0x01)
            decoder_control_2(tilt_down);
	else	
            decoder_control_2(tilt_up);
    }
}
function up_onmouseup() 
{
    if (typeof flip !== "undefined")
    {
	if (flip&0x01)
            decoder_control_2(3);
	else	
            decoder_control_2(1);
    }
}
function down_onmousedown() 
{
    if (typeof flip !== "undefined")
    {
	if (flip&0x01)
            decoder_control_2(tilt_up);
	else
            decoder_control_2(tilt_down);
    }
}
function down_onmouseup() 
{
    if (typeof flip !== "undefined")
    {
	if (flip&0x01)
            decoder_control_2(1);
	else
            decoder_control_2(3);
    }	
}
function right_onmousedown() 
{
    if (typeof flip !== "undefined")
    {
	if (flip&0x02)
            decoder_control_2(pan_left);
	else	
            decoder_control_2(pan_right);
    }
}
function right_onmouseup() 
{
    if (typeof flip !== "undefined")
    {
	if (flip&0x02)
            decoder_control_2(pan_left_stop);
	else	
            decoder_control_2(pan_right_stop);
    }
}
function rightdown_onmousedown() 
{
    if (typeof flip !== "undefined")
    {
	if ((flip&0x03)==0x03)
		 decoder_control_2(ptz_left_up);
	else if (flip&0x02)
		 decoder_control_2(ptz_left_down);
	else if (flip&0x01)
		 decoder_control_2(ptz_right_up);
	else		
		 decoder_control_2(ptz_right_down);
    }
}
function rightup_onmousedown() 
{
    if (typeof flip !== "undefined")
    {
	if ((flip&0x03)==0x03)
		decoder_control_2(ptz_left_down);
	else if (flip&0x02)
		decoder_control_2(ptz_left_up);
	else if (flip&0x01)
		decoder_control_2(ptz_right_down);
	else		
		decoder_control_2(ptz_right_up);
    }
}
function redirect() 
{
    if ((typeof pri !== "undefined") && (pri == 1) && (VisitorJumpPage!=""))
              window.location = VisitorJumpPage;
    else if ((typeof pri !== "undefined") && (pri == 2) && (OperatorJumpPage!=""))
              window.location = OperatorJumpPage;
    else if ((typeof pri !== "undefined") && (pri == 3) && (AdminJumpPage!=""))
              window.location = AdminJumpPage;
}
function do_help()
{
    window.location = "http://foscam.us/forum/free-generic-browser-interface-for-foscam-mjpeg-ptz-cameras-t2522.html";
}
function do_camera_settings()
{
    window.location = 'http://'+IPandPort+'/'+'get_params.cgi?&user='+user+'&pwd='+pwd;
}
function do_camera_misc()
{
    window.location = 'http://'+IPandPort+'/'+'get_misc.cgi?&user='+user+'&pwd='+pwd;
}
function do_camera_status()
{
    window.location = 'http://'+IPandPort+'/'+'get_status.cgi?&user='+user+'&pwd='+pwd;
}
function do_camera_params()
{
    window.location = 'http://'+IPandPort+'/'+'get_camera_params.cgi?&user='+user+'&pwd='+pwd;
}
function do_log()
{
    window.location = 'http://'+IPandPort+'/'+'get_log.cgi?&user='+user+'&pwd='+pwd;
}
function do_reboot()
{
    window.location = 'http://'+IPandPort+'/'+'reboot.cgi?&user='+user+'&pwd='+pwd;
}
function left_right_onclick()
{
    if (leftright_check.checked)
    {
        pan_left = 6;
        pan_left_stop = 7;
        pan_right = 4;
        pan_right_stop = 5;
        ptz_left_up = 91;
        ptz_right_up = 90;
        ptz_left_down = 93;
        ptz_right_down = 92;
    }
    else
    {
        pan_left = 4;
        pan_left_stop = 5;
        pan_right = 6;
        pan_right_stop = 7;
        ptz_left_up = 90;
        ptz_right_up = 91;
        ptz_left_down = 92;
        ptz_right_down = 93;
    }
}
function up_down_onclick()
{
    if (updown_check.checked)
    {
        tilt_up = 2;
        tilt_down = 0;
        ptz_left_up = 92;
        ptz_right_up = 93;
        ptz_left_down = 90;
        ptz_right_down = 91;
    }
    else
    {
        tilt_up = 0;
        tilt_down = 2;
        ptz_left_up = 90;
        ptz_right_up = 91;
        ptz_left_down = 92;
        ptz_right_down = 93;
    }
}
function rip_speed_onchange(ptzr_speed)
{
    if ((lrReversed == "Y") || (leftright_check.checked))
    {
         if (typeof ptz_patrol_left_rate == "undefined") return;
         ptz_patrol_left_rate = ptzr_speed;
         action_zone.location='http://'+IPandPort+'/'+'set_misc.cgi?ptz_patrol_left_rate='+ptzr_speed+'&user='+user+'&pwd='+pwd;
    }
    else       
    {
         if (typeof ptz_patrol_right_rate == "undefined") return;
         ptz_patrol_right_rate = ptzr_speed;
         action_zone.location='http://'+IPandPort+'/'+'set_misc.cgi?ptz_patrol_right_rate='+ptzr_speed+'&user='+user+'&pwd='+pwd;
    }
}
function lep_speed_onchange(ptzl_speed)
{
    if ((lrReversed == "Y") || (leftright_check.checked))
    {
         if (typeof ptz_patrol_right_rate == "undefined") return;
         ptz_patrol_right_rate = ptzl_speed;
         action_zone.location='http://'+IPandPort+'/'+'set_misc.cgi?ptz_patrol_right_rate='+ptzl_speed+'&user='+user+'&pwd='+pwd;
    }
    else
    {
         if (typeof ptz_patrol_left_rate == "undefined") return;
         ptz_patrol_left_rate = ptzl_speed;
         action_zone.location='http://'+IPandPort+'/'+'set_misc.cgi?ptz_patrol_left_rate='+ptzl_speed+'&user='+user+'&pwd='+pwd;
    }
}
function dop_speed_onchange(ptzd_speed)
{
    if (typeof ptz_patrol_down_rate == "undefined") return;
    ptz_patrol_down_rate = ptzd_speed;
    action_zone.location='http://'+IPandPort+'/'+'set_misc.cgi?ptz_patrol_down_rate='+ptzd_speed+'&user='+user+'&pwd='+pwd;
}
function upp_speed_onchange(ptzu_speed)
{
    if (typeof ptz_patrol_up_rate == "undefined") return;
    ptz_patrol_up_rate = ptzu_speed;
    action_zone.location='http://'+IPandPort+'/'+'set_misc.cgi?ptz_patrol_up_rate='+ptzu_speed+'&user='+user+'&pwd='+pwd;
}
function ptz_speed_onchange(ptzp_speed)
{
    if (typeof ptz_patrol_rate == "undefined") return;
    ptz_patrol_rate = ptzp_speed;
    action_zone.location='http://'+IPandPort+'/'+'set_misc.cgi?ptz_patrol_rate='+ptzp_speed+'&user='+user+'&pwd='+pwd;
}
function led_mode_onchange(ledmode)
{
    if (typeof led_mode == "undefined") return;
    led_mode = ledmode;
    action_zone.location='http://'+IPandPort+'/'+'set_misc.cgi?led_mode='+led_mode+'&user='+user+'&pwd='+pwd;
}
function disable_presets_onchange(dpreset)
{
    if (typeof ptz_disable_preset == "undefined") return;
    ptz_disable_preset = dpreset;
    action_zone.location='http://'+IPandPort+'/'+'set_misc.cgi?ptz_disable_preset='+ptz_disable_preset+'&user='+user+'&pwd='+pwd;
}
function center_start_onchange(cstart)
{
    if (typeof ptz_center_onstart == "undefined") return;
    ptz_center_onstart = cstart;
    action_zone.location='http://'+IPandPort+'/'+'set_misc.cgi?ptz_center_onstart='+ptz_center_onstart+'&user='+user+'&pwd='+pwd;
}
function start_preset_onchange(spreset)
{
    if (typeof ptz_preset_onstart == "undefined") return;
    ptz_preset_onstart = spreset;
    action_zone.location='http://'+IPandPort+'/'+'set_misc.cgi?ptz_preset_onstart='+ptz_preset_onstart+'&user='+user+'&pwd='+pwd;
}
function alarm_preset_onchange(apreset)
{
    if (typeof alarm_preset == "undefined") return;
    alarm_preset = apreset;
    action_zone.location='http://'+IPandPort+'/'+'set_alarm.cgi?preset='+alarm_preset+'&user='+user+'&pwd='+pwd;
}
function ioin_alarm_level_onchange(ioin)
{
    if (typeof alarm_ioin_level == "undefined") return;
    alarm_ioin_level = ioin;
    action_zone.location='http://'+IPandPort+'/'+'set_alarm.cgi?ioin_level='+alarm_ioin_level+'&user='+user+'&pwd='+pwd;
}
function ioout_alarm_level_onchange(ioout)
{
    if (typeof alarm_ioout_level == "undefined") return;
    alarm_ioout_level = ioout;
    action_zone.location='http://'+IPandPort+'/'+'set_alarm.cgi?ioout_level='+alarm_ioout_level+'&user='+user+'&pwd='+pwd;
}
function alarm_input_armed_check_onclick()
{
    if (typeof alarm_input_armed == "undefined") return;
    if (inarmed_check.checked)
        alarm_input_armed = 1;
    else
        alarm_input_armed = 0;
    action_zone.location='http://'+IPandPort+'/'+'set_alarm.cgi?input_armed='+alarm_input_armed+'&user='+user+'&pwd='+pwd;
}
function alarm_iolinkage_check_onclick()
{
    if (typeof alarm_iolinkage == "undefined") return;
    if (iolink_check.checked)
        alarm_iolinkage = 1;
    else
        alarm_iolinkage = 0;
    action_zone.location='http://'+IPandPort+'/'+'set_alarm.cgi?iolinkage='+alarm_iolinkage+'&user='+user+'&pwd='+pwd;
}
function http_check_onclick()
{
    if ((typeof alarm_http == "undefined") || (typeof alarm_http_url == "undefined")) return;
    if ((http_text.value.substring(0, 7).toLowerCase() != "http://") && (http_check.checked))
    {
         http_text.value = "";
         http_check.checked = false;
         return;
    }  
    if (http_check.checked)
    {
        alarm_http = 1;
        alarm_http_url = http_text.value;
    }
    else
    {
        alarm_http = 0;
        if (http_text.value == "")
            alarm_http_url = "";
    }        
    action_zone.location='http://'+IPandPort+'/'+'set_alarm.cgi?http='+alarm_http+'&http_url='+alarm_http_url+'&user='+user+'&pwd='+pwd;
}
function email_Url_check_onclick()
{
    if (typeof mail_inet_ip == "undefined") return;
    if (url_check.checked)
        mail_inet_ip = 1;
    else
        mail_inet_ip = 0;
    var our_temp_location = 'http://'+IPandPort+'/'+'set_mail.cgi?sender='+encodeURIComponent(mail_sender)+'&receiver1='+encodeURIComponent(mail_receiver1)+'&receiver2='+encodeURIComponent(mail_receiver2)+'&receiver3='+encodeURIComponent(mail_receiver3)+'&receiver4='+encodeURIComponent(mail_receiver4)+'&svr='+encodeURIComponent(mail_svr)+'&port='+((mail_port=='')?25:mail_port)+'&mail_inet_ip='+mail_inet_ip+'&user='+mail_user+'&pwd='+mail_pwd;
    if (typeof mail_tls !== "undefined") 
        our_temp_location+='&tls='+mail_tls;
    our_temp_location+='&cam_user='+user+'&cam_pwd='+pwd;
    action_zone.location=our_temp_location;
}
function email_check_onclick()
{
    if (typeof alarm_mail == "undefined") return;
    if (email_check.checked)
        alarm_mail = 1;
    else
        alarm_mail = 0;
    action_zone.location='http://'+IPandPort+'/'+'set_alarm.cgi?mail='+alarm_mail+'&user='+user+'&pwd='+pwd;
}
function ftp_now_interval_onchange(ftp_int)
{
    if (typeof ftp_upload_interval == "undefined") return;
    ftp_upload_interval = ftp_int;
    action_zone.location='http://'+IPandPort+'/'+'set_ftp.cgi?upload_interval='+ftp_upload_interval+'&cam_user='+user+'&cam_pwd='+pwd;
}
function ftp_schedule_onclick()
{
    if (typeof ftp_schedule_enable == "undefined") return;
    if (ftps_check.checked)
        ftp_schedule_enable = 1;
    else
        ftp_schedule_enable = 0;
    action_zone.location='http://'+IPandPort+'/'+'set_ftp.cgi?schedule_enable='+ftp_schedule_enable+'&cam_user='+user+'&cam_pwd='+pwd;
}
function ftp_alarm_interval_onchange(ftp_int)
{
    if (typeof alarm_upload_interval == "undefined") return;
    alarm_upload_interval = ftp_int;
    action_zone.location='http://'+IPandPort+'/'+'set_alarm.cgi?upload_interval='+alarm_upload_interval+'&user='+user+'&pwd='+pwd;
}
function sound_sensitivity_onchange(so_sensitivity)
{
    if (typeof alarm_sounddetect_sensitivity == "undefined") return;
    alarm_sounddetect_sensitivity = so_sensitivity;
    action_zone.location='http://'+IPandPort+'/'+'set_alarm.cgi?sounddetect_sensitivity='+alarm_sounddetect_sensitivity+'&user='+user+'&pwd='+pwd;
}
function sound_check_onclick()
{
    if (typeof alarm_sounddetect_armed == "undefined") return;
    if (sound_check.checked)
        alarm_sounddetect_armed = 1;
    else
        alarm_sounddetect_armed = 0;
    action_zone.location='http://'+IPandPort+'/'+'set_alarm.cgi?sounddetect_armed='+alarm_sounddetect_armed+'&user='+user+'&pwd='+pwd;
}
function motion_compensation_onclick()
{
    if (typeof alarm_motion_compensation == "undefined") return;
    if (mocomp_check.checked)
        alarm_motion_compensation = 1;
    else
        alarm_motion_compensation = 0;
    action_zone.location='http://'+IPandPort+'/'+'set_alarm.cgi?motion_compensation='+alarm_motion_compensation+'&user='+user+'&pwd='+pwd;
}
function motion_sensitivity_onchange(mo_sensitivity)
{
    if (typeof alarm_motion_sensitivity == "undefined") return;
    alarm_motion_sensitivity = mo_sensitivity;
    action_zone.location='http://'+IPandPort+'/'+'set_alarm.cgi?motion_sensitivity='+alarm_motion_sensitivity+'&user='+user+'&pwd='+pwd;
}
function motion_check_onclick()
{
    if (typeof alarm_motion_armed == "undefined") return;
    if (motion_check.checked)
        alarm_motion_armed = 1;
    else
        alarm_motion_armed = 0;
    action_zone.location='http://'+IPandPort+'/'+'set_alarm.cgi?motion_armed='+alarm_motion_armed+'&user='+user+'&pwd='+pwd;
}
function alarm_schedule_onclick()
{
    if (typeof alarm_schedule_enable == "undefined") return;
    if (schedule_check.checked)
        alarm_schedule_enable = 1;
    else
        alarm_schedule_enable = 0;
    action_zone.location='http://'+IPandPort+'/'+'set_alarm.cgi?schedule_enable='+alarm_schedule_enable+'&user='+user+'&pwd='+pwd;
}
function forbidden_schedule_onclick()
{
    if (typeof schedule_enable == "undefined") return;
    if (forbidden_check.checked)
        schedule_enable = 1;
    else
        schedule_enable = 0;
    action_zone.location='http://'+IPandPort+'/'+'set_forbidden.cgi?schedule_enable='+schedule_enable+'&schedule_sun_0='+schedule_sun_0+'&schedule_sun_1='+schedule_sun_1+'&schedule_sun_2='+schedule_sun_2+'&schedule_mon_0='+schedule_mon_0+'&schedule_mon_1='+schedule_mon_1+'&schedule_mon_2='+schedule_mon_2+'&schedule_tue_0='+schedule_tue_0+'&schedule_tue_1='+schedule_tue_1+'&schedule_tue_2='+schedule_tue_2+'&schedule_wed_0='+schedule_wed_0+'&schedule_wed_1='+schedule_wed_1+'&schedule_wed_2='+schedule_wed_2+'&schedule_thu_0='+schedule_thu_0+'&schedule_thu_1='+schedule_thu_1+'&schedule_thu_2='+schedule_thu_2+'&schedule_fri_0='+schedule_fri_0+'&schedule_fri_1='+schedule_fri_1+'&schedule_fri_2='+schedule_fri_2+'&schedule_sat_0='+schedule_sat_0+'&schedule_sat_1='+schedule_sat_1+'&schedule_sat_2='+schedule_sat_2+'&user='+user+'&pwd='+pwd;
}
function send_test_mail()
{
    action_zone.location='http://'+IPandPort+'/'+'test_mail.cgi?user='+user+'&pwd='+pwd;
}
function send_test_ftp()
{
    action_zone.location='http://'+IPandPort+'/'+'test_ftp.cgi?user='+user+'&pwd='+pwd;
}
var myXYPositionChanged=false; 
function decoder_control_2(command)
{
    if ((typeof pri !== "undefined") && (pri > 1))
    {
         if (!myXYPositionChanged)
              myXYPositionChanged=true;
         action_zone.location='http://'+IPandPort+'/'+'decoder_control.cgi?user='+user+'&pwd='+pwd+'&command='+command;
    }
}
function camera_control_2(param,value)
{
    if ((typeof pri !== "undefined") && (pri > 1))
         action_zone.location='http://'+IPandPort+'/'+'camera_control.cgi?user='+user+'&pwd='+pwd+'&param='+param+'&value='+value;
}
function set_M(v,_v)
{
    camera_control_2(v,_v);
}
function resolution_changed(command)
{
    if (typeof resolution !== "undefined")
    {
        set_M(0, command);
        resolution = command;
        $('#img1').dblclick();
    }
}
function getwith (to,p)
{
    var myForm = document.createElement("form");
    myForm.method="get";
    myForm.action = to;
    for (var k in p) 
    {
         var myInput = document.createElement("input");
         myInput.setAttribute("name", goforit(k));
         myInput.setAttribute("value", goforit(p[k]));
         myForm.appendChild(myInput);
    }
    document.body.appendChild(myForm);
    myForm.submit();
    document.body.removeChild(myForm);
}
function body_onload()
{
    if ((IPandPort != "") && (typeof pri !== "undefined") && (pri > 0))
    {
         if (navigator.appName.indexOf("Microsoft IE Mobile") != -1)
         {
	     preload();
	     changesrc();
	     return;
         }
         startonload();
         if ((pri == 1) && (VisitorFPS !=""))
                   MyFPS = VisitorFPS;
         else if ((pri == 2) && (OperatorFPS !=""))
                   MyFPS = OperatorFPS;
         else if ((pri == 3) && (AdminFPS !=""))
                   MyFPS = AdminFPS;
         if ((DisplayStatsEvery != "") && (((pri == 1) && (StatsForVisitor != "")) || ((pri == 2) && (StatsForOperator != "")) || ((pri == 3) && (StatsForAdmin != ""))))
         {
              statsOn = true;
              startTime = new Date();
              countFPS = 0;
              totalKBps = 0;
              setInterval("reload_count()", (DisplayStatsEvery * 1000));
         }
         if ((typeof alias !== "undefined") && (DisplayCameraName != ""))
              $("#CameraName").text(alias);
         document.getElementById('Container').style.display = 'block';
         document.getElementById('Container').style.visibility = 'visible';
         if ((DisplayZoomButtons == "A" && isTouchDevice) && MyZoom > 0)
         {
              document.getElementById('ZoomButtons').style.display = 'block';
              document.getElementById('ZoomButtons').style.visibility = 'visible';
         }
         if (((pri == 1) && (VisitorChangeInternalFPS != "")) || ((pri == 2) && (OperatorChangeInternalFPS != "")) || ((pri == 3) && (AdminChangeInternalFPS != "")))
         {
               $('#IntFPS').val(MyFPS);
               if (document.getElementById('IntFPS').selectedIndex == -1)
               {
                   document.getElementById('IntFPS').options[0].value = MyFPS;
                   $('#IntFPS').val(MyFPS);
               }
               else
                   document.getElementById('IntFPS').options[0].value = MyFPS;               
               document.getElementById('InternalFPS').style.display = 'block';
               document.getElementById('InternalFPS').style.visibility = 'visible';
         }     
         if (pri > 1)
         {                           
             if ((pri == 3) || (ShowChangePosition1 !=""))
             {
                  document.getElementById('Oper1').style.display = 'block';
                  document.getElementById('Oper1').style.visibility = 'visible';
             }
             if (pri == 3)
             {
                 if (ptz_patrol_rate !== "undefined")
                 {
                     document.getElementById('PtzSpeed').options[0].value = ptz_patrol_rate;
                     $('#PtzSpeed').val(ptz_patrol_rate);
                     if ($("#PtzSpeed option:selected").index() == 0)
                         document.getElementById('PtzSpeed').options[0].text = ptz_patrol_rate; 
                 }
                 if (typeof alarm_schedule_enable !== "undefined")
                     schedule_check.checked = alarm_schedule_enable?true:false;
                 if (typeof schedule_enable !== "undefined")
                     forbidden_check.checked = schedule_enable?true:false;
                 if (typeof alarm_motion_armed !== "undefined")
                     motion_check.checked = alarm_motion_armed?true:false;
                 if (typeof alarm_motion_sensitivity !== "undefined")
                     $('#Mosense').val(alarm_motion_sensitivity);
                 if (typeof alarm_motion_compensation !== "undefined")
                     mocomp_check.checked = alarm_motion_compensation?true:false;
                 if (typeof alarm_sounddetect_armed !== "undefined")
                     sound_check.checked = alarm_sounddetect_armed?true:false;
                 if (typeof alarm_sounddetect_sensitivity !== "undefined")
                     $('#Sosense').val(alarm_sounddetect_sensitivity);
                 if ((typeof ftp_svr !== "undefined") && (ftp_svr != ""))
                 {
                      if ((typeof alarm_upload_interval !== "undefined") && (alarm_upload_interval > 0))
                      {
                           document.getElementById('Ftpa').options[0].value = alarm_upload_interval;
                           $('#Ftpa').val(alarm_upload_interval);
                           if ($("#Ftpa option:selected").index() == 0)
                               document.getElementById('Ftpa').options[0].text = alarm_upload_interval; 
                      }
                      else
                           $('#Ftpa').val(0);
                      if (typeof ftp_schedule_enable !== "undefined")
                          ftps_check.checked = ftp_schedule_enable?true:false;
                      if ((typeof ftp_upload_interval !== "undefined") && (ftp_upload_interval > 0))
                      {
                           document.getElementById('Ftpn').options[0].value = ftp_upload_interval;
                           $('#Ftpn').val(ftp_upload_interval);
                           if ($("#Ftpn option:selected").index() == 0)
                               document.getElementById('Ftpn').options[0].text = ftp_upload_interval; 
                      }
                      else
                           $('#Ftpn').val(0);
                      document.getElementById('Ftpainfo').style.display = 'block';
                      document.getElementById('Ftpainfo').style.visibility = 'visible';
                      document.getElementById('Ftpninfo').style.display = 'block';
                      document.getElementById('Ftpninfo').style.visibility = 'visible';
                 }
                 if ((typeof mail_svr !== "undefined") && (mail_svr != ""))
                 {
                      if (typeof alarm_mail !== "undefined")
                          email_check.checked = alarm_mail?true:false;
                      if (typeof mail_inet_ip !== "undefined")
                          url_check.checked = mail_inet_ip?true:false;
                      document.getElementById('Emaila').style.display = 'block';
                      document.getElementById('Emaila').style.visibility = 'visible';
                 }
                 if ((typeof alarm_http !== "undefined") && (typeof alarm_http_url !== "undefined"))
                 {
                      http_check.checked = alarm_http?true:false;
                      if (alarm_http_url != "")
                          document.getElementById('http_text').value = decodeURIComponent(alarm_http_url);
                      document.getElementById('Httpa').style.display = 'block';
                      document.getElementById('Httpa').style.visibility = 'visible';
                 }
                 if (typeof alarm_iolinkage !== "undefined")
                     iolink_check.checked = alarm_iolinkage?true:false;
                 if (typeof alarm_input_armed !== "undefined")
                     inarmed_check.checked = alarm_input_armed?true:false;
                 if ((typeof alarm_ioin_level !== "undefined") && (alarm_ioin_level == 1))
                      $('#Ioin').val(1);
                 else
                      $('#Ioin').val(0);
                 if ((typeof alarm_ioout_level !== "undefined") && (alarm_ioout_level == 1))
                      $('#Ioout').val(1);
                 else
                      $('#Ioout').val(0);
                 if ((typeof alarm_preset !== "undefined") && (alarm_preset > 0))
                 {
                      document.getElementById('Apreset').options[0].value = alarm_preset;
                      $('#Apreset').val(alarm_preset);
                      if ($("#Apreset option:selected").index() == 0)
                          document.getElementById('Apreset').options[0].text = alarm_preset; 
                 }
                 else
                      $('#Apreset').val(0);
                 if ((typeof ptz_preset_onstart !== "undefined") && (ptz_preset_onstart > 0))
                 {
                      document.getElementById('Spreset').options[0].value = ptz_preset_onstart;
                      $('#Spreset').val(ptz_preset_onstart);
                      if ($("#Spreset option:selected").index() == 0)
                          document.getElementById('Spreset').options[0].text = ptz_preset_onstart; 
                 }
                 else
                      $('#Spreset').val(0);
                 if ((typeof ptz_disable_preset !== "undefined") && (ptz_disable_preset == 1))
                      $('#Dpresets').val(1);
                 else
                      $('#Dpresets').val(0);
                 if ((typeof ptz_center_onstart !== "undefined") && (ptz_center_onstart == 1))
                      $('#Cstart').val(1);
                 else
                      $('#Cstart').val(0);
                 if (typeof led_mode !== "undefined")
                     $('#Ledmode').val(led_mode);
                 else
                     $('#Ledmode').val(0);
                 if (ptz_patrol_up_rate !== "undefined")
                 {
                     document.getElementById('PtzUSpeed').options[0].value = ptz_patrol_up_rate;
                     $('#PtzUSpeed').val(ptz_patrol_up_rate);
                     if ($("#PtzUSpeed option:selected").index() == 0)
                         document.getElementById('PtzUSpeed').options[0].text = ptz_patrol_up_rate; 
                 }
                 if (ptz_patrol_down_rate !== "undefined")
                 {
                     document.getElementById('PtzDSpeed').options[0].value = ptz_patrol_down_rate;
                     $('#PtzDSpeed').val(ptz_patrol_down_rate);
                     if ($("#PtzDSpeed option:selected").index() == 0)
                         document.getElementById('PtzDSpeed').options[0].text = ptz_patrol_down_rate; 
                 }
                 if (ptz_patrol_left_rate !== "undefined")
                 {
                     if (lrReversed == "Y")
                     {
                         document.getElementById('PtzLSpeed').options[0].value = ptz_patrol_right_rate;
                         $('#PtzLSpeed').val(ptz_patrol_right_rate);
                         if ($("#PtzLSpeed option:selected").index() == 0)
                             document.getElementById('PtzLSpeed').options[0].text = ptz_patrol_right_rate;
                     }
                     else
                     {
                         document.getElementById('PtzLSpeed').options[0].value = ptz_patrol_left_rate;
                         $('#PtzLSpeed').val(ptz_patrol_left_rate);
                         if ($("#PtzLSpeed option:selected").index() == 0)
                             document.getElementById('PtzLSpeed').options[0].text = ptz_patrol_left_rate;
                     } 
                 }
                 if (ptz_patrol_right_rate !== "undefined")
                 {
                     if (lrReversed == "Y")
                     {
                         document.getElementById('PtzRSpeed').options[0].value = ptz_patrol_left_rate;
                         $('#PtzRSpeed').val(ptz_patrol_left_rate);
                         if ($("#PtzRSpeed option:selected").index() == 0)
                             document.getElementById('PtzRSpeed').options[0].text = ptz_patrol_left_rate;
                     }
                     else
                     {
                         document.getElementById('PtzRSpeed').options[0].value = ptz_patrol_right_rate;
                         $('#PtzRSpeed').val(ptz_patrol_right_rate);
                         if ($("#PtzRSpeed option:selected").index() == 0)
                             document.getElementById('PtzRSpeed').options[0].text = ptz_patrol_right_rate;
                     } 
                 }
                 document.getElementById('Admincontrols').style.display = 'block';
                 document.getElementById('Admincontrols').style.visibility = 'visible';
             }
             if ((pri == 3) || (ShowChangePosition2 !=""))
             {
                  document.getElementById('Oper2').style.display = 'block';
                  document.getElementById('Oper2').style.visibility = 'visible';
             }            
             if ((pri == 3) || (ShowGoToPresets !=""))
             {
                  document.getElementById('GoToPresets').style.display = 'block';
                  document.getElementById('GoToPresets').style.visibility = 'visible';
             }
             if ((pri == 3) || (ShowSetPresets !=""))
             {
                  document.getElementById('SetPresets').style.display = 'block';
                  document.getElementById('SetPresets').style.visibility = 'visible';
             }
             if (((pri == 3) || (ShowResMode !="")) && ((typeof mode !== "undefined") && (typeof resolution !== "undefined")))
             {
                   $('#RealResolution').val(resolution);
                   $('#RealMode').val(mode);    
                   document.getElementById('CameraResMode').style.display = 'block';
                   document.getElementById('CameraResMode').style.visibility = 'visible';
             }
             if ((pri == 3) || (ShowHPatrol !=""))
             {
                  document.getElementById('PatrolH').style.display = 'block';
                  document.getElementById('PatrolH').style.visibility = 'visible';
             }
             if ((pri == 3) || (ShowVPatrol !=""))
             {
                  document.getElementById('PatrolV').style.display = 'block';
                  document.getElementById('PatrolV').style.visibility = 'visible';
             }
             if (((pri == 3) || (ShowFlip !="")) && (typeof flip !== "undefined"))
             {
                   $('#FlipSetting').val(flip);
                   document.getElementById('CameraFlip').style.display = 'block';
                   document.getElementById('CameraFlip').style.visibility = 'visible';
             }
             if (((pri == 3) || (ShowBrightContrast !="")) && ((typeof brightness !== "undefined") && (typeof contrast !== "undefined")))
             {
                   if ((brightness > 0) && (brightness < 240))
                            $('#Bright').val(Math.round(brightness) / 16);
                   else if (brightness == 0)
                            $('#Bright').val(0);
                   else if (brightness > 239)
                            $('#Bright').val(15);
                   $('#Cont').val(contrast);   
                   document.getElementById('BrightContrast').style.display = 'block';
                   document.getElementById('BrightContrast').style.visibility = 'visible';
             }
             if ((pri == 3) || (ShowIR !=""))
             {
                  document.getElementById('IRStatus').style.display = 'block';
                  document.getElementById('IRStatus').style.visibility = 'visible';
             }
             if ((pri == 3) || (pri == 2))
             {
                  if (lrReversed == "Y")
                  {
                      pan_left = 6;
                      pan_left_stop = 7;
                      pan_right = 4;
                      pan_right_stop = 5;
                      ptz_left_up = 91;
                      ptz_right_up = 90;
                      ptz_left_down = 93;
                      ptz_right_down = 92;
                  }
                  if ((ShowLeftRight !="") || (pri == 3))
                  {
                       if (lrReversed == "Y")
                           leftright_check.checked = true;
                       document.getElementById('Lrflipped').style.display = 'block';
                       document.getElementById('Lrflipped').style.visibility = 'visible';
                  }
             }
             if ((pri == 3) || (pri == 2))
             {
                  if (udReversed == "Y")
                  {
                      tilt_up = 2;
                      tilt_down = 0;
                      ptz_left_up = 92;
                      ptz_right_up = 93;
                      ptz_left_down = 90;
                      ptz_right_down = 91;
                  }
                  if ((ShowUpDown !="") || (pri == 3))
                  {
                       if (udReversed == "Y")
                           updown_check.checked = true;
                       document.getElementById('Udflipped').style.display = 'block';
                       document.getElementById('Udflipped').style.visibility = 'visible';
                  }
             }
             if ((typeof resolution !== "undefined") && (MyResolution != -1))
             {
                  set_M(0,MyResolution);
                  resolution = MyResolution;
                  $('#RealResolution').val(resolution);
             }
             if ((pri == 3) && (showOtherCameras == "Y"))
             {
                  if ((typeof dev2_host !== "undefined") && (typeof dev2_alias !== "undefined") && (dev2_host != ""))
                  {
                       $('#a_Camera2').text('2 ' + dev2_alias);
                       document.getElementById('Camera2').style.display = 'block';
                       document.getElementById('Camera2').style.visibility = 'visible';
                  }
                  if ((typeof dev3_host !== "undefined") && (typeof dev3_alias !== "undefined") && (dev3_host != ""))
                  {
                       $('#a_Camera3').text('3 '+ dev3_alias);
                       document.getElementById('Camera3').style.display = 'block';
                       document.getElementById('Camera3').style.visibility = 'visible';
                  }
                  if ((typeof dev4_host !== "undefined") && (typeof dev4_alias !== "undefined") && (dev4_host != ""))
                  {
                       $('#a_Camera4').text('4 '+ dev4_alias);
                       document.getElementById('Camera4').style.display = 'block';
                       document.getElementById('Camera4').style.visibility = 'visible';
                  }
                  if ((typeof dev5_host !== "undefined") && (typeof dev5_alias !== "undefined") && (dev5_host != ""))
                  {
                       $('#a_Camera5').text('5 '+ dev5_alias);
                       document.getElementById('Camera5').style.display = 'block';
                       document.getElementById('Camera5').style.visibility = 'visible';
                  }
                  if ((typeof dev6_host !== "undefined") && (typeof dev6_alias !== "undefined") && (dev6_host != ""))
                  {
                       $('#a_Camera6').text('6 '+ dev6_alias);
                       document.getElementById('Camera6').style.display = 'block';
                       document.getElementById('Camera6').style.visibility = 'visible';
                  }
                  if ((typeof dev7_host !== "undefined") && (typeof dev7_alias !== "undefined") && (dev7_host != ""))
                  {
                       $('#a_Camera7').text('7 '+ dev7_alias);
                       document.getElementById('Camera7').style.display = 'block';
                       document.getElementById('Camera7').style.visibility = 'visible';
                  }
                  if ((typeof dev8_host !== "undefined") && (typeof dev8_alias !== "undefined") && (dev8_host != ""))
                  {
                       $('#a_Camera8').text('8 '+ dev8_alias);
                       document.getElementById('Camera8').style.display = 'block';
                       document.getElementById('Camera8').style.visibility = 'visible';
                  }
                  if ((typeof dev9_host !== "undefined") && (typeof dev9_alias !== "undefined") && (dev9_host != ""))
                  {
                       $('#a_Camera9').text('9 '+ dev9_alias);
                       document.getElementById('Camera9').style.display = 'block';
                       document.getElementById('Camera9').style.visibility = 'visible';
                  }
             }
         }    
         if ((pri == 1) && (VisitorTimeout !=""))
                   redirectTimerId = window.setTimeout('redirect()', VisitorTimeout);
         else if ((pri == 2) && (OperatorTimeout !=""))
                   redirectTimerId = window.setTimeout('redirect()', OperatorTimeout);
         else if ((pri == 3) && (AdminTimeout !=""))
                   redirectTimerId = window.setTimeout('redirect()', AdminTimeout);
    }
    window.status='';
}
function body_onunload()
{
    if (((typeof pri !== "undefined") && (pri > 1)) && ((myXYPositionChanged) && (((pri == 2) && (OperatorGoToPre1 !="")) || ((pri == 3) && (AdminGoToPre1 !="")))))
          action_zone.location = 'http://'+IPandPort+'/'+'decoder_control.cgi?user='+user+'&pwd='+pwd+'&command=31';
}	
function load_video()
{
    window.status=" ";
    setTimeout("update()", MyFPS);
}
function takeError1()
{
    img1.src = "http://"+IPandPort+"/"+"snapshot.cgi?user="+user+"&pwd="+pwd+"&count="+(unique_name++);
}
function takeError()
{
    img.src = "http://"+IPandPort+"/"+"snapshot.cgi?user="+user+"&pwd="+pwd+"&count="+(unique_name++);
}
function startonload()
{
    if (isChrome)
    {
        img1.src = "http://"+IPandPort+"/"+"snapshot.cgi?user="+user+"&pwd="+pwd+"&count="+(unique_name++);
        imgObj = document.getElementById('img1');
        img = imgObj;
        img.onerror = takeError;
        img.onload = load_video;
    }
    else
    {
        img.onerror = takeError;
        img1.onerror = takeError1;
        img.onload = load_video;
        img.src = "http://"+IPandPort+"/"+"snapshot.cgi?user="+user+"&pwd="+pwd+"&count="+(unique_name++);
    }
}
function preload()
{
    img.src= "http://"+IPandPort+"/"+"snapshot.cgi?user="+user+"&pwd="+pwd+"&count="+(unique_name++);
}
function changesrc()
{
    img1.src = img.src;
    preload();
    setTimeout(changesrc,MyFPS);
}
var updateFirstRun = 1;
function update()
{
    if ((typeof pri !== "undefined") && (pri > 0))
    {
         imgObj = document.getElementById('img1');
         if (!isChrome) imgObj.src = img.src;
         img.src= "http://"+IPandPort+"/"+"snapshot.cgi?user="+user+"&pwd="+pwd+"&count="+(unique_name++);
         if (firstTime)
         {
             if (JustifyLeft == "")
             {
                 var aa = document.getElementById('testing123'); 
                 aa.style.cssText= 'FLOAT:none';
             }
             document.getElementById('testing123').style.display = 'block';
             document.getElementById('testing123').style.visibility = 'visible';
             firstTime = false;
         }
         if (statsOn)
         {
             if (isIE)
                 totalKBps = totalKBps + parseFloat(document.getElementById("img1").fileSize);
             countFPS++;
         }
    }
    window.status=" ";
}
function reload_count()
{
    var reCalc = 0;
    if (MyFPS > (DisplayStatsEvery * 1000) && (MyFPS > 1000))
        reCalc = Math.round(MyFPS/1000);
    else
        reCalc = DisplayStatsEvery;
    if ((isIE) && (countFPS > 0) && (totalKBps > 0))
    {
         if ((typeof alias !== "undefined") && (DisplayCameraName != ""))
              $("#CameraName").text(alias + " - FPS: " + (countFPS / reCalc).toFixed(2) + " - Bps: " + Math.round((totalKBps/reCalc)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
         else
              $("#CameraName").text("FPS: " + (countFPS / reCalc).toFixed(2) + " - Bps: " + Math.round((totalKBps/reCalc)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    }
    else if (countFPS > 0)
             if ((typeof alias !== "undefined") && (DisplayCameraName != ""))
                  $("#CameraName").text(alias + " - FPS: " + (countFPS / reCalc).toFixed(2));
             else
                  $("#CameraName").text("FPS: " + (countFPS / reCalc).toFixed(2));
    if (countFPS > 0)
    {
        countFPS = 0;
        totalKBps = 0;
        startTime = new Date();
        endTime = new Date();
    }     
}