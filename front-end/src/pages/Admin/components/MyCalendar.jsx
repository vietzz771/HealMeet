import Calendar from 'react-calendar';
// import './Calendar.css';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
function MyCalendar({ date, setDate }) {
  const currentDate = moment().toDate();
  const minDate = currentDate;

  return (
    <div className="calendar-container">
      <Calendar onChange={setDate} value={date} minDate={minDate} />
    </div>
  );
}

export default MyCalendar;
