const Habitats = require('../models/habitats');
const Pictures = require('../models/pictures');
const path = require('path');
const fs = require('fs');
const Comments = require('../models/comments');
const Animals = require('../models/animals');
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

const createHabitat = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newHabitat = await Habitats.create({ name, description });

        if (req.file) {
            await Pictures.create({
                route: req.file.path,
                habitat_id: newHabitat.id,
            });
        }
        const habitatWithPicture = await Habitats.findByPk(newHabitat.id, {
            include: [{ model: Pictures, as: 'pictures' }]
        });

        res.status(201).json(habitatWithPicture);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getHabitats = async (req, res) => {
    try {
        const habitats = await Habitats.findAll({
            include: [{ model: Pictures, as: 'pictures' }]
        });
        res.status(200).json(habitats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getHabitatById = async (req, res) => {
    try {
        const { id } = req.params;
        const habitat = await Habitats.findByPk(id, {
            include: [{ model: Pictures, as: 'pictures' }]
        });
        if (habitat) {
            res.status(200).json(habitat);
        } else {
            res.status(404).json({ error: 'Habitat not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateHabitat = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const [updated] = await Habitats.update(
            { name, description },
            { where: { id } }
        );

        if (updated) {
            const updatedHabitat = await Habitats.findByPk(id, {
                include: [{ model: Pictures, as: 'pictures' }]
            });

            if (req.file) {
                if (updatedHabitat.pictures.length > 0) {
                    const oldPicture = updatedHabitat.pictures[0];
                    const filePath = path.isAbsolute(oldPicture.route)
                        ? oldPicture.route
                        : path.join(UPLOADS_DIR, path.basename(oldPicture.route));
                    if (fs.existsSync(filePath)) {
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error(`Erreur lors de la suppression du fichier : ${err}`);
                            }
                        });
                    } else {
                        console.error(`Fichier non trouvé : ${filePath}`);
                    }
                    await Pictures.destroy({ where: { id: oldPicture.id } });
                }
                await Pictures.create({
                    route: req.file.path,
                    habitat_id: id,
                });
            }

            const habitatWithPicture = await Habitats.findByPk(id, {
                include: [{ model: Pictures, as: 'pictures' }]
            });
            res.status(200).json(habitatWithPicture);
        } else {
            res.status(404).json({ error: 'Habitat non trouvé' });
        }
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de l'habitat: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const deleteHabitat = async (req, res) => {
    try {
        const { id } = req.params;
        const animals = await Animals.findAll({
            where: { habitat_id: id }
        });

        if (animals.length > 0) {
            return res.status(400).json({
                error: 'Veuillez d\'abord modifier l\'habitat des animaux associés avant de supprimer cet habitat.'
            });
        }
        const pictures = await Pictures.findAll({
            where: { habitat_id: id }
        });
        pictures.forEach(picture => {
            const filePath = path.isAbsolute(picture.route) 
                ? picture.route 
                : path.join(UPLOADS_DIR, path.basename(picture.route));

            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Erreur lors de la suppression de l'image : ${filePath}`, err);
                    }
                });
            } else {
                console.warn(`Le fichier n'existe pas : ${filePath}`);
            }
        });
        await Pictures.destroy({
            where: { habitat_id: id }
        });
        await Comments.destroy({
            where: { habitat_id: id }
        });
        const deleted = await Habitats.destroy({
            where: { id }
        });

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Habitat non trouvé' });
        }
    } catch (error) {
        console.error(`Erreur lors de la suppression de l'habitat: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    createHabitat,
    getHabitats,
    getHabitatById,
    updateHabitat,
    deleteHabitat
};