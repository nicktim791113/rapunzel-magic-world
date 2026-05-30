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

## 2026-05-31 — pending — 天燈改 3D sprite + 新增工程車模式（10 機具）

- 🎨 **天燈重畫**：醜的 CSS 天燈換成 ChatGPT 畫的 6 色 3D 天燈 sprite（紅/橘/金/粉/綠/藍，真正的孔明燈造型+可愛臉+火焰，去背 PNG）；lantern 模式從 `type:color`(CSS) 改為 `type:emoji`(sprite)
- ✨ **新增工程車模式 🚜**：選單第 6 顆，10 種機具 sprite — 挖土機/推土機/砂石車/吊車/水泥車/堆高機/壓路機/裝載機/拖拉機/拖吊車（3D 玩具、朝右、去背）
- 🔊 工程車**真實音效**：10 個 Pixabay 機具錄音，ffmpeg 裁成 2.6 秒（共 ~320KB）；點擊播放機具聲 + **英文發音**（excavator / bulldozer …）
- 🛠 工程車沿用 vehicle 的地面行駛 + 翻轉 + 小鎮背景；不啟用撞車（純收集）
- 🔬 瀏覽器實測：工程車 10 sprite + 10 音效 buffer 載入、點擊計分/發音正常；天燈確認改用 sprite、選單 7 鈕排版正常
- 📦 service-worker v51 → v52，6 天燈 sprite + 10 工程車 sprite + 10 工程音效加入快取

## 2026-05-31 — b779e7d — 新增天燈模式（搖擺上升 + 點擊加速）

- ✨ 新模式 **天燈**（由氣球模式衍生）：選單第 2 顆按鈕 🏮
- ✨ 天燈從畫面下方升起，但**左右搖擺呈 S 形緩緩上飄**（多關鍵格 sway，比氣球慢 1.2 倍、ease-in-out），不像氣球那麼垂直
- ✨ **點擊天燈 → 加速往上衝 + 淡出 + whoosh 音效**（`playLanternWhoosh`：氣流噪音掃頻 + 柔和上升鈴聲），並計分
- 🎨 CSS 暖色發光紙天燈（`.sky-lantern-body` 內發光 + 暖色光暈 + 閃爍火焰），10 種暖色
- 🎨 專屬夜景背景：ChatGPT 畫的「天燈節夜空」（深藍紫星空+滿天天燈+湖面倒影+魔法塔），直式 + 橫式各一張
- 🔬 實測 6 模式全部正確：各自渲染對的物件 + 對的背景；天燈點擊分數 0→1、套用加速動畫、whoosh 有觸發；選單 6 鈕排版正常
- 📦 service-worker v50 → v51，2 張天燈背景加入快取

## 2026-05-31 — 9f9bde7 — 背景加橫式版，桌面不再被裁

- 🐛 上一版只有直式背景（1024×1536），桌面 landscape 用 `cover` 會把上下裁掉只剩中央一條
- 🎨 每個模式再畫一張**橫式 1536×1024** 版本（5 張），構圖橫向鋪開、場景在左右兩側與底部、中央留白
- 🎨 `@media (orientation: landscape)` 切換：手機直式用直圖、桌面/平板橫式用寬圖
- 🔬 桌面實測車車模式：寬版小鎮+天空+魔法塔完整鋪滿、無裁切、交通工具清楚
- 🛠 5 張橫式同樣壓成 progressive JPEG（q82），共 ~1 MB
- 📦 service-worker v49 → v50，5 張橫式加入離線快取

## 2026-05-31 — a184aef — 五個模式換上童話魔法繪本背景

- 🎨 用 ChatGPT 畫了 5 張全螢幕直式繪本背景（原創童話魔法場景，無人物、無迪士尼元素），取代原本粗糙的 CSS 漸層：
  - 氣球＝晨曦天空＋天燈、水果＝金色魔法果園、動物園＝森林精靈空地、車車＝童話小鎮道路＋天空、ABC＝星空魔法書房
  - 每張都含魔法塔＋漂浮天燈的統一視覺語言，中央留白確保遊戲物件清楚
