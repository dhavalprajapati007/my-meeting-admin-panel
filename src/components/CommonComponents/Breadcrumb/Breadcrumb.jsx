import { Breadcrumbs, Grid, Typography } from '@mui/material';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

class BreadcrumbComp extends Component {
  render() {
    const { items } = this.props
    return (
      <div className="card-main breadcrumb-card">
        <Breadcrumbs 
          aria-label="breadcrumb"
          className='breadcrum-main'
        >
          {items?.length && items?.map((item,idx) => (
            (!item.link.trim()) ?
                <Typography 
                  className={'link-main small-text ' + (item?.active ? "active" : "")}
                  key={idx}
                >
                  {item.name}
                </Typography>
              :
                <Link 
                  to={item.link}
                  key={idx}
                  className={'link-main small-text ' + (item?.active ? "active" : "")}
                >
                  {item.name}
                </Link>
          ))}
        </Breadcrumbs>
      </div>
    );
  }
}

export default BreadcrumbComp;