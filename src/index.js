const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require("fs");
const DecompressZip = require('decompress-zip');
const addon_index = [];
const theme_index = [];
const template_index = [];

const addon_directory = "content/addons/";
const theme_directory = "content/themes/";
const template_directory = "content/templates/";

require('@electron/remote/main').initialize()
let win;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}


const ipc = {
    'render': {
        // From render to main.
        'send': [],
        // From main to render.
        'receive': [],
        // From render to main and back again.
        'sendReceive': [
            'dialog:openDirectorySelect' // Channel name
        ]
    }
};


//require('child_process').spawn('control', ['ncpa.cpl']);

const createWindow = () => {
  // Create the browser window.
 
  
  const mainWindow = new BrowserWindow({
	  autoHideMenuBar: true,
	  minWidth:800,
	  minHeight:640,
	  titleBarStyle: 'hidden',
	  titleBarOverlay: {
              color: '#000000',
              symbolColor: '#ffffff',
			  backgroundColor:'#000000',
          },
		  webPreferences: {
	  nodeIntegration: true, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: true, // turn off remote
      preload: path.join(__dirname, "preload.js"),	// use a preload script
        },
	  icon: path.join(__dirname, 'icons/favi.ico'),
	  
  });
  
// remove so we can register each time as we run the app. 
app.removeAsDefaultProtocolClient('nuken');



app.setAsDefaultProtocolClient('nuken', process.execPath);        

  


const dir = path.join(__dirname, addon_directory);
const files = fs.readdirSync(dir);


const pdir = path.join(__dirname, template_directory);
const pfiles = fs.readdirSync(pdir);

const tdir = path.join(__dirname, theme_directory);
const tfiles = fs.readdirSync(tdir);

for (const file of files) {

if (file.toString().toLowerCase().includes('.js')){
	
addon_index.push(file);
		
		

}
}

for (const file of tfiles) {

if (file.toString().toLowerCase().includes('.css')){
	
console.log(file);	
theme_index.push(file);
		
		

}

		

}

for (const file of pfiles) {

if (file.toString().toLowerCase().includes('.js')){
	
console.log(file);	
template_index.push(file);
		

}

		

}
  
 
  

ipcMain.on("toMain", (event, args) => {
	
	
if (args == "NOTHING"){
	 mainWindow.webContents.send("fromMain", 'NOTHING');
} else {
	
  fs.readFile(args, 'utf-8', (error, data) => {
    // Do something with file contents
    // Send result back to renderer process
    mainWindow.webContents.send("fromMain", data);
  });
}
});

ipcMain.handle('addons', async (event, someArgument) => {
  return addon_index;
});

ipcMain.handle('templates', async (event, someArgument) => {
  return template_index;
});

ipcMain.handle('themes', async (event, someArgument) => {
  return theme_index;
});

ipcMain.on('extract_file', async (event, args) => {
extract_zip_file(args);
});

ipcMain.handle('reload_nuken', async (event, someArgument) => {
app.relaunch();
app.exit();
});


ipcMain.on('delete_file', async (event, args) => {
delete_file(args);
});

ipcMain.on('delete_folder', async (event, args) => {
delete_folder(args);
});


ipcMain.on('show_folder', async (event, args) => {
  var temp = path.join(__dirname,args);
  shell.showItemInFolder(temp);
  mainWindow.webContents.executeJavaScript('popup_sound.currentTime=0;popup_sound.play();');  
});

var delete_file = function(file){


mainWindow.webContents.executeJavaScript(`notify("If nuken missed something, you migt have to yeet it manually. You can open the directories you're looking for from the <a uk-toggle= "target:#content_page"><i class="ri-install-fill"></i> <span>Downloaded Content Menu.</span></a>")`);

var filepath = path.join(__dirname,file);// Previously saved path somewhere

if (fs.existsSync(filepath)) {
    fs.unlink(filepath, (err) => {
        if (err) {
            mainWindow.webContents.executeJavaScript(`notify("The content you were trying to delete just... won't... die.")`);
            return;
        }
        mainWindow.webContents.executeJavaScript(`notify("Content was successfully deleted.")`);
    });
} else {
    mainWindow.webContents.executeJavaScript('notify("Hm, are you sure that file exists?")');
}

};

var delete_folder = function(directory){

var directory = path.join(__dirname,directory);
   mainWindow.webContents.executeJavaScript(`console.log('`+directory+`')`);

fs.readdir(directory, (err, files) => {
  if (err){
   mainWindow.webContents.executeJavaScript(`console.log("Directory doesn't exist: `+err+`")`);
 }

  for (const file of files) {
    fs.unlink(path.join(directory, file), err => {
      if (err){
mainWindow.webContents.executeJavaScript(`console.log("The files weren't deleted. Deal with it. `+err+`")`);
      }
    });
  }
});

mainWindow.webContents.executeJavaScript('notify("All downloadable content has been deleted.")');

};



function extract_zip_file(extract_object) {
console.log(extract_object[0].toString());
console.log(extract_object[1].toString());  

var ZIP_FILE_PATH = path.join(__dirname, extract_object[0].toString());
var DESTINATION_PATH = path.join(__dirname, extract_object[1].toString());
var unzipper = new DecompressZip(ZIP_FILE_PATH);

// Add the error event listener
unzipper.on('error', function (err) {
    console.log('Caught an error', err);
});

// Notify when everything is extracted
unzipper.on('extract', function (log) {
    console.log('Finished extracting', log);
	mainWindow.webContents.executeJavaScript('notify("Content was installed successfully. Please restart nuken (now or later) to use it.")');
	mainWindow.webContents.executeJavaScript('download_sound.currentTime=0;download_sound.play();');
	
	
});

// Notify "progress" of the decompressed files
unzipper.on('progress', function (fileIndex, fileCount) {
    console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
});

// Start extraction of the content
unzipper.extract({
    path: DESTINATION_PATH
    // You can filter the files that you want to unpack using the filter option
    //filter: function (file) {
        //console.log(file);
        //return file.type !== "SymbolicLink";
    //}
});
  
}


  ipcMain.handle('dialog:openFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
		
      properties: ['openFile'],
	  filters: [
              { name: 'HTML files', extensions: ['html', 'htm', 'shtml'] }
            ],
    })
    if (canceled) {
      return 'NOTHING';
    } else {
      return filePaths[0]
    }
  })
  


mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
  // Set the save path, making Electron not to prompt a save dialog.
  
  var is_shop_content = false;
  
  
    var content_type = item.getFilename().toString();
  var content_directory = addon_directory;  
var item_location = item.getURL();


if (item_location.toString().includes('data:') && item_location.toString().includes('text/') ){
	
	is_shop_content = false;

console.log('not shop content');

} else {

is_shop_content = true;

if (content_type.includes('addon')){
item.setSavePath(path.join(__dirname,addon_directory+content_type)); 
 
  } else if (content_type.includes('theme')){
item.setSavePath(path.join(__dirname,theme_directory+content_type));

  } else if (content_type.includes('template') || content_type.includes('_pack')){
item.setSavePath(path.join(__dirname,template_directory+content_type));

  } else {
mainWindow.webContents.executeJavaScript('console.log("'+content_type+'")');
  	  
 }	  
}

  

  

  item.on('updated', (event, state) => {
    if (state === 'interrupted') {
		//INTERRUPTED
      console.log('Download is interrupted but can be resumed');
	    mainWindow.webContents.executeJavaScript('UIkit.modal("#shop_confirm_page").hide();UIkit.modal("#shop_success_page").hide();UIkit.modal("#shop_error_page").show();');
	    mainWindow.webContents.executeJavaScript('notif_error_sound.currentTime=0;notif_error_sound.play();');
    } else if (state === 'progressing') {
      if (item.isPaused()) {
		  //PAUSED
        console.log('Download is paused');
				mainWindow.webContents.executeJavaScript('UIkit.modal("#shop_confirm_page").hide();UIkit.modal("#shop_success_page").hide();UIkit.modal("#shop_error_page").show();');
	    mainWindow.webContents.executeJavaScript('notif_error_sound.currentTime=0;notif_error_sound.play();');
      
	  } else {
		  //SUCCESS
        console.log(`Received bytes: ${item.getReceivedBytes()}`);
      }
    }
  })
  item.once('done', (event, state) => {
	  	  mainWindow.webContents.executeJavaScript('console.log("'+state+'")');
		 
		  
    if (state === 'completed') {
		
	if (is_shop_content){	

      console.log('Download successfully');
	  mainWindow.webContents.executeJavaScript('init_extract_process()');
	  //SHOP CONTENT DOWNLOADED SUCCESSFULLY

	  mainWindow.webContents.executeJavaScript("document.getElementById('shop_download_location').style.transition = 'all 0s';document.getElementById('shop_download_location').style.backgroundSize = '100%';document.body.style.pointerEvents = 'auto';document.getElementById('shop_cancel_button').style.opacity = '100%';");
	  	  	  		mainWindow.webContents.executeJavaScript('UIkit.modal("#shop_confirm_page").hide();UIkit.modal("#shop_success_page").show();');
	    mainWindow.webContents.executeJavaScript('download_sound.currentTime=0;download_sound.play();');
		
		setTimeout(function(){
			mainWindow.webContents.executeJavaScript("document.getElementById('shop_download_location').style.transition = 'all 0s';document.getElementById('shop_download_location').style.backgroundSize = '0%';");
		setTimeout(function(){
			mainWindow.webContents.executeJavaScript("document.getElementById('shop_download_location').style.transition = 'all 2.5s';");
			mainWindow.webContents.executeJavaScript("document.getElementById('shop_download_button').innerHTML = `<i class='ri-check-fill'></i> <span>Let's begin</span>`;");
		},100);
		},100);
		
	} else {
	
		  mainWindow.webContents.executeJavaScript('notify("Export successful.")');
		  	    mainWindow.webContents.executeJavaScript('download_sound.currentTime=0;download_sound.currentTime=0;download_sound.play();');
	
	}
	  
	    } else if (state === 'cancelled') {
	//DOWNLOAD CANCELLED BY USER	

if (is_shop_content){
		  		mainWindow.webContents.executeJavaScript('UIkit.modal("#shop_confirm_page").hide();UIkit.modal("#shop_success_page").hide();UIkit.modal("#shop_error_page").show();');
	    mainWindow.webContents.executeJavaScript('notif_error_sound.currentTime=0;notif_error_sound.play();');
} else {
	  mainWindow.webContents.executeJavaScript('notify("Export cancelled.")');
	  mainWindow.webContents.executeJavaScript('close_sound.currentTime=0;close_sound.play();');
	  
	  setTimeout(function(){
			mainWindow.webContents.executeJavaScript("document.getElementById('shop_download_location').style.transition = 'all 0s';document.getElementById('shop_download_location').style.backgroundSize = '0%';");
		setTimeout(function(){
			mainWindow.webContents.executeJavaScript("document.getElementById('shop_download_location').style.transition = 'all 2.5s';");
			mainWindow.webContents.executeJavaScript("document.getElementById('shop_download_button').innerHTML = `<i class='ri-check-fill'></i> <span>Let's begin</span>`;");
		},100);
		},100);
	  
}
    } else {
		//SOMETHING WENT WRONG
	  	  mainWindow.webContents.executeJavaScript('console.log("Download failed: '+state+'")');
	  		mainWindow.webContents.executeJavaScript('UIkit.modal("#shop_confirm_page").hide();UIkit.modal("#shop_success_page").hide();UIkit.modal("#shop_error_page").show();');
	    mainWindow.webContents.executeJavaScript('notif_error_sound.currentTime=0;notif_error_sound.play();');
		
		setTimeout(function(){
			mainWindow.webContents.executeJavaScript("document.getElementById('shop_download_location').style.transition = 'all 0s';document.getElementById('shop_download_location').style.backgroundSize = '0%';");
		setTimeout(function(){
			mainWindow.webContents.executeJavaScript("document.getElementById('shop_download_location').style.transition = 'all 2.5s';");
			mainWindow.webContents.executeJavaScript("document.getElementById('shop_download_button').innerHTML = `<i class='ri-check-fill'></i> <span>Let's begin</span>`;");
		},100);
		},100);
		
    }
  })
})

  // and load the index.html of the app.
mainWindow.setBackgroundColor('#000000');
mainWindow.loadFile(path.join(__dirname, 'index.html'));
mainWindow.maximize();


const wintest = BrowserWindow.getAllWindows()[0];
const ses = wintest.webContents.session;

ses.clearCache();

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


// 👇 Comment out the code below if you want to enable DevTools in nuken. 👇

/*
app.on("browser-window-created", (e, win) => {
   win.removeMenu();
});
*/


// 👆 Comment out the code above if you want to enable DevTools in nuken. 👆


app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});











// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