- 🎨 `#game-container.theme-<mode>` 用 `background: url(...) center/cover` 套用（id 限定壓過容器底色）
- 🎨 遊戲中（有 theme class 時）隱藏舊的 CSS 場景（塔、天燈、太陽、雲、柵欄、scene-prop、`::before/::after`）；首頁選單無 theme class 仍保留原本 CSS 場景
- 🛠 圖片轉成最佳化 progressive JPEG（q82），5 張共 ~1 MB（原始 PNG 共 11.6 MB）
- 🔬 本機實測：水果模式背景正確鋪滿、果樹/天燈/魔法塔到位、水果 sprite 在中央清楚可辨
- 📦 新增 `assets/images/backgrounds/`（5 jpg + CREDITS.md）；service-worker v48 → v49，背景加入離線快取

## 2026-05-30 — 3556f03 — 真正的根因：預解鎖 race 把音樂停掉

- 🐛 **真正的 root cause**：c8ce864 加的「首次手勢 muted 預解鎖」用 `play().then(() => pause())` 延遲暫停。capture-phase 的 firstGestureInit 先跑、排入 microtask；接著按鈕 handler 的 `startBackgroundMusic()` 開始播音樂；然後那個延遲的 `.then(pause)` 才觸發 → **把剛開始的音樂立刻暫停** → 全模式背景音樂無聲（PC + 手機）
- 🔁 預解鎖改成 **同步 play→pause**（在 firstGestureInit 內就跑完，早於同一次點擊的按鈕 handler），解鎖但不再 clobber 真正的播放
- 🔬 同時查明：這個自動化瀏覽器環境連 data: URI 靜音 WAV 都無法載入（media 被抑制），所以音訊只能靠程式邏輯推理 + 真機驗證，無法在工具內聽到
- 📦 service-worker v47 → v48（沿用 v47 的「SW 不攔截 range」改動，那本身是正確做法）

## 2026-05-30 — 1a32923 — SW 不再攔截 range 請求（仍保留）

- 🐛 **根因（實測找到）**：service worker 的 `handleRangeRequest` 用 `respondWith` 回傳合成的 206 給 `<audio>` 的 range 請求。`fetch()` 能正常讀取，但 Chrome/Safari 的媒體 byte-range 狀態機無法消化 SW 合成的 Response → 元素卡在 `readyState 0`（`loadstart → stalled`）→ **所有背景音樂無聲**（PC、手機皆然）
- 🔬 用 Chrome 實際載入 GitHub Pages 驗證：`fetch` 拿得到 206/完整檔，但遊戲的 `<audio>` 與全新 `new Audio()` 都 stall → 確認是 SW 攔截 media range 的鍋
- 🔁 SW fetch handler 對帶 `Range` 標頭的請求直接 `return`（不 `respondWith`），交給瀏覽器原生處理；移除整個 `handleRangeRequest`
- 🛠 SFX（用 `fetch`+decodeAudioData、無 range 標頭）仍走 cache-first，離線快取不受影響；只有串流的背景音樂改走原生網路
- 📦 service-worker v46 → v47

## 2026-05-30 — c8ce864 — 修復背景音樂全失聲

- 🐛 上一版用「重設 `bgMusic.src`」切換 ABC 音樂，但 iOS/Safari 一旦重設 `<audio>` 的 src 就會弄丟 user-gesture unlock → 切過一次後**所有背景音樂（含原本的）都不再播放**
- 🔁 改成 **雙 `<audio>` 元素**：`bgMusic`（一般模式）+ `abcMusic`（ABC 模式），各自保留 baked-in src 與 unlock，只 play/pause 不重設 src
- 🔁 `gameplayMusicEl()` 依模式回傳正確元素；`startBackgroundMusic` 播放該元素並暫停另一個；`stopBackgroundMusic` / `updateMusicVolumes` 同時涵蓋兩者
- 🛠 首次手勢時對 `bgMusic` + `abcMusic` 做 muted play→pause **預解鎖**，確保冒險模式在 setTimeout（非手勢）切到 ABC 音樂也能播
- 📦 service-worker v45 → v46

