export function detectOS() {
    const userAgent = navigator.userAgent;
    if (/Android/i.test(userAgent)) {
        return "Android";
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
        return "iOS";
    } else {
        return "Unknown";
    }
}