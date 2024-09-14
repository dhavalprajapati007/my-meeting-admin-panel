import React, { Component } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import OfficeThree from "../../../assets/images/office-three.jpg"
import "./style.css"
import { Grid, Typography } from '@mui/material';
import { withRouter } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Dropzone from 'react-dropzone';
import Delete from "../../../assets/images/Delete.png"
import { toastAlert } from '../../../helpers/toastAlert';
import { deleteCabinImage, editCabinDetails } from '../../../services/officeService';
import { connect } from 'react-redux';

class CabinSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            addImageModal: false,
            addImage: "",
            error: [],
            deleteModal: false,
            deleteImageLink: "",
            cabinId: "",
            imageSRC : ""
        }
    }

    componentDidMount() {
        const { data } = this.props;
        this.setState({
            data: data,
            cabinId: data?._id
        })
    }

    openModal = () => {
        this.setState({
            addImageModal: true,
            addImage: "",
            error: []
        })
    }

    handleAddDrop = (acceptedFiles) => {
        this.setState({
            addImage: acceptedFiles
        })
    }

    closeImageModal = () => {
        this.setState({
            addImageModal: false,
            addImage: "",
            error: []
        })
    }

    openDeleteCabinImageModal = (idx) => {
        let deleteImage = this?.state?.data?.images[idx];
        this.setState({
            deleteModal: true,
            deleteImageLink: deleteImage
        })
    }

    deleteCabinImage = async () => {
        try {
            const res = await deleteCabinImage(this.state, this.props);
            // passed stateData as props to function so it can prepare payload from this data

            if (res && res?.statusCode == 200) {
                toastAlert(
                    res?.message
                        ? res?.message
                        : "Cabin image deleted successfully"
                );
                this.closeDeleteCabinImageModal();
                this?.props?.getOfficeData();
            } else {
                // error
                console.log("error deleting certi : ", res, res.message);
                let message =
                    res && res.message !== undefined
                        ? res.message
                        : "Problem while deleting images";
                toastAlert(message, "error");
                this.closeDeleteCabinImageModal();
            }
        } catch (error) {
            console.log("error catch block", error);
            toastAlert("Please check Internet Connection.", "error");
            this.closeDeleteCabinImageModal();
        }
    }

    closeDeleteCabinImageModal = () => {
        this.setState({
            deleteModal: false,
            deleteCabinImage: ""
        })
    }

    validateCabinImage = () => {
        let error = [];
        const { addImage } = this.state;
        if (typeof (addImage) === "string" && !addImage.trim()) {
            error.push('addImageError')
        }

        if(error.length > 0) {
            this.setState({
                error
            })
        }else {
            this.setState({
                error: []
            })
            this.addCabinImage();
        }
    }

    addCabinImage = async() => {
        const { addImage, cabinId } = this.state;
        try {
            const formData = new FormData();
            addImage?.length > 0 && addImage?.map((val) => formData.append('images', val));
            formData.append('id',cabinId);
            let res = await editCabinDetails(formData, this.props);
            // passed props to function

            if (res && res?.statusCode == 200) {
                toastAlert(
                    res?.message
                        ? res?.message
                        : "Cabin image Added successfully"
                );
                this.closeImageModal();
                this?.props?.getOfficeData();
            } else {
                // error
                console.log("error adding certificate : ", res, res.message);
                let message =
                    res && res.message !== undefined
                        ? res.message
                        : "Problem while adding cabin images.";
                toastAlert(message, "error");
                this.closeImageModal();
            }
        } catch (error) {
            console.log("error catch block", error);
            toastAlert("Please check Internet Connection.", "error");
            this.closeImageModal();
        }
    }


    render() {
        var settings = {
            dots: true,
            arrows: false,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,

        };
        const { 
            addImageModal,
            addImage,
            error,
            deleteModal,
            imageSRC
        } = this.state;
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
                        marginBottom: "30px",
                        width: "100%" 
                    }}
                >
                    <Slider {...settings} >
                        {data?.images?.map((image, i) => (
                            <div>
                                <div class='container' >
                                    <div 
                                        className="row title"
                                        style={{ marginBottom: "20px" }}
                                    >
                                        <div className="content-header">
                                            <div className="inner-card-title">
                                                <Typography 
                                                    className='card-title'
                                                    variant='h5'
                                                >
                                                    Cabin Images
                                                </Typography>
                                                <Button 
                                                    className='white-border-btn modal-title-btn add-btn' 
                                                    onClick={() => this.openModal(i)}
                                                >
                                                    Add
                                                </Button>
                                                {
                                                    data?.images?.length > 1 &&
                                                    <Button 
                                                        className='white-border-btn modal-title-btn' 
                                                        onClick={() => this.openDeleteCabinImageModal(i)}
                                                    >
                                                        <DeleteIcon 
                                                            style={{ fontSize: "28px" }}
                                                        />
                                                    </Button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="wdt">
                                    <img
                                        src={image ? image : OfficeThree}
                                        className="img-cabin"
                                        alt="" 
                                    />
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>

                {/* Add cabin image modal : start*/}
                <div>
                    <Modal 
                        className='all-modals'
                        isOpen={addImageModal}
                    >
                        <ModalHeader>
                            Add Cabin Image
                        </ModalHeader>
                        <ModalBody>
                            <Grid container spacing={2}>
                                <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                    <Dropzone
                                        onDrop={(file) => this.handleAddDrop(file)}
                                        accept={"image/*"}
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()}/>
                                                <div className="dropzone-style">
                                                    <div className="upload-icon">
                                                    {
                                                        addImage?.length > 0 ?             
                                                            <div>
                                                                {addImage?.map((file) => {
                                                                    var reader = new FileReader();
                                                                    let src;
                                                                    reader.onload = (event) => {
                                                                        src = event.target.result;
                                                                        this.setState({
                                                                            imageSRC: src
                                                                        })
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                    return <img src={imageSRC} />
                                                                })}
                                                            </div>
                                                        :
                                                        <>
                                                            <CloudUploadIcon className="upload-icon"/>
                                                            <p 
                                                                className='small-text-color' 
                                                                style={{ fontSize: "16px" }}
                                                            >
                                                                Try dropping some files here, or click to select files to upload
                                                            </p>
                                                        </>
                                                    }
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Dropzone>
                                    {error?.includes('addImageError') &&
                                        <p className='error-message'>
                                            Kindly upload image
                                        </p>
                                    }
                                    <div 
                                        style={{ marginTop: "10px" }}
                                    >
                                        {addImage?.length === 0 ? (
                                            <span style={{ fontSize: '14px', color: '#496389' }}>

                                                <div className="check-icon-main">
                                                    <CheckCircleOutlineIcon className='icon' />
                                                    <Typography className="small-text-color">
                                                        Uploaded file will appear here
                                                    </Typography>
                                                </div>
                                            </span>
                                        ) : (
                                            <span>
                                                <strong>
                                                    Uploaded file :
                                                </strong>
                                                {addImage?.length > 0 && addImage.map((image) =>
                                                    <p>{image?.name}</p>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </Grid>
                            </Grid>
                        </ModalBody>
                        <ModalFooter>
                            <div className="update-btn">
                                <Button
                                    className='btn btn-colored small-text-white'
                                    onClick={() => this.validateCabinImage()}
                                >
                                    Add
                                </Button>
                                <Button className='btn-border'
                                    onClick={() => this.closeImageModal()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </ModalFooter>
                    </Modal>
                </div>
                {/* Add cabin image modal : end*/}


                {/* Delete-cabin image : start */}
                <div>
                    <Modal 
                        className='all-modals'
                        isOpen={deleteModal}
                    >
                        <ModalHeader>
                            Delete Certificate
                        </ModalHeader>
                        <ModalBody>
                            <Grid container spacing={2}>
                                <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                    <div className="delete-icon">
                                        <img 
                                            src={Delete} 
                                            alt="delete-image"
                                        />
                                    </div>
                                    <Typography 
                                        className="small-text-color" 
                                        style={{ 
                                            textAlign: "center",
                                            marginTop: "20px" 
                                        }}
                                    >
                                        Are you sure you want to delete this certificate?
                                    </Typography>
                                </Grid>
                            </Grid>
                        </ModalBody>
                        <ModalFooter>
                            <div className="update-btn">
                                <Button
                                    className='btn btn-colored small-text-white'
                                    onClick={() => this.deleteCabinImage()}
                                >
                                    Delete
                                </Button>
                                <Button
                                    className='btn-border'
                                    onClick={() => this.closeDeleteCabinImageModal()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </ModalFooter>
                    </Modal>
                </div>
                {/* Delete-cabin image : end */}

            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    authData: state.authReducer,
})

export default withRouter(connect(mapStateToProps)(CabinSlider));