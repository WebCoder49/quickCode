setTimeout(function() {
    // Set theme
    if(localStorage.qCT == "d") {
        document.getElementById("theme").href = "dark.css";
    } else {
        document.getElementById("theme").href = "light.css";
    }
}, 1000);