/* 業務邏輯 */
import * as SHARE_FUNCTIONS from "./ShareFunctions.js"            // 共用 function
import NAVS_ITEMS from "./navItems.json" with { type: "json" }; // 功能
import NAVS_CLASS from "./Nav.js"                                 // 功能對應函式
import OTHERS from "./others.json" with { type: "json" };       // 其他變數

const NAVBARS = document.getElementsByClassName("jstElements"); // 所有 textarea 上方的 navbar
const NAVS = {}; // nav class object

// 检查源代码中是否包含 "jquery" 字符串
const $ = window.$;

// =================================================================
(function() {
    console.log("redmine script is enabled");
    if ($) {
        /* 重新設置監聽，使貼上執行的 copyImageFromClipboard 改為覆寫版 */
        $("form div.box.filedroplistner").off("paste");
        $('form div.box.filedroplistner').on("paste", copyImageFromClipboard);
    } else {
        alert("找不到 jquery，貼上圖片更名功能將不啟用");
    }
    
    rendor();

    // 委派 body 監聽 textarea (因為 textarea 可能是點了編輯後才生成，監聽 focus 後再生成功能比較方便)
    document.body.addEventListener("focus", (event) => {
        if (event.target.classList.contains("wiki-edit")) {
            rendor();
        }
    }, true);

    document.body.addEventListener("click", (event) => {
        const dropdowns = document.querySelectorAll(".redmine_manifest_dropdown");
        if (event.target.classList.contains("redmine_manifest")) {
            // dropdown
            if (event.target.classList.contains("redmine_manifest_nav")) {
                const id = event.target.dataset.item_id;
                const dropdown = document.getElementById(`redmine_manifest_dropdown_${id}`);

                // 設置 nav class
                NAVS[id].setTextareaElement(event.target.closest(".jstBlock").querySelector(".jstEditor textarea"));
                NAVS[id].setRect(event.target.getBoundingClientRect());
                dropdown.style.top  = `${NAVS[id].rect.y}px`;
                dropdown.style.left = `${NAVS[id].rect.x}px`;

                // dropdown 顯示控制
                if (dropdown.style.display == "block") {
                    dropdown.style.display = "none";
                } else {
                    dropdown.style.display = "block";
                }
            }
        } else {
            // 點擊 dropdown 以外關閉
            dropdowns.forEach((dropdown) => dropdown.style.display = "none");
        }
    });

    // td dropdown
    document.body.addEventListener("mouseover", (event) => {
        if (event.target.closest(".redmine_manifest_dropdown li")) {
            event.target.classList.add("ui-state-active");
        }
    });
    document.body.addEventListener("mouseout", (event) => {
        if (event.target.closest(".redmine_manifest_dropdown li")) {
            event.target.classList.remove("ui-state-active");
        }
    });



    // jquery ajax 發送請求監聽 (目前 redmine 是用 jquery ajax 上傳圖片)
    // $(document).ajaxSend(function(event, xhr, options) {
    //     // .jpg|.png
    //     url_pattern = /\/uploads\.js\?attachment_id=\d+&filename=([^&]+)+&content_type=(image%2Fjpeg|image%2Fpng)/;

    //     let url = options.url; // ajax 網址
    //     if(url_pattern.test(url)) {
    //         // 更改 url 檔名
    //         let old_name = url_pattern.exec(url)[1]; // 原檔名
    //         let date = new Date();
    //         let filename = `${date.getFullYear()}
    //             ${('0'+(date.getMonth()+1)).slice(-2)}
    //             ${('0'+date.getDate()).slice(-2)}_
    //             ${('0'+date.getHours()).slice(-2)}
    //             ${('0'+date.getMinutes()).slice(-2)}
    //             ${('0'+date.getSeconds()).slice(-2)}_
    //             ${randomKey(5).toLocaleLowerCase()}.${old_name.split('.').pop()}`
    //             .replace(/\s+/g, '').split('\n').join('');
    //         options.url = url.replace(/filename=([^&]+)/, `filename=${filename}`);

    //         // 更改 post data 檔名
    //         let file = options.data;
    //         let blob = file.slice(0, file.size, old_name.split('.').pop()); 
    //         options.data = new File([blob], filename, {type: old_name.split('.').pop()});
    //         console.log(options);
    //     }
    //     //xhr.abort(); // 阻擋發送 ajax
    // });

})();

