/* nav 相關功能 */
import * as SHARE_FUNCTIONS from "./ShareFunctions.js"
import OTHERS from "./others.json" with { type: "json" };

export default class Nav {
    constructor({ name, textareaElement = "", rect = {x: 0, y: 0} }) {
        this.name = name;
        this.textareaElement = textareaElement;
        this.rect = rect;

        // 對應的 function
        this.functionMapping = {
            pasteMain:     () => this.pasteMain(),
            pasteRelease:  () => this.pasteRelease(),
            pasteDemoUrl:  () => this.pasteDemoUrl(),
            pasteDemoRain: () => this.pasteDemoRain()
        };
    }
    
    // 目前點擊的按鈕對應的 textarea
    setTextareaElement(textareaElement) {
        this.textareaElement = textareaElement;
    }

    // 目前點擊的按鈕的位置 (生成 dropdown 用)
    setRect(boundingClientRect) {
        this.rect.x = boundingClientRect.left + window.scrollX;
        this.rect.y = boundingClientRect.top + boundingClientRect.height + window.scrollY;
    }


    // navs functions
    pasteMain() {
        this.pasteUpdateDate("main");
    }
        
    pasteRelease() {
        this.pasteUpdateDate("release");
    }
        
    pasteDemoUrl() {
        let text = `#### @demotest 測試網址：${OTHERS.demo}`;
        this.pasteToTextarea(text);
    }
        
    pasteDemoRain() {
        let text = `#### @demotest 測試網址：${OTHERS.rain}`;
        this.pasteToTextarea(text);
    }

    // functions
    pasteUpdateDate(type) {
        const today = new Date();
        let dayOfWeek = today.getDay(); // 返回值為 0（星期日）到 6（星期六）
        let date = '';
        if (type == "main") {
            switch (dayOfWeek) {
                case 5:
                case 6:
                    date = new Date(today.setDate(today.getDate() + (8 - dayOfWeek)));
                    break;
                default:
                    date = new Date(today.setDate(today.getDate() + 1));
                    break;
            }
        }
    
        if (type == "release") {
            switch (dayOfWeek) {
                case 0:
                case 1:
                    date = new Date(today.setDate(today.getDate() + (2 - dayOfWeek)));
                    break;
                default:
                    date = new Date(today.setDate(today.getDate() + (9 - dayOfWeek)));
                    break;
            }
        }
        
        let text = `### @itupdate 預計 ${SHARE_FUNCTIONS.dateFormat(date)} 更新`;
        this.pasteToTextarea(text);
    }
        
    pasteToTextarea(text) {
        this.textareaElement.focus();
        document.execCommand("insertText", false, `${text}\n`); // 使其可以 ctrl+z 復原
    }
}

