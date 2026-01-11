export function dispatchGlobalError(message: string) {
  window.dispatchEvent(
    new CustomEvent("global-error", {
      detail: { message }
    })
  );
}