// 渲染到頁面上
function rendor()
{
    // 每個 textarea 都有一個 nav
    for (let i = 0; i < NAVBARS.length; i++) {
        // 每個 textarea 的 nav 只渲染一次 (每次點編輯對應的地方都會產生新的 editor)
        if (NAVBARS[i].redmine_manifest?.done) {
            continue;
        }

        NAVBARS[i].insertAdjacentHTML("beforeend", processFunctionHTML());
        NAVBARS[i].redmine_manifest = {};
        NAVBARS[i].redmine_manifest.done = true;
    }
}

// 將所有功能處理成 html
function processFunctionHTML()
{
    let html = '';
    for (let key in NAVS_ITEMS) {
        let item = NAVS_ITEMS[key];
        html += `
                <button type="button" tabindex="200" class="redmine_manifest redmine_manifest_nav"
                        title="${item.description}" data-item_id="${key}"
                        style="background-image: url('${item.icon}'); background-size: 12px 12px">
                    <span>${item.description}</span>
                </button>`;

        if (item.attribute === "dropdown") {
            rendorDropdown(key, item.items);
        }

        
        NAVS[key] = new NAVS_CLASS({ name: key });
    }
    return html;
}

/**
 * 渲染下拉選單
 * 
 * 建立一個 navbar 對應的 dropdown，其 id = narbar 的 key 名
 * 
 * @param {string} id   navbars 的 key 名 (id)
 * @param {object} item navbar
 */
function rendorDropdown(id, item)
{
    // 每個 nav 只建立一次對應的 dropdown
    if (!document.getElementById(`redmine_manifest_dropdown_${id}`)) {
        let html = '';
        for (let i of item) {
            // 遍歷 dropdown 元素
            html += `
                    <li class="ui-menu-item">
                        <div data-function="${i["function"]}" class="ui-menu-item-wrapper">${i["description"]}</div>
                    </li>`;
        }

        // 創建 dropdown
        const ul = document.createElement("ul");
        ul.id = `redmine_manifest_dropdown_${id}`;
        ul.classList.add("redmine_manifest", "redmine_manifest_dropdown", "ui-menu", "ui-widget", "ui-widget-content");
        ul.dataset.item_id = id;
        ul.innerHTML = html;
        ul.style.position = "absolute";

        // li 事件監聽
        const liElements = ul.querySelectorAll(`#redmine_manifest_dropdown_${id} li`);
        liElements.forEach((li) => {
            li.addEventListener("click", (event) => {
                let f = event.target.dataset.function;
                NAVS[id].functionMapping[f](); // 字串轉 function name 並執行
                ul.style.display = "none";
            });
        });

        document.body.appendChild(ul);
        ul.style.display = "none";
    }
}







// 重新定義 redmine 的 copyImageFromClipboard()
function copyImageFromClipboard(e) {
    if (!$(e.target).hasClass("wiki-edit")) { return; }
    let clipboardData = e.clipboardData || e.originalEvent.clipboardData
    if (!clipboardData) { return; }
    if (clipboardData.types.some((t) => { return /^text\/plain$/.test(t); })) { return; }
  
    let files = clipboardData.files
    for (let i = 0 ; i < files.length ; i++) {
        let file = files[i];
        if (file.type.indexOf("image") != -1) {
            let date = new Date();
            const filename = `${date.getFullYear()}
                ${('0'+(date.getMonth()+1)).slice(-2)}
                ${('0'+date.getDate()).slice(-2)}_
                ${('0'+date.getHours()).slice(-2)}
                ${('0'+date.getMinutes()).slice(-2)}
                ${('0'+date.getSeconds()).slice(-2)}_
                ${randomKey(5).toLocaleLowerCase()}.${file.name.split('.').pop()}`
                .replace(/\s+/g, '').split('\n').join('');
  
            const newFile = new File([file], filename, { type: file.type });
            let inputEl = $("input:file.filedrop").first()
            handleFileDropEvent.target = e.target;
            addFile(inputEl, newFile, true);
        }
    }
}