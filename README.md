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
    status: string         // 状态 [new, done, not-found, db-cache, step-{N}]
    done: boolean          // 是否更新完成
    update: string         // 更新时间 [UTC]
    data: [{
        tml: number        // 时间线ID
        time: string       // 改名时间 [YYYY-MM-DD]
        before: string     // 改名前
        after: string      // 改名后
    }, ...]
}
```

```typescript
/**
 * @description 获取点格子活跃度
 * @method EventSource
 * @path /user/:user/progress_activity
 */
interface Data {
    status: string         // 状态 [new, done, not-found, db-cache, step-{N}]
    done: boolean          // 是否更新完成
    update: string         // 更新时间 [UTC]
    data: [{
        time: string       // 改名时间 [YYYY-MM-DD]
        activity: number   // 活跃度
    }, ...]
}
```
