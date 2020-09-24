import * as SQLite from 'expo-sqlite'
import { BaseModel, types } from 'expo-sqlite-orm'
 
export default class User extends BaseModel {
  constructor(obj) {
    super(obj)
  }
 
  static get database() {
    return async () => SQLite.openDatabase('loharano.db')
  }
 
  static get tableName() {
    return 'user'
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      email: { type: types.TEXT, not_null: true },
      password: { type: types.TEXT, not_null: true },
    }
  }
}