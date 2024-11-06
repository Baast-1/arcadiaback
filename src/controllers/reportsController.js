const Reports = require('../models/reports');

const createReport = async (req, res) => {
    try {
        const { state, feed, grammage, animal_id, created_at } = req.body;
        const newReport = await Reports.create({ state, feed, grammage, animal_id, created_at });
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getReportsByAnimal = async (req, res) => {
    try {
        const { animal_id } = req.params;
        const reports = await Reports.findAll({
            where: { animal_id }
        });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Reports.destroy({
            where: { id }
        });

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Report not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createReport,
    getReportsByAnimal,
    deleteReport
};