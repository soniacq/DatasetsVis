// import * as React from 'react';
import React, {Component} from "react";
import { Card, Box } from '../node_modules/@material-ui/core/index';
import {ProfilerView} from './ProfilerView';
import {ScatterPlot} from './ScatterPlot';
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

const colorTabIndicator = "#FFFFFF";

const widthSVG = 1000;


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ flex: 1 }}
    >
      {value === index && (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', p: 2 }}>
          <Typography component={'div'} style={{ display: 'flex', flex: 1 }}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

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
    ScatterPlot(
      this.ref,
      hit,
      widthSVG
    );
    // WordCloud(text, {
    //   width: 250,
    //   height: 100,
    //   size: () => .3 + Math.random(),
    //   rotate: () => (~~(Math.random() * 6) - 3) * 30
    // });
  }
    // console.log("Hi");

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