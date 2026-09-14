// Pre-baked Worker URL for personal builds. Leave empty string to force
// the user to enter their own Worker URL on first launch.
//
// Override at build time via:
//   sed -i 's|window.WEB2KB_WORKER_URL = ".*"|window.WEB2KB_WORKER_URL = "https://YOUR.workers.dev"|' \
//     apk/app/src/main/assets/web/config.js
window.WEB2KB_WORKER_URL = "";
