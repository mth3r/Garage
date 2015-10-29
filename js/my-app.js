
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
var photons;
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
	$$('.element-add-location').on('click', function() {
		appendLocation('test');
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
    var newDiv = $$('#Photon-Detail').html();
	
	$$('.Phonton-List').append(newDiv); 
	console.log($$('Phonton-List').html());
	
	
	var formname=String(photons[1].id);
	
	// run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
	$$('.dynamicForm').on('click', function() {
		//myApp.alert('got here');
	
		appendForm(formname);
		
		//console.log(str_1);
			$$('.save-storage-data-dynamic').on('click', function(){
			
			var text = '{' + 
				'"DeviceID_'+ 	formname +'":"'+ $$('#ParticleID').val()	+'",'+
				'"token_'+ 		formname +'":"'+ $$('#ParticleToken').val()	+'",'+
				'"Rpin_'+ 		formname +'":"'+ $$('#Rpin').val()			+ '",'+
				'"Lpin_'+ 		formname +'":"'+ $$('#Lpin').val()			+ '",'+
				'"S1pin_'+ 		formname +'":"'+ $$('#S1pin').val()			+ '",'+
				'"S1pinName_'+ 	formname +'":"'+ $$('#S1pinName').val()		+ '",'+
				'"S2pin_'+ 		formname +'":"'+ $$('#S2pin').val()			+ '",'+
				'"S2pinName_'+ 	formname +'":"'+ $$('#S2pinName').val()		+ '",'+
				'"S3pin_'+ 		formname +'":"'+ $$('#S3pin').val()			+ '",'+
				'"S3pinName_'+ 	formname +'":"'+ $$('#S3pinName').val()		+ '",'+
				'"S4pin_'+ 		formname +'":"'+ $$('#S4pin').val()			+ '",'+
				'"S4pinName_'+ 	formname +'":"'+ $$('#S4pinName').val()		+ '",'+
				'"S5pin_'+ 		formname +'":"'+ $$('#S5pin').val()			+ '",'+
				'"S5pinName_'+ 	formname +'":"'+ $$('#S5pinName').val()		+'"}';
				
				
			console.log(text);	
			var obj = JSON.parse(text);
			var storedData = myApp.formStoreData(formname,obj);
			
			//myApp.alert($$('#ParticleID').val()) //works
			
		});
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
    	photons= results;	
	    });
		
}
function appendLocation(a){
 	var newDiv = $$('#SomeClassTemplate').html();
	$$('.tempReadout').append(newDiv); 
	$$('.dynamic').html(a);	
}
function appendForm(a){
 	console.log(a);
	
	$$('#my-form3').attr('id',a);
	$$('#ParticleID').attr('name', 'DeviceID_'+ a);
	$$('#ParticleToken').attr('name', 'token_' + a);
	$$('#Lpin').attr('name', 'Lpin_' + a);
	$$('#Rpin').attr('name', 'Rpin_' + a);
	$$('#S1pin').attr('name', 'S1pin_' + a);
	$$('#S1pinName').attr('name', 'S1pinName_' + a);
	$$('#S2pin').attr('name', 'S2pin_' + a);
	$$('#S2pinName').attr('name', 'S2pinName_' + a);
	$$('#S3pin').attr('name', 'S3pin_' + a);
	$$('#S3pinName').attr('name', 'S3pinName_' + a);
	$$('#S4pin').attr('name', 'S4pin_' + a);
	$$('#S4pinName').attr('name', 'S4pinName_' + a);	
	$$('#S5pin').attr('name', 'S5pin_' + a);
	$$('#S5pinName').attr('name', 'S5pinName_' + a);
	
	var newDiv = $$('#dynForm').html();
	$$('.formSpot').append(newDiv); 
	try {
	var DynData = myApp.formGetData(a);
	}
	catch(err){
	var DynData='false';
	}
	
	if (DynData){
		$$('input#ParticleID').val(eval('DynData.DeviceID_'+a));
		$$('input#ParticleToken').val(eval('DynData.token_'+a));
		$$('input#Lpin').val(eval('DynData.Lpin_'+a));
		$$('input#Rpin').val(eval('DynData.Rpin_'+a));
		$$('#S1pin').val(eval('DynData.S1pin_' + a));
		$$('#S1pinName').val(eval('DynData.S1pinName_' + a));
		$$('#S2pin').val(eval('DynData.S2pin_' + a));
		$$('#S2pinName').val(eval('DynData.S2pinName_' + a));
		$$('#S3pin').val(eval('DynData.S3pin_' + a));
		$$('#S3pinName').val(eval('DynData.S3pinName_' + a));
		$$('#S4pin').val(eval('DynData.S4pin_' + a));
		$$('#S4pinName').val(eval('DynData.S4pinName_' + a));	
		$$('#S5pin').val(eval('DynData.S5pin_' + a));
		$$('#S5pinName').val(eval('DynData.S5pinName_' + a));
	}
		
}
function SubmitDynamicForm(a){
 	
}
function buildDynamicForm(formname){
	

}