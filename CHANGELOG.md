# 更新紀錄 (Changelog)

> 每次 `git commit + push` 都在這份檔案**最上方**新增一個區塊，最新的在上、舊的往下推。
> 區塊標題格式：`## YYYY-MM-DD — <short-hash> — 主題`（一句話帶過主題）。
> 區塊內按下方圖示分類列點，每點 1 句講「做了什麼/為什麼」。
> 詳細實作細節請看對應的 commit message（`git show <hash>`）。

## 分類圖示

| 圖示 | 類別 | 範例 |
|---|---|---|
| ✨ | 新功能 | 新模式、新機制、新關卡 |
| 🎨 | 視覺/資產 | 新 sprite、CSS 改版、動畫、配色 |
| 🔊 | 音效/語音 | 新音效、語音語序、發音 |
| 🛠 | 改進 | 效能、體驗、平衡性、文字 |
| 🐛 | 修正 | bug、視覺/邏輯錯誤 |
| 🔁 | 重構 | 內部結構變動但行為不變 |
| 📦 | 工具/結構 | repo 設定、腳本、規則文件、CI |

## 撰寫流程（給 Claude 看的）

依 `CLAUDE.md` 的 Standard Loop 第 4 步，**提交前**先 prepend 一個區塊：

```bash
# 1. 在 CHANGELOG.md 最上方插入新區塊（hash 在 commit 後填入或留 placeholder）
# 2. git add CHANGELOG.md <其他檔案>
# 3. git commit
# 4. 用 git log -1 --format=%h 取得 hash，若 placeholder 不準確就改正再 commit --amend? 不要 —— 直接補在下一次 commit
```

實務上：寫個 placeholder 短碼（例如 `pending`），commit 後拿到真正 hash 再下次更新時補正。或者乾脆只用日期 + 主題，hash 從 git log 對照。

---

## 2026-05-27 — pending — 全面換成真實錄音音效

- 🔊 21 個真實 SFX 取代 Web Audio 合成：1 顆 balloon pop（OpenGameArt CC0）+ 10 個動物叫聲 + 10 個交通工具音效（Pixabay royalty-free）
- 🔊 新 `SFX_CONFIG` + `sfxBank` + `playSfx(key)` 機制：每 clip 自帶 `max` 秒數，超時自動 fade-out（120ms 6 步），所以 23 秒的羊叫也能變成 1.6 秒乾淨的「咩」
- 🔊 `playBalloonPop` / `playAnimalSound` / `playVehicleSound` 從原本 100+ 行 Web Audio 合成縮為 1 行 `playSfx()` 呼叫
- 🔊 `gameData.vehicle.items[].sound` 改為每 emoji 唯一鍵（`bus`/`rocket`/`police`/`firetruck`/`ambulance` 不再共用 `car`/`plane`/`siren`），讓警車 / 消防車 / 救護車能各播自己的警笛
- 📦 `initAudio()` 多呼叫 `preloadSfxBank()`，第一次點擊前所有 mp3 / ogg 都用 `Audio` 物件預載
- 📦 新增 `assets/audio/sfx/`：21 個檔案 + `CREDITS.md`（含每個音檔的來源 URL、創作者、授權）
- 📦 `service-worker.js` v41 → v42，把 21 個 SFX 加進 `APP_ASSETS` 離線快取

## 2026-05-26 — 0fa4c1a — 修復手機動物 / 字母模式靜音

- 🐛 iOS Safari 在 PWA 切回前台時會把 `AudioContext` 留在 `suspended` 狀態、`speechSynthesis` 留在 `paused`，導致 `playAnimalSound` / `playLetterChime` / `speakEnglishWord` / `speakLetterAndWord` 全部 no-op
- 🔊 新增 `ensureAudioReady()` 工具：呼叫 `audioCtx.resume()` + `speechSynthesis.resume()`（包 try/catch 避免拋例外）
- 🔊 在 `handleInteract`、`sliceFruit` 入口都呼叫一次，確保每次點/切前 audio 都是可播狀態
- 🔊 加 `visibilitychange` / `pageshow` / `focus` 三個全域監聽，PWA 從背景切回時自動喚醒
- 📦 service-worker `v40 → v41`，強制 PWA 抓新版

