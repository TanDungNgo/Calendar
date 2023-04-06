import { useEffect, useRef } from "react";
import { useState } from "react";
import AddEvent from "./AddEvent";
import axios from "axios";
import moment from "moment";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";

const Calendar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);

  const onOpenAddEvent = () => {
    setModalOpen(true);
  };
  const onEventAdd = (event) => {
    let calendarApi = calendarRef.current.getApi();
    calendarApi.addEvent({
      start: moment(event.start).toDate(),
      end: moment(event.end).toDate(),
      title: event.title,
    });
  };
  const handleEventAdd = async (data) => {
    console.log(data.event);
    await axios.post("/api/calendar/create-event", data.event);
  };
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/api/calendar/get-events");
      setEvents(res.data);
    };
    fetchData();
  }, [events]);

  const handleDateClick = () => {
    setModalOpen(true);
  };

  const handleEventClick = (selected) => {
    console.log(selected.event.extendedProps._id);
    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}'`
      )
    ) {
      fetch("/api/calendar/delete-event/" + selected.event.extendedProps._id, {
        method: "DELETE",
      }).then(() => {
        selected.event.remove();
      });
    }
  };
  return (
    <section>
      <Box m="20px">
        <Box display="flex" justifyContent="space-between">
          <Box
            flex="1 1 20%"
            backgroundColor="#2C3E50"
            p="15px"
            borderRadius="4px"
          >
            <Typography variant="h5" style={{ color: "#fff" }}>
              Events
            </Typography>
            <List>
              {events.map((event) => (
                <ListItem
                  key={event.id}
                  sx={{
                    color: "#fff",
                    backgroundColor: "#1c7cdc",
                    margin: "10px 0",
                    borderRadius: "2px",
                    height: "40px",
                  }}
                >
                  <ListItemText
                    primary={event.title}
                    style={{ fontSize: "10px" }}
                    secondary={
                      <Typography style={{ fontSize: "10px" }}>
                        {formatDate(event.start, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          <Box flex="1 1 100%" ml="15px">
            <button
              style={{
                backgroundColor: "#2C3E50",
                color: "#fff",
                padding: "10px 20px",
                fontWeight: 600,
                borderRadius: "5px",
                marginBottom: "5px",
                cursor: "pointer",
              }}
              onClick={onOpenAddEvent}
            >
              Add Event
            </button>
            <div style={{ position: "relative", zIndex: 0 }}>
              <FullCalendar
                height="75vh"
                ref={calendarRef}
                events={events}
                initialView="dayGridMonth"
                eventAdd={(event) => handleEventAdd(event)}
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                  listPlugin,
                ]}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                }}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                eventClick={handleEventClick}
                select={handleDateClick}
              />
            </div>
          </Box>
        </Box>
      </Box>
      <AddEvent
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onEventAdd={(event) => onEventAdd(event)}
      />
    </section>
  );
};

export default Calendar;
