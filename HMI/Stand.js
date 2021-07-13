//href="javascript:void(0);"
var JugAxis=["Y","-Y","X","-X"];
var JogNum=1;
var allowJog = false;
var SerialPart="";
var customer="";
var version="";
var G_CodeLines;
var G_CodeLength; 
var ReadyTosend=false;
var StartCNC = false;
var CurrentLine=0;
var StartPos=0;
var FeedRate=100;
var Xmax=0,Ymax=0;
var Xmin=100000,Ymin=100000;
//////////////////////////////////
var _Connection;
//var host = window.document.location.host.replace(/:.*/, '');
var link="ws://"+location.host+"/ws";

//////////////////////////////////
function initialize (){
ini_ws();	
document.getElementById('_status').style.display = "block";
accordion();
}

 function check_WS(){//if(!_Connection ||
  
      if(  _Connection.readyState == 3 ) {document.getElementById('_link').style.backgroundColor ="#FFA500"; ini_ws();}
else  if(  _Connection.readyState == 0 ) {document.getElementById('_link').style.backgroundColor ="#DC143C";  } 
else  if(  _Connection.readyState == 2 ) {document.getElementById('_link').style.backgroundColor ="#FF0000";  }
  }
function ini_ws()
{
 
 _Connection = new WebSocket( link, ['arduino']); 
_Connection.onerror = function (error) {	
										document.getElementById('_link').style.backgroundColor ="#FFA500";
										//alert('Conection Error '+'\n'+link);
										}
_Connection.close = function (error) {	document.getElementById('_link').style.backgroundColor ="#FFE4E1";} //gray
_Connection.onopen = function (evt) {  
									var newdate=new Date();
									var C_date=pad2(newdate.getFullYear())+pad2(newdate.getDay()) +pad2(newdate.getDate()) ;
									var C_sec=newdate.getSeconds()+ newdate.getMinutes()*60 + newdate.getHours()*3600; 
									_Connection.send('SGT=' + C_date + C_sec); //15
									document.getElementById('_link').style.backgroundColor ="#7FFF00"; // grenn
									document.getElementById('current_data').value=newdate;
									}
_Connection.onmessage = function(INCOME){parsing(INCOME.data); }	 
	
setInterval(check_WS, 500);	
}
function parsing(_income)
 {
 
	var param_array = _income.split("@"); 
	 len=param_array.length;
	    if(param_array[0]=='RST') {  //alert(param_array) ;
								    						 
									document.getElementById("welcome").value="welcome "+param_array[2];//welcome LoginUser									 									
									 
									if(WifiMode=='S') document.getElementById("wifimode").value="اتصال به وای فای";
									else              document.getElementById("wifimode").value="وای فای مستقل";
									 
													
									document.getElementById("localip").value=param_array[3]; //MyIP		                                    
									document.getElementById("hostID").value="local"+param_array[5]; //Hostname 
									document.getElementById("_SSID").value=param_array[6]; //ST_ssid
									document.getElementById("AP_name").value=param_array[7]; //AP_ssid
									document.getElementById("serverip").value=param_array[10]; //Master_IP
									document.getElementById("sensorIP").value=param_array[11]; //RemoteSensorIP 
									 
								
								 ///------------------------------------ network setting  page	WFM
								    if(WifiMode=='S') document.getElementById("WFM").options[1].selected = true;
									else              document.getElementById("WFM").options[0].selected = true;
									document.getElementById("SHN").value=param_array[5]; //Hostname
									document.getElementById("APN").value=param_array[7];//AP_ssid
									
								 
				 	               /*---------setting page------------------------------------------ ----*/		
									document.getElementById("SerialPart").value=param_array[4]; //SerialPart	
						            document.getElementById("man_date").value="20"+param_array[4].substr(6,2)+"-"+param_array[4].substr(8,2)+"-"+param_array[4].substr(10,2);
									 
									document.getElementById("product_code").value=param_array[4].substr(0,3)+param_array[14];//preSetPass
									document.getElementById("version").value=parseInt(param_array[4].substr(12,2));								
										
								 
						}
  else if(param_array[0]=='SVE')  {
	                              // var old= document.getElementById("savesetting").style.backgroundColor;
	                                document.getElementById("savesetting").style.backgroundColor='#00FF00';
								   setTimeout(back2normalColor,3000,"savesetting","#D4D0C8"); 
								   }	
  else if(param_array[0]=='BIF')  {
									var settings = param_array[1].split("$"); 
	                               var L=settings.length;
								   document.getElementById("input").value+=settings;
								  // document.getElementById('currentline').value=L;
									for(var i=0;i<L;i++){
											var arr=settings[i].match(/\d+/g)
											if(!arr){
												var num=parseInt(arr[0]);
												var val=parseInt(arr[1]);
												switch(num){
													
													case 0: document.getElementById("steppulsetime").value=val; document.getElementById("_Steppulsetime").value=val; break;
													case 1: document.getElementById("step_id_eldisa").value=val; document.getElementById("stepideldisa").value=val; break;
													case 2: document.getElementById("invertport").options[val].selected = true; break;
													case 3: document.getElementById("invertdirection").options[val].selected = true; break;
													case 4: document.getElementById("invertenable").options[val].selected = true; break;
													case 5: document.getElementById("Invertlimit").options[val].selected = true; break;
													case 6: document.getElementById("_Invertprobe").options[val].selected = true; break;
													case 10: document.getElementById("Statusreport").options[val].selected = true; break;
													case 11: document.getElementById("junc").value=val;  break;
													case 12: document.getElementById("arctolerance").value=val;  break;
													case 13: document.getElementById("reportinunite").options[val].selected = true; break;  
													case 20: document.getElementById("softlimit").options[val].selected = true;  break;
													case 21: document.getElementById("hardlimit").options[val].selected = true;  break;
													case 22: document.getElementById("homecycle").options[val].selected = true;  break;
													case 23: document.getElementById("homedirinv").options[val].selected = true;  break;
													case 24: document.getElementById("homeLFR").value=val;  break;
													case 25: document.getElementById("homeSFR").value=val;  break;
													case 26: document.getElementById("homedebounce").value=val; document.getElementById("homedebun").value=val; break;
													case 27: document.getElementById("hometelorance").value=val;  break; 
													case 30: document.getElementById("maxspindel").value=val;  break;
													case 31: document.getElementById("minspindel").value=val;  break;
													case 32: document.getElementById("lasermode").options[val].selected = true;  break;
													case 100: document.getElementById("stepx").value=val;  break;
													case 101: document.getElementById("stepy").value=val;  break;
													case 102: document.getElementById("stepz").value=val;  break;	
													case 110: document.getElementById("velox").value=val;  break;
													case 111: document.getElementById("veloy").value=val;  break;
													case 112: document.getElementById("veloz").value=val;  break;
													case 120: document.getElementById("accx").value=val;  break;
													case 121: document.getElementById("accy").value=val;  break;
													case 122: document.getElementById("accz").value=val;  break;
													case 130: document.getElementById("lenx").value=val;  break;
													case 131: document.getElementById("leny").value=val;  break;
													case 132: document.getElementById("lenz").value=val;  break;
												}
												
											}
										}
								   }
  else if(param_array[0]=='CNC')  {document.getElementById("input").value+=param_array[1];
											 if(param_array[1].indexOf("ok")>-1){ document.getElementById('okerror').value="OK";
										                                	document.getElementById('okerror').style.backgroundColor='#00FF00';}
										else if(param_array[1].indexOf("error")>-1){ document.getElementById('okerror').value="Error"; 
										                                	document.getElementById('okerror').style.backgroundColor='#FF0000';}								
                                    }
				
 } 
 ////////////////////////////////////	page status  			//////////////////////////////////////////////
