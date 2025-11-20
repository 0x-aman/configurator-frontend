(function () {
  try {
    const scriptEl = document.currentScript;

    const publicId = scriptEl.getAttribute("data-public-id");
    const publicKey = scriptEl.getAttribute("data-public-key");

    if (!publicId || !publicKey) {
      console.error("[Konfigra Embed] Missing required attributes.");
      return;
    }

    // Create container
    const container = document.createElement("div");
    container.id = "konfigra-embed-container";

    // Create iframe
    const iframe = document.createElement("iframe");
    iframe.src = `https://embed-konfigra.vercel.app/?publicId=${encodeURIComponent(
      publicId
    )}&publicKey=${encodeURIComponent(publicKey)}`;

    iframe.style.width = "100%";
    iframe.style.height = "100vh";
    iframe.style.border = "0";
    iframe.style.display = "block";

    container.appendChild(iframe);

    scriptEl.parentNode.insertBefore(container, scriptEl.nextSibling);

    // ------ NEW: SEND PARENT ORIGIN TO IFRAME ------
    iframe.onload = () => {
      try {
        iframe.contentWindow.postMessage(
          {
            type: "KONFIGRA_PARENT_ORIGIN",
            origin: window.location.origin,
          },
          "*"
        );
      } catch (err) {
        console.error("[Konfigra Embed] Failed to send parent origin:", err);
      }
    };
  } catch (err) {
    console.error("[Konfigra Embed] Initialization error:", err);
  }
})();
