import mongoose from 'mongoose'

const ringtoneSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Ringtone name is required'
  },
  sections: {
    type: [sectionSchema],
    required: 'Ringtone content is required'
  },
})

const sectionSchema = new mongoose.Schema({
  notes: {
    type: [{pitch: Number, duration: Number}]
  }
});