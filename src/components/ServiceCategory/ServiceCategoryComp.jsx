import { Button, CircularProgress, Grid, Typography, Autocomplete, TextField } from '@mui/material';
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, } from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Dropzone from 'react-dropzone';
import "./style.css"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BreadcrumbComp from '../../components/CommonComponents/Breadcrumb/Breadcrumb';
import { withRouter } from 'react-router-dom';
import { getServiceCategory, handleClick, toggleModal, handleDrop, handleEditDrop, handleChange, addServiceCategory, editServiceCategory } from '../../services/serviceCategoryService';
import { serviceCategoryListData } from '../../helpers/renderData';
import { toastAlert } from '../../helpers/toastAlert';
import Datatable from '../CommonComponents/Datatable/Datatable';
import { Box } from "@mui/system";
import { connect } from 'react-redux';
class ServiceCategoryComp extends Component {
    constructor() {
        super();
        this.state = {
            editModal: false,
            modal: false,
            imageName: [],
            parentCategory: "",
            category: "",
            description: "",
            editCategory: "",
            editDescription: "",
            editParentCategory: "",
            editImageName: [],
            error: [],
            editError: [],
            data: "",
            loading: false,
            data: "",
            loading: false,
            parentData: [],
            selectedId: "",
            tableData: {},
            allServiceData: [],
            imageSRC : "",
            editImageSRC : ""
        }
    }

    getAllServices = async () => {
        try {
            let services = await getServiceCategory(this.props);
            // passed props to getServiceCategory function so it can redirect this props to clearCookie() function

            if (services && services?.statusCode == 200) {
                let allServiceData = [];
                let parentData = [];
                services?.data?.length > 0 && services?.data?.map((parentData) => {
                    if (parentData?.childs?.length > 0) {
                        allServiceData.push(parentData);
                        parentData.childs.map((childData) => {
                            childData.parentName = parentData.name;
                            allServiceData.push(childData);
                        });
                    } else {
                        allServiceData.push(parentData);
                    }
                });
                services?.data?.length > 0 && services?.data?.map((val) => {
                    if (!val.parent) {
                        parentData.push(val)
                    }
                })
                this.setState({
                    parentData,
                    allServiceData
                })
                let tableData = await serviceCategoryListData(this.state.allServiceData, this);
                this.setState({
                    tableData,
                    data: services.data,
                    loading: false
                })
            } else {
                // error
                console.log('error fetching languages : ', services, services.message);
                let message = services && services.message !== undefined ? services.message : "Problem Fetching Records.";
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
        this.getAllServices();
    }

    closeAddModal = () => {
        this.setState({
            modal: false,
            category: "",
            description: "",
            imageName: [],
            error: [],
            parentCategory: ""
        })
    }

    closeEditModal = () => {
        this.setState({
            editModal: false,
            editCategory: "",
            editDescription: "",
            editImageName: [],
            editError: [],
            editParentCategory: ""
        });
    }

    addCategory = async () => {
        const { category, description, imageName } = this.state;
        let error = [];

        if (!category.trim()) {
            error.push('category')
        }
        if (!description.trim()) {
            error.push('description')
        }
        if (imageName.length === 0) {
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
                let res = await addServiceCategory(this.props, this);
                // passe props to addServiceCategory function so it can redirect this props to clearCookie() function

                if (res && res?.statusCode == 200) {
                    toastAlert(res?.message ? res?.message : "Service category added successfully", "success")
                    this.closeAddModal();
                    this.getAllServices();
                } else {
                    // error
                    console.log('error adding service category : ', res, res.message);
                    let message = res && res.message !== undefined ? res.message : "Problem while adding Records.";
                    toastAlert(message, "error");
                    this.closeAddModal();
                }
            } catch (error) {
                console.log('error catch block', error);
                toastAlert("Please check Internet Connection.", "error");
                this.closeAddModal();
            }
        }
    };

    editCategory = async () => {
        const { editCategory, editDescription, editImageName } = this.state;
        let editError = [];

        if (!editCategory.trim()) {
            editError.push('editCategory')
        }
        if (!editDescription.trim()) {
            editError.push('editDescription')
        }
        if (editImageName.length === 0) {
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
                let res = await editServiceCategory(this.props, this);
                // passe props to editServiceCategory function so it can redirect this props to clearCookie() function

                if (res && res?.statusCode == 200) {
                    toastAlert(res?.message ? res?.message : "Service category updated successfully", "success")
                    this.closeEditModal();
                    this.getAllServices();
                } else {
                    // error
                    console.log('error updating service category : ', res, res.message);
                    let message = res && res.message !== undefined ? res.message : "Problem while updating Records.";
                    this.closeEditModal();
                    toastAlert(message, "error");
                }
            } catch (error) {
                console.log('error catch block', error);
                toastAlert("Please check Internet Connection.", "error");
                this.closeEditModal();
            }
        }
    };

