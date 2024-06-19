module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define('user_master', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        mobile: {
            type: Sequelize.STRING,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isMaster: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            default: false
        },
    });
    
    return user;
};


