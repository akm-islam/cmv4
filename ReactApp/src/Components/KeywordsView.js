import React, { Component } from 'react';
import Grid from '@mui/material/Grid';
import * as d3 from 'd3'
import { connect } from "react-redux";
class App extends Component {
    constructor(props) {
        super(props);
        this.state = { temp: 0 };
    }
    componentDidMount() {
    this.setState({temp:10})
    }
    componentDidUpdate() {
    }
    render() {
        return (
            <Grid style={{ width: window.innerWidth,padding:"0px 10px"}}>
            </Grid>
        );
    }
}

const maptstateToprop = (state) => {
    return {
        original_data: state.original_data,
        selected_topic_number: state.selected_topic_number,
        keywords_data:state.keywords_data,
        topic_data:state.topic_data,
        color:state.color
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        Set_original_data: (val) => dispatch({ type: "original_data", value: val }),
        Set_month_wise_data: (val) => dispatch({ type: "month_wise_data", value: val })
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(App);


//https://www.d3indepth.com/force-layout/
