import React, { Component } from 'react';
import CabinSlider from "../CabinSlider/CabinSlider";
import Slider from "react-slick";
import Cabins from "../Cabins/Cabins";
import { Grid, Typography, Avatar, Autocomplete, TextField } from '@mui/material';
import "./style.css";
import { withRouter } from 'react-router-dom';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';
import { getAmenities } from '../../../services/amenityService';
import { toastAlert } from '../../../helpers/toastAlert';
import { connect } from 'react-redux';
import { editCabinDetails } from '../../../services/officeService';


class Slidercompo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id : "",
            data: [],
            amenityData : [],
            loading: true,
            error : [],
            modal : false,
            amenities : []
        }
    }

    getAllAmenities = async () => {
        try {
            let amenities = await getAmenities(this.props);
            // passed props to getAmenities function so it can redirect this props to clearCookie() function

            if (amenities && amenities?.statusCode == 200) {
                this.setState({
                    amenityData: amenities.data,
                    // loading: false
                })
            } else {
                // error
                console.log('error fetching languages : ', amenities, amenities.message);
                let message = amenities && amenities?.message !== undefined ? amenities.message : "Problem Fetching Records.";
                toastAlert(message, "error");
                this.setState({ loading: false });
            }
        } catch (error) {
            console.log('error catch block', error);
            toastAlert("Please check Internet Connection.", "error");
            this.setState({ loading: false });
        }
    }

    componentDidMount() {
        this.getAllAmenities();
        const { data } = this.props
        this.setState({
            data
        })
    }

    closeModal = () => {
        this.setState({
            modal: false,
            error : []
        })
    }

    handleDropDownChange = (event, val) => {
        this.setState({
            amenities: val,
        });
    }

    openModal = (idx) => {
        const { data } = this.props;
        let amenities = data[idx]?.amenities
        let cabinId = data[idx]?._id
        this.getAmenities(amenities);
        this.setState({
            modal : true,
            id : cabinId 
        })
    }

    getAmenities = (data) => {
        let amenityArr = [];
        data?.length && data?.map((amenity) => {
            this.state.amenityData.map((data) => {
                if (data?._id === amenity?._id) {
                    amenityArr.push(data);
                }
            });
        });
        this.setState({
            amenities: amenityArr,
        });
    }

    validateUpdateAmenities = async () => {
        let error = [];
        const { amenities, id } = this.state;
        if(!amenities?.length || !amenities) {
            error.push("amenityError");
        }
        if(error.length > 0) {
            this.setState({
                error,
            });
        } else {
            this.setState({
                error: [],
            });
            this.updateAmenities();
        }
    }

    updateAmenities = async() => {
        const { amenities, id } = this.state;
        try {
            const formData = new FormData();
            amenities?.length > 0 && amenities?.map((val) => formData.append('amenitieIds', val?._id));
            formData.append('id',id);
            let res = await editCabinDetails(formData, this.props);
            // passed formdata as payLoad to function
            
            if (res && res?.statusCode == 200) {
                toastAlert(
                    res?.message
                    ? res?.message
                    : "Cabin amenities updated successfully"
                    );
                    this.closeModal();
                    this?.props?.getOfficeData();
                } else {
                    // error
                    console.log("error updating cabin amenities : ", res, res.message);
                    let message =
                    res && res.message !== undefined
                    ? res.message
                    : "Problem while updating Records.";
                    toastAlert(message, "error");
                    this.closeModal();
                }
        } catch(error) {
            console.log("error catch block", error);
            toastAlert("Please check Internet Connection.", "error");
            this.closeModal();
        }
    }

    render() {
        var settings = {
            dots: false,
            arrows: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
        };
        const { data, getOfficeData } = this.props;
        const {
            amenities,
            amenityData,
            error,
            modal 
        } = this.state;

        return (
            <div>
                <Slider {...settings}  >
                    {
                        data?.length > 0 && data?.map((cabin, i) => (
                            <div className="wdt">
                                {
                                    cabin?.images?.length > 0 && 
                                    <div className='slider-image-main'>
                                        <CabinSlider 
                                            data={cabin}
                                            getOfficeData={getOfficeData}
                                        />
                                    </div>
                                }
                                {
                                    data?.length > 0 && 
                                    <div className='slider-image-main'>
                                        <Cabins 
                                            data={cabin}
                                            getOfficeData={getOfficeData}
                                        />
                                    </div>
                                }
                                {
                                    cabin?.amenities?.length > 0 && 
                                    <div className='slider-image-main'>
                                        <div className="content-header" >
                                            <div className="inner-card-title">
                                                <Typography 
                                                    className='card-title' 
                                                    variant='h5'
                                                > 
                                                    Amenities
                                                </Typography>
                                                <Button 
                                                    className='white-border-btn modal-title-btn' 
                                                    onClick={() => this.openModal(i)}
                                                >
                                                    Edit
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="content-body-main">
                                            {cabin?.amenities?.map((amenities, i) => (
                                                <div className="content-details">
                                                    <div className="ame-image">
                                                        <div className="ame-avatar">
                                                            <Avatar
                                                                src={amenities?.image}
                                                                alt="Avatar"
                                                            >
                                                            </Avatar>
                                                        </div>
                                                        <Typography
                                                            className='small-text' 
                                                            variant='p'
                                                        >
                                                            {amenities?.name}
                                                        </Typography>
                                                    </div>
                                                    <span className='span-line'></span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                }
                            </div>
                        ))
                    }
                </Slider >

                <div>
                    <Modal 
                        size='lg'
                        className='all-modals'
                        isOpen={modal}
                    >
                        <ModalHeader>
                            Edit Amenities
                        </ModalHeader>
                        <ModalBody>
                            <Grid container spacing={2}>
                                <Grid item lg={12} xs={12} sm={12} md={6} xl={12}>
                                    <div>
                                        <p className="small-text">
                                            Amenities :
                                        </p>
                                        <Autocomplete
                                            multiple
                                            id="tags-outlined"
                                            value={amenities}
                                            options={amenityData}
                                            getOptionLabel={(option) => option.name}
                                            onChange={(e, val) =>
                                                this.handleDropDownChange(e, val)
                                            }
                                            filterSelectedOptions
                                            renderInput={(params) => (
                                                <TextField
                                                {...params}
                                                label="Amenities"
                                                className="auto-text"
                                                placeholder="Choose Amenity"
                                                />
                                            )}
                                        />
                                        {error.includes("amenityError") &&
                                            <p className="error-message">
                                                Amenity is required!
                                            </p>
                                        }
                                    </div>
                                </Grid>
                            </Grid>
                        </ModalBody>
                        <ModalFooter>
                            <div className="update-btn">
                                <Button 
                                    className='btn btn-colored small-text-white'
                                    onClick={() => this.validateUpdateAmenities()}
                                >
                                    Update
                                </Button>
                                <Button 
                                    className='btn-border'
                                    onClick={() => this.closeModal()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </ModalFooter>
                    </Modal>
                </div>
            </div >
        );
    }
}

const mapStateToProps = (state) => ({
    authData: state.authReducer,
})

export default withRouter(connect(mapStateToProps)(Slidercompo))
