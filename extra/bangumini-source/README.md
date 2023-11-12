# Bangumini EventSource

## Example

```typescript
import createSource from 'bangumini-source';

async function main() {
    const source = createSource('path/to/bangumini/api');

    for await (const data of source) {
        // you can use data
        console.debug(data);
    }
}
```


