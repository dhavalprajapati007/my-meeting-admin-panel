import { Button, Grid, Typography } from '@mui/material';
import React, { Component } from 'react';
import GppGoodIcon from '@mui/icons-material/GppGood';
import Pdf from "../../../assets/images/PDF.png"
import "./style.css"
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import GetAppIcon from '@material-ui/icons/GetApp';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Dropzone from 'react-dropzone';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { addCertificates, deleteCertificate, editPersonalDocs } from '../../../services/userService';
import { withRouter } from 'react-router-dom';
import { toastAlert } from '../../../helpers/toastAlert';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from "../../../assets/images/Delete.png";

class Document extends Component {
    constructor(props) {
        super();
        this.state = {
            modal: false,
            editImage: "",
            editImageSRC : "",
            imageType: "",
            error: [],
            userId: "",
            deleteModal: false,
            deleteImage: "",
            addModal: false,
            imageSRC : "",
            addImage: "",
        }
    }

    componentDidMount = () => {
        const { data } = this.props
        this.setState({
            userId: data?.id
        })
    }

    openModal = (imgType,image) => {
        this.setState({
            imageType: imgType,
            editImage: image?.trim().length ? image : "",
            modal: true,
        })
    }

    openDeleteCertificateModal = (image) => {
        this.setState({
            deleteModal: true,
            deleteImage: image
        })
    }

    closeDeleteCertificateModal = () => {
        this.setState({
            deleteModal: false,
            deleteImage: ""
        })
    }

    toggleAddCertiModal = () => {
        this.setState({
            addModal: !this.state.addModal,
            addImage: ""
        })
    }

    handleEditDrop = (acceptedFiles) => {
        this.setState({
            editImage: acceptedFiles
        })
    }

    handleAddDrop = (acceptedFiles) => {
        this.setState({
            addImage: acceptedFiles
        })
    }

    closeModal = () => {
        this.setState({
            modal: false,
            error: [],
            editImage: "",
            imageType: ""
        })
    }

    deleteCertificate = async () => {
        try {
            const res = await deleteCertificate(this.state, this.props);
            // passed stateData as an argument to function so it can prepare payload from this data

            if (res && res?.statusCode == 200) {
                toastAlert(
                    res?.message
                        ? res?.message
                        : "Certificate deleted successfully"
                );
                this.closeDeleteCertificateModal()
                this.props.getVendorData();
            } else {
                // error
                console.log("error deleting certi : ", res, res.message);
                let message =
                    res && res.message !== undefined
                        ? res.message
                        : "Problem while deleting certificate.";
                toastAlert(message, "error");
                this.closeDeleteCertificateModal();
            }
        } catch (error) {
            console.log("error catch block", error);
            toastAlert("Please check Internet Connection.", "error");
            this.closeDeleteCertificateModal();
        }
    }

    addCertificate = () => {
        let error = [];
        if (typeof (this.state.addImage) === "string" && !this.state.addImage.trim()) {
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
            this.addCertificateApiCall();       
        }
    }

    addCertificateApiCall = async() => {
        try {
            let res = await addCertificates(this.state, this.props);
            // passed stateData as an argument to function so it can prepare payload from this data

            if(res && res?.statusCode == 200) {
                toastAlert(
                    res?.message
                        ? res?.message
                        : "Certificate Added successfully"
                );
                this.toggleAddCertiModal();
                this.props.getVendorData();
            }else {
                // error
                console.log("error adding certificate : ", res, res.message);
                let message =
                    res && res.message !== undefined
                        ? res.message
                        : "Problem while adding certificates.";
                toastAlert(message, "error");
                this.toggleAddCertiModal();
            }
        } catch(error) {
            console.log("error catch block", error);
            toastAlert("Please check Internet Connection.", "error");
            this.toggleAddCertiModal();
        }
    }

    editDocument = () => {
        let error = [];
        const { editImage } = this.state;
        if (typeof (editImage) === "string" && !editImage.trim()) {
            error.push('editImageError')
        }
        if(typeof (editImage) === "object" && !editImage[0]?.name) {
            error.push('editImageError')
        }
        if(error.length > 0) {
            this.setState({
                error
            })
        }else {
            this.setState({
                error: []
            })
            this.editDocumentApiCall();            
        }
    }

