import Contact from "../models/contactModel.js";

export const NewContact = async (req, res, next) => {
  try {
    const { fullName, email, sub, message } = req.body;
    if (!fullName || !email || !sub || !message) {
      const error = new Error("All fields required");
      error.statusCode = 400;
      return next(error);
    }

    const newContact = await Contact.create({
      fullName,
      email,
      sub,
      message,
    });

    console.log(newContact);

    
      res.status(201)
      .json({
        message:
          "Thanks for Contacting us.We Will Get Back to you in 24-48 Hours",
      });


  } catch (error) {
    next(error);
  }
};
