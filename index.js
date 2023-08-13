const express = require("express");
const server = express();

const PORT =3500;
server.use(express.json());

let rooms = [];
let bookings = [];

server.get("/", async (req, res) => {
  res.send("Welcome to Hall-Booking API");
  console.log("request Hit");
});
//1.Creating the Room
server.post("/rooms", (req, res) => {
  const { room_id, seats_available, amenities, price_per_hour } = req.body;
  const room = {
    room_id,
    seats_available,
    amenities,
    price_per_hour,
  };
  rooms.push(room);
  res.status(200);

  res.json({
    room_id: room.room_id,
    message: "Room created successfully",
  });
  console.log(rooms);
});
//2. Booking a Room

server.post("/bookings", (req, res) => {
  const { booking_id, customer_name, date, start_time, end_time, room_id } =
    req.body;
  console.log("Requested room_id", room_id);

  const room = rooms.find((room) => room, room_id === String(room_id));
  console.log("found room", room);
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }
  const booking = {
    booking_id,
    customer_name,
    date,
    start_time,
    end_time,
    room_id,
  };
  bookings.push(booking);
  res.status(201).json({
    booking_id: booking.booking_id,
    message: "Room booked successfully",
  });
});

// 3. List all Rooms with Booked Data
server.get("/rooms/booked", (req, res) => {
  const roomWithBookings = rooms.map((room) => {
    const bookedData = bookings.find((booking) => booking.id === room.room_id);
    return {
      room_name: room.room_id,
      booked_status: !!bookedData,
      customer_name: bookedData?.customer_name || null,
      date: bookedData?.date || null,
      start_time: bookedData?.start_time || null,
      end_time: bookedData?.end_time || null,
    };
  });
  res.json({
    rooms: roomWithBookings,
  });
});

// 4. List all Customers with Booked Data

server.get("/customers/booked", (req, res) => {
  const customerWithBookings = bookings.map((booking) => {
    const room = rooms.find((room) => room.room_id === booking.room_id);

    return {
      customer_name: booking.customer_name,
      room_name: room.room_id,
      date: booking.date,
      start_time: booking.start_time,
      end_time: booking.end_time,
    };
  });
  res.json({
    customers: customerWithBookings,
  });
});

// 5. List Booking Details for a Customer

server.get("/customers/:customer_name/bookings", (req, res) => {
  const { customer_name } = req.params;
  const customerBookings = bookings.filter(
    (booking) => booking.customer_name === customer_name
  );
  res.json({ bookings: customerBookings });
});

server.listen(PORT,"0.0.0.0" , (err) => {
  if (err) {
    console.log(`Error in Running the port:${PORT}`);
  } else {
    console.log(`port:${PORT} is Running`);
  }
});
