let fs;
let currentName;
let currentCode;
let currentlyEditing;
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
function highlight(code) {
    if(currentlyEditing !== undefined) {
    code = code.replace(new RegExp(" ", "ig"), "\u00a0")
    let linen = code.split("\n").length;
    document.getElementById("plainCode").style.height = (linen * 20) + "px";
    document.getElementById("richCode").style.height = (linen * 20) + "px";
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
function codeKeyPressed(event) {
    if(event.code == "Tab") {
        event.preventDefault();
        let tarea = document.getElementById("plainCode");
            let oldVal = tarea.value;
            let beginningCode = oldVal.substr(0, tarea.selectionStart);
            let cPos = tarea.selectionStart;
            let endCode = oldVal.substr(tarea.selectionEnd, tarea.value.length);
            tarea.value = beginningCode + "\u00a0\u00a0\u00a0\u00a0" + endCode;
            tarea.selectionStart = cPos + 4;
            tarea.selectionEnd = cPos + 4;
    }
}
function run() {
    let frame = document.getElementById("resultFrame");
    let code = document.getElementById("plainCode").value;
    frame.src = "data:text/html;base64," + btoa(code);
}
function download() {
    let code = document.getElementById("plainCode").value;
    window.open("download.html#" + encodeURIComponent("data:text/html;base64," + btoa(code)), "_blank")
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
function openF(e) {
    let es = document.getElementById("fileList").getElementsByClassName("fileItem");
    for(let i = 0; i < es.length; i++) {
        es[i].classList.remove("open");
    }
    e.classList.add("open");
    let n = e.id.substring(1);
    fs = files.get();
    let f = fs[n].split("#");
    currentName = f[0];
    currentCode = f[1];
    currentlyEditing = n;
    document.getElementById("plainCode").value = currentCode;
    highlight(document.getElementById("plainCode").value);
}
let files = {
    get: function() {
        if(localStorage.qCFs !== undefined) {
            let fCodes = localStorage.qCFs.split("/");
            let files = [];
            fCodes.forEach(function(item) {
                files.push(item.split(","));
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
            let arr = item.split("#");
            document.getElementById("fileList").innerHTML += '<div class="fileItem" id="f' + index + '" onclick="openF(this);"><span class="fileName">' + arr[0] + '.html</span><button class="fileOptions"></button></div>';
        });
    }
}
window.onload = files.addToList;
window.addEventListener('beforeunload', function (e) {
    // Cancel the event
    e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
    // Chrome requires returnValue to be set
    e.returnValue = 'Are you sure you want to leave? Changes may not be saved - WebCoder49';
  });