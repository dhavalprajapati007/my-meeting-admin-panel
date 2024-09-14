import React, { Component } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./style.css"
import { Typography } from '@mui/material';

class BookingCabinSlider extends Component {
    render() {
        var settings = {
            dots: true,
            arrows: false,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,

        };
        const { data } = this.props;
        return (
            <div 
                style={{ 
                    width: "100%", 
                    display: "flex" 
                }}
            >
                <div 
                    style={{ 
                        marginTop: "10px",
                        marginBottom: "40px",
                        width: "100%" 
                    }}
                >
                    <div>
                        <div class='container cabin-container'>
                            <div 
                                className="row title"
                                style={{ 
                                    marginBottom: "20px" 
                                }}
                            >
                                <div className="content-header">
                                    <div className="inner-card-title">
                                        <Typography 
                                            className='card-title' 
                                            variant='h5'
                                        >
                                            Cabin Images
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Slider {...settings} >
                            {data?.length > 0 && data?.map((image) => (
                                <div className="wdt">
                                    <img 
                                        src={image ? image : ""} 
                                        className="img-cabin"
                                        alt="cabin-images" 
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}

export default BookingCabinSlider;