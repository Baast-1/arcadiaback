const Animals = require('./animals');
const Comments = require('./comments');
const Habitats = require('./habitats');
const Pictures = require('./pictures');
const Services = require('./services');
const Feeds = require('./feeds');
const Reports = require('./reports');

Animals.belongsTo(Habitats, {
    foreignKey: 'habitat_id',
    as: 'habitat'
});

Animals.hasMany(Pictures, {
    foreignKey: 'animal_id',
    as: 'pictures',
});

Animals.hasMany(Feeds, {
    foreignKey: 'animal_id',
    as: 'feeds',
});

Animals.hasMany(Reports, {
    foreignKey: 'animal_id',
    as: 'reports',
});

Habitats.hasMany(Animals, {
    foreignKey: 'habitat_id',
    as: 'animals'
});

Habitats.hasMany(Pictures, {
    foreignKey: 'habitat_id',
    as: 'pictures',
});

Habitats.hasMany(Comments, {
    foreignKey: 'habitat_id',
    as: 'comments',
});

Services.hasMany(Pictures, {
    foreignKey: 'service_id',
    as: 'pictures',
});

const associations = {
    Animals,
    Comments,
    Habitats,
    Pictures,
    Services,
};

module.exports = associations;