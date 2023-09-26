import { Client } from '@elastic/elasticsearch'
import path from "path";
import fs from 'fs';
import dotenv from 'dotenv';
// import split from 'split2';

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

async function prepare() {
    const exists = await client.indices.exists({ index: 'stackoverflow'})
    if (exists) return;
    await client.indices.create({
        index: 'stackoverflow',
        body: {
            mappings: {
                dynamic: true,
                properties: {
                    id: { type: 'keyword' }
                }
            }
        }
    })
    console.log('body', exists)
}

async function index() {
    const datasetPath = path.join(__dirname, '..', 'fixtures', 'stackoverflow.ndjson')
    const datasource = fs.createReadStream(datasetPath);


    const result = await client.helpers.bulk({
        datasource,
        wait: 10000,
        retries: 10,
        concurrency: 10,
        flushBytes: 500000,
        flushInterval: 1000,
        onDocument(doc) {
            return {
                index: { _index: 'stackoverflow' }
            }
        },
        onDrop(doc) {
            console.log(doc);
        },
        refreshOnCompletion: 'stackoverflow'
    })

    console.log('result', result);
}

prepare()
    .then(index)
    .catch(err => {
        console.log(err);
        process.exit(1);
    })
