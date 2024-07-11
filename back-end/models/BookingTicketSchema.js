import mongoose from "mongoose";

const bookingTicketSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    message: {
      type: String,
    },
    ticketNumber: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Tạo chỉ mục độc nhất cho cặp trường date và ticketNumber
bookingTicketSchema.index({ date: 1, ticketNumber: 1 }, { unique: true });

export default mongoose.model("BookingTicket", bookingTicketSchema);
