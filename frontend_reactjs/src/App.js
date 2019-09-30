import React, { Component } from 'react';
import ReactTable from "react-table";
import axios from 'axios';
import matchSorter from 'match-sorter'
import logo from './logo.svg';

import 'react-table/react-table.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

axios.defaults.baseURL = 'http://localhost:5000';


class App extends Component{

  constructor(props){
   super(props)
   this.state = {
    SearchBar: '',
    defaultSearch: 1,
    enableLoad: false,
    simpleSearch: false,
    isChecked: false,
  };

  this.handleChange = this.handleChange.bind(this);
  this.loadNext = this.loadNext.bind(this);
  this.loadPrev = this.loadPrev.bind(this);
  this.axiosLoad = this.axiosLoad.bind(this);

  }

  componentDidMount = () => {

    axios.get('/api/'+this.state.defaultSearch)
    .then((response) => {
       this.setState({data: response.data})
     })
    .catch((error)=>{
       console.log(error);
    });

  }

  handleChange = (e) => {
     this.setState({
       [e.target.name]: e.target.value
     });
   }

   toggleChange = () => {
    this.setState({
      isChecked: !this.state.isChecked,
      simpleSearch: !this.state.simpleSearch,
    });
  }

  searchItems = (e) => {
    this.setState({enableLoad: true})

    if (this.state.simpleSearch === false){
      var searchArray = this.state.SearchBar.split(" ")
      if (searchArray.length === 2){
        var formulatedWord = searchArray[1] + " - " + searchArray[0]

      } else if (searchArray.length > 2){
        var formulatedWord = searchArray[1] + " " + searchArray[2] + " - " + searchArray[0]
      } else {
        var formulatedWord = this.state.SearchBar
      }

      axios.get('/api/search/'+formulatedWord)
      .then((response) => {
         this.setState({data: response.data})
       })
      .catch((error)=>{
         console.log(error);
      });



    } else {
      axios.get('/api/search/'+this.state.SearchBar)
      .then((response) => {
         this.setState({data: response.data})
       })
      .catch((error)=>{
         console.log(error);
      });
    }
  }

  loadNext = () => {
    this.setState({defaultSearch: this.state.defaultSearch+1}, () =>{
      this.axiosLoad()
    })
  }


  loadPrev = () => {
    if (this.state.defaultSearch > 1){
      this.setState({defaultSearch: this.state.defaultSearch-1}, () =>{
        this.axiosLoad()
      })
    }
  }

  axiosLoad = () => {
    axios.get('/api/'+this.state.defaultSearch)
    .then((response) => {
       console.log(response);
       this.setState({data: response.data})
     })
    .catch((error)=>{
       console.log(error);
    });
  }


  render(){

    const main_columns = [{
      Header: <h4><b>Image</b></h4>,
      id: 'image',
      accessor: (d) => <img src={d.image_urls} height="100px" width="100px"/>, // String-based value accessors!
    }, {
      Header: <h4><b>Product Title</b></h4>,
      id: "product_title",
      accessor: 'product_title',
      filterMethod: (filter, rows) =>
                      matchSorter(rows, filter.value, { keys: ["product_title"],threshold: matchSorter.rankings.CONTAINS }),
                    filterAll: true,
      Filter: ({filter, onChange}) => (
          <input
            onChange={event => onChange(event.target.value)}
            placeholder="Refine Search..."
            value={filter ? filter.value : ''}
            style={{
              width: '100%',
            }}
          />)
    }, {
      Header: <h4><b>Brand</b></h4>,
      id: "brand",
      accessor: (d) => d.brand,
      filterMethod: (filter, rows) =>
                      matchSorter(rows, filter.value, { keys: ["brand"],threshold: matchSorter.rankings.CONTAINS }),
                    filterAll: true,
    }, {
      Header: <h4><b>Price</b></h4>,
      id: "price",
      accessor: 'price',
      filterMethod: (filter, rows) =>
                      matchSorter(rows, filter.value, { keys: ["price"],threshold: matchSorter.rankings.WORD_STARTS_WITH }),
                    filterAll: true,
    }
    ]




  return (
    <div>
      <div className="page-header">
        SOLCE & YOVANA Clothing Ltd
      </div>

      <div className="App">
        <div className="form-inline form-group mb-2 centerSearch">
          <input id="SearchBar"
                  className="form-control"
                  type="text"
                  name="SearchBar"
                  placeholder="Search...."
                  value={this.state.SearchBar}
                  onChange={e => this.handleChange(e)}
                  onKeyPress={e => e.which === 13 ? this.searchItems(): ''}/>

          <button type="button" className="btn btn-primary searchButton" onClick={e => this.searchItems()}>Search</button>

          <label>
            <input className="simplecheckbox" type="checkbox" checked={this.state.isChecked} onChange={this.toggleChange}/>
            Simple Search
          </label>
        </div>

         {this.state.data ?
         <ReactTable
           data={this.state.data}
           columns={main_columns}
           noDataText="No Data Has been found, enable simple search for one word search e.g 'dress'."
           loadingText="Please Wait. Data is Loading....If no data is returned the API server may be down."
           defaultPageSize={5}
           showPaginationTop={false}
           className="-striped -highlight"
           pageSizeOptions={[5, 10, 20, 25, 50, 100, 200]}
           filterable={true}
           minRows={3}/> : ''}
       </div>

        <button type="button" className="btn btn-info" onClick={e => this.loadPrev()} disabled={this.state.enableLoad}>Load Prev Data</button>
        <button type="button" className="btn btn-info searchButton" onClick={e => this.loadNext()} disabled={this.state.enableLoad}>Load More Data</button>
    </div>
  );
}
}

export default App;
