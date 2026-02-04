# Vue interview memory notes
# Vue 面試記憶筆記

## Key concepts quick recall
## 核心觀念速記

### Virtual DOM (VDOM)
- What: JS object tree that mirrors the real DOM structure.
- 什麼: 用 JS 物件樹描述 DOM 結構。
- Why: Diff old/new VDOM, generate minimal DOM patches.
- 為什麼: 比對新舊 VDOM，產生最小 DOM 更新。
- How: render -> VDOM, update -> diff -> patch -> DOM.
- 流程: render 產生 VDOM -> diff -> patch -> 更新 DOM。
- Tradeoff: extra JS work, but reduces expensive DOM operations.
- 取捨: 多一些 JS 計算，換取較少的昂貴 DOM 操作。

### Reactivity (Vue 3)
- Core idea: `Proxy` intercepts get/set, collect deps, trigger updates.
- 核心概念: `Proxy` 攔截 get/set，收集依賴，觸發更新。
- Flow:
  1) `get` -> `track(target, key)` register active effect
  2) `set` -> `trigger(target, key)` re-run dependent effects
  3) `effect(fn)` runs `fn` and records deps
- 流程:
  1) `get` -> `track` 收集依賴
  2) `set` -> `trigger` 觸發更新
  3) `effect(fn)` 執行並記錄依賴
- Notes:
  - `ref` wraps primitives with `.value`
  - `reactive` wraps objects, deep by default
  - `computed` caches until deps change
- 重點:
  - `ref` 包裝基本型別，用 `.value` 取值
  - `reactive` 包裝物件，預設深層
  - `computed` 依賴不變就快取

### Closure (JS)
- What: function + lexical environment it was created in.
- 什麼: 函式 + 建立時的詞法環境。
- Why: keep private state, function factories, callbacks.
- 用途: 私有狀態、函式工廠、回呼。
- Common pitfalls: unexpected shared state in loops, memory leaks if long-lived.
- 注意: 迴圈中的共用狀態、長生命週期可能造成記憶體占用。

## Common interview Q&A (Vue)
## 常見面試問答

Q: VDOM diff key points?
- A: Same tag + same key = reuse; different key = replace; list diff uses keys to avoid DOM thrash.
Q: VDOM diff 重點?
- A: 同 tag + 同 key 會復用；key 不同就替換；列表用 key 降低 DOM 抖動。

Q: Why is `key` important in `v-for`?
- A: Keeps element identity, avoids wrong patching and state reuse.
Q: `v-for` 為什麼要 key?
- A: 保持元素身分，避免錯誤 patch 與狀態錯置。

Q: `ref` vs `reactive`?
- A: `ref` for primitives or explicit `.value`; `reactive` for objects, no `.value`, but cannot wrap primitives directly.
Q: `ref` 和 `reactive` 差異?
- A: `ref` 適合基本型別且需 `.value`；`reactive` 適合物件，不用 `.value`，但不能包基本型別。

Q: Why `computed` is cached but `methods` are not?
- A: `computed` tracks deps and only re-evaluates on change; `methods` run on each render.
Q: `computed` 為何會快取，`methods` 不會?
- A: `computed` 追蹤依賴，只在改變時重算；`methods` 每次 render 都會跑。

Q: How does `watch` differ from `watchEffect`?
- A: `watch` observes explicit source and provides old/new; `watchEffect` auto-tracks and runs immediately.
Q: `watch` 與 `watchEffect` 差異?
- A: `watch` 監聽明確來源並給新舊值；`watchEffect` 自動收集依賴且立即執行。

## Coding exercise
## 題目練習

### 1) Print 3x3 from [1..9]
### 1) 把 1..9 印成 3x3
```js
const arr = [1,2,3,4,5,6,7,8,9]
const grid = []
for (let i = 0; i < 3; i++) {
  grid.push(arr.slice(i * 3, i * 3 + 3))
}
console.log(grid)
// [[1,2,3],[4,5,6],[7,8,9]]
```

