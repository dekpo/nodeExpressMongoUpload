// on importe nos dépendances
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');

// on se connecte au serveur MongoDB
const mongoURI = 'mongodb+srv://dekpo:qi08xn6@cluster0.wnduh.mongodb.net/GALLERY_DB?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('MongoDB connected successfully !!!');
});
// on crée un schéma pour les images
const ImageSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: 'the filename is mandatory !'
    },
    title: String,
    description: String,
    author: String,
    likes: Number,
    upload_date: {
        type: Date,
        default: Date.now
    }
});
// on définit un model et une méthode pour ajouter une image
// dans la BDD MongoDB GALLERY_DB
const ImageModel = mongoose.model('Image',ImageSchema);
const addNewImage = (req,res) => {
    const imageData = {
        filename: req.file.filename,
        title: req.body.title,
        description: req.body.description,
        author: req.body.author
    };
    const newImage = new ImageModel( imageData );
    newImage.save( (error,data) => {
        if (error) res.send(error);
        res.json(data);
        console.log('Method addNewImage :', data);
    });
}
// la méthode pour afficher le listing de photos
const getImages = (req,res) => {
    ImageModel.find({},(err,data) => {
        if (err) res.send(err);
        res.json(data);
        console.log('Method getImages :', data);
    }).sort({'upload_date':-1});
}

// on définit quelques constantes
const UPLOAD_DIR = 'public';
const PORT = 3000;
const message = 'Server is running on port '+PORT;

// on lance le serveur avec sa config
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(UPLOAD_DIR));

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

// on définit notre route pour l'upload en méthode post
app.post('/', upload.single('picture'), addNewImage );
// la route pour afficher la liste au format Json
app.get('/list', getImages );
// la route pour l'accès par défaut
app.get('/', (req,res) => {
    res.send(message);
    console.log( req.headers.host );
});
// le serveur express écoute le port 3000
app.listen(PORT, () => {
    console.log(message);
});