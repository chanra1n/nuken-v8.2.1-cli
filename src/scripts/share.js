var share_menu_is_open = true; //indicates whether the Share Menu is open or not.


//write a preview to the snapshot preview area
var write_preview = function(){

if (share_menu_is_open){
	snap_sound.currentTime = 0;
snap_sound.play();

 //When the user creates a snapshot and the menu is OPEN, the camera shutter sound plays. However, since we don't want the shutter sound to play if the user isn't actually in the menu, we detect whether it's open or not first. (Remember, when the user hits the play button, a snapshot is automatically generated).

}

//clear previous snapshot
document.getElementById('share_project_container').innerHTML = "";


//show the save / copy button container
document.getElementById('share_project_bar').style.display = "block";


//here, we create a (hidden) iframe based on the project currently being previewed in the preview area (taking a snapshot of the preview area doesn't work - we need to create a new iframe e can manipulate for this to work. trust me bro). Then, we use html2canvas to take a snapshot of this iframe, and display the result to the user.

var iframe = document.createElement('iframe');

document.getElementById('share_project_container').appendChild(iframe);
iframe.id = "share_frame";

iframe.contentWindow.document.open();

iframe.contentWindow.document.write(saved_project);


const element = iframe.contentWindow.document.documentElement;

html2canvas(element).then(canvas => {
	document.getElementById('share_project_container').innerHTML = "";
	document.getElementById('share_project_container').appendChild(canvas);
});


  };
  
//copy the current snapshot 
var copy_preview = function(){

enable_sound.currentTime = 0;
enable_sound.play();

//the copy button changes on success, then reverts back
document.getElementById('copy_project_share').classList.remove('ri-checkbox-multiple-blank-line');
document.getElementById('copy_project_share').classList.add('ri-checkbox-multiple-fill');

setTimeout(function(){
	document.getElementById('copy_project_share').classList.add('ri-checkbox-multiple-blank-line');
document.getElementById('copy_project_share').classList.remove('ri-checkbox-multiple-fill');
},1000);


//write the image blob to the user's clipboard
var canvas = document.querySelector("canvas");	
canvas.toBlob(function(blob) { 
    const item = new ClipboardItem({ "image/png": blob });
    navigator.clipboard.write([item]); 
});



};  

//download the current snapshot
var download_preview= function(){
enable_sound.currentTime = 0;
enable_sound.play();
var canvas = document.querySelector("canvas");
  image = canvas.toDataURL("image/png");
  var link = document.createElement('a');
  link.download = "My Project.png";
  link.href = image;
  link.click();
  
  };
  
  
var share_page_innerhtml = `


<div id="left">

<div class="widget">
<img src="icons/images/share.jpg">
<h1>Join the community</h1>
<p>Welcome to the <b><i class="ri-share-fill" style="font-size:2.25vmin"></i> Share Menu.</b> Looking to join us? Pick a platform and hop in!</p>
</div>

<div class="grid">

<div onclick="popup_sound.currentTime=0;popup_sound.play();window.open('https://nuken.xyz/discord');" style="background-color:#404eed" class="app">
<i class="ri-discord-fill"></i>
<h1 style="font-family:'discord';">Discord</h1>
</div>

<div onclick="popup_sound.currentTime=0;popup_sound.play();window.open('https://nuken.xyz/github');" style="background-color:#161b22" class="app">
<i class="ri-github-fill"></i>
<h1 style="font-family:'github';">GitHub</h1>
</div>

<div onclick="popup_sound.currentTime=0;popup_sound.play();window.open('https://nuken.xyz/twitter');" style="background-color:#1DA1F2" class="app">
<i class="ri-twitter-fill"></i>
<h1 style="font-family:Helvetica;">Twitter</h1>
</div>
<br>

<div onclick="popup_sound.currentTime=0;popup_sound.play();window.open('https://nuken.xyz/reddit');" style="background-color:#FF5700" class="app">
<i class="ri-reddit-fill"></i>
<h1 style="font-family:Verdana;">Reddit</h1>
</div>

<div onclick="popup_sound.currentTime=0;popup_sound.play();window.open('https://nuken.xyz/instagram');" style="background-color:#C13584" class="app">
<i class="ri-instagram-line"></i>
<h1 style="font-family:'instagram';">Instagram</h1>
</div>

</div>

</div>

<div id="right">
<h1>Share my project</h1>
<p>If you want to share your work, try <b style="cursor:pointer" uk-toggle="#export_page" tabindex="0" aria-expanded="false"><i uk-toggle="#export_page" class="ri-share-box-fill" style="font-size:2.25vmin" tabindex="0" aria-expanded="false"></i> <span>exporting it</span></b>. If you'd rather just take a picture, we're here for that too.</p>
<button id="project_snapshot_button" onclick="write_preview()"><i class="ri-camera-fill"></i> <span> Take a snapshot</span></button>
<span id="share_project_container">
<iframe src="" id="share_frame"></iframe>
</span>
<div id="share_project_bar">
<i id="download_project_share" onclick="download_preview()" class="ri-download-2-fill"></i>
<i id="copy_project_share" onclick="copy_preview()" class="ri-checkbox-multiple-blank-line"></i>
</div>

</div>

`;