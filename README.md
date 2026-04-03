Viewed adv-02-unit-canvas-image.html:1-431

針對 **`adv-02-unit-canvas-image` (HTML5 Canvas 影像繪製與處理)** 單元，這是一個將 Web 技術轉化為「視覺處理引擎」的關鍵課程，重點在於底層像素的直接操控與高效渲染。

以下是在 **GitHub Classroom** 部署其作業 (Assignments) 的具體建議：

### 1. 範本倉庫 (Template Repo) 配置建議
Canvas 處理需要一個穩定的「前端沙盒」，建議包含：
*   **📂 `index.html`**：預置雙層畫布結構（底層影像 + 頂層 UI 標註），這是工業級影像處理的標準配置，避免 UI 繪製損壞原始數據。
*   **📂 `src/vision-engine.js`**：提供 `requestAnimationFrame` 的循環框架，並預置 `applyFilter(imageData)` 等空函式，讓學員專注於填充內部的像素運算邏輯。
*   **📂 `tests/vision_test.js`**：使用單元測試檢核學員的濾鏡公式。例如：輸入紅色 `(255, 0, 0)`，檢查灰階化後是否正確輸出約 `(85, 85, 85)`。
*   **📂 `.github/workflows/ui_snapper.yml`**：設置一個簡單的工作流，自動截取學員提交後的網頁畫面並貼在 PR 評論中，方便導師一眼看出濾鏡與準星是否正常。

---

### 2. 作業任務部署細節

#### 任務 1：即時濾鏡開發師 (Filter Development Lab)
*   **目標**：掌握 `Uint8ClampedArray` 的一維索引規律。
*   **Classroom 部署建議**：
    *   **核心代碼檢核**：
        ```javascript
        // 學生需實作：(R+G+B)/3 的灰階變換
        for (let i = 0; i < data.length; i += 4) {
            let avg = (data[i] + data[i+1] + data[i+2]) / 3;
            data[i] = data[i+1] = data[i+2] = avg; // 固定 Alpha 不動
        }
        ```
    *   **Autograding**：透過 headless browser 測試，讀取 Canvas 的數據值，驗證像素變換是否精確符合數學公式。

#### 任務 2：視覺準星與動態標註 (Visual Overlay System)
*   **目標**：練習座標空間映射 (Coordinate Mapping) 與圖層解耦思維。
*   **Classroom 部署建議**：
    *   **核核重點**：導師應檢查學員是否將 UI 繪製在「正確的畫布層級」。如果是直接繪製在處理過後的影像層，會導致後續 AI 偵測時「誤把準星當特徵」，這是常見的工程失誤。
    *   **互動性驗證**：要求學員實作即時顯示移動座標旁的像素 $R, G, B$ 原生數據，這能驗證學員是否有成功「反推」回一維陣列的正確索引。

#### 任務 3：鏡像修正與 ROI 提取 (Mirroring & ROI)
*   **目標**：練習空間幾何變換與局部數據封裝。
*   **Classroom 部署建議**：
    *   **空間變換檢核**：實作水平鏡像。這需要雙重 $for$ 迴圈或 $O(N)$ 的陣列搬移，這能測試學員對「記憶體配置」與「座標對稱性」的理解。
    *   **ROI 提交**：要求學員將提取出的 $100 \times 100$ 局部特徵區塊（ROI），使用 `canvas.toDataURL()` 轉為 Base64 格式並印在 Console。這能模擬未來將「特徵小圖」上傳至雲端 AI 的真實場景。

---

### 3. 前端影像導師點評標準 (Frontend Vision Benchmarks)
此單元的價值在於 **「對影像主權的操控」**：
*   [ ] **效能韌性**：在開啟濾鏡的狀態下，FPS 是否仍能維持在「準時重繪 (30-60 FPS)」？
*   [ ] **索引精確度**：濾鏡處理是否發生「顏色偏移」或「邊界溢漏」（例如：不小心修改了最後一列像素）？
*   [ ] **架構優雅度**：是否理解「分離圖層 (Layer Separation)」的重要性？

### 📁 推薦範本結構 (GitHub Classroom Template)：
```text
.
├── index.html              # 前端頁面 (含視訊串流區與畫布圖層)
├── src/
│   ├── filters.js          # 核心：像素濾鏡算法實作位元
│   └── interaction.js      # UI：準星與數據標註繪製邏輯
├── tests/
│   └── pixel_logic.test.js # 自動化測試：檢核色彩空間轉換公式
└── README.md               # 專案報告：我如何優化影像渲染延遲
```

透過這種部署方式，學生能將「冷冰冰的數據流」轉化為「可視化、可操作的軟體介面」，這是開發 AI 監控系統、遙控機器人儀表板的必備核心技能。_
