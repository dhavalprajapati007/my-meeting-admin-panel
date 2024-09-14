import React, { Component } from 'react'
import MUIDataTable from "mui-datatables";

export default class Datatable extends Component {
  render() {
      const { props, title } = this.props
    return (
      <MUIDataTable
        title={title && title}
        data={props?.data}
        columns={props?.columns}
        options={props?.options}
        className=""
      />
    )
  }
}
