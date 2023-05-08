const express = require("express");
const router = express.Router();
const Response = require("../models/response");
const Form = require("../models/form");
const Subject = require("../models/subject");

// Getting All
router.get("/", async (req, res) => {
  try {
    const responses = await Response.find();
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get for a particular form
router.get("/form/:form", async (req, res) => {
  try {
    const responses = await Response.find({ form: req.params.form });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/form/:form/student/:student", async (req, res) => {
  try {
    const responses = await Response.find({
      form: req.params.form,
      student: req.params.student,
    });
    res.json(responses[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Allocation Business Logic
router.get("/allocate/:form", async (req, res) => {
  let responses = await Response.find({
    form: req.params.form,
  }).sort({ createdAt: "asc" });

  let form = await Form.findById(req.params.form);
  let courses = await Subject.find({
    elective: form.elective,
    department: JSON.parse(form.batch).department,
  });

  courses = courses.map((course) => course.code);

  console.log("Courses:", courses);
  console.log("Responses: ", responses);

  // Set min and max capacity to form classes
  const MIN_CAP = 2;
  const MAX_CAP = 3;
  const n = responses.length;

  // Finding courses less than MIN_CAP
  let count = {};

  courses.map((course) => {
    count[course] = 0;
  });

  for (let i = 0; i < n; i++) {
    if (count[responses[i].priority1] < MAX_CAP) {
      count[responses[i].priority1] += 1;
      continue;
    }
    if (count[responses[i].priority2] < MAX_CAP) {
      count[responses[i].priority2] += 1;
      continue;
    }
    if (count[responses[i].priority3] < MAX_CAP) {
      count[responses[i].priority3] += 1;
      continue;
    }
  }

  console.log("Count: ", count);

  courses = courses.filter((course) => {
    return count[course] >= MIN_CAP;
  });

  console.log("Courses after filtering: ", courses);

  count = {};

  for (let i = 0; i < courses.length; i++) {
    count[courses[i]] = 0;
  }

  console.log("Count after clearing: ", count);

  for (let i = 0; i < n; i++) {
    let priority1 = responses[i].priority1;
    let priority2 = responses[i].priority2;
    let priority3 = responses[i].priority3;

    if (courses.indexOf(priority1) !== -1 && count[priority1] < MAX_CAP) {
      count[priority1]++;
      responses[i].allocated = priority1;
      if (count[priority1] === MAX_CAP)
        courses = courses.filter((course) => {
          return course !== priority1;
        });
      continue;
    }
    if (courses.indexOf(priority2) !== -1 && count[priority2] < MAX_CAP) {
      count[priority2]++;
      responses[i].allocated = priority2;
      if (count[priority2] === MAX_CAP)
        courses = courses.filter((course) => {
          return course !== priority2;
        });
      continue;
    }
    if (courses.indexOf(priority3) !== -1 && count[priority3] < MAX_CAP) {
      count[priority3]++;
      responses[i].allocated = priority3;
      if (count[priority3] === MAX_CAP)
        courses = courses.filter((course) => {
          return course !== priority3;
        });
      continue;
    }
    console.log("Allocating:", responses.allocated);
  }

  console.log("Responses after allocating: ", responses);

  if (courses.length !== 0) {
    for (let i = 0; i < n; i++) {
      console.log(responses[i].get("allocated", ""));
      if (!"allocated" in responses[i] || responses[i].allocated === "") {
        first = courses[0];
        count[first]++;
        responses[i].allocated = first;
        if (count[first] === MAX_CAP)
          courses = courses.filter((course) => {
            return course !== first;
          });
        console.log(courses);
      }
    }
  }

  console.log("Responses after allocating: ", responses);

  form.allocated = "true";
  form.save();
  responses.map((res) => res.save());

  res.json(responses);
});

// Getting One
router.get("/:id", getResponse, (req, res) => {
  res.json(res.response);
});

// Creating One
router.post("/", async (req, res) => {
  const response = new Response({
    student: req.body.student,
    form: req.body.form,
    priority1: req.body.priority1,
    priority2: req.body.priority2,
    priority3: req.body.priority3,
    allocated: "",
    created: Date.now(),
  });
  try {
    const newResponse = await response.save();
    res.status(201).json(newResponse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating One
router.patch("/:id", getResponse, async (req, res) => {
  if (req.body.student != null) {
    res.response.student = req.body.student;
  }
  if (req.body.form != null) {
    res.response.form = req.body.form;
  }
  if (req.body.priority1 != null) {
    res.response.priority1 = req.body.priority1;
  }
  if (req.body.priority2 != null) {
    res.response.priority2 = req.body.priority2;
  }
  if (req.body.priority3 != null) {
    res.response.priority3 = req.body.priority3;
  }

  try {
    const updatedResponse = await res.response.save();
    console.log(updatedResponse);
    res.json(updatedResponse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting One
router.delete("/:id", getResponse, async (req, res) => {
  try {
    await res.response.remove();
    res.json({ message: "Deleted Response" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Custom Middleware
async function getResponse(req, res, next) {
  let response;
  try {
    response = await Response.findById(req.params.id);
    if (response == null)
      return res.status(404).json({ message: "Cannot find form" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.response = response;
  next();
}

module.exports = router;
