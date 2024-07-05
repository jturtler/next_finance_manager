## Prepare database 
 - Create a Mongodb Atlat account ( mongodb.com )
 - Create file env.local with content:
    MONGODB_URI=<Mongodb-URI>
    This is an example for "Mongodb-URI": mongodb+srv://<username>:<passowrd>@cluster0.n0jz7.mongodb.net/personalfinance?retryWrites=true&w=majority&appName=Cluster0

## Getting Started
[1]. Build the app
``` bash
npm run build
or 
yarn build

[2]. Run the development server:
```bash
npm run dev
# or
yarn dev


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result