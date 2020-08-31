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