const express = require("express");
const router = express.Router();

const { readAssignments, writeAssignments } = require("../utils/fileHandler");
const sendEmail = require("../services/emailService");


// CREATE ASSIGNMENT
router.post("/", async (req, res) => {
  try {
    const { title, subject, deadline, email } = req.body;

    
    if (!title || !subject || !deadline || !email) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    
    const assignments = await readAssignments();

    
    const newAssignment = {
      id: Date.now(),
      title,
      subject,
      deadline,
      status: "pending",
      email
    };

    
    
    assignments.push(newAssignment);
    await writeAssignments(assignments);

    
        
    await sendEmail(
      email,
      "Assignment Created",
      `Your assignment "${title}" has been successfully created.`
    );


    res.status(201).json({
      message: "Assignment created successfully",
      assignment: newAssignment
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// GET ALL ASSIGNMENTS (with optional filtering)
router.get("/", async (req, res) => {
  try {
    let assignments = await readAssignments();

    const { status, subject } = req.query;

    // Filter by status
    if (status) {
      assignments = assignments.filter(
        assignment => assignment.status === status
      );
    }

    // Filter by subject
    if (subject) {
      assignments = assignments.filter(
        assignment => assignment.subject === subject
      );
    }

    res.json({
      total: assignments.length,
      assignments
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});



// MARK ASSIGNMENT AS COMPLETED
router.put("/:id", async (req, res) => {
  try {
    const assignments = await readAssignments();
    const id = parseInt(req.params.id);

    const assignment = assignments.find(a => a.id === id);

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found"
      });
    }

    assignment.status = "completed";

    await writeAssignments(assignments);

    await sendEmail(
      assignment.email,
      "Assignment Completed",
      `Your assignment "${assignment.title}" has been marked as completed.`
    );

    res.json({
      message: "Assignment marked as completed",
      assignment
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// DELETE ASSIGNMENT
router.delete("/:id", async (req, res) => {
  try {
    const assignments = await readAssignments();
    const id = parseInt(req.params.id);

    const assignmentExists = assignments.some(a => a.id === id);

    if (!assignmentExists) {
      return res.status(404).json({
        message: "Assignment not found"
      });
    }

    const updatedAssignments = assignments.filter(a => a.id !== id);

    await writeAssignments(updatedAssignments);

    res.json({
      message: "Assignment deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


// CHECK DEADLINES AND SEND REMINDERS
router.get("/check-deadlines", async (req, res) => {
  try {
    const assignments = await readAssignments();
    const now = new Date();

    const upcoming = assignments.filter(a => {
      const deadline = new Date(a.deadline);
      const diffHours = (deadline - now) / (1000 * 60 * 60);

      return diffHours > 0 && diffHours <= 24 && a.status === "pending";
    });

    

    if (upcoming.length === 0) {
      return res.json({
        remindersSent: 0,
        message: "No pending assignments due within the next 24 hours."
      });
    }

    
    
    for (const assignment of upcoming) {
      await sendEmail(
        assignment.email,
        "Assignment Deadline Reminder",
        `Reminder: Your ${assignment.subject} assignment "${assignment.title}" is due within 24 hours.`
      );
    }


    res.json({
      remindersSent: upcoming.length,
      message: "Reminder emails sent successfully."
    });


  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


module.exports = router;