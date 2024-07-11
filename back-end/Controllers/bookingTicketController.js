import BookingTicket from "../models/BookingTicketSchema.js";
export const getBookings = async (req, res) => {
  try {
    const bookings = await BookingTicket.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Successfully retrieved bookings",
      data: bookings,
    });
  } catch (error) {
    console.error("Get Bookings Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings",
    });
  }
};
export const createBooking = async (req, res) => {
  try {
    const { name, email, phone, date, message } = req.body;

    // Chuyển  string thành đối tượng Date
    const selectedDate = new Date(date);
    selectedDate.setUTCHours(0, 0, 0, 0); // Set giờ, phút, giây, mili giây về 0 để so sánh ngày

    // Tìm vé đặt cuối cùng cho cùng ngày
    const lastBookingWithSameDate = await BookingTicket.findOne({
      date: selectedDate,
    }).sort({ ticketNumber: -1 }); // Sắp xếp theo ticketNumber giảm dần để lấy vé đặt cuối cùng

    let ticketNumber = 1; // Số thứ tự mặc định cho ngày được chọn

    if (lastBookingWithSameDate) {
      // Nếu tìm thấy vé đặt cho cùng ngày, tăng ticketNumber lên 1
      ticketNumber = lastBookingWithSameDate.ticketNumber + 1;
    }

    // Tạo vé đặt mới
    const newBooking = new BookingTicket({
      name,
      email,
      phone,
      date: selectedDate,
      message,
      ticketNumber,
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Đặt vé thành công",
      data: newBooking,
    });
  } catch (error) {
    console.error("Lỗi khi đặt vé:", error);
    res.status(500).json({
      success: false,
      message: "Đặt vé thất bại",
    });
  }
};

// export const updateBooking = async (req, res) => {
//   const id = req.params.id;

//   try {
//     const updatedBooking = await BookingTicket.findByIdAndUpdate(
//       id,
//       { $set: req.body },
//       { new: true }
//     );

//     if (!updatedBooking) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Booking successfully updated",
//       data: updatedBooking,
//     });
//   } catch (error) {
//     console.error("Update Booking Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update booking",
//     });
//   }
// };
export const deleteBooking = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedBooking = await BookingTicket.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking successfully deleted",
    });
  } catch (error) {
    console.error("Delete Booking Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete booking",
    });
  }
};
