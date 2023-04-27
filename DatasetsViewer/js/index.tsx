import React from 'react';
import ReactDOM from 'react-dom';
import { select } from "d3-selection";
import {ProfilerView} from './ProfilerView';
import "regenerator-runtime/runtime";
import SummaryView from './SummaryView';

export function renderProfilerViewBundle(divName, data, dataset_results){
	console.log("renderProfilerViewBundle");
    console.log(dataset_results);
	ReactDOM.render(
		<ProfilerView data={data} dataset_results={dataset_results}/>
		// <SummaryView data={data}/>
		, select(divName).node());
}