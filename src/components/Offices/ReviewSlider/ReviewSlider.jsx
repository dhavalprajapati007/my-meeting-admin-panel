import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {Typography } from '@mui/material';
import Slider from "react-slick";
import UserImage from "../../../assets/images/user.jpg"

let settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
};

class ReviewSlider extends Component {
    render() {
        return (
            <div className="card-main" style={{ width: "100%" }}>
                <div className="content-header">
                    <div className="inner-card-title">
                        <Typography className='card-title' variant='h5'>Reviews</Typography>
                    </div>
                </div>
                <div className="review-slider-main">
                    <Slider {...settings} >
                        <div className="wdt">
                            <div className="user-image">
                                <div className="avatar-main">
                                    <img src={UserImage} alt="userImage" />
                                </div>
                                <div className="user-name" style={{ marginTop: "20px" }}>
                                    <Typography variant='p' className='small-text-color'>
                                        Amanda Jackson
                                    </Typography>
                                </div>
                                <div className="user-name" style={{ marginTop: "5px" }}>
                                    <Typography variant='p' className='small-text-color'>
                                        CEO, R&D Group
                                    </Typography>
                                </div>
                                <div className="user-comment" style={{ marginTop: "20px" }}>
                                    <Typography variant='p' className='small-text'>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius alias nihil quia asperiores quae id ab, pariatur explicabo maxime expedita sint rerum accusamus consectetur cum aspernatur, ut corrupti voluptatibus optio!
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius alias nihil quia asperiores quae id ab, pariatur explicabo maxime expedita sint rerum accusamus consectetur cum aspernatur, ut corrupti voluptatibus optio!
                                    </Typography>
                                </div>
                            </div>
                        </div>
                        <div className="wdt">
                            <div className="user-image">
                                <div className="avatar-main">
                                    <img src={UserImage} alt="userImage" />
                                </div>
                                <div className="user-name" style={{ marginTop: "20px" }}>
                                    <Typography variant='p' className='small-text-color'>
                                        Amanda Jackson
                                    </Typography>
                                </div>
                                <div className="user-name" style={{ marginTop: "5px" }}>
                                    <Typography variant='p' className='small-text-color'>
                                        CEO, R&D Group
                                    </Typography>
                                </div>
                                <div className="user-comment" style={{ marginTop: "20px" }}>
                                    <Typography variant='p' className='small-text'>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius alias nihil quia asperiores quae id ab, pariatur explicabo maxime expedita sint rerum accusamus consectetur cum aspernatur, ut corrupti voluptatibus optio!
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius alias nihil quia asperiores quae id ab, pariatur explicabo maxime expedita sint rerum accusamus consectetur cum aspernatur, ut corrupti voluptatibus optio!
                                    </Typography>
                                </div>
                            </div>
                        </div>
                        <div className="wdt">
                            <div className="user-image">
                                <div className="avatar-main">
                                    <img src={UserImage} alt="userImage" />
                                </div>
                                <div className="user-name" style={{ marginTop: "20px" }}>
                                    <Typography variant='p' className='small-text-color'>
                                        Amanda Jackson
                                    </Typography>
                                </div>
                                <div className="user-name" style={{ marginTop: "5px" }}>
                                    <Typography variant='p' className='small-text-color'>
                                        CEO, R&D Group
                                    </Typography>
                                </div>
                                <div className="user-comment" style={{ marginTop: "20px" }}>
                                    <Typography variant='p' className='small-text'>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius alias nihil quia asperiores quae id ab, pariatur explicabo maxime expedita sint rerum accusamus consectetur cum aspernatur, ut corrupti voluptatibus optio!
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius alias nihil quia asperiores quae id ab, pariatur explicabo maxime expedita sint rerum accusamus consectetur cum aspernatur, ut corrupti voluptatibus optio!
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </Slider>
                </div>
            </div>
        )
    }
}

export default withRouter(ReviewSlider)
