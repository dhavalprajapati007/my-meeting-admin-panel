import { 
    columnsUserTable,
    columnsVendorTable,
    columnsOfficeTable,
    columnsLanguageTable,
    columnsServiceCategoryTable,
    columnsAmenityTable,
    columnsPhysicalBookingTable,
    columnsWithdrawalRequestHistoryTable,
    columnsBookingPaymentHistoryTable
} from "./column";
import { dateFormater } from "./dateFormater";

export const userListData = async (data, thisEvt) => {
    if(data.length > 0) {
        let temp = [];
        data.map((data)=>{
            temp.push([
                data.avatar,
                `${data.firstName ? data.firstName : ""} ${data.lastName ? data.lastName : ""}`,
                data.email,
                data.mobile,
                data._id,
                data.status
            ])
        })
        let options = {
            filter: false,
            search : false,
            responsive: "scroll",
            rowsPerPage: thisEvt.state.rowsPerPage,
            selectableRows : false,
            rowsPerPageOptions: [10,20,50,100],
            serverSide: true,
            count: thisEvt.state.count,
            page : thisEvt.state.page-1,
            downloadOptions: {
                filename: "user-details.csv",
            },
            onTableChange: (action, tableState) => {
                if (action === "changePage" || action === "changeRowsPerPage") {
                    console.log("Go to page", tableState.page+1);
                    thisEvt.changePage(tableState.page+1,tableState.rowsPerPage);
                }
            }
        };
        return { data : temp, columns : columnsUserTable, options : options };
    } else{
        return { data : [], columns : [], options : {}};
    }
}

export const vendorListData = async (data,thisEvt) => {
    if(data.length > 0){
        let temp = [];
        data.map((data)=>{
            temp.push([
                data._id,
                data.avatar,
                `${data.firstName ? data.firstName : ""} ${data.lastName ? data.lastName : ""}`,
                data.email,
                data.mobile,
                // data.regStepsTotal,
                data.vendorDetails.providerType == 1 ? 
                    "Place Vendor" 
                : 
                data.vendorDetails.providerType == 2 ? 
                    "Service Vendor" 
                : 
                    "Place & Service Vendor",
                {
                    id : data._id,
                    isVerified : data.vendorDetails.hasOwnProperty("isVerified") ? data.vendorDetails.isVerified : false,
                    providerType : data.vendorDetails.providerType
                }
            ])
        })
        let options = {
            filter: false,
            search : false,
            responsive: "scroll",
            selectableRows : false,
            rowsPerPage: thisEvt.state.rowsPerPage,
            rowsPerPageOptions: [10,20,50,100],
            serverSide: true,
            count: thisEvt.state.count,
            page : thisEvt.state.page-1,
            downloadOptions: {
                filename: "vendor-details.csv",
            },
            onTableChange: (action, tableState) => {
                console.log(action,"action")
                if (action === "changePage" || action === "changeRowsPerPage") {
                    console.log("Go to page", tableState.page+1);
                    thisEvt.changePage(tableState.page+1,tableState.rowsPerPage);
                }
            }
        };
        return { data : temp, columns : columnsVendorTable(thisEvt), options : options };
    } else{
        return { data : [], columns : [], options : {}};
    }
}

export const officeListData = async (data, thisEvt) => {
    if(data.length > 0){
        let temp = [];
        data.map((data)=>{
            temp.push([
                data._id,
                data.name,
                `${data.vendor.firstName ? data.vendor.firstName : ""} ${data.vendor.lastName ? data.vendor.lastName : ""}`,
                `${data?.address?.line1 ? data?.address?.line1 : ""} ${data?.address?.line2 ? data?.address?.line2 : ""}
                ${data?.address?.city ? data?.address?.city : ""} ${data?.address?.state ? data?.address?.state : ""} - ${data?.address?.pincode ? data?.address?.pincode : ""}`,
                `${data.representativeDetails.name ? data.representativeDetails.name : ""} <br/> ${data.representativeDetails.number ? data.representativeDetails.number : ""}`,
                data.officeContactNumber,
                data.isKycCompleted ? "Verified" : "Pending",
                data.officeType,
                thisEvt?.props?.authData?.role === "Super Admin" ? data._id : ""
            ])
        })
        let options = {
            filter: false,
            search : false,
            responsive: "scroll",
            selectableRows : false,
            rowsPerPage: thisEvt.state.rowsPerPage,
            rowsPerPageOptions: [10,20,50,100],
            serverSide: true,
            count: thisEvt.state.count,
            page : thisEvt.state.page-1,
            downloadOptions: {
                filename: "office-details.csv",
            },
            onTableChange: (action, tableState) => {
                if (action === "changePage" || action === "changeRowsPerPage") {
                    console.log("Go to page", tableState.page+1);
                    thisEvt.changePage(tableState.page+1,tableState.rowsPerPage);
                }
            }
        };
        return { data : temp, columns : columnsOfficeTable(thisEvt), options : options };
    } else{
        return { data : [], columns : [], options : {}};
    }
}

