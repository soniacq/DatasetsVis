import React, { Component } from "react";
import PropTypes from 'prop-types';
import {DatasetSample} from './DatasetSample';
import {SummaryView} from "./SummaryView";
import CommAPI from "./CommAPI";

export class MainView extends Component {
  constructor(props){
    super(props);
    this.commFormatMetadata = new CommAPI('format_metadata_comm_api', (msg) => {
      this.setState({ fullMetadata: msg.newformatmetadata });
    });
    this.state = {
      fullMetadata: ""
    };
    this.handleChangeDataset = this.handleChangeDataset.bind(this);

  }

  componentDidCatch(error, info) {
    console.log(error);
  }

  componentDidUpdate(prevProps, prevState){
  }

  handleChangeDataset (value) {
    this.commFormatMetadata.call({dataneedformat: value});
  }

  render(){
    const { dataset_results, similarity_metrics } = this.props;

    return <div ref={ref=>{this.ref = ref}}>
      <div  className="d-flex flex-row">
        <SummaryView
          hit={dataset_results}
          similarityMetrics={similarity_metrics["similarity_metrics"]}
          onClick={
            (selectedDataset) => {
              this.handleChangeDataset (selectedDataset);
            }
          }
        />
        <div className="row">
          <div className="column-left">
            <div className="selected-container">
              <div className="selected-header">Selected Datasets:</div>
              <div className="selected-body"></div>
            </div>
          </div>
          <div className="column-right">
            {
              this.state.fullMetadata !== "" && <DatasetSample hit={this.state.fullMetadata}/>
            }
          </div>
        </div>
      </div>
    </div>
  }
}

MainView.propTypes = {
  data: PropTypes.object.isRequired,
};
