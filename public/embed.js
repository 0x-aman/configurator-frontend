(function () {
  try {
    const scriptEl = document.currentScript;

    // Extract required credentials
    const publicId = scriptEl.getAttribute("data-public-id");
    const publicKey = scriptEl.getAttribute("data-public-key");

    if (!publicId || !publicKey) {
      console.error(
        "[Konfigra Embed] Missing required attributes: data-public-id and/or data-public-key."
      );
      return;
    }

    // Create container
    const container = document.createElement("div");
    container.id = "konfigra-embed-container";

    // Create iframe
    const iframe = document.createElement("iframe");
    iframe.src =
      `https://embed-konfigra.vercel.app/?publicId=${encodeURIComponent(
        publicId
      )}` + `&&publicKey=${encodeURIComponent(publicKey)}`;

    // Responsive sizing — full width, auto height as needed
    iframe.style.width = "100%";
    iframe.style.height = "100vh"; // Full screen height (enterprise loves big things)
    iframe.style.border = "0";
    iframe.style.display = "block";

    // Append iframe
    container.appendChild(iframe);

    // Insert after script tag
    scriptEl.parentNode.insertBefore(container, scriptEl.nextSibling);
  } catch (err) {
    console.error("[Konfigra Embed] Initialization error:", err);
  }
})();
