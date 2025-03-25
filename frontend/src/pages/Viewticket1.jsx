import React, { useEffect, useState } from "react";

const Viewticket1 = () => {
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    // Retrieve ticket details from localStorage
    const savedTicket = JSON.parse(localStorage.getItem("ticketDetails"));

    if (savedTicket) {
      setTicket(savedTicket);
    } else {
      alert("No valid ticket found. Please book again.");
    }
  }, []);

  if (!ticket) return <p className="text-center mt-10 text-gray-600">Loading bus pass...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Bus Pass</h2>

        <div className="border p-4 rounded-lg shadow-md">
          <p className="text-lg"><strong>Name:</strong> {ticket.name}</p>
          <p className="text-lg"><strong>Branch:</strong> {ticket.branch}</p>
          <p className="text-lg"><strong>Semester:</strong> {ticket.semester}</p>
          <p className="text-lg"><strong>Bus:</strong> {ticket.bus}</p>
          <p className="text-lg"><strong>Date:</strong> {ticket.date}</p>
          <p className="text-lg"><strong>Mobile:</strong> {ticket.phone}</p>
        </div>

        <p className="mt-4 text-green-600 font-bold">Pass Generated Successfully!</p>
      </div>
    </div>
  );
};

export default Viewticket1;
