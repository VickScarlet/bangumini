# Bangumini

Bangumi mini API

## APIs

```typescript
/**
 * @description 获取曾用名
 * @method EventSource
 * @path /user/:user/formername
 */
interface Data {
    type: string       // 类型 [done, task, none]
    update: string     // 更新时间 [UTC]
    data: [{
        tml: number        // 时间线ID
        time: string       // 改名时间 [YYYY-MM-DD]
        before: string     // 改名前
        after: string      // 改名后
    }, ...]
}
```

