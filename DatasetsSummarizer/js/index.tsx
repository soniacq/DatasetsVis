import React from 'react';
import ReactDOM from 'react-dom';
import { select } from "d3-selection";
import {MainView} from './MainView';
import "regenerator-runtime/runtime";

export function renderDatasetsSummarizerBundle(divName, dataset_results, similarity_metrics){
	ReactDOM.render(
		<MainView dataset_results={dataset_results} similarity_metrics={similarity_metrics}/>
		, select(divName).node());
}