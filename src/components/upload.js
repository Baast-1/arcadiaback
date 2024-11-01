const fs = require('fs');
const multer = require('multer');
const path = require('path');

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Dossier ${uploadDir} créé.`);
}

// Fonction pour nettoyer le nom du site
const cleanSiteName = (siteName) => {
    return siteName.replace(/[^a-zA-Z0-9-_]/g, '_'); // Remplacer les caractères non valides par des underscores
};

// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const siteName = req.headers.origin ? cleanSiteName(new URL(req.headers.origin).hostname) : 'default'; // Récupérer et nettoyer le nom du site
    const siteDir = path.join(uploadDir, siteName);

    if (!fs.existsSync(siteDir)){
        fs.mkdirSync(siteDir, { recursive: true });
        console.log(`Dossier ${siteDir} créé.`);
    }

    console.log(`Tentative de stockage du fichier dans : ${siteDir}`);
    cb(null, siteDir); // Chemin du sous-dossier où les fichiers seront stockés
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`; // Utiliser le nom original du fichier avec un horodatage
    console.log(`Nom du fichier : ${filename}`);
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;