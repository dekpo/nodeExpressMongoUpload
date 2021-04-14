// on importe nos dépendances
const express = require('express');
const cors = require('cors');
const multer = require('multer');

// on lance le serveur avec sa config
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// on définit quelques constantes
const UPLOAD_DIR = 'public';
const PORT = 3000;
const message = 'Server is running on port '+PORT;

// on gère l'upload dans le dossier voulu avec un renommage
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,UPLOAD_DIR)
    },
    filename: (req,file,cb) => {
        const ext = file.mimetype=='image/jpeg' ? '.jpg' : '.png';
        cb(null, file.fieldname + '-' + Date.now() + ext)
    }
});
const upload = multer({ storage: storage });

// on définit notre route
app.post('/', upload.single('picture'), (req,res) => {
    console.log(req.file);
    console.log(req.body);
    // res.send(message);
});
app.get('/', (req,res) => {
    res.send(message);
});
// le serveur express écoute le port 3000
app.listen(PORT, () => {
    console.log(message);
});