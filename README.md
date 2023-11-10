# Bangumini

Bangumi mini API

## APIs


#### 曾用名

* Method `GET`<br/>
* URL `/user/:user/formername `<br/>
* Response
    ```typescript
    interface Response [{
        update: string     // 抓取时间 [UTC]
        tml: number        // 时间线ID
        time: string       // 改名时间 [YYYY-M-D]
        before: string     // 改名前
        after: string      // 改名后
    }, ...]
    ```

