### 前言
- 針對公司用的 redmine 做額外功能及優化的 redmine 插件，主要是進行注入

### 安裝
- chrome: 點擊右上角拼圖 icon 下方點擊"管理擴充功能"，左方點擊"載入未封裝項目"，選擇整個資料夾後即可
- edge: 點擊右上角拼圖 icon下方點擊"管理擴充功能"，左方開啟"開發人員模式"，右方點選"載入解壓縮"，選擇整個資料夾後即可

### 功能
1. 插入特定文字
    - 更新日期
    - 測試站網址
2. 貼上圖片會更改檔名為 `{日期}_{時間}_{亂碼}` 避免重複貼上時檔名重複而被蓋掉

### bug
1. 中文檔案上傳後自動嵌入時名稱會亂碼 (仍可作用)
2. 對之前的回覆點擊編輯按鈕後不會馬上出現 paste 按鈕，須點擊 textarea 之後才會出現

### 其他
1. other.json 若無該檔案需自己另外建立，主要是存放額外的變數

###### update at 2024.05.07
###### 2024.06.05 加入"建立新議題"的網址到 manifest.json