export const withdrawalRequestHistoryData = async (data, thisEvt) => {
    if(data.length > 0){
        let temp = [];
        data.map((data)=>{
            temp.push([
                data._id,
                `${data.vendorInfo[0].firstName ? data.vendorInfo[0].firstName : ""} ${data.vendorInfo[0].lastName ? data.vendorInfo[0].lastName : ""}`,
                data.paymentMethodInfo?.length ? 
                    data.paymentMethodInfo[0].vendorDetails.paymentMethods.type === "bank" ? 
                        `A/C No. : *****${data.paymentMethodInfo[0].vendorDetails.paymentMethods.acNumber.slice(-4)}`
                    : 
                        `UPI Id : *****${data.paymentMethodInfo[0].vendorDetails.paymentMethods.upiId.slice(-4)}`
                :
                    "Method Doesn't Exist",
                data?.requestedDate?.split("T")[0] && dateFormater(data?.requestedDate?.split("T")[0]),
                data.amount,
                data.status,
                data.remark,
                { id : data._id, status : data.status },
            ])
        })
        let options = {
            filter: false,
            selectableRows : false,
            search : false,
            responsive: "scroll",
            rowsPerPage: thisEvt.state.rowsPerPage,
            rowsPerPageOptions: [10,20,50,100],
            serverSide: true,
            count: thisEvt.state.count,
            page : thisEvt.state.page-1,
            downloadOptions: {
                filename: "withdrawalRequestHistory.csv",
            },
            onTableChange: (action, tableState) => {
                if (action === "changePage" || action === "changeRowsPerPage") {
                    console.log("Go to page", tableState.page+1);
                    thisEvt.changePage(tableState.page+1,tableState.rowsPerPage);
                }
            }
        };
        return { data : temp, columns : columnsWithdrawalRequestHistoryTable(thisEvt), options : options };
    } else{
        return { data : [], columns : [], options : {}};
    }
}

export const bookingPaymentHistoryData = async (data, thisEvt) => {
    if(data.length > 0){
        let temp = [];
        data.map((data)=>{
            temp.push([
                data._id,
                data.bookingId,
                `${data.userInfo?.firstName?.trim() ? data.userInfo.firstName : ""} ${data.userInfo?.lastName?.trim() ? data.userInfo.lastName : ""}`,
                `${data.vendorInfo?.firstName?.trim() ? data.vendorInfo.firstName : ""} ${data.vendorInfo?.lastName?.trim() ? data.vendorInfo.lastName : ""}`,
                data.paymentId,
                data?.createdAt?.split("T")[0] && dateFormater(data?.createdAt?.split("T")[0]),
                data.amount,
                data.status,
                data.remark
            ])
        })
        let options = {
            filter: false,
            search : false,
            selectableRows : false,
            responsive: "scroll",
            rowsPerPage: thisEvt.state.rowsPerPage,
            rowsPerPageOptions: [10,20,50,100],
            serverSide: true,
            count: thisEvt.state.count,
            page : thisEvt.state.page-1,
            downloadOptions: {
                filename: "bookingPaymentHistory.csv",
            },
            onTableChange: (action, tableState) => {
                if (action === "changePage" || action === "changeRowsPerPage") {
                    console.log("Go to page", tableState.page+1);
                    thisEvt.changePage(tableState.page+1,tableState.rowsPerPage);
                }
            }
        };
        return { data : temp, columns : columnsBookingPaymentHistoryTable(thisEvt), options : options };
    } else{
        return { data : [], columns : [], options : {}};
    }
}

export const languageListData = async (data, thisEvt) => {
    if(data.length > 0){
        let temp = [];
        data.map((data)=>{
            temp.push([
                data.name,
                data.status === 1 ? "Active" : "Inactive",
                data._id
            ])
        })
        let options = {
            filter: false,
            search : false,
            filterType: "dropdown",
            responsive: "scroll",
            rowsPerPageOptions: [10,20,50,100],
            downloadOptions: {
                filename: "language-list.csv",
            },
        };
        return { data : temp, columns : columnsLanguageTable(thisEvt), options : options };
    } else{
        return { data : [], columns : [], options : {}};
    }
}

