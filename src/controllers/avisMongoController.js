const AvisMongo = require('../models/avisMongo');

exports.createAvis = async (req, res) => {
    try {
        const { pseudo, message } = req.body;
        const newAvis = new AvisMongo({
            pseudo,
            message,
            isVisible: false
        });
        await newAvis.save();
        res.status(201).json(newAvis);
    } catch (error) {
        console.error('Erreur lors de la création de l\'avis:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllAvis = async (req, res) => {
    try {
        const avis = await AvisMongo.find();
        res.status(200).json(avis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.putAvis = async (req, res) => {
    try {
        const avis = await AvisMongo.findById(req.params.id);
        if (!avis) {
            return res.status(404).json({ error: 'Avis not found' });
        }
        await AvisMongo.findByIdAndUpdate(req.params.id, { ...req.body });
        res.status(200).json({ message: 'Avis updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}