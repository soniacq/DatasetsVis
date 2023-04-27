import React, { Component } from "react";
import PropTypes from 'prop-types';
import {DatasetSample} from './DatasetSample';
import { Card, Box } from '../node_modules/@material-ui/core/index';
import {SummaryView} from "./SummaryView";

export class ProfilerView extends Component {
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
    console.log("dataset_results");
    console.log(dataset_results);
    return <div ref={ref=>{this.ref = ref}}>
      <div  className="d-flex flex-row">
        <SummaryView hit={dataset_results}/>
          {/* <Card>
            Hiii2
            dfdf
            <p>ff</p>
            <p>ddd</p>
          </Card> */}
          <DatasetSample hit={data} />
      </div>
    </div>
  }
}

ProfilerView.propTypes = {
  data: PropTypes.object.isRequired,
};