## 2026-05-30 — 2e1b38d — ABC 模式：3D 搖動字母 + 專屬童謠

- 🎨 字母從蒼白小卡改成 **彩虹 3D 擠出字**：每個字母依 A–Z 取不同色相（face 亮色 + edge 暗色 5 層 text-shadow 擠出立體感），加白色描邊
- 🎨 字母會 **搖動**（`letterWobble` 旋轉 ±8° + 縮放呼吸），每字母 stagger 不同步，避免整片同步搖
- 🎨 字母放大（fontSize 0.52→0.62em）、點擊框配合放大；word 標籤改成白底圓角藥丸
- 🔊 ABC 模式專屬背景音樂：Pixabay CC-free「ABC Song (Music Box)」音樂盒版，純樂器避免跟英文發音打架
- 🔊 `applyBgMusicForMode()`：alphabet 模式自動切 `abc-song.mp3`，其他模式用原本的 `where-the-sunbeams-hide.mp3`；只在曲目改變時才換 src（不重啟循環）；冒險模式跨關也會切換
- 📦 新增 `assets/audio/abc-song.mp3` + `assets/audio/CREDITS.md`（背景音樂授權）
- 📦 service-worker v44 → v45

## 2026-05-27 — 5227f3d — SFX 播放管線改 Web Audio AudioBuffer

- 🐛 iOS Safari PWA 對 `new Audio() + .play()` 有保留性的 autoplay 限制（即便在 user gesture 內），導致氣球 pop、動物叫聲、車輛音效在手機上常常沉默
- 🔁 改用 Web Audio API：`fetch` → `decodeAudioData` → `AudioBuffer`，存進 `sfxBuffers[key]`
- 🔁 `playSfx` 改為 `audioCtx.createBufferSource()` + 連接到既有 masterGain（與合成 SFX 走同一條管線）→ 解決 iOS PWA 不發聲問題，並且 mute / sfxVolume 滑桿自動生效（不再雙重套用音量）
- 🔁 淡出改成 `gain.linearRampToValueAtTime`（Web Audio 內建），取代原本 6 步 setTimeout 步進
- 🛠 預載改成在 `initAudio()` 觸發後才開始 fetch+decode（音訊上下文活著時 decode 才合法）
- 📦 service-worker v43 → v44

## 2026-05-27 — db22966 — 拆分音效 / 發音音量 + 暫停畫面可即時調整

- ✨ 原本「音效 / 英文發音」共用一個 SFX 滑桿，拆成兩個獨立軸：
  - 🔊 **物件音效**：動物叫聲、車輛、爆破等 sfxBank 音效
  - 🔤 **英文發音**：所有 `speakEnglishWord` / `speakLetterAndWord` 出來的 voice
- ✨ 新增 `state.voiceVolume`（default 0.85），`speechEffectiveVolume()` 改讀 voiceVolume
- ✨ profile 自動向下相容：舊存檔沒有 voiceVolume 時，沿用 sfxVolume 當初始值
- ✨ **暫停畫面新增同款 3 列音量面板**，遊戲中不用退回首頁就能即時微調
- 🛠 首頁與暫停的滑桿互相同步（`syncVolumeUI()` 一次寫進 6 個 input + 6 個顯示數字）
- 🛠 「試聽」按鈕分成兩顆：物件音效試聽會連播氣球 pop + 狗叫 + 警笛；發音試聽會說「A — Apple」
- 📦 audio-panel CSS 從 2 欄改成 `auto-fit minmax(220px, 1fr)`，3 列在窄螢幕上會自動 stack
- 📦 service-worker v42 → v43

## 2026-05-27 — d9ef1ee — 全面換成真實錄音音效

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
