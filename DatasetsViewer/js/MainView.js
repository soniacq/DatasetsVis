import React, { Component } from "react";
import PropTypes from 'prop-types';
import {DatasetSample} from './DatasetSample';
import { Card, Box } from '../node_modules/@material-ui/core/index';
import {SummaryView} from "./SummaryView";

export class MainView extends Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }

  componentDidCatch(error, info) {
    console.log(error);
  }

  render(){
    const {data, dataset_results} = this.props;
    const similarityMetrics = [
      {name: "Title", x: "title_x", y: "title_y"},
      {name: "Description", x: "description_x", y: "description_y"},
      {name: "Title and Description", x: "title_and_description_x", y: "title_and_description_y"},
      {name: "Column Name", x: "column_name_x", y: "column_name_y"}
    ];

    return <div ref={ref=>{this.ref = ref}}>
      <div  className="d-flex flex-row">
        <SummaryView hit={dataset_results} similarityMetrics={similarityMetrics}/>
        <div className="row">
          <div className="column-left">
            <div className="selected-container">
              <div className="selected-header">Selected Datasets:</div>
              <div className="selected-body"></div>
            </div>
          </div>
          <div className="column-right">
            <DatasetSample hit={data} />
          </div>
        </div>
      </div>
    </div>
  }
}

MainView.propTypes = {
  data: PropTypes.object.isRequired,
};
