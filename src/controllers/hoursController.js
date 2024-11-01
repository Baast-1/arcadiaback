const Hours = require('../models/hours');

const createHour = async (req, res) => {
    try {
        const { name, start, end } = req.body;
        console.log('Request body:', req.body);
        const newHour = await Hours.create({ name, start, end });
        console.log('New hour created:', newHour);
        res.status(201).json(newHour);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getHours = async (req, res) => {
    try {
        const hours = await Hours.findAll();
        res.status(200).json(hours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getHourById = async (req, res) => {
    try {
        const { id } = req.params;
        const hour = await Hours.findByPk(id);
        if (hour) {
            res.status(200).json(hour);
        } else {
            res.status(404).json({ error: 'Hour not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateHour = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, start, end } = req.body;
        const [updated] = await Hours.update({ name, start, end }, {
            where: { id }
        });
        if (updated) {
            const updatedHour = await Hours.findByPk(id);
            res.status(200).json(updatedHour);
        } else {
            res.status(404).json({ error: 'Hour not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteHour = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Hours.destroy({
            where: { id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Hour not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createHour,
    getHours,
    getHourById,
    updateHour,
    deleteHour
};