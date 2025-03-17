document.addEventListener("DOMContentLoaded", function () {
  var htmlEditor = CodeMirror.fromTextArea(document.getElementById("html"), {
    mode: "xml",
    lineNumbers: true,
    theme: "base16-dark",
    autoCloseTags: true,
    autoCloseBrackets: true,
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    indentWithTabs: true,
    smartIndent: true,
  });
  var cssEditor = CodeMirror.fromTextArea(document.getElementById("css"), {
    mode: "css",
    lineNumbers: true,
    theme: "base16-dark",
    foldGutter: true,
    autoCloseBrackets: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    indentWithTabs: true,
    smartIndent: true,
  });
  var jsEditor = CodeMirror.fromTextArea(document.getElementById("js"), {
    mode: "javascript",
    lineNumbers: true,
    theme: "base16-dark",
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    autoCloseBrackets: true,
    indentWithTabs: true,
    smartIndent: true,
  });

  // Prefilled Code
  htmlEditor.setValue(`<head>
  <title>Test</title>
</head>
<body>
  <h1>Hello, World!</h1>
</body>
`);

  cssEditor.setValue(`body {
  font-family: Arial, sans-serif;
  text-align: center;
}`);

  jsEditor.setValue(`console.log('Hello, World!');`);

  window.runCode = function () {
    var htmlCode = htmlEditor.getValue();
    var cssCode = "<style>" + cssEditor.getValue() + "</style>";
    var jsCode = jsEditor.getValue();
    var frame = document.getElementById("output").contentWindow.document;

    // Clear console before running new code
    var logContainer = document.getElementById("console-output");
    logContainer.innerHTML = "";

    frame.open();
    frame.write(
      htmlCode +
        cssCode +
        `
          <script>
            (function() {
              var logContainer = window.parent.document.getElementById("console-output");
              logContainer.innerHTML = ""; // Clear previous logs
  
              // Override console.log
              console.log = function(message) {
                logContainer.innerHTML += "<span style='color:white'>" + "&gt;&nbsp;" + message + "</span><br>";
              };
  
              // Override console.error
              console.error = function(error) {
                logContainer.innerHTML += "<span style='color:red'>" + "&gt;&nbsp;" + error + "</span><br>";
              };
  
              // Capture uncaught errors
              window.onerror = function(message, source, lineno, colno, error) {
                logContainer.innerHTML += "<span style='color:red'><b>Error:</b> " +  "&gt;&nbsp;" + message + " (Line: " + lineno + ")</span><br>";
              };
            })();
          <\/script>
        `
    );
    frame.close();

    // Delay execution slightly to ensure console setup
    setTimeout(() => {
      try {
        document.getElementById("output").contentWindow.eval(jsCode);
      } catch (error) {
        logContainer.innerHTML +=
          "<span style='color:red'><b>Runtime Error:</b> " +
          error.message +
          "</span><br>";
      }
    }, 100);
  };

  window.downloadCode = function () {
    var htmlCode = htmlEditor.getValue();
    var cssCode = cssEditor.getValue();
    var jsCode = jsEditor.getValue();
    var blob = new Blob(
      [
        "<!DOCTYPE html>\n",
        "<html>\n",
        htmlCode,
        "\n<style>\n",
        cssCode,
        "\n</style>\n<script>\n",
        jsCode,
        "\n</script>",
        "\n<!-- Code Editor by Rakesh Kanna S -->",
        "\n<!-- https://rakeshkanna-rk.github.io/Code-Editor/ -->",
        "\n</html>",
      ],
      { type: "text/html" }
    );
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "code.html";
    a.click();
  };

  window.toggleConsole = function () {
    var consolePanel = document.getElementById("console-panel");
    var isChecked = document.getElementById("consoleToggle").checked;
    consolePanel.style.display = isChecked ? "block" : "none";
  };

  // Clear Console Function
  window.clearConsole = function () {
    document.getElementById("console-output").innerHTML =
      "Press 'Run' to see any console output";
  };
});

// OVERLAY
function closeOverlay(event) {
  // Close the overlay only if the user clicks outside overlay-content
  if (!event || event.target.id === "dev-overlay") {
    document.getElementById("dev-overlay").classList.add("hidden");
  }
}

// Mobile Alert
window.onload = function () {
  if (window.innerWidth < 768) {
    alert(
      "⚠️ 𝗙𝗼𝗿 𝗮 𝗯𝗲𝘁𝘁𝗲𝗿 𝗲𝘅𝗽𝗲𝗿𝗶𝗲𝗻𝗰𝗲, 𝘂𝘀𝗲 𝗮 𝗹𝗮𝗿𝗴𝗲𝗿 𝘀𝗰𝗿𝗲𝗲𝗻.\n\nClick OK to continue."
    );
  }
};
