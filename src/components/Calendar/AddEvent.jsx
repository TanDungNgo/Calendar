import { useState } from "react";
import Modal from "react-modal";
import Datetime from "react-datetime";

function AddEvent({ isOpen, onClose, onEventAdd }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const onSubmit = (e) => {
    e.preventDefault();
    if (title == "") {
      alert("Please enter a new title for your event");
      return false;
    }
    onEventAdd({ title, start, end });
    setTitle("");
    setStart(new Date());
    setEnd(new Date());
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3>Create Event </h3>
        <input
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
        <div>
          <label>Start</label>
          <Datetime value={start} onChange={(date) => setStart(date)} />
        </div>
        <div>
          <label>End</label>
          <Datetime value={end} onChange={(date) => setEnd(date)} />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "rgb(44, 62, 80)",
            padding: "7px",
            width: "320px",
            color: "#fff",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
          Add
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{
            backgroundColor: "rgb(44, 62, 80)",
            padding: "7px",
            width: "320px",
            color: "#fff",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </form>
    </Modal>
  );
}

export default AddEvent;
