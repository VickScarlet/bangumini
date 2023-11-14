# Bangumini

Bangumi mini API

## EventSource 数据结构

```typescript
interface EventSourceData {
    status: string        // 状态 [new, done, not-found, db-cache, step-{N}]
    done: boolean         // 是否更新完成
    update: string        // 更新时间 [UTC]
    data?: unknown        // 数据 [类型根据接口数据而定]
}
```

## APIs

```typescript
/**
 * @description 获取曾用名
 * @method EventSource
 * @path /user/:user/formername
 */
interface FormerNames [{
    tml: number            // 时间线ID
    time: string           // 改名时间 [YYYY-MM-DD]
    before: string         // 改名前
    after: string          // 改名后
}, ...]
```

```typescript
/**
 * @description 获取点格子活跃度
 * @method EventSource
 * @path /user/:user/progress_activity
 */
interface ProgressActivitys [{
    time: string           // 改名时间 [YYYY-MM-DD]
    activity: number       // 活跃度
}, ...]
```
