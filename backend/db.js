const { Sequelize } = require ('sequelize');

const sequelize = new Sequelize('RideSafedb', 'postgres', 'postgres', {
    host: '127.0.0.1',
    port: 5434,
    dialect: 'postgres',
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to database', error);
    }
})();

module.exports = sequelize;