
// Initialize your app
var myApp = new Framework7({
swipePanel: 'right',
precompileTemplates: true, //
template7Pages: true,
template7Data: {
        // This context will applied for page/template with "about.html" URL
        'Photons': {
            'details': [
                {
                    name:'JavaScript',
                    description: 'Dynamic computer programming language[5]. It is most commonly used as part of web browsers, whose implementations allow...',
					PhotonName: 'Testing name'
                },
                {
                    name:'CSS',
                    description: 'Style sheet language used for describing the look and formatting of a document written in a markup language...'
                },
            ]            
        }
	}

});
 
// Export selectors engine
var $$ = Dom7;
var storedData = myApp.formGetData('my-form2');
if(storedData) {
  
  $$('.Switch-1').html(storedData.S1pinName);
  $$('.Switch-2').html(storedData.S2pinName);
  $$('.Switch-3').html(storedData.S3pinName);
  $$('.Switch-4').html(storedData.S4pinName);
  $$('.Switch-5').html(storedData.S5pinName);
   getPhotons();
   
}


$$('.close').on('click', function () {
  myApp.sortableClose('.sortable');
});

$$('.panel-left').on('opened', function () {
    var storedData = myApp.formGetData('my-form2');
	var q = 'https://api.particle.io/v1/devices/' + storedData.DeviceID + '/tempf/?access_token=' + storedData.token;
	    $$.get(q, function (results) {
            results = JSON.parse(results);
    		$$('#val1').html(results.result);
	    });
	$$('.swipeout-hide').on('click', function() {
		
		
	});
});

$$('.garage-left').on('click', function() {
    var storedData = myApp.formGetData('my-form2');	
	var q = 'https://api.particle.io/v1/devices/' + storedData.DeviceID + '/toggleRelay/';
    $$.post(q, {access_token: storedData.token, val: storedData.Lpin}, function (data) {
		if($$('.leftdoor').hasClass('garage-closed')){
			$$('.leftdoor').removeClass('garage-closed');
			$$('.leftdoor').addClass('garage-open');
			$$('.leftdoor').html('<img src=\'img/garage_open_l.gif\' alt=\'closed\' height=\'45\' width=\'45\'>');
			console.log('Door Open:');
		}else {
			$$('.leftdoor').removeClass('garage-open');
			$$('.leftdoor').addClass('garage-closed');
			$$('.leftdoor').html('<img src=\'img/garage_close_l.gif\' alt=\'closed\' height=\'45\' width=\'45\'>');
			console.log('Door Closed:');
		}
		
		
		console.log('Load was performed:' + storedData.Lpin);
		
	});
});
$$('.garage-right').on('click', function() {
    var storedData = myApp.formGetData('my-form2');	
	
	
	var q = 'https://api.particle.io/v1/devices/' + storedData.DeviceID + '/toggleRelay/';
    $$.post(q, {access_token: storedData.token, val: storedData.Rpin}, function (data) {
		
		if($$('.rightdoor').hasClass('garage-closed')){
			$$('.rightdoor').removeClass('garage-closed');
			$$('.rightdoor').addClass('garage-open');
			$$('.rightdoor').html('<img src=\'img/garage_open_r.gif\' alt=\'closed\' height=\'45\' width=\'45\'>');
			console.log('Door Open:');
		}else {
			$$('.rightdoor').removeClass('garage-open');
			$$('.rightdoor').addClass('garage-closed');
			$$('.rightdoor').html('<img src=\'img/garage_close_r.gif\' alt=\'closed\' height=\'45\' width=\'45\'>');
			console.log('Door Closed:');
		}
		console.log('Load was performed:' + storedData.Rpin);
	});
});
$$('.Switch-1').on('click', function() {
    var storedData = myApp.formGetData('my-form2');	
	var q = 'https://api.particle.io/v1/devices/' + storedData.DeviceID + '/switchRelay/';
    $$.post(q, {access_token: storedData.token, val: storedData.S1pin}, function (data) {
		if ($$('.Switch-1').hasClass('color-red')){
		$$('.Switch-1').removeClass('color-red');
		$$('.Switch-1').addClass('color-green');
		}else{
		$$('.Switch-1').removeClass('color-green');
		$$('.Switch-1').addClass('color-red');
		}
	});
});
$$('.Switch-2').on('click', function() {
    var storedData = myApp.formGetData('my-form2');	
	var q = 'https://api.particle.io/v1/devices/' + storedData.DeviceID + '/switchRelay/';
    $$.post(q, {access_token: storedData.token, val: storedData.S2pin}, function (data) {
		if ($$('.Switch-2').hasClass('color-red')){
		$$('.Switch-2').removeClass('color-red');
		$$('.Switch-2').addClass('color-green');
		}else{
		$$('.Switch-2').removeClass('color-green');
		$$('.Switch-2').addClass('color-red');
		}
	});
});
$$('.Switch-3').on('click', function() {
    var storedData = myApp.formGetData('my-form2');	
	var q = 'https://api.particle.io/v1/devices/' + storedData.DeviceID + '/switchRelay/';
    $$.post(q, {access_token: storedData.token, val: storedData.S3pin}, function (data) {
		if ($$('.Switch-3').hasClass('color-red')){
		$$('.Switch-3').removeClass('color-red');
		$$('.Switch-3').addClass('color-green');
		}else{
		$$('.Switch-3').removeClass('color-green');
		$$('.Switch-3').addClass('color-red');
		}
	});
});
$$('.Switch-4').on('click', function() {
    var storedData = myApp.formGetData('my-form2');	
	var q = 'https://api.particle.io/v1/devices/' + storedData.DeviceID + '/switchRelay/';
    $$.post(q, {access_token: storedData.token, val: storedData.S4pin}, function (data) {
		if ($$('.Switch-4').hasClass('color-red')){
		$$('.Switch-4').removeClass('color-red');
		$$('.Switch-4').addClass('color-green');
		}else{
		$$('.Switch-4').removeClass('color-green');
		$$('.Switch-4').addClass('color-red');
		}
	});
});
$$('.Switch-5').on('click', function() {
    var storedData = myApp.formGetData('my-form2');	
	var q = 'https://api.particle.io/v1/devices/' + storedData.DeviceID + '/switchRelay/';
    $$.post(q, {access_token: storedData.token, val: storedData.S5pin}, function (data) {
		if ($$('.Switch-5').hasClass('color-red')){
		$$('.Switch-5').removeClass('color-red');
		$$('.Switch-5').addClass('color-green');
		}else{
		$$('.Switch-5').removeClass('color-green');
		$$('.Switch-5').addClass('color-red');
		}
	});
});
	
// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
	
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
});

myApp.onPageInit('form', function (page) {
    // run createContentPage func after link was clicked
	if(storedData){
	var q = 'https://api.particle.io/v1/devices/' + storedData.DeviceID + '/?access_token=' + storedData.token;
	    $$.get(q, function (results) {
            results = JSON.parse(results);
    		$$('#photon-name').html('Device Name: ' + results.name);
	    });
}

 
$$('.delete-storage-data').on('click', function() {
  //$$('#my-form2').attr('id', 'my-form3');
   //var storedData1 = myApp.formStoreData('my-form3');
   //storedData = myApp.formGetData('my-form2');
  
  //$$('input#ParticleToken').val('');
  //$$('input#ParticleID').val('');
  //myApp.alert(storedData1)
  //storedData1 = myApp.formGetData('#my-form3');
  //myApp.alert($$('#my-form3').attr('class'))
  //myApp.alert(storedData1)
  
});
 
$$('.save-storage-data').on('click', function() {
  
  var storedData = myApp.formStoreData('my-form2');
  storedData = myApp.formGetData('my-form2');
  
  $$('.Switch-1').html(storedData.S1pinName);
  $$('.Switch-2').html(storedData.S2pinName);
  $$('.Switch-3').html(storedData.S3pinName);
  $$('.Switch-4').html(storedData.S4pinName);
  $$('.Switch-5').html(storedData.S5pinName);
  
});
});

// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage() {
var q = 'https://api.particle.io/v1/devices/?access_token=' + storedData.token;
	    $$.get(q, function (results) {
            results = JSON.parse(results);
    		mainView.router.load({
				template: Template7.templates.PhotonsTemplate,
				url: 'language-details.html',
				context: {
					name:results[0].name,
                    description: results[0].id					
				}
			});
	   });

	return;
}
function getPhotons(){
var q = 'https://api.particle.io/v1/devices/?access_token=' + storedData.token;
	    $$.get(q, function (results) {
            results = JSON.parse(results);
    		
	    });
}
