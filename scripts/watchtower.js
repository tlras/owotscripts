/* yagton's "Watchtower" script (version 3)
 * This is a simple script listens on the active WebSocket for tileUpdate messages.
 * After it recieves such a message, it outputs the location of the update to the
 * console, or as a notification if the menu option is enabled. The primary purpose
 * of this script is so you can see where edits are happening on an OWOT world.
 * Please do not use this for malicious purposes.
 * 
 * NOTICES:
 *     1. This script has a known "off-by-one" bug. I have tried several times to fix it,
 *        but have not succeeded. If you find out how to fix it, *please* let me know.
 *     2. Enabling notifications can cause lag if there's a lot of updates happening
 *        in rapid succession.
 *     3. Since the new features in Watchtower v4 can be potentially exploited for
 *        nefarious purposes, I have decided to not release it publicly, but rather
 *        privately to a select few who I deem safe. The public version of Watchtower
 *        will be staying at version v3 indefinitely with the exception of bug fixes.
 * 
 * CONTRIBUTIONS:
 *     - Vince0110 (added notifications)
 *
 * This is free and unencumbered software released into the public domain.
 * For more information, please refer to <http://unlicense.org/> */
// "tileUpdate notifications" menu option
var notifsEnabled = false;

menu.addCheckboxOption("tileUpdate notifications",
  function () {notifsEnabled = true},
  function () {notifsEnabled = false},
  false
);

// Proxies the active WebSocket.
w.socket.onmessage = new Proxy(w.socket.onmessage, {
  apply: function(func, _, args) {
    var data = JSON.parse(args[0].data);
    if (data.kind == "tileUpdate") {
      for (const i in data.tiles) {
        // Some math to convert server-retrieved coords to actual coords.
        var nums = i.split(',').map(x => parseInt(x));
        var positionX = Math.floor(nums[1] / coordSizeX);
        var positionY = Math.floor(-nums[0] / coordSizeY);

        var output = `tileUpdate at ${positionX}, ${positionY}.`;
        console.log(output);
        if (notifsEnabled) {
          if (Notification.permission !== "granted") {
            Notification.requestPermission();
          }
          new Notification(output, {tag: 'tileUpdate'});
        }
      }
    }

    func(...args);
  }
});
