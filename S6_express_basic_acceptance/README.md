### Express 基礎驗收

```
在網頁上方有導覽列，當使用者點擊導覽列上的按鈕時，可以前往不同的頁面。每個頁面僅需放一行標題文字，讓人看得出畫面有改變。
```

#### 功能列表

- 點擊導覽列上的按鈕時，可以前往不同的頁面，並可呈現出一行標題文字。

#### 專案畫面

![image](https://github.com/Ingrid-chi/AC_practice/blob/main/S6_express_basic_acceptance/public/images/S6_express_basic_acceptance.jpg)

#### 安裝

將此專案 Clone 到本機，步驟如下：

1. 由終端機 ( Terminal ) 進入此專案資料夾

```
cd S6_express_basic_acceptance
```

2. 透過 npm 來安裝 Express

- 建立 package.json 檔

```
npm init -y
```

- 安裝所需套件

```
npm i express@4.16.4
```

3. 啟動 Express 伺服器

```
nodemon app.js
```

4. 安裝 express-handlebars

```
npm I express-handlebars@3.0.0
```

5. 設定在 Express 中使用的 express-handlebars

#### 開發工具

1. Express @4.16.4
2. express-handlebars@3.0.0