function buidInfo(){
	_Connection.send("BIF=$$\n");
	
	} 
function loadGcode(){
	
var x = document.getElementById("FileUpload");
var file = x.files[0]; 
    if (file) {    
	   var R = new FileReader();//new FileReaderSync();
           R.onload = function(){
								           var codes = R.result;								 
								 G_CodeLines = codes.split("\n");
								 for(var i=0;i<CurrentLine;i++) G_CodeLines.shift();
								 document.getElementById('output').value=G_CodeLines;
							
								 G_CodeLength=G_CodeLines.length;
								 document.getElementById('lenght').value=G_CodeLength;
								// document.getElementById('duration').value=lines[10];
								 // alert(R.result.substring(0, 10));
								};    
		 R.onloadend = function() {
								//  alert("LOD="+file.name + "@"  + (file.size/1024).toFixed(2) + "$"+R.readyState+"|"+G_CodeLength);
								  _Connection.send("LOD="+file.name + "@"  + (file.size/1024).toFixed(2) + "$"+R.readyState+"|"+G_CodeLength);
								} //15
		R.onerror = function() {
			                       alert("on error Failed"); 
			}
		
	   R.readAsText(x.files[0]);
	   // R.readAsArrayBuffer(x.files[0]);
	  //R.readAsDataURL(x.files[0]);	 
    }
	else       alert("Failed to load file");
 
}
function check_boundry(){
	
	var val=0,p=0;
for(var i=0;i<G_CodeLength;i++){
	
	 p=G_CodeLines[i].indexOf('X'); val=parseInt(G_CodeLines[i].substr(p+1)); if(val>=Xmax) Xmax=val; if(val<=Xmin) Xmin=val;
	 p=G_CodeLines[i].indexOf('Y'); val=parseInt(G_CodeLines[i].substr(p+1)); if(val>=Ymax) Ymax=val; if(val<=Ymin) Ymin=val;
}
	document.getElementById('lenght').value=Xmax-Xmin;
	  document.getElementById('wide').value=Ymax-Ymin;
}
function Movearound(){
	_Connection.send("RAW=G90\nG0 X"+Xmin+" Y"+Ymin+"\nG0 X"+Xmax+" Y"+Ymax+"\n");
}
function start_send_gcode(){	
/*
if(document.getElementById('startresume').className=="My_BT_big"){
       StartCNC = true;  document.getElementById('startresume').className="My_BT_big_off";}
else { StartCNC = false; document.getElementById('startresume').className="My_BT_big";}
*/
document.getElementById('currentline').value=CurrentLine;
var sum=0;
var L="";
//StartPos+=(G_CodeLines[CurrentLine].length+1);
for(var i=0;i<100;i++){
	if((sum+G_CodeLines[CurrentLine].length)>=128)	break;
	else {L+=G_CodeLines[CurrentLine]; sum+=G_CodeLines[CurrentLine].length+1;}
	CurrentLine++;
	}
//	CurrentLine--;
	_Connection.send("RAW="+L+"\n");
//alert("CurrentLine="+CurrentLine+"  Line="+L+" sum="+sum);

document.getElementById('output').selectionStart =StartPos-1;
StartPos+=sum;//+G_CodeLines[CurrentLine].length;
document.getElementById('output').selectionEnd = StartPos;
document.getElementById('output').focus ();
//alert("CurrentLine="+ CurrentLine +" StartPos="+ StartPos+"  G_CodeLines=" +G_CodeLines[CurrentLine+1].length);
//CurrentLine++;
ReadyTosend=false;	
}

