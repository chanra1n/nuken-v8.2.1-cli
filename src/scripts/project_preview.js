var selected_style = "";
var selected_style_icon = "";

var selected_script = "";
var selected_script_icon = "";

var extra_script = "";
var extra_style = "";

var project = "";

var saved_project = "";

var hide_errors = false;

var project_write = function(){
	
ready_to_notify = false;

	share_menu_is_open = false;

document.getElementById('project_console_notification_list').innerHTML = "";
document.getElementById('project_console_raw').value = "";
document.getElementById('download_project_console_button').style.display = "none";
//reset_project_console_badge();

document.getElementById('template_export_name').value = document.getElementById('titlebox').value;

exported_filename = document.getElementById('template_export_filebox').value;
exported_template = document.getElementById('raw_templatebox').value;

var style = stylebox_editor.getSession().getValue();
var markup = markupbox_editor.getSession().getValue();
var script = scriptbox_editor.getSession().getValue();

console.log(selected_style);
console.log(selected_script);

var title = document.getElementById('titlebox').value;
var meta = document.getElementById('metabox').value.toString();
var author = document.getElementById('project_author_box').value;
var description = document.getElementById('project_description_box').value;
var audience = document.getElementById('project_audience_box').value;

right_frame.innerHTML = '';
var project_frame = document.getElementById('project_frame');

project = `

<!DOCTYPE html>
<html>

<head>

<title>`+title+`</title>

<meta name = "nuken_style" content = "`+selected_style_icon+`"/>
<meta name = "nuken_script" content = "`+selected_script_icon+`"/>
<meta name = "author" content = "`+author+`"/>
<meta name = "description" content = "`+description+`"/>
<meta name = "nuken_audience" content = "`+audience+`"/>


<!--nuken_meta_begin-->
`+meta+`
<!--nuken_meta_end-->

`+extra_style+`
`+extra_script+`

`+selected_style+`
<!--nuken_style_begin-->
<style>
`+style+`
</style>
<!--nuken_style_end-->

`+selected_script+`
</head>

<!--nuken_markup_begin-->
<body>
`+markup+`
</body>
<!--nuken_markup_end-->

<!--nuken_script_begin-->
<script>
`+script+`
</script>
<!--nuken_script_end-->

`+file_path_insert+`

</html>


`;

saved_project = project;

if (remember_workspace){
localStorage.setItem('recovered_project_data', saved_project);
}

var iframe = document.createElement('iframe');
document.getElementById('right_frame').appendChild(iframe);
iframe.id = "project_frame";
if (!auto_run_is_on){
	success_1.currentTime = 0;	
success_1.play();	
iframe.classList.add("animated","tdFadeInDown");
} else {
document.getElementById('project_frame').style.opacity = "100%";
}
iframe.contentWindow.document.open();

iframe.contentWindow.onerror = function(e){
project_console_notify('<i class="ri-spam-2-line"></i> <span style = "margin-left: 0.5vmin" >'+ e+'</span> <span class = "timestamp">'+timestamp+'</span>','error');
project_console_raw(e,timestamp);
notif_error_sound.currentTime = 0;
notif_error_sound.play();
};

iframe.contentWindow.console.log = function(c){
project_console_notify('<i class="ri-arrow-right-s-line"></i> <span>'+ c+'</span> <span class = "timestamp">'+timestamp+'</span>','log');
project_console_raw(c,timestamp);
};

iframe.contentWindow.console.warn = function(w){
project_console_notify('<i class="ri-alert-line"></i> <span style = "margin-left: 0.5vmin">'+ w+'</span> <span class = "timestamp">'+timestamp+'</span>','warning');
project_console_raw(w,timestamp);
};
iframe.contentWindow.document.write(project);


if (recover_timer_is_on){
	
} else {
	
if (recovery_allowed){
save_recovered_project();
recover_timer = setInterval(save_recovered_project,180000);
console.log('First time clicked.');
recover_timer_is_on = true;
document.getElementById('recover_project_button').style.opacity = "100%";
document.getElementById('recover_project_button').style.pointerEvents = "auto";
document.getElementById('recover_project_button').innerHTML = '<i class="ri-download-cloud-line"></i> <span> Recover this project</span>';
} else {
document.getElementById('recover_project_button').style.opacity = "25%";
document.getElementById('recover_project_button').style.pointerEvents = "none";
document.getElementById('recover_project_button').innerHTML = '<i class="ri-download-cloud-line"></i> <span> Recover this project</span>';
}
document.getElementById('project_snapshot_button').style.pointerEvents = "auto";
document.getElementById('project_snapshot_button').style.opacity = "100%";

}

init_custom_file_paths();

setTimeout(function(){



const element = document.getElementById('project_frame').contentWindow.document.documentElement;

html2canvas(element).then(canvas => {
    document.body.appendChild(canvas);
	canvas.id = "project_canvas";
	document.getElementById('project_canvas').remove();
	document.body.appendChild(canvas);
}).catch(error => {

notify("You're typing too fast! Slow down and give nuken some room to breathe.");
hide_errors = true;
setTimeout(function(){hide_errors=false},1000);


});

setTimeout(function(){

var canvas = document.getElementById('project_canvas');

canvas_url = document.getElementById('project_canvas').toDataURL();

var c = canvas.getContext('2d');
var p = c.getImageData(1, 1, 1, 1).data;
var rgb = "rgb(" + p[0]+", "+p[1]+", "+p[2]+")";

document.getElementById('right_frame').style.backgroundImage = "linear-gradient(to left, "+rgb+", "+rgb+")";
//document.getElementById('console_button').style.color = rgb;
setTimeout(function(){
ready_to_notify = true;
},10);
},10);

},10);

};