## 2026-05-25 — 6d51b56 — PWA safe-area 根治：移到 body 級

- 🐛 之前在個別元素（HUD、overlay、toast）加 `env(safe-area-inset-*)` 還是會有東西貼到瀏海/Home Indicator（特別是 items、scenery、未列出的子元素）。
- 🐛 改成在 **`<body>`** 直接加四向 `env(safe-area-inset-*)` padding + `box-sizing: border-box`，讓 `#game-container` 縮成 `width:100%/height:100%`（= body 內容區 = safe zone）。所有子元素（HUD、items、塔樓、結算頁、按鈕等）自然全部活在 safe area 之內。
- 🎨 body 與 game-container 套同一段 sky→grass 漸層，所以 safe-area 邊緣與遊戲區無縫接合，瀏海下面仍是漸層而不是黑邊。
- 🔁 把上一輪在 HUD / overlay / guide-modal / toast 加的 `env(...)` 還原成原本的 px，避免雙重 padding 把內容壓得太小。
- 📦 `service-worker.js` v38 → **v39**，再次強制 PWA 抓新版（v38 還是會被某些裝置的舊 install 卡住）。

## 2026-05-25 — 1660fc8 — PWA safe-area 補強 + 強制更新快取

- 🐛 浮動 toast（連擊 / 鼓勵 / 任務）的 `top` 加上 `env(safe-area-inset-top)`，避免在 iPhone 瀏海/Dynamic Island 下被遮住
- 📦 `service-worker.js` 從 `v37` bump 到 `v38`，強制已安裝的 PWA 拋棄舊快取、抓新版 `index.html`（先前的 safe-area 修正一直被 v37 快取卡住沒生效）

## 2026-05-25 — 23cb423 — 建立更新紀錄機制

- 📦 新增 `CHANGELOG.md`：規範分類圖示、區塊格式、撰寫流程
- 📦 `CLAUDE.md` Standard Loop 第 4 步補上「更新 CHANGELOG.md」的義務
- 📦 backfill 本次 session（5/22 → 5/25）的重要區塊作為示範

## 2026-05-25 — e8ced77 — 水果忍者模式

- ✨ 水果不再從上掉落，改為**從畫面下方拋出弧線**，5 條 lane 機率 10/18/40/22/10%
- ✨ 點擊無效，必須**手指滑過**才能切水果（pointermove + 20px 距離門檻 + sparkle 尾跡）
- 🎨 ChatGPT 批次生成 30 個水果 sprite（10 整顆 + 20 切半），含蘋果星形果核、西瓜籽、桃子核等
- 🎨 切水果後左/右半 sprite 飛開 + 旋轉 + 淡出（CSS 700ms keyframe）
- 📦 `scripts/split_fruit_composite.py` 自動切割合成圖、`scripts/remove_bg.py` 統一去背流程
- 📦 service worker bump → `v37`，30 張新 PNG 加入離線 cache

## 2026-05-25 — 28a0e07 — 氣球往上飄 + 音序調整

- ✨ 氣球從畫面下方升起，水平隨機 ±30px 漂移，飛出頂部即漏接
- 🔊 點擊氣球：**先 pop 音效，250ms 後**才念顏色英文（避免重疊聽不清）

## 2026-05-25 — d48ef5f — 腳踏車重畫

- 🎨 ChatGPT 重畫腳踏車：紅框、白籐籃、銀鈴、白胎灰圈，朝向右
- 🐛 `faces: left → right` 配合右朝向 sprite，與其他 5 台新車慣例一致

## 2026-05-25 — 8579db7 — iPhone PWA safe-area

- 🐛 `#menu-screen` / `#summary-screen` / `#pause-overlay` / `#hud` / `#guide-modal` 加上 `env(safe-area-inset-*)` padding
- 🐛 修正 PWA 模式下瀏海蓋住 HUD、Home Indicator 截斷結算按鈕
- 🛠 裝飾性背景（塔樓/果樹/草地）刻意保持貼邊讓漸層鋪滿瀏海

## 2026-05-25 — 750412c — 5 台新車 faces 標註修正

- 🐛 `airplane / helicopter / police / firetruck / ambulance` 的 PNG 都朝右繪製，但 gameData 設成 `left`，導致翻轉方向錯亂
- 🐛 全部改成 `faces: 'right'`，視覺方向與行駛方向一致

