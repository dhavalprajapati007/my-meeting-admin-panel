import { Button, CircularProgress, Grid } from '@mui/material';
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css"
import BreadcrumbComp from '../CommonComponents/Breadcrumb/Breadcrumb';
import { withRouter } from 'react-router-dom';
import { addLang, getLanguages, handleClick, toggleModal, handleChange, editLang } from '../../services/languageService';
import { toastAlert } from '../../helpers/toastAlert';
import { languageListData } from '../../helpers/renderData'
import Datatable from '../CommonComponents/Datatable/Datatable';
class LanguagesComp extends Component {
    constructor() {
        super();
        this.state = {
            data: "",
            loading: false,
            editModal: false,
            modal: false,
            languageName: "",
            editLanguageName: "",
            error: [],
            editError: [],
            langId: "",
            tableData: {}
        }
    }

    getAllLang = async () => {
        try {
            let languages = await getLanguages(this.props);
            // passed props to getLanguages function so it can redirect this props to clearCookie() function

            if (languages && languages?.statusCode == 200) {
                let tableData = await languageListData(languages.data, this);
                this.setState({
                    tableData,
                    data: languages.data,
                    loading: false
                })
            } else {
                // error
                console.log('error fetching languages : ', languages, languages.message);
                let message = languages && languages.message !== undefined ? languages.message : "Problem Fetching Records.";
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
        this.getAllLang();
    }

    closeEditModal = () => {
        this.setState({
            editModal: false,
            langId: "",
            editLanguageName: "",
            editError: [],
        })
    }

    addLanguage = async () => {
        const { languageName } = this.state;
        let error = [];
        if (!languageName.trim()) {
            error.push('languageName')
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
                let res = await addLang(this.props, this);
                // passed props to getLanguages function so it can redirect this props to clearCookie() function

                if (res && res?.statusCode == 200) {
                    toastAlert(res?.message ? res?.message : "Language added successfully")
                    this.setState({
                        modal: false
                    })
                    this.getAllLang();
                } else {
                    // error
                    console.log('error adding language : ', res, res.message);
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
    }

    editLang = async () => {
        const { editLanguageName } = this.state;
        let editError = [];

        if (!editLanguageName.trim()) {
            editError.push('editLanguageName')
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
                let res = await editLang(this.props, this);
                // passed allProps and thisEvt as props to function

                if (res && res?.statusCode == 200) {
                    toastAlert(res?.message ? res?.message : "Language updated successfully")
                    this.closeEditModal();
                    this.getAllLang();
                } else {
                    // error
                    console.log('error updating language : ', res, res.message);
                    let message = res && res.message !== undefined ? res.message : "Problem while updating Records.";
                    toastAlert(message, "error");
                    this.closeEditModal();
                }
            } catch (error) {
                console.log('error catch block', error);
                toastAlert("Please check Internet Connection.", "error");
                this.closeEditModal();
            }
        }
    };

    itemArray = () => {
        return (
            [
                {
                    name: "Languages",
                    active: false,
                    link: ""
                },
                {
                    name: "All Languages",
                    active: true,
                    link: ""
                }
            ]
        )
    }

    render() {
        const {
            languageName,
            editLanguageName,
            error,
            editError,
            tableData,
            modal,
            editModal,
            loading
        } = this.state
        return (
            <div>
                {/* Breadcrumb component :: start  */}
                <BreadcrumbComp items={this.itemArray()} />
                {/* Breadcrumb component :: end  */}

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
                        + Add New Language
                    </Button>
                </Grid>
                {/* Add service-category modal : start */}
                <div>
                    <Modal 
                        className='all-modals'
                        isOpen={modal}
                    >
                        <ModalHeader className='card-title'>
                            Add Language
                        </ModalHeader>
                        <ModalBody>
                            <Grid container spacing={2}>
                                <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                    <div>
                                        <input 
                                            className="input-main"
                                            type="Text"
                                            value={languageName}
                                            name="languageName"
                                            onChange={(evt) => handleChange(evt, this)}
                                            placeholder='Language Name'
                                        />
                                    </div>
                                    {error?.includes('languageName') &&
                                        <p className='error-message'>
                                            Language name shouldn't be empty
                                        </p>
                                    }
                                </Grid>
                            </Grid>
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                                className='btn btn-colored small-text-white'
                                onClick={() => this.addLanguage()}
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
                        <ModalHeader>
                            Edit Language
                        </ModalHeader>
                        <ModalBody>
                            <Grid container spacing={2}>
                                <Grid item lg={12} xs={12} sm={12} md={12} xl={12}>
                                    <div>
                                        <input 
                                            className="input-main"
                                            type="Text"
                                            value={editLanguageName} 
                                            name="editLanguageName"
                                            onChange={(evt) => handleChange(evt, this)}
                                            placeholder='Language Name'
                                        />
                                        {editError?.includes('editLanguageName') &&
                                            <p className='error-message'>
                                                Language name shouldn't be empty
                                            </p>
                                        }
                                    </div>
                                </Grid>
                            </Grid>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                className='btn btn-colored small-text-white'
                                onClick={() => this.editLang()}
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
                                className="card-main" 
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
                                            props={tableData}
                                            title={"All Verified Offices"} 
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

export default withRouter(LanguagesComp);