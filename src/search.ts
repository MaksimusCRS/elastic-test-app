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


async function run() {
   const response = await client.search({
       index: 'stackoverflow',
       body: {
           query: {
               match: {
                    title: 'javascript'
               }
           }
       }
   })

    console.log('full res', response);

   console.log('res match', response.hits.hits.map(doc => doc._source))
}

run()
    .catch(err => {
        console.log(err);
        process.exit(1);
    })
