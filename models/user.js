import Sequelize from 'sequelize';

export default (sequelize) => {
    const user = sequelize.define('user_master', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        mobile: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        isMaster: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false, 
        },
    });

    return user;
};
