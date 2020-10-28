let fs;
let currentName;
let currentCode;
let currentlyEditing;
let newLines = true;

$(window).bind('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
        case 's':
            event.preventDefault();
            if(currentlyEditing !== undefined) {
                let defbg = document.getElementById("save").style.backgroundColor;
                save();
                document.getElementById("save").style.backgroundColor = "#ffff00";
                setTimeout(function() {
                    document.getElementById("save").style.backgroundColor = defbg;
                }, 500)
            }
            break;
        case 'r':
            event.preventDefault();
            if(currentlyEditing !== undefined) {
                let defbg = document.getElementById("run").style.backgroundColor;
                run();
                document.getElementById("run").style.backgroundColor = "#ffff00";
                setTimeout(function() {
                    document.getElementById("run").style.backgroundColor = defbg;
                }, 500)
            }
            break;
        }
    }
});

setTimeout(function() {
    // Set theme
    if(localStorage.qCT == "d") {
        document.getElementById("theme").href = "dark.css";
        document.getElementById("darkMode").classList.add("dark");
    } else {
        document.getElementById("theme").href = "light.css";
        document.getElementById("darkMode").classList.remove("dark");
    }
}, 1000);
function darkMode(e) {
    e.classList.toggle("dark");
    if(e.classList.contains("dark")) {
        localStorage.qCT = "d";
        document.getElementById("theme").href = "dark.css";
    } else {
        localStorage.qCT = "";
        document.getElementById("theme").href = "light.css";
    }
}
// Element Views
function toggleFiles() {
    document.getElementById("files").classList.toggle("open");
}
function viewFiles() {
    document.getElementById("files").className = "open";
    document.getElementById("code").className = "";
    document.getElementById("result").className = "";
    document.getElementById("filesButton").className = "open";
    document.getElementById("codeButton").className = "";
    document.getElementById("resultButton").className = "";
}
function viewCode() {
    document.getElementById("files").className = "";
    document.getElementById("code").className = "open";
    document.getElementById("result").className = "";
    document.getElementById("filesButton").className = "";
    document.getElementById("codeButton").className = "open";
    document.getElementById("resultButton").className = "";
}
function viewResult() {
    document.getElementById("files").className = "";
    document.getElementById("code").className = "";
    document.getElementById("result").className = "open";
    document.getElementById("filesButton").className = "";
    document.getElementById("codeButton").className = "";
    document.getElementById("resultButton").className = "open";
}
//Syntax highlight
function refreshLines() {
    $(function() {
        $(".lined").linedtextarea();
    });
    newLines = false;
}
function highlight(code) {
    if(currentlyEditing !== undefined) {
        refreshLines();
        code = code.replace(new RegExp(" ", "ig"), "\u00a0")
        let linen = code.split("\n").length;
        document.getElementById("plainCode").style.height = (linen * 20) + "px";
        document.getElementById("richCode").style.height = (linen * 20) + "px";
        document.getElementsByClassName("lines")[0].style.height = (linen * 20) + "px";
        let linem = 0;
        code.split("\n").forEach(function(item) {
            if(item.length > linem) {
                linem = item.length;
            }
        });
        document.getElementById("plainCode").style.width = (linem * 15) + "px";
        document.getElementById("richCode").style.width = (linem * 15) + "px";
        document.getElementById("richCode").innerText = code;
        hljs.highlightBlock(document.getElementById("richCode"));
    } else {
        document.getElementById("richCode").innerHTML = "<div class='hljs-comment'>Please <span class='hljs-title'>click a file in the file tab to edit it </span> <br/>or press the <span class='hljs-title'>+</span> button to create a new one.</div>";
        document.getElementById("plainCode").value = "";
    }
}
//Keyboard Shortcuts
function codeKeyPressed(event) {
    if(event.code == "Tab") {
        event.preventDefault();
        let tarea = document.getElementById("plainCode");
            let oldVal = tarea.value;
            let beginningCode = oldVal.substr(0, tarea.selectionStart);
            let cPos = tarea.selectionStart;
            let endCode = oldVal.substr(tarea.selectionEnd, tarea.value.length);
            tarea.value = beginningCode + "    " + endCode;
            tarea.selectionStart = cPos + 4;
            tarea.selectionEnd = cPos + 4;
    }
}
//Files and editor
function run() {
    if(currentlyEditing !== undefined) {
    let frame = document.getElementById("resultFrame");
    let code = document.getElementById("plainCode").value;
    if(/^[\x00-\xFF]*$/.test(code) == false) {
        alert("Sorry, but quickCode does not yet have support for non-ASCII characters. 😢")
    }
    frame.src = "data:text/html;base64," + btoa(code);
    }
}
function download() {
    if(currentlyEditing !== undefined) {
        let code = document.getElementById("plainCode").value;
        window.open("download/#" + encodeURIComponent("data:text/html;base64," + btoa(code) + "-" + btoa(currentName)), "_blank");
    }
}
function save() {
    currentCode = document.getElementById("plainCode").value;
    fs = files.get();
    fs[currentlyEditing][1] = encodeURIComponent(currentCode);
    files.set(fs);
}
function searchFiles(q) {
    let es = document.getElementById("fileList").getElementsByClassName("fileItem");
    for(let i = 0; i < es.length; i++) {
        if(es[i].innerText.includes(q)) {
            es[i].style.display = "block";
        } else {
            es[i].style.display = "none";
        }
    }
}
function options(e) {
    deleteFile(e);
}
function deleteFile(e) {
    if(confirm("Do you really want to delete this file?")) {
        //save before action
        if(currentlyEditing !== undefined) {
            let defbg = document.getElementById("save").style.backgroundColor;
            save();
            document.getElementById("save").style.backgroundColor = "#ffff00";
            setTimeout(function() {
                document.getElementById("save").style.backgroundColor = defbg;
            }, 500)
        }
        //action
        let n = e.id.substring(1);
        fs.splice(n, 1);
        files.set(fs);
        window.onbeforeunload = function (e) {}; //allow reload
        location.reload(); //Reload
    }
}
function openF(e) {
    if(currentlyEditing !== undefined) {
        let defbg = document.getElementById("save").style.backgroundColor;
        save();
        document.getElementById("save").style.backgroundColor = "#ffff00";
        setTimeout(function() {
            document.getElementById("save").style.backgroundColor = defbg;
        }, 500)
    }
    let es = document.getElementById("fileList").getElementsByClassName("fileItem");
    for(let i = 0; i < es.length; i++) {
        es[i].classList.remove("open");
    }
    e.classList.add("open");
    let n = e.id.substring(1);
    fs = files.get();
    let f = fs[n];
    currentName = decodeURIComponent(f[0]);
    currentCode = decodeURIComponent(f[1]);
    currentlyEditing = n;
    document.getElementById("plainCode").value = currentCode;
    highlight(currentCode);
    
}
function newFile() {
    if(currentlyEditing !== undefined) {
        let defbg = document.getElementById("save").style.backgroundColor;
        save();
        document.getElementById("save").style.backgroundColor = "#ffff00";
        setTimeout(function() {
            document.getElementById("save").style.backgroundColor = defbg;
        }, 500)
    }
    currentName = prompt("What would you like to call your file? \n(.html will be added automatically)") + ".html";
    currentCode = encodeURIComponent("<!DOCTYPE html>\r\n<html>\r\n    <head>\r\n        <title>" + currentName + "<\/title>\r\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\r\n        <!--It works on tablets and smartphones-->\r\n    <\/head>\r\n    <body>\r\n        <h1>Hello, World!<\/h1>\r\n    <\/body>\r\n<\/html>");
    fs = files.get();
    fs.push([currentName, currentCode])
    files.set(fs);
    document.getElementById("fileList").innerHTML = "";
    files.addToList();
    let e = document.getElementById("f" + (fs.length - 1));
    let es = document.getElementById("fileList").getElementsByClassName("fileItem");
    for(let i = 0; i < es.length; i++) {
        es[i].classList.remove("open");
    }
    e.classList.add("open");
    let n = e.id.substring(1);
    fs = files.get();
    let f = fs[n].split("#");
    currentName = f[0];
    currentCode = decodeURIComponent(f[1]);
    currentlyEditing = n;
    document.getElementById("plainCode").value = currentCode;
    highlight(document.getElementById("plainCode").value);
}
let files = {
    get: function() {
        if(localStorage.qCFs !== undefined && localStorage.qCFs !== "") {
            let fCodes = localStorage.qCFs.split("/");
            let files = [];
            fCodes.forEach(function(item) {
                files.push(item.split("#"));
            });
            return files;
        } else {
            return [];
        }
    },
    set: function(arr) {
        let codes = [];
        arr.forEach(function(item) {
            codes.push(item.join("#"));
        });
        localStorage.qCFs = codes.join("/");
    },
    addToList: function() {
        fs = files.get();
    fs.forEach(function(item, index) {
            let arr = item;
            document.getElementById("fileList").innerHTML += '<div class="fileItem" id="f' + index + '" onclick="openF(this);"><span class="fileName">' + arr[0] + '</span><button class="fileOptions"></button></div>';
        });
    }
}
window.onload = files.addToList;
window.addEventListener('beforeunload', function (e) {
    //save before action
    if(currentlyEditing !== undefined) {
        let defbg = document.getElementById("save").style.backgroundColor;
        save();
        document.getElementById("save").style.backgroundColor = "#ffff00";
        setTimeout(function() {
            document.getElementById("save").style.backgroundColor = defbg;
        }, 500)
    }
    // Cancel the event
    e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
    // Chrome requires returnValue to be set
    e.returnValue = 'Are you sure you want to leave? Changes may not be saved - WebCoder49';
  });
function exitPopup() {
    document.getElementById("popupOverlay").classList.add("closed");
    let popups = document.getElementsByClassName("popup");
    for(let i = 0; i < popups.length; i++) {
        popups[i].classList.add("closed");
    }
}
function openPopup(popup) {
    document.getElementById("popupOverlay").classList.remove("closed");
    popup.classList.remove("closed");
}
function settings() {
    openPopup(document.getElementById("settings"));
}
function toggleSwitch(e, doifon, doifoff) {
    e.classList.toggle("on");
    if(e.classList.contains("on")) {
        eval(doifon)();
    } else {
        eval(doifoff)();
    }
}
function openFullscreen() {
    let elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { 
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { 
    elem.msRequestFullscreen();
  }
}
function exitFullscreen() {
    let elem = document.documentElement;
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { 
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

document.documentElement.addEventListener('fullscreenchange', (event) => {
if (document.fullscreenElement) {
    document.getElementById("fullscreen").classList.add("on");
} else {
    document.getElementById("fullscreen").classList.remove("on");
}
});