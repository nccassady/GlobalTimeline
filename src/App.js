import React, { Component } from 'react';
import './App.css';
import L from 'leaflet';

class GlobalTimeline extends Component {
  function GlobalTimelineMap() {

  }
  render() {
    return (
      <div className="GlobalTimeline">
        <div className="GlobalTimeline-header">
          <h2>Welcome to the Global Timeline</h2>
        </div>
        <GlobalTimelineMap />
        <div className="GlobalTimeline-list"></div>
      </div>
    );
  }
}

export default GlobalTimeline;
