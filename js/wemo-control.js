//var wemo = require('wemo-js');
//var http = require('http');
//var util = require('util');
//var xml2js = require('xml2js');

var postbodyheader = [
  '<?xml version="1.0" encoding="utf-8"?>',
  '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',
    '<s:Body>'].join('\n');


var postbodyfooter = ['</s:Body>',
  '</s:Envelope>'
].join('\n');

var getenddevs = {};
getenddevs.path = '/upnp/control/bridge1';
getenddevs.action = '"urn:Belkin:service:bridge:1#GetEndDevices"';
getenddevs.body = [
  postbodyheader, 
  '<u:GetEndDevices xmlns:u="urn:Belkin:service:bridge:1">', 
  '<DevUDN>%s</DevUDN>', 
  '<ReqListType>PAIRED_LIST</ReqListType>',
  '</u:GetEndDevices>',
  postbodyfooter
].join('\n');



if (process.argv.length < 3) {
  console.log("Help:");
  console.log("node wemo-lights.js list - Shows all the available bulbs");
  console.log("node wemo-lights.js state <friendly name> - Shows the current state of a given bulb");
  console.log("node wemo-lights.js control <friendly name> on|off [0-255] - (dim value only used if state is on)");
  console.log("node wemo-lights.js dim <friendly name> <0-255> - setting dim value of an off device will turn it on at new level");
  console.log("node wemo-lights.js sleep <friendly name> <time> - time in seconds to dim to off");
  process.exit(0);
}

function processOptions(lights) {
  if (process.argv[2] === 'list') {
    console.log("Lights:");
    console.log("Friendly name - id");
    for (var j=0; j<lights.length; j++) {
      console.log("%s - %s", lights[j].name, lights[j].id);
    }
    console.log("Groups:");
    for (var j=0; j<groups.length; j++) {
      console.log("%s - %s", groups[j].name, groups[j].id);
    }
    console.log("-------");
    console.log("Sockets:");
    for (var j=0; j<sockets.length; j++) {
      console.log("%s", sockets[j].name);
    }
    process.exit(0);
  } else if (process.argv[2] === 'state') {
    for (var j=0; j<lights.length; j++) {
      if (lights[j].name === process.argv[3]) {
        console.log("%s %s",lights[j].name, lights[j].state);
        process.exit(0);
      }
    }

    for (var j=0; j<groups.length; j++) {
      if (groups[j].name === process.argv[3]) {
        console.log("%s %s",groups[j].name, groups[j].state);
        process.exit(0);
      }
    }

    for (var j=0; j<sockets.length; j++) {
      if (sockets[j].name === process.argv[3]) {
        console.log("%s %s",sockets[j].name, sockets[j].state);
        process.exit(0);
      }
    }
  } else if (process.argv[2] === 'control') {
    for (var j=0; j<lights.length; j++) {
      if (lights[j].name === process.argv[3]) {
        var on = 0;
        var level = 255;
        if ("on" === process.argv[4]) {
          on = 1;
        }
        control(lights[j], on);
        if (on === 1 && process.argv.length === 6) {
          console.log("dimming to %d", process.argv[5]);
          dim(lights[j], process.argv[5]);
        }
        return;
      }
    }
    for (var j=0; j<groups.length; j++) {
      if (groups[j].name === process.argv[3]) {
        var on = 0;
        var level = 255;
        if ("on" === process.argv[4]) {
          on = 1;
        }
        setGroupStatus(groups[j], "10006", on);
        //control(groups[j], on);
        // if (on === 1 &&  process.argv.length === 6) {
        //   dim(groups[j], process.argv[5]);
        // }
        return;
      }
    }
    for (var j=0; j<sockets.length; j++) {
      if (sockets[j].name === process.argv[3]) {
        var on = 0;
        if ("on" === process.argv[4]) {
          on = 1;
        }
        toggleSocket(sockets[j], on);
        return;
      }
    }
  } else if (process.argv[2] === "dim") {
    for (var j=0; j<lights.length; j++) {
      if (lights[j].name === process.argv[3]) {
        var level = process.argv[4];
        dim(lights[j],level);
        break;
      }
    }
  } else if (process.argv[2] === "sleep") {
    for (var j=0; j<lights.length; j++) {
      var time = process.argv[4];
      sleep(lights[j], time);
    }
  }
}