var prompt_for_web = function(error){

popup_sound.currentTime = 0;
popup_sound.play();
var ask = confirm(error+"\n\nThat's the error. Do you want to look it up on the web?");

if (ask) {
popup_sound.currentTime = 0;
popup_sound.play();
window.open('https://www.stackoverflow.com/search?q='+encodeURIComponent(error),"_blank");
}

};

var init_time = function(){
date = new Date();	
hour = date.getHours();
minute = date.getMinutes();
second = date.getSeconds();

if (hour<10){
hour = "0" + hour;
}

if (minute<10){
minute = "0" + minute;
}

if (second<10){
second = "0" + second;
}
timestamp = "["+hour+":"+minute+":"+second+"]";
};

setInterval(init_time,1000);

var win;

var is_being_previewed = false;

var preview_project = function(mode){			
		
project_write();
		
if (mode === "workspace") {
	//close in workspace
	var right_frame = document.getElementById('right_frame');	
	if (is_being_previewed) {
		
	document.getElementById('preview_in_workspace').style.backgroundColor = "#c0c0c050";
	document.getElementById('preview_in_workspace').innerHTML ='<i class="ri-fullscreen-fill"></i>  In-workspace';
	right_frame.style.position = "relative";
	right_frame.style.zIndex = "5";
		is_being_previewed = false;
	} else {
		
		//open in workspace
	
	document.getElementById('preview_in_workspace').style.backgroundColor = "#76db94";
	document.getElementById('preview_in_workspace').innerHTML ='<i class="ri-fullscreen-exit-fill"></i>  Exit preview';
	right_frame.style.position = "fixed";
	right_frame.style.zIndex = "10";
	
	is_being_previewed = true;
	notify('Your project is being previewed fullscreen.');
	
	}
	
	
} else {
	
	//open in a new window
		
	popup_sound.currentTime = 0;
	popup_sound.play();	
 win = window.open("", titlebox.value, "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width='100%',height='100%',top='0',left='0'");
 win.document.documentElement.innerHTML = project;
 
 notify('Your project was written to a <a onclick = "win.focus()">popup window</a>.');

}

};


var view_project_compiled = function(){
notify('Your project was written to a pop-up window.');
var temp = new String("<plaintext>"+project);
popup_sound.currentTime = 0;
popup_sound.play();
 winsource = window.open("", document.getElementById('titlebox').value, "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width='71%',height='92.5%',top="+(screen.height-400)+",left="+(screen.width-840));
 winsource.document.write(temp);

};