function SendCommand(){
	
	_Connection.send("RAW="+document.getElementById('commandtype').value+"\n");
}
function SendPreCommand(){
	_Connection.send('RAW='+document.getElementById("commands").options[document.getElementById("commands").selectedIndex].value+"\n");
	}
                           
function send_setting(num,min,max,id){
	
var l=parseInt(document.getElementById(id).value);
     if(l<min) l=min;
else if(l>max) l=max;
 
_Connection.send('RAW=$'+num+'='+l+'\n' ); 
}
function Send_selection_val(num,id){
	
_Connection.send('RAW=$'+num+'='+document.getElementById(id).options[document.getElementById(id).selectedIndex].value+"\n");
}
function accordion(){
var acc = document.getElementsByClassName("accordion");//button
var i;

for (i = 0; i < acc.length; i++) 
	{
	  acc[i].onclick = function() {
									this.classList.toggle("active");
									var panel = this.nextElementSibling;
									if (panel.style.maxHeight)  panel.style.maxHeight = null;
									else	                    panel.style.maxHeight = panel.scrollHeight + "px"; 
								  }
	}
}

function CountTime(num,increment){

	if(allowJog){ 
	             if( JogNum<100)JogNum++;
				       if(JogNum<=30)  increment=1;
				 else  if(JogNum>30 && JogNum<70)  increment=10;
				 else                              increment=100;
				 setTimeout(CountTime,5000/JogNum,num,increment);
             	}
	document.getElementById("jojadjust").value=JogNum;	
    _Connection.send("RAW=$J=G91 "+JugAxis[num]+increment+"\n");	
	
}
function JugD(num){
JogNum=parseInt(document.getElementById("jojadjust").value);	
allowJog = true;
CountTime(num,1);
}
function JugU(num){allowJog = false; JogNum=1;}

function ToggleFloodCoolant(){
	 if(document.getElementById('fancool').className=="My_BT_big")
	 {
       document.getElementById('fancool').className="My_BT_big_off";
	    document.getElementById('fancool').value="Fan ON";
	   }
else  {
       document.getElementById('fancool').className="My_BT_big";
	    document.getElementById('fancool').value="Fan OFF";
	   }
   _Connection.send('RAW=0xA0\n' ); 
 
}
 
