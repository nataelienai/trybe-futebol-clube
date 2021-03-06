import { DataTypes, Model } from 'sequelize';
import sequelize from '.';

class Team extends Model {
  declare id: number;
  declare teamName: string;
}

Team.init({
  teamName: DataTypes.STRING,
}, {
  sequelize,
  tableName: 'teams',
  underscored: true,
  timestamps: false,
});

export default Team;