## 2026-05-25 — 5ca3547 — 飛機與救護車重畫

- 🐛 飛機原本兩片尾翼（prompt 寫了 "twin tail fin"）→ 改成單尾翼
- 🐛 救護車原本兩對眼睛（保險桿臉 + 頭燈內眼）→ 改成只在擋風玻璃一張臉

## 2026-05-24 — 60adfcc — 新 sprite 自動去背

- 🐛 ChatGPT 預設輸出 RGB（colorType=2）無 alpha → 14 張動物/車輛實際上有近白色底
- 📦 `scripts/remove_bg.py`：corner-seeded flood fill + 抗鋸齒軟邊帶，重新存成 RGBA

## 2026-05-24 — 069758f — 動物與新車 3D 化

- 🎨 ChatGPT 重繪 10 隻動物：從「只有頭」改成全身 3D 玩具 figurine（補新增 cow/sheep/monkey/frog/duck/pig）
- 🎨 飛機/直升機重畫 + 新增警車/消防車/救護車（5 台），都用 3D 玩具風格
- 📦 `spriteAssets` 加入 9 個 emoji → PNG 映射、service worker → `v36`

## 2026-05-24 — 6e5c3a6 — 設立 CLAUDE.md 工作規則

- 📦 新增 `CLAUDE.md`：黃金規則「做完即推送」、commit message 格式、衝突解決準則、既定設計決策（10 條）
- 📦 Claude Code 每次新 session 會自動讀取

## 2026-05-23 — 0748752 — 物件出現機率均勻化

- 🛠 `pickSpawnChoice` 拿掉任務目標的加權（原本挑戰 38% / 冒險 55%），改為**每個物件平均 1/N**
- 🛠 任務系統不受影響（`chooseMission` 本來就均勻取樣）

## 2026-05-23 — f3ccf4e — 1.25 倍曲線 + 逼真氣球

- 🛠 每分鐘倍率從 ×2 降到 **×1.25**，8 分鐘曲線後期才接近 floor
- 🎨 10 種氣球統一用 CSS 渲染（蛋形 body + 反光 + 繫繩結 + 細繩）
- 🎨 紅/藍/紫 PNG sprite 在遊戲中不再使用（任務 HUD 圖示仍用）

## 2026-05-22 — 7d94a71 — 8 分鐘挑戰 + 每分鐘倍增

- ✨ 所有難度/年齡的挑戰模式統一 **8 分鐘**（`GAME_DURATION = 480`）
- ✨ 每經過 1 分鐘 `state.level` +1，spawn 與 fall 速度都倍增
- ✨ 結算畫面新增「沒點到」欄位（5 欄）
- 🛠 冒險模式保留原本依分數線性升級的曲線

## 2026-05-22 — d9d7185 — 10 物件 roster + 撞車結束

- ✨ 氣球 3→10 色（黃、綠、橘、粉紅、咖啡、黑、白 CSS fallback）
- ✨ 水果 4→10 種（柳橙、西瓜、鳳梨、桃子、櫻桃、梨子）
- ✨ 動物 4→10 種（牛、羊、猴、蛙、鴨、豬 + 豬叫聲合成）
- ✨ 車輛 5→10 種（飛機、直升機、警車、消防車、救護車 + 直升機 chopping 音效）
- ✨ **撞車 = 遊戲結束**：rAF loop 偵測 vehicle item 兩兩重疊 → 💥 爆破動畫 + 紅屏抖動 + `finishGame('crash')`

## 2026-05-22 — 346b251 — 紫色氣球修正

- 🐛 `#FF9FF3` 英文從 `pink` 改回 `purple`，與中文「紫氣球」、PNG 檔名 `balloon-purple.png` 一致

## 2026-05-22 — fc01406 — 移除中文鼓勵語音

- 🔊 刪除 `speakEncouragement()`（原本朗讀「好棒！」「真厲害！」），只保留英文物件名朗讀

---

## 更早的歷史

更早的版本變動請參考：

- `README.md` 玩家視角的 V2.1 → V3.0 版本特性
- `progress.md` 開發者視角的 chronological 工作日誌
- `git log` 完整 commit 記錄
