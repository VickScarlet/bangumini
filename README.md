# Bangumini

Bangumi mini API

## APIs

```typescript
/**
 * @description 获取曾用名
 * @method GET
 * @path /user/:user/formername
 */
interface FormerNameList [{
    update: string     // 抓取时间 [UTC]
    tml: number        // 时间线ID
    time: string       // 改名时间 [YYYY-M-D]
    before: string     // 改名前
    after: string      // 改名后
}, ...]
```

