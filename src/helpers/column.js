import { Avatar, Button, CircularProgress, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  getSingleService,
  deleteServiceCategory,
} from "../services/serviceCategoryService";
import { getSingleLang, deleteLang } from "../services/languageService";
import { deleteAmenity, getSingleAmenity } from "../services/amenityService";

export const columnsUserTable = [
  {
    name: "Avatar",
    options: {
      filter: false,
      download : false,
      customBodyRender: (value) => {
        return <Avatar src={value} alt="Avatar"></Avatar>;
      },
    },
  },
  {
    name: "Name",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Email",
    options: {
      filter: false,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Mobile",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "ID",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Status",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
];

export const columnsVendorTable = (thisEvt) => [
  {
    name: "ID",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <Link
              to={{
                pathname : `/vendors/${value}`,
                status : thisEvt.state.selectedStatus,
              }}
            >
              <p>{value}</p>
            </Link>
          );
        }
      },
    },
  },
  {
    name: "Avatar",
    options: {
      filter: false,
      download: false,
      customBodyRender: (value) => {
        return <Avatar src={value} alt="Avatar"></Avatar>;
      },
    },
  },
  {
    name: "Name",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Email",
    options: {
      filter: false,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Mobile",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Service Type",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Action",
    options: {
      filter: true,
      download: false,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                {
                  thisEvt?.props?.authData?.role === "Super Admin" ?
                    <IconButton
                      title="Delete"
                      onClick={() => thisEvt.openDeleteModal(value.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  : null
                }
                <Button
                  className='btn btn-colored'
                  onClick={() => value.isVerified ? thisEvt.verifyVendor(value.id,false) : thisEvt.verifyVendor(value.id,true)}
                  disabled={value.providerType === 1}
                >
                  {
                    thisEvt.state.verifyLoader ?
                      <CircularProgress
                        style={{ color: "#5F5BA8" }}
                        size={20} 
                      />
                    :
                      value.providerType === 1 ? "Verified" : value.isVerified ? "Unverify" : "Verify"
                  }
                </Button>
              </div>
            </span>
          );
        }
      },
    },
  },
];

