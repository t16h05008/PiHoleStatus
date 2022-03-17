let elementWidth = 320;
let elementHeight = 40;
let updateInterval = 10000 // millis


setInterval( function() {
    // get statistics from pihole
    fetch('http://pi.hole/admin/api.php?summaryRaw', {
        method: 'GET',
        mode: 'cors'})
    .then(response => response.json())
    .then(data => {
        // property names are a bit misleading, it's the total number, not today's number
        let totalQueries = format(data.dns_queries_today);
        let adsBlocked = format(data.ads_blocked_today);
        let blockedPercentage = Math.round(data.ads_percentage_today * 100 ) / 100; // 2 decimal places
        let adlistDomains = format(data.domains_being_blocked);
        // create the gui as a canvas
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext("2d");
        canvas.width = elementWidth;
        canvas.height = elementHeight;
        // background
        ctx.fillStyle = "#005C32";
        ctx.fillRect(0, 0, elementWidth * 0.25, elementHeight)
        ctx.fillStyle = "#007997";
        ctx.fillRect(elementWidth * 0.25, 0, elementWidth * 0.25, elementHeight)
        ctx.fillStyle = "#B1720C";
        ctx.fillRect(elementWidth * 0.5, 0, elementWidth * 0.25, elementHeight)
        ctx.fillStyle = "#913225";
        ctx.fillRect(elementWidth * 0.75, 0, elementWidth * 0.25, elementHeight)
        // text
        ctx.font = "bold 9px Helvetica";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Total Queries", elementWidth / 8, elementHeight * 0.25)
        ctx.fillText("Queries Blocked", elementWidth * 0.25 + elementWidth / 8, elementHeight * 0.25)
        ctx.fillText("Blocked %", elementWidth * 0.5 + elementWidth / 8, elementHeight * 0.25)
        ctx.fillText("Adlist Domains", elementWidth * 0.75 + elementWidth / 8, elementHeight * 0.25)
        ctx.font = "bold 14px Helvetica";
        ctx.fillText(totalQueries, elementWidth / 8, elementHeight * 0.75)
        ctx.fillText(adsBlocked, elementWidth * 0.25 + elementWidth / 8, elementHeight * 0.75)
        ctx.fillText(blockedPercentage + "%", elementWidth * 0.5 + elementWidth / 8, elementHeight * 0.75)
        ctx.fillText(adlistDomains, elementWidth * 0.75 + elementWidth / 8, elementHeight * 0.75)
        // set canvas content as the extension icon
        let imageData = ctx.getImageData(0, 0, elementWidth, elementHeight);
        browser.browserAction.setIcon({
            imageData: imageData
        });

    });
}, updateInterval)


function format(x) {
    return parseInt( x ).toLocaleString('en'); // . as separator
}