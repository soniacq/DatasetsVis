import React from 'react';
import ReactDOM from 'react-dom';
import { select } from "d3-selection";
import {MainView} from './MainView';
import "regenerator-runtime/runtime";

export function renderProfilerViewBundle(divName, data, dataset_results){
	console.log("renderProfilerViewBundle");
    console.log(dataset_results);
	ReactDOM.render(
		<MainView data={data} dataset_results={dataset_results}/>
		, select(divName).node());
}