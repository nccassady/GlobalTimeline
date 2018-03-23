import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Col, Row, Panel, Navbar, Nav, NavItem } from 'react-bootstrap';
import './App.css';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker.css';

class GlobalTimelineApp extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            center: [35.585,-77.370],
            bounds: [],
            searchDate: moment(),
            markers: []
        };
    };

    updateMarkers = (bounds) => {
        var boundsArray = [
                [bounds.getNorthWest().lat, bounds.getNorthWest().lng],
                [bounds.getSouthEast().lat, bounds.getSouthEast().lng],
        ];

        this.setState(bounds: boundsArray);

        this.getNewMarkers(boundsArray, this.state.searchDate);
    };

    getNewMarkers = (bounds, date) => {
        var u = new URLSearchParams();
        u.append('bounds', bounds);
        u.append('date', date.format('YYYY-MM-DD'));

        var myRequest = new Request('http://127.0.0.1:3030/search?' + u);
        console.log(myRequest);
        fetch(
            myRequest,
            { mode: 'cors'})
        .then(function(response) {
            return response.json().then(function (json) {
                this.setState({
                    markers: json
                })
            }.bind(this))
        }.bind(this));
    };

    newDate = (date) => {
        this.setState({
            searchDate: date
        });

        this.getNewMarkers(this.state.bounds, date);
    };

    render() {
        return (<div className="GlobalTimeline">
                    <Navbar>
                      <Navbar.Header>
                        <Navbar.Brand>
                          <a href="#home">React-Bootstrap</a>
                        </Navbar.Brand>
                      </Navbar.Header>
                      <Nav>
                        <NavItem eventKey={1} href="https://nccassady.com">About me</NavItem>
                      </Nav>
                    </Navbar>
                    <Row className="GlobalTimeline-body">
                        <Col md={8}>
                            <GlobalTimelineMap center={this.state.center} mapMoved={this.updateMarkers} markers={this.state.markers}/>
                        </Col>
                        <Col md={4}>
                            <DatePicker
                                ref="datePicker"
                                selected={this.state.searchDate}
                                onChange={this.newDate}
                                autofocus
                                shouldCloseOnSelect={false}
                                fixedHeight
                                showMonthDropdown
                                showYearDropdown
                                scrollableYearDropdown />
                        </Col>
                    </Row>
                    <Row className="GlobalTimeline-info">
                        <Col md={4} className={'offset-1'}>
                          <Panel bsStyle="primary">
                            <Panel.Heading>Welcome to Global Timeline!</Panel.Heading>
                            <Panel.Body>Here you can find history's strangest coincidences. Simply pan across the map and select different dates above and markers will appear showing where in the world something happened on the day you chose!</Panel.Body>
                          </Panel>
                        </Col>
                    </Row>
                </div>);
    };
}

class GlobalTimelineMap extends React.Component{
    updateBounds = () => {
        this.props.mapMoved(this.refs.map.leafletElement.getBounds())
    };

    render() {
        var markers = this.props.markers.map((marker) => {
            return <Marker key={marker._id} position={[marker.latitude, marker.longitude]}>
                    <Popup>
                        <span>
                            {marker.name ? ( <p><b>{marker.name}</b> {marker.description}</p> ) : (<p>{marker.description}</p>)}
                        </span>
                    </Popup>
            </Marker>
        });
        return <Map ref="map" center={this.props.center} zoom={9} onMoveend={this.updateBounds}>
                    <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' />
                    {markers}
                </Map>
    };
}

ReactDOM.render(<GlobalTimelineApp />, document.getElementById('container'));
registerServiceWorker();