export const columnsOfficeTable = (thisEvt) => [
  {
    name: "ID",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <Link
              to={{
                pathname: `/offices/${value}`,
                thisEvt,
              }}
            >
              <p>{value}</p>
            </Link>
          );
        }
      },
    },
  },
  {
    name: "Name",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <p>{value}</p>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Vendor",
    options: {
      filter: false,
      customBodyRender: (value) => {
        return (
          <span>
            <div>
              <p>{value}</p>
            </div>
          </span>
        );
      },
    },
  },
  {
    name: "Address",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>
                  {value}
                </p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Representative",
    options: {
      filter: false,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p dangerouslySetInnerHTML={{ __html: value }}></p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Phone no.",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "KYC Status",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Office Type",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  thisEvt?.props?.authData?.role === "Super Admin" ?
    {
      name: "Action",
      options: {
        filter: true,
        download : false,
        customBodyRender: (value) => {
          if (value) {
            return (
              <span>
                <div>                  
                  <IconButton
                    title="Delete"
                    onClick={() => thisEvt.openDeleteModal(value)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </span>
            );
          }
        },
      },
    } 
  : ""
];

export const columnsLanguageTable = (thisEvt) => [
  {
    name: "Name",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Status",
    options: {
      filter: false,
      customBodyRender: (value) => {
        return (
          <span>
            <div>
              <p>Active</p>
            </div>
          </span>
        );
      },
    },
  },
  {
    name: "Action",
    options: {
      filter: false,
      download : false,
      customBodyRender: (value, tableMeta, updateValue) => {
        console.log(value, "actions");
        return (
          <div className="action_div">
            <IconButton
              title="Edit"
              onClick={() => getSingleLang(value, thisEvt)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              title="Delete"
              onClick={() => deleteLang(value, thisEvt)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        );
      },
    },
  },
];

export const columnsServiceCategoryTable = (thisEvt) => [
  {
    name: "ID*",
    options: {
      filter: false,
    },
  },
  {
    name: "Name*",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Parent Name",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Description",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span className="description-table">
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "profileimage",
    label: "Image",
    options: {
      filter: false,
      download : false,
      customBodyRender: (value) => {
        return <Avatar src={value} alt="Avatar"></Avatar>;
      },
    },
  },
  {
    name: "Total SP",
    options: {
      filter: true,
      customBodyRender: (value) => {
        return (
          <span>
            <div>
              <p>{value}</p>
            </div>
          </span>
        );
      },
    },
  },
  {
    name: "Total Child",
    options: {
      filter: true,
      customBodyRender: (value) => {
        return (
          <span>
            <div>
              <p>{value}</p>
            </div>
          </span>
        );
      },
    },
  },
  {
    name: "Status",
    options: {
      filter: false,
      customBodyRender: (value) => {
        return (
          <span>
            <div>
              <p>{value}</p>
            </div>
          </span>
        );
      },
    },
  },
  {
    name: "Action",
    options: {
      filter: false,
      download : false,
      customBodyRender: (value, tableMeta, updateValue) => {
        console.log(value, "actions");
        return (
          <div className="action_div">
            <IconButton
              title="Edit"
              onClick={() => getSingleService(value, thisEvt)}
            >
              <EditIcon />
            </IconButton>
            {
              thisEvt?.props?.authData?.role === "Super Admin" ?
              <IconButton
                title="Delete"
                onClick={() => deleteServiceCategory(value.id, thisEvt)}
              >
                <DeleteIcon />
              </IconButton>
              : null
            }
          </div>
        );
      },
    },
  },
];

export const columnsAmenityTable = (thisEvt) => [
  {
    name: "Name",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "profileimage",
    label: "Image",
    options: {
      filter: false,
      download : false,
      customBodyRender: (value) => {
        return <Avatar src={value} alt="Avatar"></Avatar>;
      },
    },
  },
  {
    name: "Status",
    options: {
      filter: false,
      customBodyRender: (value) => {
        return (
          <span>
            <div>
              <p>{value}</p>
            </div>
          </span>
        );
      },
    },
  },
  {
    name: "Action",
    options: {
      filter: false,
      download : false,
      customBodyRender: (value, tableMeta, updateValue) => {
        console.log(value, "actions");
        return (
          <div className="action_div">
            <IconButton
              title="Edit"
              onClick={() => getSingleAmenity(value, thisEvt)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              title="Delete"
              onClick={() => deleteAmenity(value, thisEvt)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        );
      },
    },
  },
];

export const columnsPhysicalBookingTable = (thisEvt,serviceType) => [
  {
    name: "Booking ID",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <Link to={{ pathname: `/allbooking/${serviceType}/${value}` }}>
                <p>{value}</p>
              </Link>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Duration",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if(value) {
          return (
            <span>
              <div>
                <p dangerouslySetInnerHTML={{ __html: value }}></p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Total Amount",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div className="center-text-total">
                <p className="text-align-center">{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Service Type",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div className="center-text-total">
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Booking Status",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div className="center-text-total">
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Booking User",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Booking Vendor",
    options: {
      filter: true,
      customBodyRender: (data) => {
        return (
          <span>
            <div>
              <p dangerouslySetInnerHTML={{ __html: data }}></p>
            </div>
          </span>
        );
      },
    },
  },
];

export const columnsWithdrawalRequestHistoryTable = (thisEvt) => [
  {
    name: "Request Id",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <p>{value}</p>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Vendor Name",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Payment Method",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div className="center-text-total">
                <p className="text-align-center">{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Requested Date",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div className="center-text-total">
                <p>
                  {value}
                </p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Amount",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div className="center-text-total">
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Status",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Remark",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Action",
    options: {
      filter: false,
      download : false,
      customBodyRender: (value, tableMeta, updateValue) => {
        console.log(value, "actions");
        return (
          <div className="action_div">
            <IconButton
              title="Edit"
              disabled={value.status === "rejected" || value.status === "completed" && true}
              onClick={() => thisEvt.openEditWithdrawalRequestModal(value.id)}
            >
              <EditIcon />
            </IconButton>
          </div>
        );
      },
    },
  },
];

export const columnsBookingPaymentHistoryTable = (thisEvt) => [
  {
    name: "_id",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <p>{value}</p>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Booking Id",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "User Name",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Vendor Name",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Payment Ref.",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div className="center-text-total">
                <p className="text-align-center">{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Transaction Date",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div className="center-text-total">
                <p>
                  {value}
                </p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Amount",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div className="center-text-total">
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Status",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
  {
    name: "Remark",
    options: {
      filter: true,
      customBodyRender: (value) => {
        if (value) {
          return (
            <span>
              <div>
                <p>{value}</p>
              </div>
            </span>
          );
        }
      },
    },
  },
];