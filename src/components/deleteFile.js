const fs = require('fs');
const path = require('path');

// Fonction pour nettoyer le nom du site
const cleanSiteName = (siteName) => {
    return siteName.replace(/[^a-zA-Z0-9-_]/g, '_'); // Remplacer les caractères non valides par des underscores
};

const deleteFile = (siteName, fileName) => {
    if (!fileName) {
        console.warn('Aucun fichier à supprimer');
        return Promise.resolve(); // Retourner une promesse résolue si aucun fichier n'est fourni
    }

    const cleanedSiteName = cleanSiteName(new URL(siteName).hostname)
    const filePath = path.join(__dirname, '../../uploads', cleanedSiteName, fileName);
    return fs.promises.access(filePath, fs.constants.F_OK)
        .then(() => fs.promises.unlink(filePath))
        .then(() => console.log('Image supprimée avec succès:', filePath))
        .catch(err => {
            if (err.code === 'ENOENT') {
                console.error('Fichier à supprimer non trouvé:', filePath);
            } else {
                console.error('Erreur lors de la suppression de l\'image:', err);
            }
        });
};

module.exports = deleteFile;