function toggleSocket(socket, on) {
  var postoptions = {
        host: socket.ip,
        port: socket.port,
        path: "/upnp/control/basicevent1",
        method: 'POST',
        headers: {
          'SOAPACTION': '"urn:Belkin:service:basicevent:1#SetBinaryState"',
          'Content-Type': 'text/xml; charset="utf-8"',
          'Accept': ''
        }
      };

      var post_request = http.request(postoptions, function(res) {
        var data = "";
        res.setEncoding('utf8');
        res.on('data', function(chunk){
          data += chunk
        });

        res.on('end', function(){
          //console.log(data);
        });
      });

    var body = [
      postbodyheader,
      '<u:SetBinaryState xmlns:u="urn:Belkin:service:basicevent:1">',
      '<BinaryState>%s</BinaryState>',
      '</u:SetBinaryState>',
      postbodyfooter
    ].join('\n');

    post_request.write(util.format(body, on));
    post_request.end();
}

function control(light, on) {
  setStatus(light, "10006", on);
}


function dim(light, dim) {
  setStatus(light, "10008", dim + ":0");
}

function sleep(light, time) {
  var date = new Date();
  date = date.getTime()/1000;
  time = time * 10;
  setStatus(light, "30008", time + ":" + date);
}


function setStatus(light, capability, value) {
  var setdevstatus = {};
  setdevstatus.path = '/upnp/control/bridge1';
  setdevstatus.action = '"urn:Belkin:service:bridge:1#SetDeviceStatus"';
  setdevstatus.body = [
    postbodyheader,
    '<u:SetDeviceStatus xmlns:u="urn:Belkin:service:bridge:1">',
    '<DeviceStatusList>',
    '&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;&lt;DeviceStatus&gt;&lt;IsGroupAction&gt;NO&lt;/IsGroupAction&gt;&lt;DeviceID available=&quot;YES&quot;&gt;%s&lt;/DeviceID&gt;&lt;CapabilityID&gt;%s&lt;/CapabilityID&gt;&lt;CapabilityValue&gt;%s&lt;/CapabilityValue&gt;&lt;/DeviceStatus&gt;',
    '</DeviceStatusList>',
    '</u:SetDeviceStatus>',
    postbodyfooter
  ].join('\n');

  var postoptions = {
    host: light.ip,
    port: light.port,
    path: setdevstatus.path,
    method: 'POST',
    headers: {
      'SOAPACTION': setdevstatus.action,
       'Content-Type': 'text/xml; charset="utf-8"',
      'Accept': ''
    }
  };

  var post_request = http.request(postoptions, function(res) {
    var data = "";
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      data += chunk;
    });

    res.on('end', function(){
      console.log(data);
    });
  });

  post_request.on('error', function (e) {
    console.log(e);
    console.log("%j", postoptions);
  });

  //console.log(util.format(setdevstatus.body, light.id, capability, value));

  post_request.write(util.format(setdevstatus.body, light.id, capability, value));
  post_request.end();
}

function setGroupStatus(light, capability, value) {
  var setdevstatus = {};
  setdevstatus.path = '/upnp/control/bridge1';
  setdevstatus.action = '"urn:Belkin:service:bridge:1#SetDeviceStatus"';
  setdevstatus.body = [
    postbodyheader,
    '<u:SetDeviceStatus xmlns:u="urn:Belkin:service:bridge:1">',
    '<DeviceStatusList>',
    '&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;&lt;DeviceStatus&gt;&lt;IsGroupAction&gt;YES&lt;/IsGroupAction&gt;&lt;DeviceID available=&quot;YES&quot;&gt;%s&lt;/DeviceID&gt;&lt;CapabilityID&gt;%s&lt;/CapabilityID&gt;&lt;CapabilityValue&gt;%s&lt;/CapabilityValue&gt;&lt;/DeviceStatus&gt;',
    '</DeviceStatusList>',
    '</u:SetDeviceStatus>',
    postbodyfooter
  ].join('\n');

  var postoptions = {
    host: light.ip,
    port: light.port,
    path: setdevstatus.path,
    method: 'POST',
    headers: {
      'SOAPACTION': setdevstatus.action,
       'Content-Type': 'text/xml; charset="utf-8"',
      'Accept': ''
    }
  };

  var post_request = http.request(postoptions, function(res) {
    var data = "";
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      data += chunk;
    });

    res.on('end', function(){
      console.log(data);
    });
  });

  post_request.on('error', function (e) {
    console.log(e);
    console.log("%j", postoptions);
  });

  //console.log(util.format(setdevstatus.body, light.id, capability, value));
  var body = util.format(setdevstatus.body, light.id, capability, value);
  console.log("%s", body);
  post_request.write(body);
  post_request.end();
}

