import { Schema, model } from "mongoose";

let schema = new Schema({
  user: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
  }
})

export default model('user', schema, 'user')
