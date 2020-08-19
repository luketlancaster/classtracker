import React from 'react';

import calRequests from '../../../helpers/data/calRequests';

class CreateRecording extends React.Component {
  state = {
    showForm: false,
    recordingName: '',
    recordingUrl: '',
    recordingPassword: '',
  }

  nameChange = (e) => {
    e.preventDefault();
    this.setState({ recordingName: e.target.value });
  }

  urlChange = (e) => {
    e.preventDefault();
    this.setState({ recordingUrl: e.target.value });
  }

  passChange = (e) => {
    e.preventDefault();
    this.setState({ recordingPassword: e.target.value });
  }

  addRecording = (e) => {
    e.preventDefault();
    const { event } = this.props;
    const { recordingName, recordingUrl, recordingPassword } = this.state;
    const recordings = [{
      link: recordingUrl,
      password: recordingPassword,
      topic: recordingName,
    }];
    event.recordings = recordings;

    calRequests.updateCalEvent(event)
      .then(() => this.setState({ showForm: false }))
      .catch(err => console.error('update cal event failed', err));
  }

  gimmieForm = () => {
    const { recordingName, recordingUrl, recordingPassword } = this.state;

    return (
      <form className="rounded p-3 bg-secondary text-white">
        <div className="text-right">
          <button className="btn btn-danger" onClick={() => { this.setState({ showForm: false }); }}><i className="fas fa-times"></i></button>
        </div>
        <div className="form-group text-left">
          <label htmlFor="recordingName">Recording Name</label>
          <input
            type="text"
            className="form-control"
            id="recordingName"
            placeholder="Recording Name"
            value={recordingName}
            onChange={this.nameChange}
          />
        </div>
        <div className="form-group text-left">
          <label htmlFor="recordingUrl">URL</label>
          <input
            type="text"
            className="form-control"
            id="recordingUrl"
            placeholder="URL"
            value={recordingUrl}
            onChange={this.urlChange}
          />
        </div>
        <div className="form-group text-left">
          <label htmlFor="recordingPassword">Password</label>
          <input
            type="text"
            className="form-control"
            id="recordingPassword"
            placeholder="Password"
            value={recordingPassword}
            onChange={this.passChange}
          />
        </div>
        <button className="btn btn-success border-0" onClick={this.addRecording}>Submit</button>
        </form>
    );
  }

  render() {
    const { showForm } = this.state;

    return (
      <div>
        {showForm
          ? this.gimmieForm()
          : <button className="btn btn-secondary" onClick={() => { this.setState({ showForm: true }); }}>Add recording</button>
        }
      </div>
    );
  }
}

export default CreateRecording;
