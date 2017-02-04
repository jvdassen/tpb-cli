#!/usr/bin/env node

var program = require('commander');
var chalk = require('chalk');
const request = require('tinyreq');
const cheerio = require('cheerio');

program
  .arguments('<searchTerm> [terms...]')
  .option('-s, --sort <sort>', 'Sort by', /^(seeds|size|name)$/i, 'seeds')
  .option('-n, --results <amount>', 'Results')
  .action(function(searchTerm, terms){
     console.log(chalk.bold.cyan('Searching for: ') + chalk.bold.magenta(searchTerm));
     console.log(chalk.bold.cyan('additional terms: ') + chalk.bold.magenta(formatTerms(terms)));
     if (terms) {
       console.log('amount' + program.amount);

       queryTpb(searchTerm + '+' +formatTerms(terms));
     }
     else {
       queryTpb(searchTerm);

     }
  })
  .parse(process.argv);




function queryTpb(term, n){
  console.log(n);
  request('https://thepiratebay.org/search/'+ term +'/0/7/0', function(err, body) {
    "use strict";
    // console.log(err || body);
    let $ = cheerio.load(body);
    let res = [];
    let torrents = $('tr');
    for (var i = 1; i < torrents.length; i++) {
      let torrent = {}
      torrent.name = $(torrents[i]).children(':nth-child(2)').children('.detName').children('a').text();
      torrent.magnet = $(torrents[i]).children(':nth-child(2)').children('a').attr('href');
      torrent.description = $(torrents[i]).children(':nth-child(2)').children('.detDesc').text();
      torrent.seeds = $(torrents[i]).children(':nth-child(3)').text()
      torrent.leechers = $(torrents[i]).children(':nth-child(4)').text()
      res.push(torrent)

      console.log(torrent.name + ' ~ ' + chalk.bold.green('S' + torrent.seeds) +':'+ chalk.bold.red('L' + torrent.leechers))
      console.log(torrent.description)
      console.log(chalk.bold.magenta(torrent.magnet))
    }
    return res;
  });
}

function formatTerms(terms){
  querystring = '';
  for (var i = 0; i< terms.length; i++){
    if (i == terms.length -1){
      querystring += terms[i];
    }
    else {
      querystring += terms[i] + '+';
   }
  }
  return querystring;
}
