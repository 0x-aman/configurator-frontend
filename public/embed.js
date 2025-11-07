(function () {
  const script = document.currentScript;
  const publicId = script.getAttribute("data-public-id");
  const publicKey = script.getAttribute("data-public-key");
  const container = document.createElement("div");
  container.id = "keen-iframe-container";

  const iframe = document.createElement("iframe");
  iframe.src = `https://product-configurator-frontend.netlify.app/?publicId=${encodeURIComponent(
    publicId
  )}?publicKey=${encodeURIComponent(publicKey)}`;
  iframe.style.width = "100%";
  iframe.style.height = "600px";
  iframe.style.border = "none";

  container.appendChild(iframe);
  script.parentNode.insertBefore(container, script.nextSibling);
})();
