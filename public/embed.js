(function () {
  const script = document.currentScript;
  const apiKey = script.getAttribute("data-key");
  const container = document.createElement("div");
  container.id = "keen-iframe-container";

  const iframe = document.createElement("iframe");
  iframe.src = `https://keen-daffodil-bf4586.netlify.app/?apiKey=${encodeURIComponent(
    apiKey
  )}`;
  iframe.style.width = "100%";
  iframe.style.height = "600px";
  iframe.style.border = "none";

  container.appendChild(iframe);
  script.parentNode.insertBefore(container, script.nextSibling);
})();
