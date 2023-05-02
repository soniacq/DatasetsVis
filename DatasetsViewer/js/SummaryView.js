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
    };
  }

// export default function SummaryView() {
//   const [value, setValue] = React.useState(0);
//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };  
//   const svgRef = useRef(null);

  // plotPipelineMatrix(
  //   this.ref,
  //   data,
  //   pipelines,
  //   moduleNames,
  //   importances,
  //   selectedPipelines,
  //   selectedPipelinesColorScale,
  //   onClick,
  //   onHover,
  //   onSelectExpandedPrimitive,
  //   expandedPrimitiveData,
  //   expandedPrimitiveName,
  //   metricRequest,
  //   highlightPowersetColumns,
  //   sortColumnBy
  // );
  display(props){
    const { hit } = props;
    SummaryPlots(
      this.ref,
      hit,
      widthSVG,
      "x",
      "y"
    );
  }

  componentDidMount(){
    this.display(this.props);
  }

  componentDidUpdate(prevProps, prevState){
    this.display(this.props);
  }

  render(){
    const { hit } = this.props;
    return (
    <div style={{position: 'relative', height: 300, width: widthSVG}}>
      <svg style={{position: 'absolute', left: 0, top: 0}} ref={ref => this.ref = ref}/>
    </div>
    );
  }
}