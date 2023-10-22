import React from 'react'
import './Home.css';
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import dateFormat from 'dateformat';
import moment from 'moment'


const Home = () => {
const [todos, setTodos] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [filterCompleted, setFilterCompleted] = useState("");
const [newFilterCompleted, setNewFilterCompleted] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [totalTodos, setTotalTodos] = useState(0);
const todosPerPage = 9;


useEffect(() => {
axios
.get(`https://api.spacexdata.com/v3/launches`)
.then((response) => {
setTodos(response.data);

})
.catch((error) => {
console.log(error);
});
}, []);
const pageNumbers = [];
for (let i = 1; i <= Math.ceil(totalTodos / todosPerPage); i++) {
pageNumbers.push(i);
}
const todosData = useMemo(() => {
let computedTodos = todos;
if (searchTerm) {
computedTodos = computedTodos.filter(
todo =>
todo.mission_name.toLowerCase().includes(searchTerm.toLowerCase())
);
}

if (filterCompleted === "true") {
computedTodos = computedTodos.filter(
todo =>
filterCompleted === "true" && todo.launch_success === true
)
}

if (filterCompleted === "false") {
computedTodos = computedTodos.filter(
todo =>
filterCompleted === "false" && todo.launch_success === false
)
}

if (newFilterCompleted === moment().format("MMMM Do YYYY")) {

// computedTodos = computedTodos.filter(
// todo =>
// newFilterCompleted === moment().format("MMMM Do YYYY") && todo.launch_success !== moment().format("MMMM Do YYYY")
// )



}



setTotalTodos(computedTodos.length);

//Current Page slice
return computedTodos.slice(
(currentPage - 1) * todosPerPage,
(currentPage - 1) * todosPerPage + todosPerPage

);
}, [todos, currentPage, searchTerm, filterCompleted, newFilterCompleted]);

// Change page
const paginate = (pageNumber) => setCurrentPage(pageNumber);
const resetFilter = () => {
setSearchTerm("");
setFilterCompleted("");
setNewFilterCompleted("");
setCurrentPage(1);
};

//UTC Date to Local Date
function date (arg) {
const utcDate = arg;
const date = new Date(utcDate);
const newdate = date.toLocaleString();
const finaldate = dateFormat(newdate, "d mmm, yyyy")
return finaldate;
}


function filterByLaunchDateLastWeek(launches: any) {

}

return(
<div className="container">
	<div className="header">
		<h3>Spaceflight details</h3>
		<p>Find out the elaborate features of all the past big spaceflights.</p>
	</div>
	<div className="d-flex justify-content-end checkbox">
		<div class="form-check">
			<input class="form-check-input"  value={newFilterCompleted ? "false" : " "} onClick={(e) => {setNewFilterCompleted(e.target.value);setCurrentPage(1);}} type="checkbox"  id="flexCheckDefault"/>
			<label class="form-check-label" for="flexCheckDefault">
				Show upcoming only
			</label>
		</div>
	</div>
	
	<div className="row">
		<div className="col-md-4 search-box">
			<div className="mb-3">
				
				<div class="input-group">
					<input type="text"
					className="form-control"
					id="search"
					placeholder="Search..."
					value={searchTerm}
					onChange={(e) => {
					setSearchTerm(e.target.value);
					setCurrentPage(1);
					}}/>
					<div class="input-group-append">
						<button class="btn btn-primary" type="button">
						<i class="fa fa-search"></i>
						</button>
					</div>
				</div>
			</div>
		</div>
		
		<div className="col-md-2">
			
		</div>
		
		<div className="col-md-3 select">
			<div className="mb-3">
				
				<select
					className="form-select" value={filterCompleted} onChange={(e) => {setFilterCompleted(e.target.value);setCurrentPage(1);}}>
					<option value="" disabled selected hidden>By Launch Status</option>
					<option value="false">Failure</option>
					<option value="true">Success</option>
				</select>
			</div>
		</div>
		<div className="col-md-3 select">
			<div className="mb-3">
				
				<select
					className="form-select" value={newFilterCompleted} onChange={(e) => {setNewFilterCompleted(e.target.value);setCurrentPage(1);}} >
					<option value="" disabled selected hidden>By Launch Date</option>
					<option value={moment().format("MMMM Do YYYY")}>Last Week</option>
					<option value="">Last Month</option>
					<option value="">Last Year</option>
				</select>
			</div>
			
		</div>
	</div>
	
	<div className="mb-3">
		
	</div>
	<div className="item-container">
		<div className="item ">
			{todosData.map((item) => {
			return (
			<div className=" my-2">
				<div className="card shadow-sm w-100">
					<div className="card-body" id="card-body">
						<img src={item.links.mission_patch} className="img"alt={item.links.mission_patch}/>
						<p className="card-text text-secondary ">Launch Date: <span className="fw-bold">{date(item.launch_date_utc)}</span></p>
						<h6 className="card-subtitle mb-2  text-center">{item.mission_name}</h6>
						
						<p className="card-text text-muted">{item.rocket.rocket_name}</p>
						<p className="card-text">Launch Status:</p>
						<p className={item.launch_success ? 'btn_active' : 'btn_inactive' }>{item.launch_success ? "Success" : "Faild" }</p>
						
					</div>
				</div>
			</div>
			);
			})}
		</div>
	</div>
	<nav>
		<ul className="pagination d-flex justify-content-center ">
			{pageNumbers.map((number) =>(
			<li key={number} className="page-item">
				<button onClick={() => paginate(number)} className={`page-link ${paginate === number ? 'active' : ''}`}>
				{number}
				</button>
			</li>
			))}
		</ul>
	</nav>
	<div className="footer text-center">
		<p className="mb-4">Created by the brilliant minds behind SpaceX</p>
	</div>
	
	
</div>
)
}
export default Home