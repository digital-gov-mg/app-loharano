import * as SQLite from 'expo-sqlite'
import { BaseModel, types } from 'expo-sqlite-orm'
 
export default class Household extends BaseModel {
  constructor(obj) {
    super(obj)
  }
 
  static get database() {
    return async () => SQLite.openDatabase('loharano.db')
  }
 
  static get tableName() {
    return 'househould'
  }
 
  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      fokontany_id: { type: types.INTEGER, not_null: true },
      fokontany_name: { type: types.TEXT, not_null: true },
      sector_locality: { type: types.TEXT },
      address: { type: types.TEXT, not_null: true },
      notebook_number: { type: types.NUMERIC },
      notebook_date: { type: types.TEXT },
      date_arrived: { type: types.TEXT },
      date_leaved: { type: types.TEXT },
      notebook_reference: { type: types.TEXT },
    }
  }
}