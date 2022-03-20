import mongoose from 'mongoose'
import User from '../../src/models/user.js'

//Create Default Admin
const addDefaultAdmin = async () => {
let db = mongoose.connection
const usersCount = await User.find({}).count()
  if (usersCount === 0) {
    let defaultAdmin = {
        name: "Dynamic Admin",
        email: "admin@dynamic.am",
        password: "Dynamic22",
        role: 'admin'
      }
    User.create(defaultAdmin, (e) => {
    if (e) {
        throw e
    }
})
}
}

export default addDefaultAdmin;