import { Model, Schema, model } from "mongoose";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minLength: [3, "Title must be at least 3 character"],
      minLength: [20, "Title should be less than 20 character"],
      trim: true,
    },
    descsription: {
      type: String,
      required: [true, "Description is required"],
      minLength: [8, "Description must be at least 8 character"],
      minLength: [150, "Description should be less than 150 character"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    thumbnail: {
      public_id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
    lectures: [
      {
        title: String,
        descsription: String,
        lecture: {
          public_id: {
            type: String,
            required: true,
          },
          secure_url: {
            type: String,
            required: true,
          },
        },
      },
    ],
    numberOfLectures: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      required: [true, "Author name is required"],
    },
  },
  { timestamps: true }
);

const Course = new model("Course", courseSchema);

export default Course;
