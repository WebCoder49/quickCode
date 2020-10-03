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
    let linen = code.split("\n").length;
    document.getElementById("plainCode").style.height = (linen * 20) + "px";
    document.getElementById("richCode").style.height = (linen * 20) + "px";
    document.getElementById("richCode").innerText = code;
    hljs.highlightBlock(document.getElementById("richCode"));
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
    var ascii = /^[ -~]+$/;

    if ( !ascii.test(code) ) {
    // string has non-ascii characters
    alert("Please only type regular characters, not emojis etc. Thank you!")
    } else {
    frame.src = "data:text/html;base64," + btoa(code);
    }
}