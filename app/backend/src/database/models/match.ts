import { DataTypes, Model } from 'sequelize';
import sequelize from '.';
import Team from './team';

class Match extends Model {}

Match.init({
  homeTeam: DataTypes.INTEGER,
  homeTeamGoals: DataTypes.INTEGER,
  awayTeam: DataTypes.INTEGER,
  awayTeamGoals: DataTypes.INTEGER,
  inProgress: DataTypes.BOOLEAN,
}, {
  sequelize,
  tableName: 'matches',
  underscored: true,
  timestamps: false,
});

Match.belongsTo(Team, { foreignKey: 'homeTeam', as: 'homeTeam' });
Match.belongsTo(Team, { foreignKey: 'awayTeam', as: 'awayTeam' });

Team.hasMany(Match, { foreignKey: 'homeTeam', as: 'matches' });
Team.hasMany(Match, { foreignKey: 'awayTeam', as: 'matches' });

export default Match;
