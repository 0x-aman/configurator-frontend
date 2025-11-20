export let parentOrigin: string | null = null;

// Listen for parent → iframe handshake
window.addEventListener("message", (event) => {
  if (event.data?.type === "KONFIGRA_PARENT_ORIGIN") {
    parentOrigin = event.data.origin;
  }
});
