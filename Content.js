/* 注入用 */
function injectScript (src, type)
{
    const script = document.createElement("script");
    script.type = (type === "module") ? type : "text/javascript";
    script.src = chrome.runtime.getURL(src);
    //script.onload = () => script.remove();
    (document.head || document.documentElement).append(script);
}

injectScript("Injection.js", "module");