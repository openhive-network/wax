import express from 'express';
const app = express();
app.use(express.static( process.cwd() ));
app.listen(8080);
