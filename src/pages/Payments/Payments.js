import { Grid, Typography } from "@material-ui/core";
import React, { Component } from "react";

export default class Payments extends Component {
  render() {
    return (
      <div>
        <Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <div
              className="card-main"
              style={{ marginTop: "10px", padding: "20px", width: "100%" }}
            >
              <div class="coming-soon-main">
                <Typography
                  variant="h3"
                  style={{ paddingBottom: "20px" }}
                  className="small-text-color large-text"
                >
                  Coming Soon
                </Typography>

                <Typography
                  variant="p"
                  className="small-text-color coming-soon-text"
                >
                  currently, the page is in working process
                </Typography>
              </div>
            </div>
          </Grid>
        </Grid>
        {/* Payments */}
        {/* TODO :: Show ComingSooon Page Here */}
      </div>
    );
  }
}