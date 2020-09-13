import React, { Component } from 'react';
import {
	sensorListElem,
	value_list_elem,
} from '../../ElemInterface/ElementsInterface';
import { SENSOR_URL } from '../../defineUrl';
import Pagination from '../Pagination';

//import DeleteRequest from './DeleteRequest'

interface SensorTableState {
	sensorList: Array<sensorListElem>;
	start: number;
	end: number;
	currentPage: number;
	pageSize: number;
}

/*
SensorTable
- Show up sensor list.
*/
class SensorTable extends Component<{}, SensorTableState> {
	state: SensorTableState = {
		sensorList: [],
		start: 0, // start page number
		end: 10, // end page number
		currentPage: 1, // current page number
		pageSize: 12,
	};

	componentDidMount() {
		this.getsensorList(this.state.currentPage);
	}

	// Get sensor list from backend per page
	getsensorList(page: number) {
		var url = SENSOR_URL;

		fetch(url)
			.then((res) => res.json())
			.then((data) => {
				this.setState({ sensorList: data });
			})
			.catch((error) => console.error('Error:', error));
	}

	// Handle click event of the Remove button
	handleRemoveClick = (sensor_uuid: string) => () => {
		var url = SENSOR_URL;

		fetch(url, {
			method: 'DELETE',
			body: JSON.stringify({ uuid: sensor_uuid }),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.catch((error) => console.error('Error:', error))
			.then(() => window.location.reload(false));
	};

	handlePageChange = (page: number) => {
		this.setState({ currentPage: page });
		this.getsensorList(page);
	};

	render() {
		return (
			<>
				<table className="table">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">name</th>
							<th scope="col">uuid</th>
							<th scope="col">values</th>
							<th scope="col"></th>
						</tr>
					</thead>
					<tbody>
						{this.state.sensorList.map(
							(sensor: sensorListElem, idx: number) => (
								<tr>
									<th scope="row">{idx}</th>
									<td>{sensor.name}</td>
									<td>{sensor.uuid}</td>
									<td>
										{sensor.value_list.map(
											(value: value_list_elem) => value.value_name + ', '
										)}
									</td>
									<td>
										<button
											className="btn btn-default btn-sm"
											type="button"
											id="button-delete"
											onClick={this.handleRemoveClick(sensor.uuid)}
										>
											<svg
												width="1em"
												height="1em"
												viewBox="0 0 16 16"
												className="bi bi-trash-fill"
												fill="currentColor"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													fill-rule="evenodd"
													d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"
												/>
											</svg>
										</button>
									</td>
								</tr>
							)
						)}
					</tbody>
				</table>
				<Pagination
					pageSize={this.state.pageSize}
					itemsCount={this.state.sensorList.length}
					currentPage={this.state.currentPage}
					onPageChange={this.handlePageChange}
				></Pagination>
			</>
		);
	}
}

export default SensorTable;
