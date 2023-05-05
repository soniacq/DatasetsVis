import ast
import pkg_resources
import string
import numpy as np
from dateutil.parser import parse
import json
import networkx as nx
from ._comm_api import setup_comm_api
from collections import defaultdict
import copy
import random
import datamart_profiler
import pandas
from io import StringIO

def formatMetadata(msg):
    json_data = ast.literal_eval(msg['dataneedformat'])
    data_dict = prepare_data_profiler( json_data)
    return {"newformatmetadata": data_dict}

setup_comm_api('format_metadata_comm_api', formatMetadata)

def id_generator(size=15):
    """Helper function to generate random div ids. This is useful for embedding
    HTML into ipython notebooks."""
    chars = list(string.ascii_uppercase)
    return ''.join(np.random.choice(chars, size, replace=True))


def make_html(dataset_results, id):
	lib_path = pkg_resources.resource_filename(__name__, "build/datasetsVis.js")
	bundle = open(lib_path, "r", encoding="utf8").read()
	html_all = """
	<html>
	<head>
	</head>
	<body>
	    <script>
	    {bundle}
	    </script>
	    <div id="{id}">
	    </div>
	    <script>
	        datasetsVis.renderDatasetsSummarizerBundle("#{id}", {dataset_results});
	    </script>
	</body>
	</html>
	""".format(bundle=bundle, id=id, dataset_results=json.dumps(dataset_results))
	return html_all

def getSample(text):
    df = pandas.read_csv(StringIO(text))
    result = [df.columns.values.tolist()] + df.values.tolist()
    return result
  
def prepare_data_profiler(metadata, enet_alpha=0.001, enet_l1=0.1):
    metadata = copy.deepcopy(metadata)
    metadataJSON = {
        "id": str(random.randint(0, 10)),
        "name": metadata["name"] if "name" in metadata else "",
        "description": '',
        "size": metadata["size"] if "size" in metadata else 0,
        "nb_rows": metadata["nb_rows"],
        "nb_profiled_rows": metadata["nb_profiled_rows"],
        "materialize": {},
        "date": "",
        "sample": metadata["sample"] if "sample" in metadata else "",
        "source": 'vizier',
        "version": "0.1",
        "columns": metadata["columns"],
    }

    search_results = {
        "id": str(random.randint(0, 10)),
        "score": 1,
        "metadata": metadataJSON,
        "sample": getSample(metadata["sample"])
    }
    return search_results

def prepare_dataset_results(dataframe):
    items = []
    for row in dataframe.to_numpy():
        item = {}
        for i in range(len(dataframe.columns)):
            item[dataframe.columns[i]] = row[i];
        items.append(item)
    all_results = {
        "datasets": items
    }
    return all_results

def plot_datasets_summary(dataset_results):
    from IPython.core.display import display, HTML
    id = id_generator()
    dataset_results_dic = prepare_dataset_results(dataset_results)
    html_all = make_html(dataset_results_dic, id)
    display(HTML(html_all))