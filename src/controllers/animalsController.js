const Animals = require('../models/animals');
const Pictures = require('../models/pictures');
const path = require('path');
const fs = require('fs');
const Habitats = require('../models/habitats');
const Reports = require('../models/reports');
const Feeds = require('../models/feeds');
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

const createAnimal = async (req, res) => {
    try {
        const { name, race, habitat_id } = req.body;
        const newAnimal = await Animals.create({ name, race, habitat_id });

        if (req.files && req.files.length > 0) {
            const pictures = await Promise.all(
                req.files.map(file => 
                    Pictures.create({
                        route: file.path,
                        animal_id: newAnimal.id,
                    })
                )
            );
            newAnimal.dataValues.pictures = pictures;
        }

        res.status(201).json(newAnimal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getAnimals = async (req, res) => {
    try {
        const animals = await Animals.findAll({
            include: [
                { model: Pictures, as: 'pictures' },
                { model: Habitats, as: 'habitat', attributes: ['name'] },
            ]
        });
        res.status(200).json(animals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getAnimalById = async (req, res) => {
    try {
        const { id } = req.params;
        const animal = await Animals.findByPk(id, {
            include: [{ model: Pictures, as: 'pictures' }]
            
        });
        if (animal) {
            res.status(200).json(animal);
        } else {
            res.status(404).json({ error: 'Animal not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateAnimal = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, race, habitat_id } = req.body;

        const [updated] = await Animals.update(
            { name, race, habitat_id },
            { where: { id } }
        );

        if (updated) {
            const updatedAnimal = await Animals.findByPk(id, {
                include: [{ model: Pictures, as: 'pictures' }]
            });

            const existingPictures = updatedAnimal.pictures;

            if (req.files && req.files.length > 0) {
                for (let i = 0; i < req.files.length; i++) {
                    const newFile = req.files[i];

                    if (i < existingPictures.length) {
                        const oldPicture = existingPictures[i];
                        const filePath = path.isAbsolute(oldPicture.route)
                            ? oldPicture.route
                            : path.join(UPLOADS_DIR, path.basename(oldPicture.route));
                        
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error(`Erreur lors de la suppression de l'image: ${err.message}`);
                            }
                        });
                        oldPicture.route = newFile.path;
                        await oldPicture.save();
                    } else {
                        await Pictures.create({
                            route: newFile.path,
                            animal_id: id,
                        });
                    }
                }
            }

            const animalWithPictures = await Animals.findByPk(id, {
                include: [{ model: Pictures, as: 'pictures' }]
            });
            res.status(200).json(animalWithPictures);
        } else {
            res.status(404).json({ error: 'Animal not found' });
        }
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de l'animal: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};


const deleteAnimal = async (req, res) => {
    try {
        const { id } = req.params;
        const pictures = await Pictures.findAll({
            where: { animal_id: id }
        });

        pictures.forEach(picture => {
            const filePath = path.isAbsolute(picture.route) 
                ? picture.route 
                : path.join(UPLOADS_DIR, path.basename(picture.route));

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Failed to delete old picture: ${filePath}`, err);
                }
            });
        });

        await Pictures.destroy({
            where: { animal_id: id }
        });
        await Reports.destroy({
            where: { animal_id: id }
        });
        await Feeds.destroy({
            where: { animal_id: id }
        });

        const deleted = await Animals.destroy({
            where: { id }
        });

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Animal not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createAnimal,
    getAnimals,
    getAnimalById,
    updateAnimal,
    deleteAnimal
}; 