const Feeds = require('../models/feeds');

const createFeed = async (req, res) => {
    try {
        const { name, quantity, animal_id, created_at } = req.body;
        const newFeed = await Feeds.create({ name, quantity, animal_id, created_at });
        res.status(201).json(newFeed);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getFeedsByAnimal = async (req, res) => {
    try {
        const { animal_id } = req.params;
        const feeds = await Feeds.findAll({
            where: { animal_id }
        });
        res.status(200).json(feeds);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteFeed = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Feeds.destroy({
            where: { id }
        });

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Feed not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createFeed,
    getFeedsByAnimal,
    deleteFeed
};