document.addEventListener("DOMContentLoaded", function () {
  var htmlEditor = CodeMirror.fromTextArea(document.getElementById("html"), {
    mode: "xml",
    lineNumbers: true,
    theme: "base16-dark",
    autoCloseTags: true,
  });
  var cssEditor = CodeMirror.fromTextArea(document.getElementById("css"), {
    mode: "css",
    lineNumbers: true,
    theme: "base16-dark",
  });
  var jsEditor = CodeMirror.fromTextArea(document.getElementById("js"), {
    mode: "javascript",
    lineNumbers: true,
    theme: "base16-dark",
  });

  // Prefilled Code
  htmlEditor.setValue(`<!DOCTYPE html>
<html>
    <head>
        <title>Test</title>
    </head>
    <body>
        <h1>Hello, World!</h1>
    </body>
</html>`);

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
                logContainer.innerHTML += "<span style='color:white'>" + message + "</span><br>";
              };
  
              // Override console.error
              console.error = function(error) {
                logContainer.innerHTML += "<span style='color:red'>" + error + "</span><br>";
              };
  
              // Capture uncaught errors
              window.onerror = function(message, source, lineno, colno, error) {
                logContainer.innerHTML += "<span style='color:red'><b>Error:</b> " + message + " (Line: " + lineno + ")</span><br>";
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
        htmlCode,
        "\n<style>\n",
        cssCode,
        "\n</style>\n<script>\n",
        jsCode,
        "\n</script>",
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

function closeOverlay() {
  document.getElementById("dev-overlay").classList.add("hidden");
}