var groups = [];
var lights = [];
var sockets = [];

var timer; 

var client = wemo.Search();
client.on('found', function(device) {
    //console.log("%j",device);

    if (!timer) {
      timer = setTimeout(function() {
          client.stop();
          processOptions(lights);
      }, 3000);
    }

    if (device.deviceType === "urn:Belkin:device:bridge:1") {

      //console.log("%j", device);

      var ip = device.ip;
      var port = device.port;
      var udn = device.UDN;

      var postoptions = {
      host: ip,
      port: port,
      path: getenddevs.path,
      method: 'POST',
      headers: {
         'SOAPACTION': getenddevs.action,
         'Content-Type': 'text/xml; charset="utf-8"',
        'Accept': ''
      }
    };

    //console.log(ip + ":" + port);
    //console.log(udn);

    var post_request = http.request(postoptions, function(res) {
      var data = "";
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        data += chunk;
      });

      res.on('end', function(){
      xml2js.parseString(data, function(err, result) {
        if (!err) {
          var list = result["s:Envelope"]["s:Body"][0]["u:GetEndDevicesResponse"][0].DeviceLists[0];
          xml2js.parseString(list, function(err, result2) {
            if (!err) {
              var devinfo = result2.DeviceLists.DeviceList[0].DeviceInfos[0].DeviceInfo;
              if (devinfo) {
                for (var i=0; i<devinfo.length; i++) {
                  //console.log("%s[%s]:\t\t%s",devinfo[i].FriendlyName[0], devinfo[i].DeviceID[0], devinfo[i].CurrentState[0]);
                  var light = {
                    "ip": ip,
                    "port": port,
                    "udn": udn,
                    "name": devinfo[i].FriendlyName[0],
                    "id": devinfo[i].DeviceID[0],
                    "state": devinfo[i].CurrentState[0] 
                  };
                  lights.push(light);
                }
              }
              var groupinfo = result2.DeviceLists.DeviceList[0].GroupInfos;
              if (groupinfo) {
                //group found
                for (var i=0; i<groupinfo.length; i++) {
                  var group = {
                    "ip": ip,
                    "port": port,
                    "udn": udn,
                    "name": groupinfo[i].GroupInfo[0].GroupName[0],
                    "id": groupinfo[i].GroupInfo[0].GroupID[0],
                    "state": groupinfo[i].GroupInfo[0].GroupCapabilityValues[0],
                    "devices" : []
                  }
                  for(var j=0; j<groupinfo[i].GroupInfo[0].DeviceInfos[0].DeviceInfo.length; j++) {
                    group.devices.push(groupinfo[i].GroupInfo[0].DeviceInfos[0].DeviceInfo[j].DeviceID[0]);
                  }
                  groups.push(group);
                }
              }
              //console.log("%j",groups);
            } else {
              console.log(err);
              console.log(data);
            }
          });
        }
      });
      });
    });

    post_request.write(util.format(getenddevs.body, udn));
    post_request.end();


    } else if (device.deviceType === 'urn:Belkin:device:controllee:1' || device.deviceType == 'urn:Belkin:device:insight:1') {
      //console.log("%s", device.friendlyName);

      var socket = {
        "ip": device.ip,
        "port": device.port,
        "name": device.friendlyName,
        "type": "socket"
      };

      var postoptions = {
        host: socket.ip,
        port: socket.port,
        path: "/upnp/control/basicevent1",
        method: 'POST',
        headers: {
          'SOAPACTION': '"urn:Belkin:service:basicevent:1#GetBinaryState"',
          'Content-Type': 'text/xml; charset="utf-8"',
          'Accept': ''
        }
      };

      var post_request = http.request(postoptions, function(res) {
        var data = "";
        res.setEncoding('utf8');
        res.on('data', function(chunk){
          data += chunk
        });

        res.on('end', function(){
          //console.log(socket.name + "\n" + data);
          xml2js.parseString(data, function(err, result) {
            if (!err) {
              var state = result['s:Envelope']['s:Body'][0]['u:GetBinaryStateResponse'][0].BinaryState[0];
              socket.state = state;
              sockets.push(socket);
            } else {
              console.log(err);
              console.log(data);
            }
          })
        });
      });

    var body = [
      postbodyheader,
      '<u:GetBinaryState xmlns:u="urn:Belkin:service:basicevent:1">',
      '</u:GetBinaryState>',
      postbodyfooter
    ].join('\n');

    post_request.write(body);
    post_request.end();
    } else {
      console.log("unknown");
      console.log("%j",device);
    }
    
});