const Services = require('../models/services');
const Pictures = require('../models/pictures');
const path = require('path');
const fs = require('fs');


const createService = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newService = await Services.create({ name, description });

        if (req.file) {
            await Pictures.create({
                route: req.file.path,
                service_id: newService.id,
            });
        }
        const serviceWithPicture = await Services.findByPk(newService.id, {
            include: [{ model: Pictures, as: 'pictures' }]
        });

        res.status(201).json(serviceWithPicture);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getServices = async (req, res) => {
    try {
        const services = await Services.findAll({
            include: [{ model: Pictures, as: 'pictures' }]
        });
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await Services.findByPk(id, {
            include: [{ model: Pictures, as: 'pictures' }]
        });
        if (service) {
            res.status(200).json(service);
        } else {
            res.status(404).json({ error: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const [updated] = await Services.update({ name, description }, {
            where: { id }
        });

        if (updated) {
            const updatedService = await Services.findByPk(id, {
                include: [{ model: Pictures, as: 'pictures' }]
            });

            if (req.file) {
                if (updatedService.pictures.length > 0) {
                    for (const picture of updatedService.pictures) {
                        const filePath = path.resolve(__dirname, '..', 'uploads', path.basename(picture.route));
                        console.log(`Suppression de l'ancienne image : ${filePath}`);
                        
                        if (fs.existsSync(filePath)) {
                            fs.unlink(filePath, (err) => {
                                if (err) {
                                    console.error(`Erreur lors de la suppression du fichier : ${err}`);
                                }
                            });
                        } else {
                            console.error(`Fichier non trouvé : ${filePath}`);
                        }
                    }

                    await Pictures.destroy({
                        where: { service_id: id }
                    });
                }

                await Pictures.create({
                    route: req.file.path,
                    service_id: id,
                });
            }

            const serviceWithPicture = await Services.findByPk(id, {
                include: [{ model: Pictures, as: 'pictures' }]
            });
            res.status(200).json(serviceWithPicture);
        } else {
            res.status(404).json({ error: 'Service non trouvé' });
        }
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du service: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};



const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const pictures = await Pictures.findAll({
            where: { service_id: id }
        });

        pictures.forEach((picture) => {
            const filePath = path.resolve(__dirname, '../uploads', path.basename(picture.route));
            fs.unlink(filePath, (err) => {
                if (err) console.error(`Erreur lors de la suppression du fichier: ${err}`);
            });
        });
        await Pictures.destroy({
            where: { service_id: id }
        });
        const deleted = await Services.destroy({
            where: { id }
        });

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Service non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService
};