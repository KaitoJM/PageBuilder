// Applied to every page via project.default.custom.globalPageSettings.
// customCodeHead/customCodeBody are injected verbatim into the exported
// HTML's <head> and just before </body> (unlike canvas.styles/scripts,
// which only affect the editor's iframe preview and are never exported).
export const globalPageSettings = {
  customCodeHead: `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
  `,
  customCodeBody: `
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  `,
};
