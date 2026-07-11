// Applied to every page via project.default.custom.globalPageSettings.
// customCodeHead/customCodeBody are injected verbatim into the exported
// HTML's <head> and just before </body> (unlike canvas.styles/scripts,
// which only affect the editor's iframe preview and are never exported).
export const globalPageSettings = {
  customCodeHead: `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css">
    <link rel="stylesheet" href="https://uptodatewebdesign.s3.eu-west-3.amazonaws.com/cdn/dist/staging/app.min.css">
  `,
  // app.min.css (the site's own theme) is built against Bootstrap 4's
  // grid/spacing conventions - matches the old project's canvas config
  // (pages/site-builder/editor/index.vue) exactly, including load order:
  // jQuery and Popper before Bootstrap 4's JS bundle, which depends on both.
  customCodeBody: `
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
  `,
};
