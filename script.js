function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function handleFiles() {
    var files = document.getElementById("fileInput").files;
    var fileNames = [];
    for (var i = 0; i < files.length; i++) {
      if (files[i].name.toLowerCase().endsWith(".xml")) {
        fileNames.push(files[i].name);
      }
    }
    document.getElementById("selectedFiles").innerHTML = fileNames.join("<br />");
  }

async function mergeFiles() {
    var files = document.getElementById("fileInput").files;
    var mergedXml = document.createElement("script");
      mergedXml.setAttribute("app", "Snap! 8.2, https://snap.berkeley.edu");
      mergedXml.setAttribute("version", "2");
      var mergedBlocks = document.createElement("blocks");

      for (var i = 0; i < files.length; i++) {
        if (files[i].name.toLowerCase().endsWith(".xml")) {
          var reader = new FileReader();
          reader.onload = function (e) {
            var xmlContent = e.target.result;
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(xmlContent, "text/xml");

            var blockDefinitions = xmlDoc.getElementsByTagName("block-definition");
            for (var j = 0; j < blockDefinitions.length; j++) {
              mergedBlocks.appendChild(blockDefinitions[j].cloneNode(true));
            }
          };
          reader.readAsText(files[i]);
          await sleep(100); // Delay for file reading to complete
        }
      }

      mergedXml.appendChild(mergedBlocks);

      var mergedFile = new Blob([mergedXml.outerHTML], { type: "text/xml" });
      var downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(mergedFile);
      downloadLink.download = "merged.xml";
      downloadLink.click();
  }