# 開發設計工作規則

此檔案為 Claude Code 在開始任何工作前必讀的專案規範。
GitHub repo：<https://github.com/nicktim791113/rapunzel-magic-world>

---

## 🚀 黃金規則：做完即推送，不等待確認

**完成任何修改後，立刻 `git add → git commit → git push`，不要停下來等使用者確認。**

- 不要問「要不要推送？」
- 不要等下一個指令才推
- 完成後立刻一次跑完三件事，並回報 commit hash 給使用者

例外狀況才需要先停下來確認：
1. 修改是大規模重構（>500 行單檔）或改變專案架構
2. 觸碰機密 / 環境變數 / `assets/audio` 等可能有版權的資產
3. 偵測到 working tree 有非當前任務的修改

---

## 📋 工作流程（Standard Loop）

每個工作回合都依下面順序執行：

1. **同步遠端**
   ```bash
   git status
   git fetch origin
   git log HEAD..origin/main --oneline    # 看遠端有沒有新 commit
   ```
   若落後 → `git pull --ff-only origin main`，再開始改動。
   若有衝突 → 優先採用 upstream 的方向（這個 repo 有多個自動化 PR 來源），但保留使用者明確要求的差異。

2. **動手寫程式**
   - 偏好用 `Edit` 做最小化的差異變更
   - 避免無關的格式化、重新排序、空白調整
   - 一個語意單位 = 一個 commit

3. **JS 語法檢查（建議）**
   ```bash
   awk '/<script>/{flag=1;next} /<\/script>/{flag=0} flag' index.html > /tmp/check.js && node --check /tmp/check.js && echo OK
   ```
   index.html 內嵌長 JS，這個小指令可在 commit 前抓到語法錯誤。

4. **提交 + 推送（一氣呵成）**
   ```bash
   git add <specific-files>          # 不要 git add -A，避免納入 .claude/ 等暫存
   git commit -m "$(cat <<'EOF'
   Imperative subject line under 70 chars

   Body explains what & why (not how) in 2-5 短段落，
   中英文混用沒關係，動詞主導。

   Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
   EOF
   )"
   git push origin main
   ```
   回報訊息要附上短 commit hash 與一句話總結，例如：
   > 推送完成 → `0748752` Uniform spawn probability across all items

---

## ✍️ Commit Message 規範

- **Subject**（70 字以內、祈使句、英文為主）：說明做了什麼。
  - ✅ `Soften per-minute ramp to 1.25x + realistic CSS balloons`
  - ❌ `修改 index.html`、`update`、`fix bug`
- **Body**：解釋「為什麼」與牽涉到的設計權衡。可使用中文。
- 結尾固定加 `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`
- **不要** 用 `--amend`（即使 hook 失敗也建立新 commit）
- **不要** 用 `--no-verify` 跳過 hook
- **不要** 用 `git push --force` 到 main

---

## 🧱 專案結構（速查）

| 路徑 | 說明 |
|---|---|
| `index.html` | 單一檔案應用，HTML + CSS + JS 全在這裡 |
| `service-worker.js` | PWA 離線快取；改動資產時記得 bump 版本字串 |
| `manifest.json` | PWA 安裝資訊 |
| `assets/images/items/` | 掉落物 PNG（balloon-*, fruit-*, animal-*, vehicle-*） |
| `assets/audio/` | 背景音樂；視為唯讀，避免覆寫 |
| `assets/icons/` | App 圖示 |
| `README.md` | 玩家視角的版本變更紀錄 |
| `progress.md` | 開發者視角的 chronological 工作日誌 |
| `CLAUDE.md` | 本檔案 — 開發規則 |

### `index.html` 內部分區位置（行號會浮動，用搜尋字串）