////////////////////////////////////	page wifi setting			//////////////////////////////////////////////
 function SetNetwork(){
	var     ssid=document.getElementById('_ssid').value;
	var netpass=document.getElementById('_netpass').value;	
  var command  = "SNW="+ ssid + "@" +netpass ;   //http://192.168.4.1/process?code=RNI&ssid=ssid+pass&poz=poz
   _Connection.send(command);	
}

function show_user_list()
{
		var _AJX=createXHR();    
   _AJX.onreadystatechange = function(){   
										  if(_AJX.readyState == 4)
										  {  
											var div = document.getElementById('userlist');
                                                div.innerHTML = _AJX.responseText;			// id of list box in code = 							
										  }
									   }
  var command  = "?code=USL";                                        //http://192.168.4.1/process?code=RUL
   _AJX.open("GET",  "/process" + command, true);
   _AJX.send(null);
	
}
function RestartHTML()
{
var _AJX=createXHR();    
				   _AJX.onreadystatechange = function(){   
														  if(_AJX.readyState == 4)
														  {  
														  }
													   }
				  var command  = "?code=RST&"
				   _AJX.open("GET", "/process" + command, true);
				   _AJX.send(null); 	
	
}
function AddUser()
{
	var a= document.getElementById("_username").value;
	var b= document.getElementById("_password").value;
	var e = document.getElementById("_userType");
    var c = e.options[e.selectedIndex].text;
	//var line=a+','+b +',' +c;
	 var count=document.getElementById("ListUserListBox").length;
	 if(count<6){
					var _AJX=createXHR();    
				   _AJX.onreadystatechange = function(){   
														  if(_AJX.readyState == 4)
														  {  
															show_user_list();//var recieved =_AJX.responseText;  alert(recieved);							
														  }
													   }
				  var command  = "?code=AUS&user=" + a + '&pass='+b + '&scop='+c; //http://192.168.4.1/process?code=RAU&user=user&pass=pass&scop=scop
				   _AJX.open("GET", "/process" + command, true);
				   _AJX.send(null); 
				}
	else alert("Exceed max user numbers")
}
function RemoveUser()
{
	var e = document.getElementById("ListUserListBox");
	var count=document.getElementById("ListUserListBox").length;
	if(count>1){	
				var index=e.selectedIndex;
				var _AJX=createXHR();    
			   _AJX.onreadystatechange = function(){   
													  if(_AJX.readyState == 4)
													  {  
														show_user_list();//var recieved =_AJX.responseText;  alert(recieved);							
													  }
												   }
			  var command  = "?code=RUS&index=" + index; //http://192.168.4.1/process?code=RRU&index=index
			   _AJX.open("GET","/process" + command, true);
			   _AJX.send(null); 
			}
	else alert("Atleast need one user")
}
function ScanNetwork()
{
	
	 var _AJX=createXHR();    
   _AJX.onreadystatechange = function(){   
										  if(_AJX.readyState == 4)
										  {  
											var div = document.getElementById('netScanResult');
                                                div.innerHTML = _AJX.responseText;			 							
										  }
									   }
  var command  = "?code=NET";                                        //http://192.168.4.1/process?code=RSN
   _AJX.open("GET","/process" + command, true);
   _AJX.send(null);
	
}
////////////////////////////////////	page config			//////////////////////////////////////////////
 function createXHR() 
{ 
		try   {
			                 return new XMLHttpRequest();
			  } 
	catch (e) {
						try {
							 return new ActiveXObject("Microsoft.XMLHTTP");
							} 
				catch (e)  {
							 return new ActiveXObject("Msxml2.XMLHTTP");
						  }
              }
}

 function change_color(id)
 {
	if(_Connection.readyState==1)		document.getElementById(id).style.backgroundColor = "LawnGreen";	
    else 	                           {document.getElementById('_link').style.backgroundColor ="#FFA500"; 
										document.getElementById(id).style.backgroundColor = "Red";}
	 setTimeout(back2normalColor,3000,id); 
 }

 function back2normal(){ document.getElementById('HTTP').className="HTTP"; }
   function back2normalColor(id,old) { 	 document.getElementById(id).style.backgroundColor = old; 	  }

function selectssid_pass()
{
    var e = document.getElementById("_netList");
	if(e.selectedIndex>0)
	{	
	var strUser = e.options[e.selectedIndex].text;
	var S=strUser.split(",")
	var ssid=S[0].trim()
	document.getElementById('_ssid').value=ssid;
	}
}

 function CheckIP(_Obj)
  {
    ValidIP = false; 
	var IPText=_Obj.value;
	
    ipParts = IPText.split(".");
    if(ipParts.length==4){
						  for(i=0;i<4;i++){							 
											TheNum = parseInt(ipParts[i]);
											if(TheNum >= 0 && TheNum <= 255){}
											else{break;}											 
										  }
						  if(i==4)ValidIP=true; 
						}
	if(!ValidIP)	alert('Wrong Format')				
  }

