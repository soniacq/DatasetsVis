import * as React from 'react';
import * as api from '../rest';
import {SearchResult} from '../types';
import './EditProfilerView.css';
import {
  ColumnMetadata,
  Annotation,
  TypesCategory,
  ColumnType,
} from '../types';
import {ProfileDataset} from './ProfileDataset';
import {isSubstrInclude} from '../utils';
import CommAPI from "../CommAPI";
import {Snackbar, IconButton} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';




interface EditProfilerViewProps {
  hit: SearchResult;
}
interface EditProfilerViewState {
  submitting: boolean,
  profilingStatus: api.RequestStatus;
  profiledData: api.ProfileResult;
  columnsName: string [];
  exportedMetadataMessage: boolean;
}

class EditProfilerView extends React.PureComponent<
  EditProfilerViewProps,
  EditProfilerViewState
> {
  constructor(props: EditProfilerViewProps) {
    super(props);
    this.commExportMetadata = new CommAPI('export_metadata_comm_api', (msg) => {});
    const obj2 = {'token': 'undefined'};
    this.state = {
      submitting: false,
      profilingStatus: api.RequestStatus.SUCCESS,
      profiledData: Object.assign(props.hit.metadata, obj2),
      columnsName: [],
      exportedMetadataMessage: false,
    };
  }

  addAnnotation(col: ColumnMetadata, value: string): ColumnMetadata {
    if (
      value.includes(ColumnType.LATITUDE) ||
      value.includes(ColumnType.LONGITUDE)
    ) {
      return {
        ...col,
        semantic_types: [...col.semantic_types, value.split('-')[0]],
        latlong_pair: value.substring(
          value.lastIndexOf('-(pair') + '-(pair'.length,
          value.lastIndexOf(')')
        ),
      };
    } else {
      return {
        ...col,
        semantic_types: [...col.semantic_types, value],
      };
    }
  }

  removeAnnotation(col: ColumnMetadata, value: string): ColumnMetadata {
    const updatedColumn: ColumnMetadata = {
      ...col,
      semantic_types: col.semantic_types.filter(item => item !== value),
    };
    if (
      !(
        isSubstrInclude(col['semantic_types'], ColumnType.LATITUDE) &&
        isSubstrInclude(col['semantic_types'], ColumnType.LONGITUDE)
      ) &&
      (value.includes(ColumnType.LATITUDE) ||
        value.includes(ColumnType.LONGITUDE)) &&
      'latlong_pair' in updatedColumn
    ) {
      delete updatedColumn['latlong_pair'];
    }
    return updatedColumn;
  }

  updateColumnType(
    value: string,
    column: ColumnMetadata,
    type: TypesCategory,
    annotation: Annotation
  ) {
    if (this.state.profiledData) {
      const modifiedColumns: ColumnMetadata[] = this.state.profiledData.columns.map(
        (col: ColumnMetadata) => {
          if (col.name === column.name) {
            if (type === TypesCategory.STRUCTURAL) {
              return {...col, structural_type: value};
            }
            if (type === TypesCategory.SEMANTIC) {
              if (annotation === Annotation.ADD) {
                return this.addAnnotation(col, value);
              }
              if (annotation === Annotation.REMOVE) {
                return this.removeAnnotation(col, value);
              }
            }
            return {...col};
          } else {
            return {...col};
          }
        }
      );
      this.setState({
        columnsName: [...this.state.columnsName, column.name],
        profiledData: {...this.state.profiledData, columns: modifiedColumns},
      });
    }
  }

  exportUpdatedMetadata() {
    const modifiedColumns = this.state.profiledData?.columns.filter(col =>
      this.state.columnsName.includes(col.name)
    );
    // const manualAnnotations = {columns: modifiedColumns};
    this.commExportMetadata.call({metadata: modifiedColumns});
    this.setState({exportedMetadataMessage: true});
    return modifiedColumns;
  }

  render() {
    return (
      <div className="mt-2">
        <h6>Dataset Sample:</h6>
        <div>
          <div
            className="btn-group btn-group-sm"
            role="group"
            aria-label="Basic example"
            style={{ float: 'initial', marginBottom: '4px' }}
          >
            <button
              type="button"
              className="btn btn-secondary active"
              onClick={() => this.exportUpdatedMetadata()}
            >
              Export updated metadata
            </button>
          </div>
          <div className="mt-2">
            <ProfileDataset
                profilingStatus={this.state.profilingStatus}
                profiledData={this.state.profiledData}
                onEdit={(value, type, column) =>
                  this.updateColumnType(value, column, type, Annotation.ADD)
                }
                onRemove={(value, column) =>
                  this.updateColumnType(
                    value,
                    column,
                    TypesCategory.SEMANTIC,
                    Annotation.REMOVE
                  )
                }
              />
          </div>
        </div>
        <Snackbar open={this.state.exportedMetadataMessage} onClose={() => {this.setState({exportedMetadataMessage: false})}}
                message={"Metadata exported. Access with `DataProfileViewer.get_exported_metadata()`"}
                autoHideDuration={8000}
                action={<IconButton size="small" aria-label="close" color="inherit" onClick={() => this.setState({exportedMetadataMessage: false})}>
                  <CloseIcon fontSize="small" />
                </IconButton>}
      />
      </div>
    );
  }
}

export { EditProfilerView };
