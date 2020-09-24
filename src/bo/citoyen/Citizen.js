import * as SQLite from 'expo-sqlite'
import { BaseModel, types } from 'expo-sqlite-orm'
 
export default class Citizen extends BaseModel {
  constructor(obj) {
    super(obj)
  }
 
  static get database() {
    return async () => SQLite.openDatabase('loharano.db')
  }
 
  static get tableName() {
    return 'citizen'
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      last_name: { type: types.TEXT, not_null: true },
      first_name: { type: types.TEXT, not_null: true },
      birth: { type: types.TEXT, not_null: true },
      birth_place: { type: types.TEXT, not_null: true },
      sexe: { type: types.INTEGER, not_null: true },
      parent_link: { type: types.INTEGER, not_null: true },
      cin: { type: types.TEXT, not_null: true },
      cin_date: { type: types.TEXT, not_null: true },
      cin_place: { type: types.TEXT, not_null: true },
      father: { type: types.TEXT, not_null: true },
      mother: { type: types.TEXT, not_null: true },
      father_status: { type: types.INTEGER, not_null: true },
      mother_status: { type: types.INTEGER, not_null: true },
      phone: { type: types.TEXT, not_null: true },
      nationality_id: { type: types.INTEGER, not_null: true },
      job: { type: types.TEXT, not_null: true },
      observation: { type: types.TEXT, not_null: true },
      id_photo: { type: types.TEXT },
      househould_id: { type: types.INTEGER, not_null: true },
    }
  }
}