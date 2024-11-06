const Comments = require('../models/comments');

const createCommentByHabitat = async (req, res) => {
    try {
        const { habitat_id } = req.params;
        const { note, state, upgrade } = req.body;
        const newComment = await Comments.create({ note, state, upgrade, habitat_id, created_at: new Date() });
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCommentsByHabitat = async (req, res) => {
    try {
        const { habitat_id } = req.params;
        const comments = await Comments.findAll({
            where: { habitat_id }
        });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Comments.destroy({
            where: { id }
        });

        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Comment not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    deleteComment,
    getCommentsByHabitat,
    createCommentByHabitat
};
