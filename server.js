const express = require("express");
const app = express();
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser')
const moment = require('moment');
moment.locale("tr");
require('dotenv/config');
const firebase = require('firebase/app');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');
const servis = require('./servis.json');
const randomstring = require("randomstring");
const urls = require('is-url');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('./public'));
app.use('/public', express.static(path.join(__dirname, 'public')))
const ejs = require('ejs');
app.set('view engine', 'ejs');


admin.initializeApp({
  credential: admin.credential.cert(servis)
});
let data = admin.firestore();





app.get('/kisalt', function(req, res) {
  data.collection("link").get().then(function(querySnapshot) {
    res.render('linq.ejs', {
      sayi: querySnapshot.size
    })
  })
});





app.post('/yonlendirme', async(req, res) => {
  let body = req.body;
  const ips = req.clientIp;
  if (!urls(body.link)) return res.send('Link gir')
  let random = randomstring.generate({
    length: 5,
    charset: 'alphanumeric'
  })
  if(body.link.includes('furtsy')) return res.redirect('https://www.youtube.com/watch?v=oHg5SJYRHA0')
  const linqs = data.collection('link');
const sikis = await linqs.get();
sikis.forEach(doc => {
var linkA = doc.data().link
if(linkA.includes(body.link)) return res.redirect('https://www.youtube.com/watch?v=oHg5SJYRHA0')
})
  data.collection('link').doc(`${random}`).set({
    'kod': random,
    'link': body.link,
    'zaman': moment(Date.now()).add(3, 'hours').format('LLLL'),
})
    res.render('links.ejs', {
      link: `https://furtsy.wtf/link/${random}`
    })
});


app.get('/link/:string', function(req, res) {
  const linqs = req.params.string
  data.collection('link').doc(linqs).get().then((am) => {
    if (!am.exists) return res.send('düştün hacı')
    res.redirect(am.data().link)
  })
});

console.log('başladım')
app.listen(process.env.PORT)