### 2) Each run moves top-left to bottom-right
### 2) 每次把左上角移到右下角
Idea: flatten, rotate left by 1, then rebuild 3x3.
想法: 先攤平成陣列，左轉一格，再重建 3x3。
```js
const rotate = (grid) => {
  const flat = grid.flat()
  const first = flat.shift()
  flat.push(first)
  const next = []
  for (let i = 0; i < 3; i++) {
    next.push(flat.slice(i * 3, i * 3 + 3))
  }
  return next
}

let g = [[1,2,3],[4,5,6],[7,8,9]]
g = rotate(g)
// [[2,3,4],[5,6,7],[8,9,1]]
```

### 3) Closure rotate (stateful)
### 3) 閉包版 rotate (保留狀態)
Idea: keep only the flat array in closure; build grid on demand.
想法: 閉包只存一維陣列，`asGrid()` 時才組回 2D。
```js
const createRotator = (arr) => {
  const n = Math.sqrt(arr.length)
  if (!Number.isInteger(n)) {
    throw new Error("Array length must be a perfect square")
  }

  let flat = arr.slice()
  const toGrid = () => {
    const next = []
    for (let i = 0; i < n; i++) {
      next.push(flat.slice(i * n, i * n + n))
    }
    return next
  }

  const rotateForward = () => {
    const first = flat.shift()
    flat.push(first)
    return toGrid()
  }

  const rotateBackward = () => {
    const last = flat.pop()
    flat.unshift(last)
    return toGrid()
  }

  return {
    size: n,
    asGrid: () => toGrid(),
    asFlat: () => flat.slice(),
    rotateForward,
    rotateBackward,
  }
}

const rotator = createRotator([1,2,3,4,5,6,7,8,9])
rotator.asGrid()
// [[1,2,3],[4,5,6],[7,8,9]]
rotator.rotateForward()
// [[2,3,4],[5,6,7],[8,9,1]]
rotator.rotateBackward()
// [[1,2,3],[4,5,6],[7,8,9]]
rotator.asFlat()
// [1,2,3,4,5,6,7,8,9]
```

### 3.1) Head index (no array moves)
### 3.1) head index 版本 (不搬陣列)
Idea: keep `flat` + `head`; rotate by moving `head`, read via index math.
想法: 保留 `flat` 與 `head`，旋轉只改 `head`，讀取靠索引換算。
```js
const createRotatorHead = (arr) => {
  const n = Math.sqrt(arr.length)
  if (!Number.isInteger(n)) {
    throw new Error("Array length must be a perfect square")
  }

  const flat = arr.slice()
  let head = 0

  const at = (i) => flat[(head + i) % flat.length]
  const toGrid = () => {
    const next = []
    for (let r = 0; r < n; r++) {
      const row = []
      for (let c = 0; c < n; c++) {
        row.push(at(r * n + c))
      }
      next.push(row)
    }
    return next
  }

  const rotateForward = () => {
    head = (head + 1) % flat.length
    return toGrid()
  }

  const rotateBackward = () => {
    head = (head - 1 + flat.length) % flat.length
    return toGrid()
  }

  return {
    size: n,
    asGrid: () => toGrid(),
    asFlat: () => flat.slice(),
    rotateForward,
    rotateBackward,
  }
}

const rotator2 = createRotatorHead([1,2,3,4,5,6,7,8,9])
rotator2.rotateForward()
// [[2,3,4],[5,6,7],[8,9,1]]
```

### 3.2) Performance note
### 3.2) 效能小結
- Storing only `flat` avoids re-flattening on every rotate.
- 單存 `flat` 可以省掉每次 rotate 的攤平成本。
- `rotate` is O(1) for shift/pop (but still moves elements internally).
- `rotate` 是 O(1) 的頭尾操作 (實作仍會搬移元素)。
- Head index avoids moving elements; rotate cost is O(1) without shifts.
- head index 不搬元素，旋轉是純 O(1)。
- `asGrid()` is O(n^2), confirmed each time you build 2D.
- `asGrid()` 是 O(n^2)，每次組 2D 都會花成本。

## Quick recall prompts
## 口訣式提醒
- "Explain VDOM diff in 30 seconds."
- "Describe Vue 3 reactivity without code."
- "When to use `watch` vs `watchEffect`?"
- "Closure pitfalls in loops?"
- "用 30 秒講 VDOM diff。"
- "不用寫 code 描述 Vue 3 響應式。"
- "`watch` 和 `watchEffect` 什麼時候用?"
- "閉包在迴圈的坑?"