    editDocumentApiCall = async() => {
        try {
            let res = await editPersonalDocs(this.state, this.props);
            // passed stateData as an argument to function so it can prepare payload from this data

            if(res && res?.statusCode == 200) {
                toastAlert(
                    res?.message
                        ? res?.message
                        : "Document updated successfully"
                );
                this.closeModal();
                this.props.getVendorData();
            }else {
                // error
                console.log("error updating document : ", res, res.message);
                let message =
                    res && res.message !== undefined
                        ? res.message
                        : "Problem while updating docs.";
                toastAlert(message, "error");
                this.closeModal();
            }
        } catch(error) {
            console.log("error catch block", error);
            toastAlert("Please check Internet Connection.", "error");
            this.closeModal();
        }
    }

    download = (e) => {
        console.log(e.target.href);
        fetch(e.target.href, {
            method: "GET",
            headers: {}
        })
            .then(response => {
                response.arrayBuffer().then(function (buffer) {
                    const url = window.URL.createObjectURL(new Blob([buffer]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "image.png"); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    render() {
        const { 
            imageType,
            error,
            editImage,
            editImageSRC,
            deleteModal,
            addModal,
            addImage,
            modal,
            imageSRC
        } = this.state
        const { data } = this.props
        let panCard =  data?.idProofDetails?.panCard ? data?.idProofDetails?.panCard : "";
        let aadharFront = data?.idProofDetails?.aadharFront ? data?.idProofDetails?.aadharFront : "";
        let aadharBack = data?.idProofDetails?.aadharBack ? data?.idProofDetails?.aadharBack : "";
        let certificates = (data?.certificates && data?.certificates?.length > 0) ? 
            data?.certificates : [];
        return (
            <div
                style={{ 
                    width: "100%",
                    display: "flex" 
                }}
            >
                <div 
                    style={{ 
                        width: "100%",
                        display: "flex" 
                    }}
                >
                    {/* Document_card::Start */}
                    <div className="card-main">
                        <div className="content-header">
                            <div className='inner-card-title'>
                                <Typography
                                    className="card-title"
                                    variant="h5"
                                >
                                    Certificates & Documents
                                </Typography>
                                <Button
                                    className="white-border-btn modal-title-btn"
                                    onClick={() => this.toggleAddCertiModal()}
                                >
                                    Add Certificate
                                </Button>
                            </div>
                        </div>
                        <Grid 
                            container 
                            spacing={1}
                            style={{ marginTop: "20px" }}
                        >
                            <Grid item lg={6} md={6} sm={6} xl={6} xs={12}>
                                <div className="document-title-main">
                                    <Typography 
                                        className='small-text-color name-icon'
                                        variant='p'
                                    >
                                        <GppGoodIcon className='details-icon' />
                                        PanCard:
                                    </Typography>
                                    <div style={{ marginLeft: "10px" }}>
                                        <Button 
                                            className='btn-border'
                                            onClick={() => this.openModal("pan",panCard)}
                                        >
                                            Edit
                                        </Button>
                                        <a
                                            href={panCard?.trim()?.length ? panCard : ""}
                                            download
                                            onClick={e => this.download(e)}
                                        >
                                            <Button
                                                className='btn-border download_btn'
                                                style={{ 
                                                    marginLeft: "10px"
                                                }}
                                            >
                                                <GetAppIcon 
                                                    style={{ fontSize: "28px" }} 
                                                />
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                                <div className="document-main">
                                    <img
                                        onClick={() => window.open(panCard.trim().length ? panCard : "","_blank")}
                                        src={panCard.trim().length ? panCard : Pdf} 
                                        alt="PAN" 
                                    />
                                </div>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xl={6} xs={12}  >
                                <div className="document-title-main">
                                    <Typography
                                        className='small-text-color name-icon'
                                        variant='p'
                                    >
                                        <GppGoodIcon className='details-icon'/>
                                        Adhar Front:
                                    </Typography>

                                    <div style={{ marginLeft: "10px" }}>
                                        <Button
                                            className='btn-border'
                                            onClick={() => this.openModal("aadharFront",aadharFront)}
                                        >
                                            Edit
                                        </Button>
                                        <a
                                            href={aadharFront?.trim()?.length ? aadharFront : ""}
                                            download
                                            onClick={e => this.download(e)}
                                        >
                                            <Button
                                                className='btn-border download_btn'
                                                style={{ marginLeft: "10px" }}
                                            >
                                                <GetAppIcon style={{ fontSize: "28px" }}/>
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                                <div className="document-main">
                                    <img
                                        onClick={() => window.open(aadharFront?.trim()?.length ? aadharFront : "", "_blank")}
                                        src={aadharFront?.trim()?.length ? aadharFront : Pdf} 
                                        alt="UIDAIfront"
                                    />
                                </div>
                            </Grid>
                            <Grid 
                                item
                                lg={6} md={6} sm={6} xl={6} xs={12}
                                style={{ marginTop: "20px" }}
                            >
                                <div className="document-title-main">
                                    <Typography
                                        className='small-text-color name-icon'
                                        variant='p'
                                    >
                                        <GppGoodIcon className='details-icon'/>
                                        Adhar Back:
                                    </Typography>
                                    <div style={{ marginLeft: "10px" }}>
                                        <Button
                                            className='btn-border'
                                            onClick={() => this.openModal("aadharBack",aadharBack)}
                                        >
                                            Edit
                                        </Button>
                                        <a
                                            href={aadharBack?.trim()?.length ? aadharBack : ""}
                                            download
                                            onClick={e => this.download(e)}
                                        >
                                            <Button
                                                className='btn-border download_btn'
                                                style={{ marginLeft: "10px", }} >
                                                <GetAppIcon style={{ fontSize: "28px" }} />
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                                <div className="document-main">
                                    <img
                                        onClick={() => window.open(aadharBack?.trim()?.length ? aadharBack : "", "_blank")}
                                        src={aadharBack?.trim()?.length ? aadharBack : Pdf}
                                        alt="UIDAIback"
                                    />
                                </div>
                            </Grid>

                            {certificates && certificates.length > 0 ? 
                                certificates?.map((cert, i) => (
                                    <Grid 
                                        item 
                                        lg={6} md={6} sm={6} xl={6} xs={12}
                                        style={{ marginTop: "20px" }}
                                    >
                                        <div className="document-title-main">
                                            <Typography
                                                className='small-text-color name-icon'
                                                variant='p'
                                            >
                                                <GppGoodIcon className='details-icon' />
                                                Cerfificate: #{i + 1}
                                            </Typography>
                                            <div 
                                                style={{ marginLeft: "10px" }}
                                            >
                                                <Button 
                                                    className='btn-border download_btn'
                                                    onClick={() => this.openDeleteCertificateModal(cert && cert)}
                                                >
                                                    <DeleteIcon style={{ fontSize: "28px" }}/>
                                                </Button>
                                                <a
                                                    href={cert}
                                                    download
                                                    onClick={e => this.download(e)}
                                                >
                                                    <Button
                                                        className='btn-border download_btn'
                                                        style={{ marginLeft: "10px", }}
                                                    >
                                                        <GetAppIcon style={{ fontSize: "28px" }}/>
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="document-main">
                                            <img
                                                onClick={() => window.open(cert && cert, "_blank")}
                                                src={cert ? cert : Pdf}
                                                alt="Certificate"
                                            />
                                        </div>
                                    </Grid>
                                ))
                            : 
                                ""
                            }
                        </Grid>
                    </div>
                    {/* Document_card::End */}
                    {/* Edit-document : start */}
                    <div>
                        <Modal 
                            className='all-modals'
                            isOpen={modal}
                        >
                            <ModalHeader>Edit
                                {
                                    imageType === "pan" ? 
                                        " PAN Card"
                                    : 
                                    imageType === "aadharFront" ? 
                                        " Adhar Front"
                                    :
                                    imageType === "aadharBack" ?
                                        " Adhar Back"
                                    : 
                                    imageType === "certificate" && 
                                        " Certificate"
                                }
                            </ModalHeader>

                            <ModalBody>
                                <Grid container spacing={2}>
                                    <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                        <Dropzone
                                            onDrop={(file) => this.handleEditDrop(file)}
                                            accept={"image/*"}
                                        >
                                            {({ getRootProps, getInputProps }) => (
                                                <div {...getRootProps()}>
                                                    <input {...getInputProps()} />
                                                    <div className="dropzone-style">
                                                        <div className="upload-icon">
                                                        {
                                                            (editImage?.length > 0 && typeof(editImage) !== "string") ?          
                                                                <div>
                                                                    {editImage?.map((file) => {
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
                                                            (editImage?.length > 0 && typeof(editImage) === "string") ? 
                                                                <div>
                                                                    <img src={editImage} />
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
                                        {
                                            error?.includes('editImageError') &&
                                                <p 
                                                    className='error-message'
                                                >
                                                    Kindly upload image
                                                </p>
                                        }
                                        <div style={{ marginTop: "10px" }}>
                                            {
                                                editImage.length === 0 ?
                                                    <span 
                                                        style={{ 
                                                            fontSize: '14px',
                                                            color: '#496389'
                                                        }}
                                                    >
                                                        <div className="check-icon-main">
                                                            <CheckCircleOutlineIcon className='icon'/>
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
                                                            {editImage[0]?.name || editImage}
                                                        </p>
                                                    </span>
                                            }
                                        </div>
                                    </Grid>
                                </Grid>
                            </ModalBody>
                            <ModalFooter>
                                <div className="update-btn">
                                    <Button
                                        className='btn btn-colored small-text-white'
                                        onClick={() => this.editDocument()}
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
                    {/*Edit-document: end */}
                    {/* Delete-Certificate : start */}
                    <div>
                        <Modal className='all-modals'
                            isOpen={deleteModal}>
                            <ModalHeader>Delete Certificate</ModalHeader>

                            <ModalBody>
                                <Grid container spacing={2}>
                                    <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                        <div className="delete-icon">
                                            <img src={Delete} alt="" />
                                        </div>
                                        <Typography className="small-text-color" style={{ textAlign: "center", marginTop: "20px" }}>
                                            Are you sure you want to delete this certificate?
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </ModalBody>
                            <ModalFooter>
                                <div className="update-btn">
                                    <Button
                                        className='btn btn-colored small-text-white'
                                        onClick={() => this.deleteCertificate()}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        className='btn-border'
                                        onClick={() => this.closeDeleteCertificateModal()}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </ModalFooter>
                        </Modal>
                    </div>
                    {/* Delete-Certificate : end */}
                    {/* Add-certificate : start */}
                    <div>
                        <Modal 
                            className='all-modals'
                            isOpen={addModal}
                        >
                            <ModalHeader>
                                Add Certificate
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
                                                    <input {...getInputProps()} />
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
                                        {
                                            error.includes('addImageError') &&
                                            <p className='error-message'>
                                                Kindly upload image
                                            </p>
                                        }
                                        <div style={{ marginTop: "10px" }}>
                                            {
                                                addImage.length === 0 ? 
                                                    <span 
                                                        style={{
                                                            fontSize: '14px',
                                                            color: '#496389' 
                                                        }}
                                                    >
                                                        <div className="check-icon-main">
                                                            <CheckCircleOutlineIcon className='icon'/>
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
                                                            {addImage[0]?.name || addImage}
                                                        </p>
                                                    </span>
                                            }
                                        </div>
                                    </Grid>
                                </Grid>
                            </ModalBody>
                            <ModalFooter>
                                <div className="update-btn">
                                    <Button 
                                        className='btn btn-colored small-text-white'
                                        onClick={() => this.addCertificate()}
                                    >
                                        Add
                                    </Button>
                                    <Button
                                        className='btn-border'
                                        onClick={() => this.toggleAddCertiModal()}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </ModalFooter>
                        </Modal>
                    </div>
                    {/*Add-certificate: end */}
                </div >
            </div >
        );
    }
}

export default withRouter(Document);