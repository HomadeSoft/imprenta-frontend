import React from "react";

const Legend = ({ message, setMessage }) => {
  if (!message) {
    return null
  }

  return (
    <div
      style={{
        display: "flex", flexDirection: 'row', justifyContent: 'space-around',
        alignItems: 'center', padding: 20,
        borderRadius: 10,
        backgroundColor: "#000000", color: "white",
        cursor: 'pointer'
      }}
      onClick={() => setMessage(null)}
    >
      <div>{message}</div>
    </div>
  )
};

export default Legend