function parse_line()
{
	var e = document.getElementById("listfile");
    var line = e.options[e.selectedIndex].text;
	var myArray=line.split("/");
    var num=myArray.length; 
if(num>2){ 
         document.getElementById("_path").value='/'+myArray[1]; 
		 document.getElementById("_file").value='/'+myArray[2]; 
		 }
else     {
		 document.getElementById("_path").value='/'; 
		 document.getElementById("_file").value=myArray[1];
         }
}

function parse_line_and_put_inform()
{
	var e = document.getElementById("ListUserListBox");
    var line = e.options[e.selectedIndex].text;
	var myArray=line.split(",");
    var num=myArray.length; 
     // alert (myArray + '\n'+num)options[i].selected = true   selectedIndex                  
	 document.getElementById("_username").value=myArray[0]; 
	 document.getElementById("_password").value=myArray[1]; 		

}

function showselecteditem()
{
var e = document.getElementById("Comboboxtest");
var strUser = e.options[e.selectedIndex].text;
var num=strUser.split("/").length;
if(num>2){ patch=strUser.split("/")[1]; file=strUser.split("/")[2];
             alert (patch+'      '+file  )}
else  {file=strUser.split("/")[1]; alert ('only file '+file  )}
}

function secondsToTime(secs)
{
   // secs = Math.round(secs)*10;
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
     var seconds = Math.ceil(divisor_for_seconds);
	 if(hours<10) hours= "0"+hours;
    if(minutes<10) minutes= "0"+minutes;
     if(seconds<10) seconds= "0"+seconds;
    return hours+":"+minutes +":"+seconds
       
}
function Wave(_image,_canvas,_amp,_speed)
{
//  alert("wave")  	
var h = new Image;      		
	h.onload = function(){
							var flag = document.getElementById(_canvas);
							var amp =_amp;
							flag.width  = h.width;
							flag.height = h.height + amp*2;
							flag.getContext('2d').drawImage(h,0,amp,h.width,h.height);
							flag.style.marginLeft = -(flag.width/2)+'px';
							flag.style.marginTop  = -(flag.height/2)+'px';
							var timer = waveFlag( flag, h.width/10, amp ,_speed);
						};
	h.src =_image ;
function waveFlag( canvas, wavelength, amplitude, period, shading, squeeze )
{
				if (!squeeze)    squeeze    = 0;
				if (!shading)    shading    = 100;
				if (!period)     period     = 400;
				if (!amplitude)  amplitude  = 10;
				if (!wavelength) wavelength = canvas.width/10;

				var fps = 30;
				var ctx = canvas.getContext('2d');
				var   w = canvas.width, h = canvas.height;
				var  od = ctx.getImageData(0,0,w,h).data;
				// var ct = 0, st=new Date;
				return setInterval(function(){
												var id = ctx.getImageData(0,0,w,h);
												var  d = id.data;
												var now = (new Date)/period;
												for (var y=0;y<h;++y){
													var lastO=0,shade=0;
													var sq = (y-h/2)*squeeze;
													for (var x=0;x<w;++x){
														var px  = (y*w + x)*4;
														var pct = x/w;
														var o   = Math.sin(x/wavelength-now)*amplitude*pct;
														var y2  = y + (o+sq*pct)<<0;
														var opx = (y2*w + x)*4;
														shade = (o-lastO)*shading;
														d[px  ] = od[opx  ]+shade;
														d[px+1] = od[opx+1]+shade;
														d[px+2] = od[opx+2]+shade;
														d[px+3] = od[opx+3];
														lastO = o;
													}
												}
												ctx.putImageData(id,0,0);		
												// if ((++ct)%100 == 0) console.log( 1000 * ct / (new Date - st));
											},1000/fps);
	}	
} 
  
function pad2(number) { return (number < 10 ? '0' : '') + number }
function convert2second(s){	return parseInt(s.substring(0,2))*3600+parseInt(s.substring(3,5))*60+parseInt(s.substring(6));}
 function show_tab(id) 
 {
   var i;
    var x = document.getElementsByClassName("my_tab");
    for (i = 0; i < x.length; i++) {  x[i].style.display = "none"; }
    document.getElementById(id).style.display = "block";
}
 
 