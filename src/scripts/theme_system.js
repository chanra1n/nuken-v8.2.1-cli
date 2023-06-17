/*
Pretty much we're just appending a custom stylesheet to the document here. Nothing special. nuken detects CSS files from the /themes directory.
*/

var content_menu_available = true;

var theme_array = [];

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

var init_theme = function(){

if (!auto_theme){
	
	
//yes, theme was detected



window.api.themes().then((result) => {
    
	
for (var i = 0; i < result.length; ++i) {
    
	if (i==0){
		console.log('first time');
	document.getElementById('library_div').innerHTML = "";
	}
	
	var item = theme_direc+result[i];  
			theme_array.push(result[i]);
		//once themes is init, load_theme
		if (item.includes('.css')){
			console.log('Theme detected.');
			
			if (i==0){
	
notify('Your theme was applied. Visit the <a uk-toggle = "#settings_page"><i class="ri-settings-3-fill"></i> <span><b>Settings Menu</b></span></a> to disable themes on startup.');

	
	}
			
					append_to_theme_page(result[i]);
		load_theme(theme_direc+result[i]);
		}
		
}	
});
} else {
//no themes	 :(
console.log('No theme detected.');

}
};

var default_nuken_theme = "fkshgkaerlgbauergbjfghriughalirueghsliutghxuthgliu";

var remove_all_themes = function(){
$('link[data = "theme"]').remove();

var workspace_background = window.getComputedStyle(document.getElementById('workspace'), false);

document.getElementById('theme_preview').style.backgroundImage = "none";
document.getElementById('theme_preview').style.backgroundColor = "#c3c3c3";

};

var append_to_theme_page = function(theme){
	
	var filename_proto = theme.replace(/[_-]/g, " "); 
var filename_proto2 = filename_proto.replace(/^.*[\\\/]/, '');
var filename_proto3 = toTitleCase(filename_proto2);
var cosmetic_filename = filename_proto3.replace(".css", ""); 
var filename = filename_proto;
	
document.getElementById('theme_library_div').innerHTML += `
<div id = "`+filename+`" class = "content_div">
<img src = "icons/theme.png" ></img>
<div class = "innerbody" id = "`+filename+`_body" >
<span>`+cosmetic_filename+`</span>
<br>
<button onclick = "swap_theme('`+theme_direc+theme+`')" >Select</button>
<i class = "ri-paint-fill content_div_icon"></i> 
</div>
</div> 
	`;
	
};

var swap_theme = function(theme) {
success_1.currentTime = 0;	
success_1.play();
ready_to_notify = false;
UIkit.modal('#theme_page').toggle();
setTimeout(function(){
document.getElementById('nuken').style.transform = "scale(1.1)";
document.getElementById('nuken').style.opacity = "0%";
document.getElementById('nuken').style.pointerEvents = "none";
setTimeout(function(){

if (theme === default_nuken_theme){	
	remove_all_themes();
} else {
	load_theme(theme);
}
	setTimeout(function(){
		document.getElementById('nuken').style.opacity = "100%";
		document.getElementById('nuken').style.pointerEvents = "auto";
		document.getElementById('nuken').style.transform = "scale(1)";
		ready_to_notify = true;
		setTimeout(function(){
			UIkit.modal('#theme_page').toggle();
			success_2.currentTime = 0;	
success_2.play();
		},250);
	},500);
},500);
},250);

};


var load_theme = function(theme){
	
	//append a link tag to the head of the document with our selected attributes (most notably, the theme href)
	
$('link[data = "theme"]').remove();

window.location.replace('#');
	
 var cssLink = $("<link>");
  $("head").append(cssLink);


  cssLink.attr({
    rel:  "stylesheet",
    type: "text/css",
    href: theme,
	id: theme,
	data: "theme"
  });
  
  //notify the user that a theme was loaded
  
  setTimeout(function(){

var filename_proto = theme.replace(/[_-]/g, " "); 
var filename_proto2 = filename_proto.replace(/^.*[\\\/]/, '');
var filename_proto3 = toTitleCase(filename_proto2);
var cosmetic_filename = filename_proto3.replace(".css", ""); 
var filename = filename_proto;
var cosmetic_filename2 = theme.replace(theme_direc,"")


var theme_panel = `
<div id = "`+filename+`" class = "content_div">
<img src = "icons/theme.png" ></img>
<div id = "`+filename+`_body" >
<span>`+cosmetic_filename+`</span>
<br>
<button uk-toggle = "target:#theme_page" ><i class="ri-external-link-line"></i></button>
<i class = "ri-paint-fill content_div_icon"></i> 
</div>
</div> 
	`;
	
	var theme_panel_raw = `
<div id = "`+filename+`" class = "content_div">
<img src = "icons/theme.png" ></img>
<div id = "`+filename+`_body" >
<span>`+cosmetic_filename2+`</span>
<br>
<button onclick = "show_folder('/`+theme+`')" ><i class="ri-external-link-line"></i></button>
<button onclick = "delete_file('/`+theme+`');show_deleted_element('`+filename+`')" ><i class="ri-delete-bin-2-line"></i></button>
<i class = "ri-paint-fill content_div_icon"></i> 
</div>
</div> 
	`;
	


if (content_menu_available) {
document.getElementById('content_div').innerHTML += theme_panel;
document.getElementById('library_div').innerHTML += theme_panel_raw;
}
		

var workspace_background = window.getComputedStyle(document.getElementById('workspace'), false);

document.getElementById('theme_preview').style.backgroundImage = workspace_background.backgroundImage;
document.getElementById('theme_preview').style.backgroundColor = workspace_background.backgroundColor;

},550);





	
};

var post_theme_check = function(){

if (auto_theme){

document.getElementById('theme_library_div').innerHTML += `
<hr>
 <p>This feature has been disabled in the <a uk-toggle = "#settings_page"><i class="ri-settings-3-fill"></i> <span><b>Settings Menu.</b></span></a> </p>
 

`;

} else {
	
document.getElementById('theme_library_div').innerHTML += `
<hr>
<p>That's all we could find. View more options in the <a uk-toggle = "#settings_page"><i class="ri-settings-3-fill"></i> <span><b>Settings Menu</b></span></a>, or the <a uk-toggle = "#content_page"><i style = "font-weight:100" class="ri-install-fill"></i> <b><span>Downloaded Content Menu.</span></b></a></p>
 

`;


}

setTimeout(function(){
content_menu_available = false;
},2000);

};

var show_deleted_element = function(element){

document.getElementById(element).style.width = "42.5vmin";
document.getElementById(element).style.opacity = "50%";
document.getElementById(element).style.pointerEvents = "none";	
	
document.getElementById(element+"_body").innerHTML = `

<h3>Removed</h3>
<h4>Please relaunch nuken to finish the removal process.</h4>

`;
};
