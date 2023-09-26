import { Client } from '@elastic/elasticsearch'
import path from "path";
import { promisify } from "util";

const sleep = promisify(setTimeout);

const client = new Client({
    cloud: {
        id: "test-app:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyQwZWJlN2RiYmJkOTY0N2YwYWYwMjQ2YjQ5YjIwZGU1ZiRhYjUyODBkYjgwZDg0OGZmYjJkZGYxYzhkOWYxOTczMw=="
    },
    auth: {
        username: 'elastic',
        password: 'lWVepZlRCeSV0gRDeZHRuOoY'
    }
})

async function * generator() {
    const dataset = [
        { user: 'Jhon', age: 16 },
        { user: 'Amy', age: 20 },
        { user: 'Martin', age: 45 },
        { user: 'Juan', age: 38 },
        { user: 'Maks', age: 32 },
        { user: 'Andrew', age: 49 },
        { user: 'Anna', age: 56 },
        { user: 'Lia', age: 87 },
    ]

    for (const doc of dataset) {
        //@ts-ignore
        await sleep(100);
        yield doc;
    }
}

async function run() {
    //@ts-ignore
    const result = await client.helpers.bulk({
        datasource: generator(),
        flushInterval: 1000,
        onDocument(doc) {
            return {
                index: { _index: 'game-of-thrones' }
            }
        },
        onDrop(doc) {
            console.log('cant index doc',doc.error);
        },
        refreshOnCompletion: 'game-of-thrones'
    })

    console.log('result', result);
}

run()
    .catch(err => {
        console.log(err);
        process.exit(1);
    })
