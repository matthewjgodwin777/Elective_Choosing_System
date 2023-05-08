const express = require("express");
const router = express.Router();
const Form = require("../models/form");
const StudentUser = require("../models/studentUser");
const Response = require("../models/response");

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    let forms = await Form.find();
    let student = await StudentUser.findById(id);
    forms = forms.filter(
      (form) => JSON.parse(form.batch)._id === student.batch
    );

    let responses = await Response.find({
      student: student._id.toString(),
    });


    // console.log("Student: ", student);
    // console.log("Forms: ", forms);
    // console.log("Responses: ", responses);
    // console.log("start: ", Date.parse(forms[0].startTime));
    // console.log("end  : ", Date.parse(forms[0].endTime));
    // console.log("now  : ", Date.now());
    // console.log(Date.parse(forms[0].startTime) < Date.now());
    // console.log(Date.parse(forms[0].endTime) > Date.now());

    let future = [];
    let past = [];
    let filled = [];

    future = forms.filter((form) => {
      return (
        Date.parse(form.startTime) < Date.now() &&
        Date.parse(form.endTime) > Date.now()
      );
    });

    past = forms.filter((form) => {
      return Date.parse(form.endTime) < Date.now();
    });

    if (responses.length !== 0) {
      filled = forms.filter((form) => {
        for (let i = 0; i < responses.length; i++) {
          if (form._id.toString() === responses[i].form) return true;
        }
        return false;
      });
      past = past.filter((form) => {
        for (let i = 0; i < filled.length; i++) {
          if (form === filled[i]) return false;
        }
        return true;
      });
      future = future.filter((form) => {
        for (let i = 0; i < filled.length; i++) {
          if (form === filled[i]) return false;
        }
        return true;
      });
    }

    res.json({ status: "ok", future: future, past: past, filled: filled });
  } catch (err) {
    res.status(404).json({ status: "error", message: err });
  }
});

module.exports = router;
