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

const langs = {
    js: {
        name: "javascript"
    },
    html: {
        name: "html"
    },
    svg: {
        name: "svg"
    }
}
function darkMode(e) {
    e.classList.toggle("dark");
    if(e.classList.contains("dark")) {
        localStorage.qCT = "d";
        document.getElementById("theme").href = "dark.css";
    } else {
        localStorage.qCT = "l";
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
    viewCode();
    if(currentlyEditing !== undefined) {
        document.getElementById("richCode").className = langs[currentName.split(".")[currentName.split(".").length - 1]].name;
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
        currentName = "index.html";
        currentCode = code
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
        let f = fs[n];
        currentName = f[0];
        currentCode = decodeURIComponent(f[1]);
        currentlyEditing = n;
        document.getElementById("plainCode").value = currentCode;
        highlight(document.getElementById("plainCode").value);
        document.getElementById("plainCode").select();
        let len = document.getElementById("plainCode").value.length;
        document.getElementById("plainCode").selectionStart = len;
        document.getElementById("plainCode").selectionEnd = len;
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
    viewResult();
    let frame = document.getElementById("resultFrame");
    let code = document.getElementById("plainCode").value;
    frame.src = "https://run-qcode.og49.repl.co/?lang=" + langs[currentName.split(".")[currentName.split(".").length - 1]].name + "&code=" + encodeURIComponent(code);
    }
}
function download() {
    if(currentlyEditing !== undefined) {
        let code = document.getElementById("plainCode").value;
        window.open("download.html#" + encodeURIComponent("data:text/html;base64," + btoa(code) + "-" + btoa(currentName)), "_blank");
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
        let delN = e.id.substring(1);
        let openN = location.hash.substring(2)
        if(delN < openN) {
            openN = Number(openN) - 1; // Keep same file open; index is different
        } else if(delN == openN) {
            openN = ""; // Deleted open file
        }
        location.hash = "#f" + openN;
        //action
        let n = e.id.substring(1);
        fs.splice(n, 1);
        files.set(fs);
        location.reload(); //Reload
    }
}
function openF(e) {
    location.hash = "#" + e.id;
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
    openPopup(document.getElementById("newFileModal"));
    document.getElementById("fName").value = "";
    document.getElementById("fName").focus();
}
function uploadFile() {
    document.getElementById("fUpload").click();
    openPopup(document.getElementById("uploadFileModal"));
}
function uploadNewFile(e, ev) {
    ev.preventDefault()
    exitPopup()

    if('files' in e) {
        fs = e.files;
        for(let i = 0; i < fs.length; i++) {
            let name = fs[i].name
            var reader = new FileReader();
            reader.onload = function(evt) {
                let text = evt.target.result;
                createNewFile(name, "", ev, text);
            };
            reader.readAsText(fs[i]);
        }
    }
}
function createNewFile(name, extension, ev, text=undefined) {
    ev.preventDefault()
    exitPopup()

    if(currentlyEditing !== undefined) {
        let defbg = document.getElementById("save").style.backgroundColor;
        save();
        document.getElementById("save").style.backgroundColor = "#ffff00";
        setTimeout(function() {
            document.getElementById("save").style.backgroundColor = defbg;
        }, 500)
    }

    currentName = name + extension
    let ext = currentName.split(".")[currentName.split(".").length - 1];
    if(text == undefined) {
        if(ext == "html") {
            currentCode = encodeURIComponent("<!DOCTYPE html>\r\n<html>\r\n    <head>\r\n        <title>" + currentName + "<\/title>\r\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\r\n        <!--It works on tablets and smartphones-->\r\n    <\/head>\r\n    <body>\r\n        <h1>Hello, World!<\/h1>\r\n    <\/body>\r\n<\/html>");
        } else if(ext == "js") {
            currentCode = encodeURIComponent("\/* " + currentName + " - Made on the quickCode editor at https://webcoder49.github.io/quickCode */\r\n\r\nconsole.log(\"Hello, World!\", \"font-size: 30pt\");");
        } else if(ext == "svg") {
            currentCode = encodeURIComponent("<!--" + currentName + " - Made on WebCoder49\'s quickCode Editor-->\r\n\r\n<polygon points=\"10 10, 50 10, 80 60, 50 110, 10 110, 40 60\" style=\"fill: navy;\"\/>\r\n<polygon points=\"65 10, 105 10, 135 60, 105 110, 65 110, 95 60\" style=\"fill: gold;\"\/>\r\n<polygon points=\"120 10, 160 10, 190 60, 160 110, 120 110, 150 60\" style=\"fill:navy\"\/>\r\n<text style=\"fill: navy; font-family: monospace; font-size: 25px;\" x=\"10\" y=\"155\">Hello, World!<\/text>");
        } else {
            currentCode = encodeURIComponent("*Extension not recognised (.'" + ext + "') - May not run*");
        }
    } else {
        currentCode = encodeURIComponent(text);
    }
    fs = files.get();
    fs.push([currentName, currentCode])
    files.set(fs);
    document.getElementById("fileList").innerHTML = "";
    files.addToList();
    let e = document.getElementById("f" + (fs.length - 1));
    openF(e)
}
let files = {
    get: function() {
        if(localStorage.qCFs !== undefined && localStorage.qCFs !== "") {
            let fCodes = localStorage.qCFs.split("/");
            let files = [];
            fCodes.forEach(function(item) {
                let arr = item.split("#")
                files.push(arr);
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
            document.getElementById("fileList").innerHTML += '<div class="fileItem" id="f' + index + '" onclick="openF(this);"><span class="fileName">' + arr[0] + '</span><button class="fileOptions" onclick="deleteFile(this.parentElement);"></button></div>';
        });
    }
}
window.onload = function() { 
    files.addToList();
    if(location.hash != "#" && location.hash != "" && location.hash != "#f") {
        let h = location.hash.substr(1);
        openF(document.getElementById(h));
    }
    if(localStorage.qCagreed == "1") {
        exitPopup();
    }
    // Set theme
    if(localStorage.qCT == "d") {
        document.getElementById("theme").href = "dark.css";
        document.getElementById("darkMode").classList.add("dark");
    } else if(localStorage.qCT == "l") {
        document.getElementById("theme").href = "light.css";
        document.getElementById("darkMode").classList.remove("dark");
    } else {
        // System theme
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.getElementById("theme").href = "dark.css";
            document.getElementById("darkMode").classList.add("dark");
            console.log("Default Theme Set to Dark due to System Theme");
        } else {
            document.getElementById("theme").href = "light.css";
            document.getElementById("darkMode").classList.remove("dark");
            console.log("Default Theme Set to Light due to System Theme");
        }
    }
    document.getElementById("loading").classList.add("hidden");
};
window.addEventListener('unload', function (e) {
    //save before action
    if(currentlyEditing !== undefined) {
        save();
    }
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