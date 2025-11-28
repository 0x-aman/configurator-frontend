export let parentOrigin: string | null = null;

// Listen for parent → iframe handshake
window.addEventListener("message", (event) => {
  if (event.data?.type === "KONFIGRA_PARENT_ORIGIN") {
    parentOrigin = event.data.origin;
  }
});

// Helper
export function getParentOrigin() {
  // If in dev, always return local dev site
  if (import.meta.env.DEV) {
    return "http://localhost:8080";
  }

  // Otherwise return the actual parent origin detected
  return parentOrigin;
}
