import { Client } from '@elastic/elasticsearch'
import path from "path";
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log('process', process.env.CLOUD_ID);

const client = new Client({
    cloud: {
        id: "test-app:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyQwZWJlN2RiYmJkOTY0N2YwYWYwMjQ2YjQ5YjIwZGU1ZiRhYjUyODBkYjgwZDg0OGZmYjJkZGYxYzhkOWYxOTczMw=="
    },
    auth: {
        username: 'elastic',
        password: 'lWVepZlRCeSV0gRDeZHRuOoY'
    }
})

async function run() {
    const response = await client.index({
        id: '1',
        body: {foo: 'bar2'},
        refresh: true,
        index: 'elastic-test-app'
    });

    const response2 = await client.get({index: 'elastic-test-app', id: '1'})
    console.log(response2._source);
}

run().catch(err => {
    console.log(err);
    process.exit(1);
})