export const serviceCategoryListData = async (data, thisEvt) => {
    console.log(thisEvt.state,"allStates")
    if(data.length > 0){
        let temp = []
          data.map((data, idx)=> {
              temp.push([
                  idx+1,
                  data.name,
                  data?.parentName ? data?.parentName : "",
                  data.description,
                  data.image,
                  data.totalServiceProviders,
                  data?.childs ? data?.childs?.length : 0,
                  data.status === 1 ? "Active" : "Inactive",
                  {
                      id :data._id, 
                      name : data.name
                  }
            ])
        })
        let options = {
            filter: false,
            search : false,
            filterType: "dropdown",
            responsive: "scroll",
            selectableRows : false,
            rowsPerPageOptions: [10,20,50,100],
            downloadOptions: {
                filename: "serviceCategory-details.csv",
            },
        };
        return { data : temp, columns : columnsServiceCategoryTable(thisEvt), options : options };
    } else {
        return { data : [], columns : [], options : {}};
    }
}

export const amenityListData = async (data, thisEvt) => {
    if(data.length > 0){
        let temp = []
          data.map((data, idx)=> {
            temp.push([
                data?.name,
                data?.image,
                data?.status === 1 ? "Active" : "Inactive",
                data?._id
            ])
        })
        let options = {
            filter: false,
            search : false,
            filterType: "dropdown",
            responsive: "scroll",
            rowsPerPageOptions: [10,20,50,100],
            downloadOptions: {
                filename: "amenity-details.csv",
            },
        };
        return { data : temp, columns : columnsAmenityTable(thisEvt), options : options };
    } else {
        return { data : [], columns : [], options : {}};
    }
}

export const physicalBookingsListData = async (data,thisEvt) => {
    if(data.length > 0){
        let temp = [];
        let serviceType;
        data.map((data)=>{
            serviceType = `${data?.serviceType === 1 ? "physicalPlace" : data?.serviceType === 2 ? "physicalPlaceWithService" : data?.serviceType === 3 && "virtual"}BookingDetails`
            temp.push([
                data?._id,
                `${data?.date?.split("T")[0] && dateFormater(data?.date?.split("T")[0])} <br/>
                ${data?.duration?.startTime?.split("T")[1].split(".")[0]} - ${data?.duration?.endTime?.split("T")[1].split(".")[0]}`,
                data?.paymentDetails?.totalAmount.toFixed(2),
                `${data?.serviceType === 1 ? "Physical Place" : data?.serviceType === 2 ? "Physical Place With Service" : data?.serviceType === 3 && "Virtual Service"}`,
                data?.isCompleted,
                `${data?.bookingUserInfo?.hasOwnProperty("firstName") ? data?.bookingUserInfo?.firstName : ""} ${data?.bookingUserInfo?.hasOwnProperty("lastName") ? data?.bookingUserInfo?.lastName : ""}`,
                `${(data?.serviceType === 1 || data?.serviceType === 2) ? 
                    `Place Vendor : ${data?.vendorInfo?.hasOwnProperty("firstName") ? data?.vendorInfo?.firstName : ""} ${data?.vendorInfo?.hasOwnProperty("lastName") ? data?.vendorInfo?.lastName : ""}`
                : 
                    ""
                } <br/>
                ${(data?.serviceType === 3 || data?.serviceType === 2) ? 
                    `Service Vendor : ${data?.serviceProviderInfo?.hasOwnProperty("firstName") ? data?.serviceProviderInfo?.firstName : ""} ${data?.serviceProviderInfo?.hasOwnProperty("lastName") ? data?.serviceProviderInfo?.lastName : ""}`
                : 
                    ""
                }`
            ])
        })
        let options = {
            filter : false,
            search : false,
            responsive: "scroll",
            rowsPerPage: thisEvt.state.rowsPerPage,
            selectableRows : false,
            rowsPerPageOptions: [10,20,50,100],
            serverSide: true,
            count: thisEvt.state.count,
            page : thisEvt.state.page-1,
            downloadOptions: {
                filename: "booking-details.csv",
            },
            onTableChange: (action, tableState) => {
                if (action === "changePage" || action==="changeRowsPerPage") {
                    console.log("Go to page", tableState.page+1);
                    thisEvt.changePage(tableState.page+1,tableState.rowsPerPage);
                }
            }
        };
        return { data : temp, columns : columnsPhysicalBookingTable(thisEvt,serviceType), options : options };
    } else{
        return { data : [], columns : [], options : {}};
    }
}