| 內容 | 搜尋關鍵字 |
|---|---|
| 常數 (`GAME_DURATION`, `MIN_SPAWN_MS` …) | `const GAME_DURATION` |
| 難度 / 年齡資料 | `const difficultyData`、`const ageData` |
| 顏色名稱對照 | `colorLabels`、`colorEnglishNames` |
| 字母庫 | `const alphabetItems` |
| Sprite 資產對應 | `const spriteAssets` |
| 各模式定義 | `const gameData` |
| 冒險關卡 | `const adventureLevels` |
| 主狀態 | `const state =` |
| 音效合成 | `function playAnimalSound`、`function playVehicleSound`、`function playCrashSound` |
| 碰撞迴圈 | `function checkVehicleCollisions` |
| 生成主迴圈 | `function spawnItem` |
| 點擊處理 | `function handleInteract` |
| 計時 + 升級 | `function tickCountdown`、`function maybeLevelUp` |
| 結算 | `function finishGame` |

---

## 🎨 既定設計決策（請勿無故反轉）

這些是使用者明確要求過的，新工作別誤刪：

1. **不要中文鼓勵語音**（`speakEncouragement` 已刪除）—— 只用 `speakEnglishWord` / `speakLetterAndWord`。
2. **氣球紫色 #FF9FF3 英文是 `purple`**（不是 `pink`，曾被誤譯）；新的 `pink` 用 `#FF6FA8`。
3. **氣球全用 CSS 渲染**（`.balloon-body` + `.balloon-string`），不要再走 PNG sprite。
4. **車輛依場景定方向**：
   - 地面：car / bus / train / bike / police / fire / ambulance — `ground-{left-right,right-left}`
   - 天空：airplane / helicopter — `sky-{left-right,right-left}`
   - 火箭：`bottom-up`
5. **車輛碰撞 = 遊戲結束**（`finishGame('crash')`），標題顯示 `💥 撞車啦！`。
6. **挑戰模式統一 8 分鐘**，每分鐘 spawn / fall 速度乘 1.25。Floor：`MIN_SPAWN_MS = 100`、`MIN_FALL_MS = 800`。
7. **物件出現機率均勻**（`pickSpawnChoice` 不再對 mission target 加權）。
8. **結算畫面 5 欄**：星星、最高連擊、到達關卡、沒點到、魔法幣。
9. **十大物件清單**：每個模式都是 10 個（字母模式 26 個 A–Z）。
10. **冒險模式（adventure）保留原本依分數線性升級的曲線**，與挑戰模式（challenge）分開處理。

---

## ⚠️ 環境特性

- 專案路徑含**中文 / 空白字元**：`C:\Users\nickt\OneDrive\Developer 私人系統\rapunzel-magic-world`。Bash 指令裡的路徑要用雙引號包住。
- 在 OneDrive 同步資料夾，git 操作可能會出現 `LF will be replaced by CRLF` 警告 → 忽略即可，不要追加 `.gitattributes` 強制改行尾規則。
- **`.claude/`** 是 Claude Code 本機 worktree 暫存，**永遠不要 commit 進 repo**（已被視為 untracked，請保持原狀）。
- Windows 環境，Bash tool 跑的是 git-bash；PowerShell 也可用，但這個 repo 的範例都用 bash 寫。

---

## 🔁 衝突解決準則

當 `git pull` 或 `git stash pop` 出現衝突時：

1. **看雙方都做了什麼** —— 不要急著選邊。
2. **如果上游已實作了你要做的功能**（這個 repo 常有並行 PR）→ 採用上游，只保留你獨有的差異。
3. **使用者剛剛明確要的東西**（例：移除某個函式、改某段文字）→ 一定要保留你這邊。
4. **資料模型分歧時**（例如 direction 欄位語法不同）→ 採用較新 / 較有擴充性那一邊。

合併後一定再跑一次 JS 語法檢查再 commit。

---

## 📝 回報格式

每次完成一個任務，回報訊息結構：

```
推送完成 → <short-hash>

## 變更總覽
### <子題目>
- 用 bullet 條列關鍵改動
- 重要常數、行為差異要寫出來
- 若有 follow-up / 潛在風險，獨立一段「值得注意」說明
```

避免：
- 把整段 diff 貼回去
- 重複描述使用者已經知道的需求
- 過度自誇（「完美實作」、「已最佳化」等空話）

---

最後更新：本檔由 Claude Opus 4.7 在使用者要求建立規則文件時撰寫。
若工作流程有調整，**請直接修改本檔並一起 commit**，不要散落在 commit message 裡。
