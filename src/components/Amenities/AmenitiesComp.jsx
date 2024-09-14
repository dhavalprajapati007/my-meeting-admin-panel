import { Button, CircularProgress, Grid,Typography } from '@mui/material';
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import Dropzone from 'react-dropzone';
import "./style.css"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BreadcrumbComp from '../CommonComponents/Breadcrumb/Breadcrumb';
import { withRouter } from 'react-router-dom';
import { amenityListData } from "../../helpers/renderData"
import { getAmenities, addAmenity, editAmenity } from '../../services/amenityService';
import Datatable from '../CommonComponents/Datatable/Datatable';
import { toastAlert } from '../../helpers/toastAlert';
import { handleChange, handleEditDrop, handleDrop, toggleModal, handleClick } from '../../services/amenityService';

class AmenitiesComp extends Component {
    constructor() {
        super();
        this.state = {
            editModal: false,
            modal: false,
            amenityName: "",
            editAmenityName: "",
            imageName: [],
            editImageName: [],
            error: [],
            editError: [],
            data: "",
            amenityId: "",
            loading: false,
            tableData: {},
            imageSRC : "",
            editImageSRC : ""
        }
    }

    getAllAmenities = async () => {
        try {
            let amenities = await getAmenities(this.props);
            // passe props to getAmenities function so it can redirect this props to clearCookie() function

            if (amenities && amenities?.statusCode == 200) {
                let tableData = await amenityListData(amenities.data, this);
                this.setState({
                    tableData,
                    data: amenities.data,
                    loading: false
                })
            } else {
                // error
                console.log('error fetching amenities : ', amenities, amenities.message);
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
        this.setState({
            loading: true
        })
        this.getAllAmenities();
    }

    itemArray = () => {
        return (
            [
                {
                    name: "Amenities",
                    active: false,
                    link: ""
                },
                {
                    name: "All Amenities",
                    active: true,
                    link: ""
                }
            ]
        )
    }

    closeProcess = () => {
        this.setState({
            editModal: false,
            amenityId: "",
            editAmenityName: "",
            editImageName: "",
            editError: [],
        })
    }

    addAmenity = async () => {
        let error = [];

        if (!this.state.amenityName.trim()) {
            error.push('amenityName')
        }

        if (this.state.imageName.length === 0) {
            error.push('imageName');
        }

        if (error.length > 0) {
            this.setState({
                error,
            })
        } else {
            this.setState({
                error: [],
            })
            try {
                let res = await addAmenity(this.props, this);
                // passe props to getLanguages function so it can redirect this props to clearCookie() function

                if (res && res?.statusCode == 200) {
                    toastAlert(res?.message ? res?.message : "Amenity added successfully")
                    this.setState({
                        modal: false
                    })
                    this.getAllAmenities();
                } else {
                    // error
                    console.log('error adding amenity : ', res, res.message);
                    let message = res && res.message !== undefined ? res.message : "Problem while adding Records.";
                    toastAlert(message, "error");
                    this.setState({ modal: false });
                }
            } catch (error) {
                console.log('error catch block', error);
                toastAlert("Please check Internet Connection.", "error");
                this.setState({ modal: false });
            }
        }
    };

    editAmenity = async () => {
        let editError = [];

        if (!this.state.editAmenityName.trim()) {
            editError.push('editAmenityName')
        }

        if (this.state.editImageName.length === 0) {
            editError.push('editImageName');
        }

        if (editError.length > 0) {
            this.setState({
                editError,
            })
        } else {
            this.setState({
                editError: [],
            })
            try {
                let res = await editAmenity(this.props, this);
                // passed props to addAmenity function so it can redirect this props to clearCookie() function

                if (res && res?.statusCode == 200) {
                    toastAlert(res?.message ? res?.message : "Amenity updated successfully", "success")
                    this.closeProcess();
                    this.getAllAmenities();
                } else {
                    // error
                    console.log('error updating amenity : ', res, res.message);
                    let message = res && res.message !== undefined ? res.message : "Problem while updating Records.";
                    toastAlert(message, "error");
                    this.closeProcess();
                }
            } catch (error) {
                console.log('error catch block', error);
                toastAlert("Please check Internet Connection.", "error");
                this.closeProcess();
            }
        }
    };

    render() {
        const {
            amenityName,
            editImageName,
            imageName,
            editAmenityName,
            error,
            editError,
            tableData,
            loading,
            modal,
            imageSRC,
            editImageSRC,
            editModal 
        } = this.state
        return (
            <div>
                {/* Breadcrumb component :: start  */}
                <BreadcrumbComp items={this.itemArray()} />
                {/* Breadcrumb component :: end  */}
                <Grid container>
                    <Grid item lg={12} sm={12} md={12} xs={12} xl={12} style={{ textAlign: "end" }}>
                        <Button 
                            className='btn btn-colored'
                            onClick={() => toggleModal(this)} 
                            style={{ marginTop: "30px" }}
                        >
                            + Add New Amenity
                        </Button>
                    </Grid>
                </Grid>
                {/* Add Amenity modal : start */}
                <div>
                    <Modal className='all-modals'
                        isOpen={modal}
                    >
                        <ModalHeader className='card-title'>
                            Add Amenity
                        </ModalHeader>
                        <ModalBody>
                            <Grid container spacing={2}>
                                <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                    <div>
                                        <input 
                                            type="Text"
                                            className="input-main"
                                            value={amenityName}
                                            name="amenityName" 
                                            onChange={(evt) => handleChange(evt, this)} 
                                            placeholder='Amenity Name' 
                                        />
                                    </div>
                                    {error?.includes('amenityName') &&
                                        <p className='error-message'>
                                            Amenity name shouldn't be empty
                                        </p>
                                    }
                                </Grid>
                                <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                    <Dropzone 
                                        onDrop={(file) => handleDrop(file, this)} 
                                        accept={"image/*"}
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <div className="dropzone-style">
                                                    {/* <img src={FileUpload} style={{ width: '85px' }} /> */}
                                                    <div className="upload-icon">
                                                    {
                                                        imageName?.length > 0 ?             
                                                            <div>
                                                                {imageName?.map((file) => {
                                                                    var reader = new FileReader();
                                                                    let src;
                                                                    reader.onload = (event) => {
                                                                        src = event.target.result;
                                                                        this.setState({
                                                                            imageSRC: src
                                                                        })
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                    return <img src={imageSRC}/>
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
                                    {error.includes('imageName') &&
                                        <p className='error-message'>
                                            Kindly upload image
                                        </p>
                                    }
                                    <div style={{ marginTop: "10px" }}>
                                        {imageName.length === 0 ? 
                                            <div className="check-icon-main">
                                                <CheckCircleOutlineIcon className='icon' />
                                                <Typography 
                                                    className="small-text-color"
                                                >
                                                    Uploaded file will appear here
                                                </Typography>
                                            </div>
                                        : 
                                            <span>
                                                <strong 
                                                    style={{ marginleft: "10px" }} 
                                                    className='sall-text-color'
                                                >
                                                    Uploaded file :
                                                </strong>
                                                <p>{imageName[0]?.name}</p>
                                            </span>
                                        }
                                    </div>
                                </Grid>
                            </Grid>
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                                className='btn btn-colored small-text-white'
                                onClick={() => this.addAmenity()}
                            >
                                Add
                            </Button>
                            <Button 
                                className='btn btn-border small-text-color'
                                onClick={() => toggleModal(this)}
                            >
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>
                </div>
                {/* Add Amenity modal : end */}
                {/* Edit Amenity modal : start */}
                <div>
                    <Modal className='all-modals'
                        isOpen={editModal}
                    >
                        <ModalHeader>
                            Edit Amenity
                        </ModalHeader>
                        <ModalBody>
                            <Grid container spacing={2}>
                                <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                    <div >
                                        <input 
                                            type="Text"
                                            className="input-main" 
                                            value={editAmenityName}
                                            name="editAmenityName" 
                                            onChange={(evt) => handleChange(evt, this)}
                                            placeholder='Amenity Name' 
                                        />
                                        {editError.includes('editAmenityName') &&
                                            <p className='error-message'>
                                                Amenity name shouldn't be empty
                                            </p>
                                        }
                                    </div>
                                </Grid>
                                <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                    <Dropzone
                                        onDrop={(file) => handleEditDrop(file, this)}
                                        accept={"image/*"}
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <div className="dropzone-style">
                                                    {/* <img src={FileUpload} style={{ width: '85px' }} /> */}
                                                    <div className="upload-icon">
                                                    {
                                                        (editImageName?.length > 0 && typeof(editImageName) !== "string") ?          
                                                            <div>
                                                                {editImageName?.map((file) => {
                                                                    var reader = new FileReader();
                                                                    let src;
                                                                    reader.onload = (event) => {
                                                                        src = event.target.result;
                                                                        this.setState({
                                                                            editImageSRC: src
                                                                        })
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                    return <img src={editImageSRC} />
                                                                })}
                                                            </div>
                                                        :
                                                        (editImageName?.length > 0 && 
                                                        typeof(editImageName) === "string") ? 
                                                            <div>
                                                                <img src={editImageName} />
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
                                    {editError?.includes('editImageName') &&
                                        <p className='error-message'>
                                            Kindly upload image
                                        </p>
                                    }
                                    <div 
                                        style={{ 
                                            marginTop: "10px" 
                                        }}
                                    >
                                        {editImageName?.length === 0 ? 
                                            <div className="check-icon-main">
                                                <CheckCircleOutlineIcon className='icon' />
                                                <Typography 
                                                    className="small-text-color"
                                                >
                                                    Uploaded file will appear here
                                                </Typography>
                                            </div>
                                        : 
                                            <span>
                                                <strong>Uploaded file :</strong>
                                                <p>{editImageName[0]?.name || editImageName}</p>
                                            </span>
                                        }
                                    </div>
                                </Grid>
                            </Grid>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                className='btn btn-colored small-text-white'
                                onClick={() => this.editAmenity()}
                            >
                                Edit
                            </Button>
                            <Button 
                                className='btn btn-border small-text-color'
                                onClick={() => handleClick(this)}
                            >
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>
                </div>
                {/* Edit Amenity modal : end */}
                <div className='data-table-main'>
                    <Grid container>
                        <Grid item lg={12} sm={12} md={12} xs={12}>
                            <div className="card-main" style={{ width: "100%" }}>
                                {
                                    loading ? 
                                        <CircularProgress 
                                            style={{ color: "#5F5BA8" }}
                                            size={50}
                                        />
                                    : 
                                        <Datatable
                                            props={tableData}
                                            title={"All Amenities"}
                                        />
                                }
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}
export default withRouter(AmenitiesComp);