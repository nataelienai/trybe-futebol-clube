import { DataTypes, Model } from 'sequelize';
import sequelize from '.';

class User extends Model {}

User.init({
  username: DataTypes.STRING,
  role: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
}, {
  sequelize,
  tableName: 'users',
  underscored: true,
  timestamps: false,
});

export default User;
