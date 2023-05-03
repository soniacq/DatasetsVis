import React, {Component} from "react";
import { Card, Box } from '../node_modules/@material-ui/core/index';
import {SummaryPlots as SummaryPlots} from './SummaryPlots';
// Material
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';

// Tabs
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';


// import React, {Component} from "react";
// import PropTypes from 'prop-types';
// import {plotPipelineMatrix, computePipelineMatrixWidthHeight} from "./plotPipelineMatrix";
// import "./pipelineMatrix.css";
// import {constants} from "../helpers";
// import ImportExportIcon from '@material-ui/icons/ImportExport';
// import IconButton from '@material-ui/core/IconButton';

const widthSVG = 1000;

export function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

export class SummaryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectMetric: this.props.similarityMetrics[0].name,
      xname: this.props.similarityMetrics[0].x,
      yname: this.props.similarityMetrics[0].y
    };
    this.handleChangeSimilarityMetric = this.handleChangeSimilarityMetric.bind(this);
  }
  display(props){
    const { hit } = props;
    SummaryPlots(
      this.ref,
      hit,
      widthSVG,
      this.state.xname,
      this.state.yname,
    );
  }

  componentDidMount(){
    this.display(this.props);
  }

  componentDidUpdate(prevProps, prevState){
    this.display(this.props);
  }

  handleChangeSimilarityMetric (e) {
    const selectedSimiMetric = e.target.value;
    this.setState({selectMetric: selectedSimiMetric,  xname: this.props.similarityMetrics.filter(d => d.name === selectedSimiMetric)[0].x, yname: this.props.similarityMetrics.filter(d => d.name === selectedSimiMetric)[0].y });
  }

  render(){
    const { hit, similarityMetrics } = this.props;
    return (
    <>
      <div className={"unselected-field"} style={{display: "inline-block"}}>
          <span>Similarity Metric based on: </span>
          <select
            value={this.state.selectMetric}
            onChange={this.handleChangeSimilarityMetric}
          >
            {
              similarityMetrics.map(metricRequest => {
                return <option key={metricRequest.name} value={metricRequest.name}>{metricRequest.name}</option>
              })
            }
          </select>
      </div>

      <div style={{position: 'relative', height: 300, width: widthSVG}}>
        <svg style={{position: 'absolute', left: 0, top: 0}} ref={ref => this.ref = ref}/>
      </div>
    </>
    );
  }
}