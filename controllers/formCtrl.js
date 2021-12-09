const Forms = require('../models/formModel');

const formCtrl = {
  getFormDatas: async (req, res) => {
    try {
      const formData = await Forms.find({ user_id: req.user.id });
      res.json(formData);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createFormData: async (req, res) => {
    try {
      const { 
        no_of_push_ups, had_long_walk, great_thing_today, 
        day_type, date
      } = req.body;
      const newFormData = new Forms({
        no_of_push_ups,
        had_long_walk,
        great_thing_today,
        day_type,
        date,
        user_id: req.user.id,
        name: req.user.name
      });
      await newFormData.save();
      res.json(newFormData);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
      
    }
  },
  getFormData: async (req, res) => {
    try {
      const form = await Forms.findById(req.params.id);
      res.json(form)

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateFormData: async (req, res) => {
    try {
      const { no_of_push_ups, had_long_walk, great_thing_today, 
        day_type, date } = req.body;
      await Forms.findOneAndUpdate(
        { _id: req.params.id },
        {
          no_of_push_ups, had_long_walk, great_thing_today, 
        day_type, date,
        }
      );
      res.json({ msg: "Updated Form Data" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteFormData: async (req, res) => {
    try {
      await Forms.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted Form Data" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },


};

module.exports = formCtrl;