    handleDropDownChange = (e, val, type) => {
        if (type === "add") {
            this.setState({
                parentCategory: val,
            });
        } else if (type === "edit") {
            this.setState({
                editParentCategory: val,
            });
        }
    }

    itemArray = () => {
        return (
            [
                {
                    name: "Service Category",
                    active: false,
                    link: ""
                },
                {
                    name: "All Service Category",
                    active: true,
                    link: ""
                }
            ]
        )
    }

    render() {

        const {
            loading,
            modal,
            editModal,
            editImageName,
            imageName,
            category,
            description,
            editDescription,
            editCategory,
            error,
            editError,
            parentData,
            tableData,
            parentCategory,
            editParentCategory,
            imageSRC,
            editImageSRC
        } = this.state
        return (
            <div>
                <BreadcrumbComp items={this.itemArray()} />
                <Grid container>
                    <Grid item lg={12} sm={12} md={12} xs={12} xl={12} 
                        style={{ 
                            textAlign: "end",
                            marginTop: "30px" 
                        }}
                    >
                        <Button 
                            className='btn btn-colored' 
                            onClick={() => toggleModal(this)}
                        >
                            + Add New Category
                        </Button>
                    </Grid>
                </Grid>
                {/* Add service-category modal : start */}
                <div>
                    <Modal 
                        className='all-modals'
                        isOpen={modal}
                    >
                        <ModalHeader className='card-title'>
                            Add Service Category
                        </ModalHeader>
                        <ModalBody>
                            <Grid container spacing={2}>
                                <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                    <div>
                                        <p className="small-text">
                                            Category Name
                                        </p>
                                        <input 
                                            className="input-main"
                                            type="Text"
                                            value={category}
                                            name="category"
                                            onChange={(evt) => handleChange(evt, this)} 
                                            placeholder='Category Name'
                                        />
                                    </div>
                                    {error?.includes('category') &&
                                        <p className='error-message'>
                                            Category shouldn't be empty
                                        </p>
                                    }
                                </Grid>
                                <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                    <p className="small-text">
                                        Parent Category
                                    </p>
                                    <Autocomplete
                                        name="parentCategory"
                                        value={parentCategory}
                                        options={parentData}
                                        autoHighlight
                                        onChange={(e, val) =>
                                            this.handleDropDownChange(e, val, "add")
                                        }
                                        getOptionLabel={(option) => option.name ? option.name : ""}
                                        renderOption={(props, option) => (
                                            <Box
                                                component="li"
                                                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                                {...props}
                                            >
                                                {option.name ? option.name : ""}
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                className="country-dropdown"
                                                {...params}
                                                label="Parent category"
                                                placeholder="Choose a parent service category"
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete: "new-password", // disable autocomplete and autofill
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                    <div>
                                        <p className="small-text">
                                            Description
                                        </p>
                                        <textarea
                                            className="input-main"
                                            type="text"
                                            name="description"
                                            value={description}
                                            placeholder='Description'
                                            onChange={(evt) => handleChange(evt, this)}
                                        />
                                    </div>
                                    {error.includes('description') &&
                                        <p className='error-message'>
                                            Description shouldn't be empty
                                        </p>
                                    }
                                </Grid>
                                <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                    <p className="small-text">
                                        Upload Image
                                    </p>
                                    <Dropzone 
                                        onDrop={(file) => handleDrop(file, this)} 
                                        accept={"image/*"}
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <div className="dropzone-style">
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
                                    {error.includes('imageName') &&
                                        <p className='error-message'>
                                            Kindly upload image
                                        </p>
                                    }
                                    <div style={{ marginTop: "10px" }}>
                                        {imageName.length === 0 ? 
                                            <span 
                                                style={{ 
                                                    fontSize: '14px', 
                                                    color: '#496389' 
                                                }}
                                            >
                                                <div className="check-icon-main">
                                                    <CheckCircleOutlineIcon className='icon' />
                                                    <Typography className="small-text-color">
                                                        Uploaded file will appear here
                                                    </Typography>
                                                </div>
                                            </span>
                                        : 
                                            <span>
                                                <strong>
                                                    Uploaded file :
                                                </strong>
                                                <p>
                                                    {imageName[0]?.name}
                                                </p>
                                            </span>
                                        }
                                    </div>
                                </Grid>
                            </Grid>
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                                className='btn btn-colored small-text-white' 
                                onClick={() => this.addCategory()}
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
                {/* Add service-category modal : end */}
                {/* Edit service-category modal : start */}
                <div>
                    <Modal 
                        className='all-modals'
                        isOpen={editModal}
                    >
                        <ModalHeader className='card-title'>
                            Edit Service Category
                        </ModalHeader>
                        <ModalBody>
                            <Grid container spacing={2}>
                                <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                    <p className="small-text">
                                        Category Name
                                    </p>
                                    <div>
                                        <input 
                                            className="input-main" 
                                            type="Text" 
                                            value={editCategory} 
                                            name="editCategory" 
                                            onChange={(evt) => handleChange(evt, this)} 
                                            placeholder='Category Name' 
                                        />
                                            {editError.includes('editCategory') &&
                                                <p className='error-message'>
                                                    Category shouldn't be empty
                                                </p>
                                            }
                                    </div>
                                </Grid>
                                <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                    <p className="small-text">
                                        Parent Category
                                    </p>
                                    <Autocomplete
                                        name="editParentCategory"
                                        value={editParentCategory}
                                        options={parentData}
                                        autoHighlight
                                        onChange={(e, val) =>
                                            this.handleDropDownChange(e, val, "edit")
                                        }
                                        getOptionLabel={(option) => option.name ? option.name : ""}
                                        renderOption={(props, option) => (
                                            <Box
                                                component="li"
                                                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                                {...props}
                                            >
                                                {option.name ? option.name : ""}
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                className="country-dropdown"
                                                {...params}
                                                label="Parent category"
                                                placeholder="Choose a parent service category"
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete: "new-password", // disable autocomplete and autofill
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                    <p className="small-text">
                                        Description
                                    </p>
                                    <div>
                                        <textarea 
                                            className="input-main" 
                                            type="text" 
                                            name="editDescription" 
                                            value={editDescription}
                                            placeholder='Description' 
                                            onChange={(evt) => handleChange(evt, this)} 
                                        />
                                        {editError.includes('editDescription') &&
                                            <p className='error-message'>
                                                Description shouldn't be empty
                                            </p>
                                        }
                                    </div>
                                </Grid>
                                <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                    <p className="small-text">
                                        Upload Image
                                    </p>
                                    <Dropzone 
                                        onDrop={(file) => handleEditDrop(file, this)} 
                                        accept={"image/*"}
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <div className="dropzone-style">
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
                                                        (editImageName?.length > 0 && typeof(editImageName) === "string") ? 
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
                                    {editError.includes('editImageName') &&
                                        <p className='error-message'>
                                            Kindly upload image
                                        </p>
                                    }
                                    <div style={{ marginTop: "10px" }}>
                                        {editImageName.length === 0 ? (
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
                                                <p>
                                                    {editImageName[0]?.name || editImageName}
                                                </p>
                                            </span>
                                        )}
                                    </div>
                                </Grid>
                            </Grid>
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                                className='btn btn-colored small-text-white'
                                onClick={() => this.editCategory()}
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
                {/* Edit service-category modal : end */}
                <div className='data-table-main'>
                    <Grid container>
                        <Grid item lg={12} sm={12} md={12} xs={12}>
                            <div 
                                className="card-main service-category-table"
                                style={{ width: "100%" }}
                            >
                                {
                                    loading ?
                                        <CircularProgress 
                                            style={{ color: "#5F5BA8" }} 
                                            size={50} 
                                        />
                                    :
                                        <Datatable 
                                            className="" 
                                            props={tableData} 
                                            title={"All Service Categories"} 
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

const mapStateToProps = (state) => ({
    authData: state.authReducer,
})

export default withRouter(connect(mapStateToProps)(ServiceCategoryComp))