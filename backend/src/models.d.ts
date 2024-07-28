import { ModelStatic } from 'sequelize';

declare module 'sequelize' {
  interface Model {
    associate?(models: any): void;
  }
}