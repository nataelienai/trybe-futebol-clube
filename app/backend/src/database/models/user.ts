import { DataTypes, Model } from 'sequelize';
import sequelize from '.';

class User extends Model {
  declare id: number;
  declare username: string;
  declare role: string;
  declare email: string;
  declare password: string;
}

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
