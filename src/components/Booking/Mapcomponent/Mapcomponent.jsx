import React, { Component } from 'react';
import "./style.css";
import Map from "../../../assets/images/map.png"
class Mapcomponent extends Component {
    render() {
        return (
            <div style={{ width: "100%", display: "flex" }}>
                <div className="card-main">
                    <div className="content-header">
                        {/* <div className="title-main">
                            <Typography className='card-title' variant='h5'> Google Map</Typography>
                        </div> */}
                    </div>
                    <div className="map-main" style={{ marginTop: "20px" }}>
                        <img src={Map} alt="Google Map" />
                    </div>
                </div>
            </div>
        );
    }
}

export default Mapcomponent;