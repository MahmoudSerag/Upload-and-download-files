const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const { diskStorage } = require('multer');

const app = express();

const fileStorage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/icon') {
    cb(null, true);
  }
  else {
    cb(null, false);
  }
}

app.set('view engine', 'ejs');


app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, `public`)));

app.get('/', (req, res, next) => {
  res.render('uploadFile');
});


app.post('/upload', (req, res, next) => {
  try {
    const image = req.file;
    console.log(image);
    if (!image) {
      return res.redirect(`/`);
    }
    res.render(`recieveFile`, {
      imagePath: image.path,
      imageName: image.filename
    });
  } 
  catch (error) {
    console.log(error.message);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Listening to port: ${port}`));