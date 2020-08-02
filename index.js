const fs = require('fs');
const http = require('http');
const url = require('url');
const { resolve } = require('path');
const slugify = require('slugify');
const replaceTemplate = require('./modules.js/replaceTemplate');
//FILES
//////////////////////////////////

// blocking, synchronous way
//const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
//console.log(textIn);
//const txtOut = `This is what we know about the avocato: ${textIn}.\n ${Date.now()}`;
//fs.writeFileSync("./txt/output.txt", txtOut);
//console.log('File written!');
//
//non blocking, asynchronous way
//
//fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
// //   fs.readFile(`./txt/${data1}`, "utf-8", (err, data2) => {
//        fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//            fs.writeFile(`./txt/final.txt`, `${data2}\n${data3}.`,'utf-8',(err)=>{
//                console.log("end");
//            });
//        });
//
//    });
//
//});

//SERVER
//////////////////////////////

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, resp) => {
  const { query, pathname } = url.parse(req.url, true);

  const pathName = pathname;
  //Overview page

  if (pathName === '/' || pathName === '/overview') {
    resp.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = dataObj.map((el) => {
      return replaceTemplate(tempCard, el);
    });
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    resp.end(output);
  }
  //Product page
  else if (pathName === '/product') {
    resp.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    resp.end(output);
  }

  //Api
  else if (pathName === '/api') {
    resp.writeHead(200, { 'Content-type': 'application/json' });
    resp.end(data);
  } else {
    resp.writeHead(404, {
      'Content-type': 'text/html',
    });
    resp.end('<h1>PAGE NOT FOUND</h1>');
  }
});

server.listen(4000, '127.0.0.1', () => {});
