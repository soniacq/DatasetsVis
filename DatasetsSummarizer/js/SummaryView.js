import React, {Component} from "react";
import {SummaryPlots as SummaryPlots} from './SummaryPlots';

const widthSVG = 1000;

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
    const {
      hit,
      onClick
    } = props;
    SummaryPlots(
      this.ref,
      hit,
      widthSVG,
      this.state.xname,
      this.state.yname,
      onClick
    );
  }

  componentDidMount(){
    this.display(this.props);
  }

  componentDidUpdate(prevProps, prevState){
    if(this.state.selectMetric !== prevState.selectMetric){
      this.display(this.props);
    }
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

SummaryView.defaultProps = {
  onClick: ()=>{}
};