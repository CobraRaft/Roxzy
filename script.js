const normal_stock_time = document.getElementById('normalstocktime');
const mirage_stock_time = document.getElementById('miragestocktime');

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, true ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function getCurrent4hPeriod() {
    const currentTime = new Date();
    
    const hours = currentTime.getHours();
    const currentPeriodStart = new Date(currentTime);
    const periodDelta = hours % 4;
    
    currentPeriodStart.setHours(hours - periodDelta);
    currentPeriodStart.setMinutes(0, 0, 0);
    
    return Math.floor(currentPeriodStart.getTime() / 1000)-7200;
}

function getCurrent2hPeriod() {
    const currentTime = new Date();
    
    const hours = currentTime.getHours();
    const currentPeriodStart = new Date(currentTime);
    const periodDelta = hours % 2;
    
    currentPeriodStart.setHours(hours - periodDelta);
    currentPeriodStart.setMinutes(0, 0, 0);
    
    return Math.floor(currentPeriodStart.getTime() / 1000);
}

function convertTimestampToTime(timestamp) {
    const date = new Date(timestamp * 1000);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
    return hours + ':' + minutesStr + ' ' + ampm;
}

async function parseImages() {
    try {
        const normalRes = await fetch(
            "https://api.bloxzy.gg/stock/get?type=normal"
        );
        const mirageRes = await fetch(
            "https://api.bloxzy.gg/stock/get?type=mirage"
        );
        if (!normalRes.ok || !mirageRes.ok) {
            throw new Error("Failed to fetch image");
        }
        const normalImageBlob = await normalRes.blob();
        const mirageImageBlob = await mirageRes.blob();
        const normalImageUrl = URL.createObjectURL(normalImageBlob);
        const mirageImageUrl = URL.createObjectURL(mirageImageBlob);
        const normalImgElement = document.getElementById("normalimg");
        const mirageImgElement = document.getElementById("mirageimg");
        normalImgElement.src = normalImageUrl;
        mirageImgElement.src = mirageImageUrl;
    } catch (error) {
        console.error("Error fetching and displaying the image:", error);
    }
}

const normal_stock_timestamp = convertTimestampToTime(getCurrent4hPeriod());
const mirage_stock_timestamp = convertTimestampToTime(getCurrent2hPeriod());

normal_stock_time.innerHTML = normal_stock_timestamp;
mirage_stock_time.innerHTML = mirage_stock_timestamp;

window.addEventListener("load", function () {
    parseImages();
});
