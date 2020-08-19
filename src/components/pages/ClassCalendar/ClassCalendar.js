import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import CreateRecording from '../../components/CreateRecording/CreateRecording';

import calRequests from '../../../helpers/data/calRequests';

import './ClassCalendar.scss';

const localizer = momentLocalizer(moment);

class ClassCalendar extends React.Component {
  state = {
    events: [],
    selectedEvents: [],
  };

  componentDidMount() {
    calRequests
      .getCalEventsRequest()
      .then((events) => {
        const newEvents = [];
        events.forEach((event) => {
          const newEvent = {
            description: event.description,
            eventType: event.eventType,
            githubRepo: event.githubRepo,
            hwUrl: event.hwUrl,
            id: event.id,
            instructor: event.instructor,
            resourceUrl: event.resourceUrl,
            title: event.title,
            recordings: event.recordings || '',
          };
          newEvent.start = new Date(event.start);
          newEvent.end = new Date(event.end);
          newEvents.push(newEvent);
        });
        this.setState({ events: newEvents });
      })
      .catch(err => console.error('error with get events request', err));
  }

  eventStyleGetter = (event) => {
    let backgroundColor = '';

    switch (event.eventType) {
      case 'vacation':
        backgroundColor = '#dc3545';
        break;
      case 'demo':
        backgroundColor = '#6f42c1';
        break;
      case 'lecture':
        backgroundColor = '#007bff';
        break;
      case 'study':
        backgroundColor = '#28a745';
        break;
      default:
        backgroundColor = '#6c757d';
    }

    const style = {
      backgroundColor,
      borderRadius: '10px',
      border: '1px solid black',
      opacity: 0.8,
      color: 'black',
      display: 'block',
    };
    return { style };
  };

  selectDate = (slotInfo) => {
    const startDate = new Date(slotInfo.start);
    const endDate = new Date(slotInfo.start);
    startDate.setHours(0, 0, 0);
    endDate.setHours(23, 59, 0);
    const events = this.state.events.filter((event) => {
      const eventStartTime = event.start.getTime();
      const eventEndTime = event.end.getTime();
      return (
        (startDate.getTime() > eventStartTime && startDate.getTime() < eventEndTime)
        || (endDate.getTime() > eventStartTime && endDate.getTime() < eventEndTime)
        || (eventStartTime >= startDate.getTime() && eventStartTime <= endDate.getTime())
      );
    });
    this.setState({ selectedEvents: events });
  };

  getRecordingBtn = event => ((this.props.admin && event.eventType === 'lecture') ? <CreateRecording event={event} /> : '');

  render() {
    const minTime = new Date();
    const maxTime = new Date();
    minTime.setHours(9, 0, 0);
    maxTime.setHours(22, 0, 0);

    const displaySelectedEvents = this.state.selectedEvents.map((event) => {
      let backgroundClass = '';
      switch (event.eventType) {
        case 'vacation':
          backgroundClass = 'danger';
          break;
        case 'demo':
          backgroundClass = 'purple';
          break;
        case 'lecture':
          backgroundClass = 'primary';
          break;
        case 'study':
          backgroundClass = 'success';
          break;
        default:
          backgroundClass = 'secondary';
      }

      return (
        <div key={event.id} className="event col-md-4">
          <div className={`card col-xs-4 border border-${backgroundClass}`}>
            <div className={`card-header bg-${backgroundClass}`}>
              {event.title}
            </div>
            <div className="card-body">
              {event.instructor.length > 0 ? (
                <div>
                  <strong>Instructor:</strong> {event.instructor}
                </div>
              ) : (
                ''
              )}
              <div>
                <strong>Description:</strong> {event.description}
              </div>
              {event.resourceUrl.length > 0 ? (
                <div>
                  Resource{' '}
                  <a href={event.resourceUrl} target="_blank" rel="noopener noreferrer">
                    Here
                  </a>
                </div>
              ) : (
                ''
              )}
              {event.githubRepo.length > 0 ? (
                <div>
                  Github{' '}
                  <a href={event.githubRepo} target="_blank" rel="noopener noreferrer">
                    Here
                  </a>
                </div>
              ) : (
                ''
              )}
              {event.hwUrl.length > 0 ? (
                <div>
                  HW{' '}
                  <a href={event.hwUrl} target="_blank" rel="noopener noreferrer">
                    Here
                  </a>
                </div>
              ) : (
                ''
              )}
              {event.recordings && event.recordings.length > 0 ? (
                <div className="recordings">
                  <strong>Recording(s):</strong>
                    {event.recordings.map((r, i) => (
                      <span key={Date.now()}>
                        <a key={`recording${i}`} href={r.link} className="btn btn-outline-dark col-md-6" target="_blank" rel="noopener noreferrer">
                          {r.topic}
                        </a>
                        {(r.password) ? <p className=""><b>Password:</b> {r.password}</p> : ''}
                      </span>
                    ))}
                </div>
              ) : (
                this.getRecordingBtn(event)
              )}
            </div>
          </div>
        </div>
      );
    });
    return (
      <div className="ClassCalendar">
        <h1>Course Calendar</h1>
        <div className="cal-holder">
          <Calendar
            localizer={localizer}
            selectable={'ignoreEvents'}
            events={this.state.events}
            step={60}
            defaultView="week"
            views={['week']}
            min = {minTime}
            max = {maxTime}
            eventPropGetter={this.eventStyleGetter}
            onSelectEvent={this.selectDate}
          />
        </div>
        <div className="d-flex flex-wrap">{displaySelectedEvents}</div>
      </div>
    );
  }
}

export default ClassCalendar;
